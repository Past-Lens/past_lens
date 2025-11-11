import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { curatorMiddleware } from '../middlewares/curator.middleware';
import { validateRequest } from '../middlewares/validate.middleware';

const router = Router();
const aiController = new AIController();

// Public routes
router.get('/insights/:artifactId', aiController.getInsights);
router.post('/explain/:id', aiController.explain);

// Protected routes
router.use(authMiddleware);
router.post('/compare', aiController.compare);

// Curator only routes
router.use(curatorMiddleware);
router.post('/generate-image', aiController.generateImage);

export default router;
