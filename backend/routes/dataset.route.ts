import { Router } from 'express';

import {
    getAllArtifacts,
    getArtifactById,
    getArtifactByTitle,
} from '../controllers/dataset.controller';

const router: Router = Router();

router.get('/', getAllArtifacts);
router.get('/id/:id', getArtifactById);
router.get('/title/:title', getArtifactByTitle);

export default router;
