import { GoogleGenerativeAI } from '@google/generai';
import { PrismaClient, AIMode, Artifact, PromptTemplate } from '@prisma/client';
import { Redis } from 'ioredis';

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY!);

interface AIServiceConfig {
    cacheTTL: number; // seconds
    maxRetries: number;
    defaultModel: string;
}

export class AIService {
    private redis: Redis;
    private config: AIServiceConfig;

    constructor(config: AIServiceConfig) {
        this.redis = new Redis(process.env.REDIS_URL);
        this.config = config;
    }

    private async getPromptTemplate(
        mode: AIMode,
        category?: string,
        community?: string
    ): Promise<PromptTemplate> {
        const template = await prisma.promptTemplate.findFirst({
            where: {
                AND: [
                    { mode },
                    { active: true },
                    {
                        OR: [
                            {
                                AND: [
                                    { category: category as any },
                                    { community },
                                ],
                            },
                            {
                                AND: [
                                    { category: category as any },
                                    { community: null },
                                ],
                            },
                            {
                                AND: [{ category: null }, { community }],
                            },
                            {
                                AND: [{ category: null }, { community: null }],
                            },
                        ],
                    },
                ],
            },
            orderBy: [
                { category: { sort: 'asc', nulls: 'last' } },
                { community: { sort: 'asc', nulls: 'last' } },
                { updatedAt: 'desc' },
            ],
        });

        if (!template) {
            throw new Error('No suitable prompt template found');
        }

        return template;
    }

    private async getCachedResponse(
        artifactId: string,
        mode: AIMode
    ): Promise<string | null> {
        const key = `ai:insight:${artifactId}:${mode}`;
        return this.redis.get(key);
    }

    private async cacheResponse(
        artifactId: string,
        mode: AIMode,
        response: string
    ): Promise<void> {
        const key = `ai:insight:${artifactId}:${mode}`;
        await this.redis.setex(key, this.config.cacheTTL, response);
    }

    private async generatePrompt(
        template: string,
        artifact: Artifact
    ): Promise<string> {
        // Replace placeholders in template with actual values
        return template
            .replace('{{title}}', artifact.title)
            .replace('{{description}}', artifact.shortDescription)
            .replace('{{community}}', artifact.community)
            .replace('{{category}}', artifact.category)
            .replace('{{provenance}}', artifact.provenance);
    }

    public async explainArtifact(
        artifactId: string,
        mode: AIMode = AIMode.SHORT
    ) {
        try {
            // Check cache first
            const cached = await this.getCachedResponse(artifactId, mode);
            if (cached) {
                return JSON.parse(cached);
            }

            // Get artifact details
            const artifact = await prisma.artifact.findUnique({
                where: { id: artifactId },
                include: {
                    transcripts: true,
                    media: {
                        select: {
                            type: true,
                            metadata: true,
                        },
                    },
                },
            });

            if (!artifact) {
                throw new Error('Artifact not found');
            }

            // Get appropriate prompt template
            const template = await this.getPromptTemplate(
                mode,
                artifact.category,
                artifact.community
            );
            const prompt = await this.generatePrompt(
                template.template,
                artifact
            );

            // Call Gemini
            const model = genAI.getGenerativeModel({
                model: this.config.defaultModel,
            });

            const result = await model.generateContent(prompt);
            const response = result.response;
            const text = response.text();

            // Store the result
            const aiInsight = await prisma.aIInsight.create({
                data: {
                    artifactId,
                    promptSummary: prompt.substring(0, 200), // Store first 200 chars of prompt
                    response: text,
                    model: this.config.defaultModel,
                    tokensUsed: text.length / 4, // Rough estimation
                    mode,
                    cachedUntil: new Date(
                        Date.now() + this.config.cacheTTL * 1000
                    ),
                    confidence: 0.95, // TODO: Implement proper confidence scoring
                    sources: [],
                    metadata: response.promptFeedback,
                },
            });

            // Cache the response
            await this.cacheResponse(
                artifactId,
                mode,
                JSON.stringify(aiInsight)
            );

            return aiInsight;
        } catch (error) {
            console.error('AI Service error:', error);
            throw error;
        }
    }

    public async compareArtifacts(artifactIds: string[]) {
        // TODO: Implement artifact comparison
        throw new Error('Not implemented');
    }

    public async generateImage(prompt: string) {
        // TODO: Implement image generation
        throw new Error('Not implemented');
    }
}
