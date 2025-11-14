// import * as GoogleGenAI from "@google/genai";
// import { PrismaClient, AIMode, Artifact, PromptTemplate } from '@prisma/client';
// import { Redis } from 'ioredis';

// const prisma = new PrismaClient();
// const GenAIClient: any = (GoogleGenAI as any).GoogleGenerativeAI || (GoogleGenAI as any).default || (GoogleGenAI as any);
// const genAI: any = typeof GenAIClient === 'function' ? new GenAIClient(process.env.GOOGLE_AI_KEY!) : GenAIClient;

// interface AIServiceConfig {
//     cacheTTL: number; // seconds
//     maxRetries: number;
//     defaultModel: string;
// }

// export class AIService {
//     private redis: Redis;
//     private config: AIServiceConfig;

//     constructor(config: AIServiceConfig) {
//         const redisUrl = process.env.REDIS_URL;
//         if (!redisUrl) {
//             throw new Error('REDIS_URL environment variable is required');
//         }
//         this.redis = new Redis(redisUrl);
//         this.config = config;
//     }

//     private async getPromptTemplate(
//         mode: AIMode,
//         category?: string,
//         community?: string
//     ): Promise<PromptTemplate> {
//         const template = await prisma.promptTemplate.findFirst({
//             where: {
//                 AND: [
//                     { mode },
//                     { active: true },
//                     {
//                         OR: [
//                             {
//                                 AND: [
//                                     { category: category as any },
//                                     { community },
//                                 ],
//                             },
//                             {
//                                 AND: [
//                                     { category: category as any },
//                                     { community: null },
//                                 ],
//                             },
//                             {
//                                 AND: [{ category: null }, { community }],
//                             },
//                             {
//                                 AND: [{ category: null }, { community: null }],
//                             },
//                         ],
//                     },
//                 ],
//             },
//             orderBy: [
//                 { category: 'asc' },
//                 { community: 'asc' },
//                 { updatedAt: 'desc' },
//             ],
//         });

//         if (!template) {
//             throw new Error('No suitable prompt template found');
//         }

//         return template;
//     }

//     private async getCachedResponse(
//         artifactId: string,
//         mode: AIMode
//     ): Promise<string | null> {
//         const key = `ai:insight:${artifactId}:${mode}`;
//         return this.redis.get(key);
//     }

//     private async cacheResponse(
//         artifactId: string,
//         mode: AIMode,
//         response: string
//     ): Promise<void> {
//         const key = `ai:insight:${artifactId}:${mode}`;
//         await this.redis.setex(key, this.config.cacheTTL, response);
//     }

//     private async generatePrompt(
//         template: string,
//         artifact: Artifact
//     ): Promise<string> {
//         // Replace placeholders in template with actual values
//         return template
//             .replace('{{title}}', artifact.title)
//             .replace('{{description}}', artifact.shortDescription)
//             .replace('{{community}}', artifact.community)
//             .replace('{{category}}', artifact.category)
//             .replace('{{provenance}}', artifact.provenance);
//     }

//     public async explainArtifact(
//         artifactId: string,
//         mode: AIMode = AIMode.SHORT
//     ) {
//         try {
//             // Check cache first
//             const cached = await this.getCachedResponse(artifactId, mode);
//             if (cached) {
//                 return JSON.parse(cached);
//             }

//             // Get artifact details
//             const artifact = await prisma.artifact.findUnique({
//                 where: { id: artifactId },
//                 include: {
//                     transcripts: true,
//                     media: {
//                         select: {
//                             type: true,
//                             metadata: true,
//                         },
//                     },
//                 },
//             });

//             if (!artifact) {
//                 throw new Error('Artifact not found');
//             }

//             // Get appropriate prompt template
//             const template = await this.getPromptTemplate(
//                 mode,
//                 artifact.category,
//                 artifact.community
//             );
//             const prompt = await this.generatePrompt(
//                 template.template,
//                 artifact
//             );

//             // Call Gemini
//             const model = genAI.getGenerativeModel({
//                 model: this.config.defaultModel,
//             });

//             const result = await model.generateContent(prompt);
//             const response = result.response;
//             const text = response.text();

//             // Store the result
//             const aiInsight = await prisma.aIInsight.create({
//                 data: {
//                     artifactId,
//                     promptSummary: prompt.substring(0, 200), // Store first 200 chars of prompt
//                     response: text,
//                     model: this.config.defaultModel,
//                     tokensUsed: text.length / 4, // Rough estimation
//                     mode,
//                     cachedUntil: new Date(
//                         Date.now() + this.config.cacheTTL * 1000
//                     ),
//                     confidence: 0.95, // TODO: Implement proper confidence scoring
//                     sources: [],
//                     metadata: response.promptFeedback,
//                 },
//             });

