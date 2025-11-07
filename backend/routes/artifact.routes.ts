import { Router } from 'express';
import { ArtifactController } from '../controllers/artifact.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateRequest } from '../middlewares/validate.middleware';
import {
    createArtifactSchema,
    updateArtifactSchema,
} from '../validators/artifact.validator';
import { curatorMiddleware } from '../middlewares/curator.middleware';

const router = Router();
const artifactController = new ArtifactController();

// Public routes
router.get('/', artifactController.listArtifacts.bind(artifactController));
router.get('/:id', artifactController.getArtifact.bind(artifactController));
router.get(
    '/:id/similar',
    artifactController.getSimilarArtifacts.bind(artifactController)
);
router.get(
    '/:id/media/:assetId',
    artifactController.getMediaAsset.bind(artifactController)
);

// Protected routes
router.use(authMiddleware);
router.post(
    '/',
    validateRequest(createArtifactSchema),
    artifactController.createArtifact.bind(artifactController)
);
router.put(
    '/:id',
    validateRequest(updateArtifactSchema),
    artifactController.updateArtifact.bind(artifactController)
);
router.delete(
    '/:id',
    artifactController.deleteArtifact.bind(artifactController)
);

// Curator/Admin only routes
router.post(
    '/:id/media',
    curatorMiddleware,
    artifactController.addMediaAsset.bind(artifactController)
);
router.post(
    '/:id/transcript',
    curatorMiddleware,
    artifactController.addTranscript.bind(artifactController)
);

export default router;
