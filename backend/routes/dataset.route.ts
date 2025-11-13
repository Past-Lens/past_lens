import { Router } from 'express';

import {
    getAllArtifacts,
    getArtifactById,
    getArtifactByTitle,
    getAllStories,
    getStoryByTitle
} from '../controllers/dataset.controller';

const router: Router = Router();

router.get('/', getAllArtifacts);
router.get('/id/:id', getArtifactById);
router.get('/title/:title', getArtifactByTitle);

// Story routes
router.get('/stories', getAllStories); // optional ?culture=Kikuyu
router.get('/stories/:culture/:title', getStoryByTitle);
export default router;