//             // Cache the response
//             await this.cacheResponse(
//                 artifactId,
//                 mode,
//                 JSON.stringify(aiInsight)
//             );

//             return aiInsight;
//         } catch (error) {
//             console.error('AI Service error:', error);
//             throw error;
//         }
//     }

//     public async compareArtifacts(artifactIds: string[]) {
//         // TODO: Implement artifact comparison
//         throw new Error('Not implemented');
//     }

//     public async generateImage(prompt: string) {
//         // TODO: Implement image generation
//         throw new Error('Not implemented');
//     }
// }

import { GoogleGenAI } from '@google/genai';
import { PrismaClient, AIMode, Artifact, PromptTemplate } from '@prisma/client';
import { Redis } from 'ioredis';

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL!);

const genAI = new GoogleGenAI({
    apiKey: process.env.GOOGLE_AI_KEY!,
});

interface AIServiceConfig {
    cacheTTL: number;
    maxRetries: number;
    defaultModel: string;
}

export class AIService {
    private config: AIServiceConfig;

    constructor(config: AIServiceConfig) {
        if (!process.env.REDIS_URL) {
            throw new Error('REDIS_URL environment variable is required');
        }
        this.config = config;
    }

    private async getCachedResponse(key: string): Promise<string | null> {
        return redis.get(key);
    }

    private async cacheResponse(key: string, response: string, ttl?: number) {
        await redis.setex(key, ttl ?? this.config.cacheTTL, response);
    }

    private async generatePrompt(
        template: string,
        artifact: Artifact
    ): Promise<string> {
        return template
            .replace('{{title}}', artifact.title)
            .replace('{{description}}', artifact.shortDescription)
            .replace('{{community}}', artifact.community)
            .replace('{{category}}', artifact.category)
            .replace('{{provenance}}', artifact.provenance);
    }

    /** -------------------- Artifact Explanation -------------------- **/
    public async explainArtifact(
        artifactId: string,
        mode: AIMode = AIMode.SHORT
    ) {
        try {
            const cacheKey = `ai:insight:${artifactId}:${mode}`;
            const cached = await this.getCachedResponse(cacheKey);
            if (cached) return JSON.parse(cached);

            const artifact = await prisma.artifact.findUnique({
                where: { id: artifactId },
                include: {
                    transcripts: true,
                    media: { select: { type: true, metadata: true } },
                },
            });
            if (!artifact) throw new Error('Artifact not found');

            const prompt = `Summarize the artifact titled "${artifact.title}" from the ${artifact.community} community in simple language.`;

            // ✅ Correct method for content generation
            const result = await genAI.models.generateContent({
                model: this.config.defaultModel,
                contents: [prompt],
            });

            const text =
                result.candidates?.[0]?.content?.parts?.[0]?.text || '';

            const aiInsight = await prisma.aIInsight.create({
                data: {
                    artifactId,
                    promptSummary: prompt.substring(0, 200),
                    response: text,
                    model: this.config.defaultModel,
                    tokensUsed: Math.ceil(text.length / 4),
                    mode,
                    cachedUntil: new Date(
                        Date.now() + this.config.cacheTTL * 1000
                    ),
                    confidence: 0.95,
                    sources: [],
                    metadata: {},
                },
            });

            await this.cacheResponse(cacheKey, JSON.stringify(aiInsight));
            return aiInsight;
        } catch (err) {
            console.error('AI Service error (artifact):', err);
            throw err;
        }
    }

    /** -------------------- Proverb Explanation -------------------- **/
    public async explainProverb(
        proverb: string,
        community: string
    ): Promise<string> {
        try {
            const cacheKey = `proverb:${community}:${proverb}`;
            const cached = await this.getCachedResponse(cacheKey);
            if (cached) return cached;

            const prompt = `Explain the ${community} proverb "${proverb}" in simple English with 2 example sentences.`;

            // ✅ Correct usage of the new GenAI SDK
            const result = await genAI.models.generateContent({
                model: this.config.defaultModel,
                contents: [prompt],
            });

            const explanation =
                result.candidates?.[0]?.content?.parts?.[0]?.text || '';

            await this.cacheResponse(cacheKey, explanation, 3600);
            return explanation;
        } catch (err) {
            console.error('AI Service error (proverb):', err);
            throw err;
        }
    }

    /** -------------------- Other methods -------------------- **/
    public async compareArtifacts(artifactIds: string[]) {
        throw new Error('Not implemented');
    }
    public async generateImage(prompt: string) {
        throw new Error('Not implemented');
    }
}
