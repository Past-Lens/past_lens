import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/express';
import { AIService } from '../services/ai.service';
import { z } from 'zod';

const aiService = new AIService({
    cacheTTL: 3600, // 1 hour
    maxRetries: 3,
    defaultModel: 'gemini-pro',
});

// Input validation schemas
const explainSchema = z.object({
    mode: z.enum(['SHORT', 'DETAILED', 'COMPARE']).default('SHORT'),
    options: z.record(z.any()).optional(),
});

const compareSchema = z.object({
    artifactIds: z.array(z.string()).min(2).max(5),
    options: z.record(z.any()).optional(),
});

const generateImageSchema = z.object({
    prompt: z.string().min(10).max(1000),
    options: z.record(z.any()).optional(),
});

export class AIController {
    async explain(req: Request, res: Response) {
        try {
            const { id: artifactId } = req.params;
            const { mode, options } = explainSchema.parse(req.body);

            const insight = await aiService.explainArtifact(artifactId, mode);

            res.json(insight);
        } catch (error) {
            console.error('AI explain error:', error);
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: 'Invalid request parameters',
                    details: error.errors,
                });
            }
            res.status(500).json({
                error: 'Failed to generate AI explanation',
            });
        }
    }

    async compare(req: Request, res: Response) {
        try {
            const { artifactIds, options } = compareSchema.parse(req.body);

            // TODO: Implement comparison logic
            res.status(501).json({ error: 'Not implemented yet' });
        } catch (error) {
            console.error('AI compare error:', error);
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: 'Invalid request parameters',
                    details: error.errors,
                });
            }
            res.status(500).json({ error: 'Failed to compare artifacts' });
        }
    }

    async generateImage(req: AuthenticatedRequest, res: Response) {
        try {
            // Only allow curators to generate images
            if (!req.user || !['curator', 'admin'].includes(req.user.role)) {
                return res
                    .status(403)
                    .json({ error: 'Only curators can generate images' });
            }

            const { prompt, options } = generateImageSchema.parse(req.body);

            // TODO: Implement image generation
            res.status(501).json({ error: 'Not implemented yet' });
        } catch (error) {
            console.error('AI image generation error:', error);
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    error: 'Invalid request parameters',
                    details: error.errors,
                });
            }
            res.status(500).json({ error: 'Failed to generate image' });
        }
    }

    async getInsights(req: Request, res: Response) {
        try {
            const { artifactId } = req.params;
            const insights = await prisma.aIInsight.findMany({
                where: { artifactId },
                orderBy: { createdAt: 'desc' },
                take: 10,
            });

            res.json(insights);
        } catch (error) {
            console.error('Get insights error:', error);
            res.status(500).json({ error: 'Failed to retrieve insights' });
        }
    }
}
