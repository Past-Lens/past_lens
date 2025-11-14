// import * as GoogleGenAI from "@google/genai";
// import { PrismaClient, AIMode, Artifact, PromptTemplate } from '@prisma/client';
// import { Redis } from 'ioredis';

// const prisma = new PrismaClient();
// const GenAIClient: any = (GoogleGenAI as any).GoogleGenerativeAI || (GoogleGenAI as any).default || (GoogleGenAI as any);
// const genAI: any = typeof GenAIClient === 'function' ? new GenAIClient(process.env.GEMINI_API_KEY!) : GenAIClient;

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

// import { GoogleGenAI } from '@google/genai';
// import { PrismaClient, AIMode, Artifact, PromptTemplate } from '@prisma/client';
// import { Redis } from 'ioredis';

// const prisma = new PrismaClient();
// const redis = new Redis(process.env.REDIS_URL!);

// const genAI = new GoogleGenAI({
//     apiKey: process.env.GEMINI_API_KEY!,
// });

// interface AIServiceConfig {
//     cacheTTL: number;
//     maxRetries: number;
//     defaultModel: string;
// }

// export class AIService {
//     private config: AIServiceConfig;

//     constructor(config: AIServiceConfig) {
//         if (!process.env.REDIS_URL) {
//             throw new Error('REDIS_URL environment variable is required');
//         }
//         this.config = config;
//     }

//     private async getCachedResponse(key: string): Promise<string | null> {
//         return redis.get(key);
//     }

//     private async cacheResponse(key: string, response: string, ttl?: number) {
//         await redis.setex(key, ttl ?? this.config.cacheTTL, response);
//     }

//     private async generatePrompt(
//         template: string,
//         artifact: Artifact
//     ): Promise<string> {
//         return template
//             .replace('{{title}}', artifact.title)
//             .replace('{{description}}', artifact.shortDescription)
//             .replace('{{community}}', artifact.community)
//             .replace('{{category}}', artifact.category)
//             .replace('{{provenance}}', artifact.provenance);
//     }

//     /** -------------------- Artifact Explanation -------------------- **/
//     public async explainArtifact(
//         artifactId: string,
//         mode: AIMode = AIMode.SHORT
//     ) {
//         try {
//             const cacheKey = `ai:insight:${artifactId}:${mode}`;
//             const cached = await this.getCachedResponse(cacheKey);
//             if (cached) return JSON.parse(cached);

//             const artifact = await prisma.artifact.findUnique({
//                 where: { id: artifactId },
//                 include: {
//                     transcripts: true,
//                     media: { select: { type: true, metadata: true } },
//                 },
//             });
//             if (!artifact) throw new Error('Artifact not found');

//             const prompt = `Summarize the artifact titled "${artifact.title}" from the ${artifact.community} community in simple language.`;

//             // ✅ Correct method for content generation
//             const result = await genAI.models.generateContent({
//                 model: this.config.defaultModel,
//                 contents: [prompt],
//             });

//             const text =
//                 result.candidates?.[0]?.content?.parts?.[0]?.text || '';

//             const aiInsight = await prisma.aIInsight.create({
//                 data: {
//                     artifactId,
//                     promptSummary: prompt.substring(0, 200),
//                     response: text,
//                     model: this.config.defaultModel,
//                     tokensUsed: Math.ceil(text.length / 4),
//                     mode,
//                     cachedUntil: new Date(
//                         Date.now() + this.config.cacheTTL * 1000
//                     ),
//                     confidence: 0.95,
//                     sources: [],
//                     metadata: {},
//                 },
//             });

//             await this.cacheResponse(cacheKey, JSON.stringify(aiInsight));
//             return aiInsight;
//         } catch (err) {
//             console.error('AI Service error (artifact):', err);
//             throw err;
//         }
//     }

//     /** -------------------- Proverb Explanation -------------------- **/
//     public async explainProverb(
//         proverb: string,
//         community: string
//     ): Promise<string> {
//         try {
//             const cacheKey = `proverb:${community}:${proverb}`;
//             const cached = await this.getCachedResponse(cacheKey);
//             if (cached) return cached;

