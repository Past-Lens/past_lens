import { z } from 'zod';

export const createArtifactSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required'),
        slug: z.string().min(1, 'Slug is required'),
        community: z.string().min(1, 'Community is required'),
        category: z.enum(['SONG', 'STORY', 'VIDEO', 'OBJECT']),
        shortDescription: z.string().min(1, 'Short description is required'),
        longDescription: z.string(),
        dateCollected: z.string().transform((str) => new Date(str)),
        provenance: z.string(),
        tags: z.array(z.string()),
        visibility: z.enum(['public', 'restricted']).default('public'),
        licenses: z.array(z.string()).optional(),
        consentDocs: z.record(z.string(), z.any()).optional(),
        layoutPos: z.object({
            x: z.number(),
            y: z.number(),
            z: z.number(),
            sceneId: z.string(),
        }),
    }),
});

export const updateArtifactSchema = z.object({
    body: createArtifactSchema.shape.body.partial(),
});
