import { Request, Response } from 'express';
import { PrismaClient, Prisma, ArtifactCategory } from '@prisma/client';
import { generateSlug } from '../utils/helpers';
import { AuthenticatedRequest } from '../types/express';

const prisma = new PrismaClient();

export class ArtifactController {
    async listArtifacts(req: Request, res: Response) {
        try {
            const {
                page = 1,
                limit = 10,
                sceneOnly = false,
                community,
                category,
            } = req.query;
            const skip = (Number(page) - 1) * Number(limit);

            const where: Prisma.ArtifactWhereInput = {
                visibility: 'public',
                ...(community && { community: String(community) }),
                ...(category && {
                    category: String(category) as ArtifactCategory,
                }),
            };

            if (sceneOnly === 'true') {
                where.layoutPos = {
                    not: null as any, // This is safe as Prisma will handle it correctly at runtime
                };
            }

            const [artifacts, total] = await Promise.all([
                prisma.artifact.findMany({
                    where,
                    skip,
                    take: Number(limit),
                    include: {
                        media: {
                            select: {
                                id: true,
                                type: true,
                                processedUrls: true,
                                status: true,
                            },
                        },
                    },
                }),
                prisma.artifact.count({ where }),
            ]);

            res.json({
                artifacts,
                total,
                pages: Math.ceil(total / Number(limit)),
            });
        } catch (error) {
            console.error('List artifacts error:', error);
            res.status(500).json({ error: 'Failed to list artifacts' });
        }
    }

    async getArtifact(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const artifact = await prisma.artifact.findUnique({
                where: { id },
                include: {
                    media: true,
                    transcripts: true,
                },
            });

            if (!artifact) {
                return res.status(404).json({ error: 'Artifact not found' });
            }

            // If artifact is restricted, check user authorization
            if (artifact.visibility === 'restricted') {
                // Add your authorization logic here
                const user = req.user;
                if (!user || user.role !== 'admin') {
                    return res.status(403).json({ error: 'Access denied' });
                }
            }

            res.json(artifact);
        } catch (error) {
            console.error('Get artifact error:', error);
            res.status(500).json({ error: 'Failed to get artifact' });
        }
    }

    async createArtifact(req: AuthenticatedRequest, res: Response) {
        try {
            const data = req.body;
            const user = req.user;

            if (!user) {
                return res
                    .status(401)
                    .json({ error: 'Authentication required' });
            }

            // Generate slug if not provided
            if (!data.slug) {
                data.slug = await generateSlug(data.title);
            }

            const artifact = await prisma.artifact.create({
                data: {
                    ...data,
                    createdById: user.id,
                },
                include: {
                    media: true,
                },
            });

            res.status(201).json(artifact);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    return res
                        .status(400)
                        .json({ error: 'Slug must be unique' });
                }
            }
            console.error('Create artifact error:', error);
            res.status(500).json({ error: 'Failed to create artifact' });
        }
    }

    async updateArtifact(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const data = req.body;
            const user = req.user;

            if (!user) {
                return res
                    .status(401)
                    .json({ error: 'Authentication required' });
            }

            const artifact = await prisma.artifact.findUnique({
                where: { id },
            });

            if (!artifact) {
                return res.status(404).json({ error: 'Artifact not found' });
            }

            // Check if user has permission to update
            if (artifact.createdById !== user.id && user.role !== 'admin') {
                return res
                    .status(403)
                    .json({ error: 'Not authorized to update this artifact' });
            }

            const updated = await prisma.artifact.update({
                where: { id },
                data,
                include: {
                    media: true,
                },
            });

            res.json(updated);
        } catch (error) {
            console.error('Update artifact error:', error);
            res.status(500).json({ error: 'Failed to update artifact' });
        }
    }

    async deleteArtifact(req: AuthenticatedRequest, res: Response) {
        try {
            const { id } = req.params;
            const user = req.user;

            if (!user) {
                return res
                    .status(401)
                    .json({ error: 'Authentication required' });
            }

            const artifact = await prisma.artifact.findUnique({
                where: { id },
            });

            if (!artifact) {
                return res.status(404).json({ error: 'Artifact not found' });
            }

            // Only admin can delete artifacts
            if (user.role !== 'admin') {
                return res
                    .status(403)
                    .json({ error: 'Only admin can delete artifacts' });
            }

            await prisma.artifact.delete({
                where: { id },
            });

            res.status(204).send();
        } catch (error) {
            console.error('Delete artifact error:', error);
            res.status(500).json({ error: 'Failed to delete artifact' });
        }
    }

    async getSimilarArtifacts(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { limit = 8 } = req.query;

            const artifact = await prisma.artifact.findUnique({
                where: { id },
                select: {
                    id: true,
                    embeddingsId: true,
                    community: true,
                    category: true,
                },
            });

            if (!artifact) {
                return res.status(404).json({ error: 'Artifact not found' });
            }

            // For now, return artifacts from same community and category
            // TODO: Implement vector similarity search
            const similar = await prisma.artifact.findMany({
                where: {
                    AND: [
                        { community: artifact.community },
                        { category: artifact.category },
                        { id: { not: artifact.id } },
                        { visibility: 'public' },
                    ],
                },
                take: Number(limit),
                include: {
                    media: {
                        select: {
                            id: true,
                            type: true,
                            processedUrls: true,
                        },
                    },
                },
            });

            res.json(similar);
        } catch (error) {
            console.error('Get similar artifacts error:', error);
            res.status(500).json({ error: 'Failed to get similar artifacts' });
        }
    }

    async getMediaAsset(req: Request, res: Response) {
        try {
            const { id, assetId } = req.params;

            const mediaAsset = await prisma.mediaAsset.findFirst({
                where: {
                    AND: [{ id: assetId }, { artifactId: id }],
                },
            });

            if (!mediaAsset) {
                return res.status(404).json({ error: 'Media asset not found' });
            }

            // TODO: Generate signed URL for the media asset
            const signedUrl = mediaAsset.processedUrls;

            res.json({
                url: signedUrl,
                type: mediaAsset.type,
                duration: mediaAsset.duration,
            });
        } catch (error) {
            console.error('Get media asset error:', error);
            res.status(500).json({ error: 'Failed to get media asset' });
        }
    }

    async addMediaAsset(req: AuthenticatedRequest, res: Response) {
        // TODO: Implement media upload and processing
        res.status(501).json({ error: 'Not implemented' });
    }

    async addTranscript(req: AuthenticatedRequest, res: Response) {
        // TODO: Implement transcript creation
        res.status(501).json({ error: 'Not implemented' });
    }
}