//             const prompt = `Explain the ${community} proverb "${proverb}" in simple English with 2 example sentences.`;

//             // ✅ Correct usage of the new GenAI SDK
//             const result = await genAI.models.generateContent({
//                 model: this.config.defaultModel,
//                 contents: [prompt],
//             });

//             const explanation =
//                 result.candidates?.[0]?.content?.parts?.[0]?.text || '';

//             await this.cacheResponse(cacheKey, explanation, 3600);
//             return explanation;
//         } catch (err) {
//             console.error('AI Service error (proverb):', err);
//             throw err;
//         }
//     }

//     /** -------------------- Other methods -------------------- **/
//     public async compareArtifacts(artifactIds: string[]) {
//         throw new Error('Not implemented');
//     }
//     public async generateImage(prompt: string) {
//         throw new Error('Not implemented');
//     }
// }

// services/aiService.ts
import { Redis } from 'ioredis';
import { GoogleGenAI } from '@google/genai';

const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

interface AIServiceConfig {
    cacheTTL: number;
    maxRetries: number;
    defaultModel: string;
}

/**
 * Minimal type for artifact object coming from JSON file
 */
type ArtifactObject = {
    name?: string;
    community?: string;
    short_description?: string;
    detailed_description?: string;
    uses?: string[];
    cultural_significance?: string;
    event_context?: string[];
    [key: string]: any;
};

export class AIService {
    private config: AIServiceConfig;
    private genAI: any;

    constructor(config: AIServiceConfig) {
        this.config = config;
        if (!process.env.GEMINI_API_KEY) {
            console.warn('GEMINI_API_KEY not set — AI calls will likely fail.');
        }

        this.genAI = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY || '',
        });
    }

    /* ------------------------- CACHE HELPERS ------------------------- */

    private async getCachedResponse(key: string): Promise<string | null> {
        try {
            return await redis.get(key);
        } catch (err) {
            console.error('Redis get error:', err);
            return null;
        }
    }

    private async cacheResponse(key: string, payload: string, ttl?: number) {
        try {
            await redis.setex(key, ttl ?? this.config.cacheTTL, payload);
        } catch (err) {
            console.error('Redis setex error:', err);
        }
    }

    /* ------------------------- ARTIFACT ENHANCER ------------------------- */

    public async enhanceArtifactObject(artifact: ArtifactObject) {
        try {
            const name = artifact.name || artifact.title || 'Unknown artifact';
            const community = artifact.community || 'unknown-community';

            const fingerprint = Buffer.from(
                `${community}::${name}::${artifact.short_description || ''}`
            ).toString('base64');

            const cacheKey = `ai:enhance:${fingerprint}`;
            const cached = await this.getCachedResponse(cacheKey);

            if (cached) {
                try {
                    return JSON.parse(cached);
                } catch {}
            }

            const prompt = [
                `You are a helpful cultural heritage assistant.`,
                `Enhance and expand the following artifact information for display in a museum-style app.`,
                `Provide the following keys ONLY:`,
                `enhanced_summary, enhanced_description, preservation_suggestions, short_preservation_note, event_context_note, raw`,
                ``,
                `Artifact:`,
                `Name: ${name}`,
                `Community: ${community}`,
                `Short description: ${artifact.short_description || 'N/A'}`,
                `Detailed description: ${artifact.detailed_description || 'N/A'}`,
                `Uses: ${artifact.uses ? artifact.uses.join(', ') : 'N/A'}`,
                `Cultural significance: ${artifact.cultural_significance || 'N/A'}`,
                `Event context: ${artifact.event_context ? artifact.event_context.join(', ') : 'N/A'}`,
                ``,
                `Return ONLY valid JSON.`,
            ].join('\n');

            const result = await this.genAI.models.generateContent({
                model: this.config.defaultModel,
                contents: [prompt],
            });

            const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) throw new Error('AI produced no text');

            let parsed: any;
            try {
                parsed = JSON.parse(text);
            } catch {
                const f = text.indexOf('{');
                const l = text.lastIndexOf('}');
                if (f !== -1 && l !== -1) {
                    parsed = JSON.parse(text.substring(f, l + 1));
                } else {
                    parsed = {
                        enhanced_summary: artifact.short_description || name,
                        enhanced_description:
                            artifact.detailed_description ||
                            artifact.short_description ||
                            name,
                        preservation_suggestions: [],
                        short_preservation_note: '',
                        event_context_note:
                            artifact.event_context?.join(', ') || '',
                        raw: text,
                    };
                }
            }

            const enhanced = {
                enhanced_summary:
                    parsed.enhanced_summary ||
                    artifact.short_description ||
                    name,
                enhanced_description:
                    parsed.enhanced_description ||
                    artifact.detailed_description ||
                    artifact.short_description ||
                    name,
                preservation_suggestions: Array.isArray(
                    parsed.preservation_suggestions
                )
                    ? parsed.preservation_suggestions
                    : [],
                short_preservation_note: parsed.short_preservation_note || '',
                event_context_note:
                    parsed.event_context_note ||
                    artifact.event_context?.join(', ') ||
                    '',
                raw: parsed.raw || text,
            };

            await this.cacheResponse(cacheKey, JSON.stringify(enhanced));
            return enhanced;
        } catch (err: any) {
            console.error('AIService.enhanceArtifactObject error:', err);

            return {
                enhanced_summary:
                    artifact.short_description || artifact.name || 'No summary',
                enhanced_description:
                    artifact.detailed_description ||
                    artifact.short_description ||
                    artifact.name ||
                    '',
                preservation_suggestions: [],
                short_preservation_note: '',
                event_context_note: artifact.event_context?.join(', ') || '',
                raw: `AI error: ${err?.message || 'unknown'}`,
            };
        }
    }

    /* ------------------------- PROVERB EXPLAINER ------------------------- */
    public async explainProverb(proverb: string, community: string) {
        try {
            const cacheKey = `ai:proverb:${community}:${proverb}`;
            const cached = await this.getCachedResponse(cacheKey);

            if (cached) return cached; // already cached as string

            const prompt = `
You are a cultural expert. Explain the following proverb from the ${community} community.

Proverb: "${proverb}"

Provide:
1. Literal meaning
2. Cultural or deeper meaning
3. When/how it is used traditionally
4. A short example scenario

Return ONLY this JSON shape:
{
  "literal": "",
  "meaning": "",
  "usage": "",
  "example": "",
  "raw": ""
}
        `.trim();

            const result = await this.genAI.models.generateContent({
                model: this.config.defaultModel,
                contents: [prompt],
            });

            const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) throw new Error('AI returned empty response');

            let parsed: any;
            try {
                parsed = JSON.parse(text);
            } catch {
                const first = text.indexOf('{');
                const last = text.lastIndexOf('}');
                if (first !== -1 && last !== -1) {
                    parsed = JSON.parse(text.substring(first, last + 1));
                } else {
                    parsed = {
                        literal: '',
                        meaning: '',
                        usage: '',
                        example: '',
                        raw: text,
                    };
                }
            }

            // Convert to Markdown string
            const explanationString = `
## ${proverb}

###  Literal Meaning
${parsed.literal || 'N/A'}

### Cultural Meaning
${parsed.meaning || 'N/A'}

###  Usage
${parsed.usage || 'N/A'}

###  Example
${parsed.example || 'N/A'}
        `.trim();

            // Cache the string instead of object
            await this.cacheResponse(cacheKey, explanationString);
            return explanationString; // <-- return string for ReactMarkdown
        } catch (err: any) {
            console.error('AIService.explainProverb error:', err);

            const fallback = `
## ${proverb}

###  Literal Meaning
N/A

###  Cultural Meaning
AI failed to explain this proverb.

###  Usage
N/A

###  Example
N/A
        `.trim();

            return fallback;
        }
    }
}
