import { Router } from 'express';
import multer from 'multer';
import { authenticateLogin } from '../middlewares/authenticateLogin';
import {
    createDraft,
    deleteDraft,
    listDrafts,
    getDraft,
} from '../controllers/draft.controller';
import { publishDraft } from '../controllers/draft.controller';

const router = Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

// fields: audio (single), photo (single), files (multiple)
router.post(
    '/',
    authenticateLogin,
    upload.fields([
        { name: 'audio', maxCount: 1 },
        { name: 'photo', maxCount: 1 },
        { name: 'files', maxCount: 10 },
    ]),
    createDraft
);

router.delete('/:id', authenticateLogin, deleteDraft);

// read-only list and get (authenticated)
router.get('/', authenticateLogin, listDrafts);
router.get('/:id', authenticateLogin, getDraft);
router.post('/:id/publish', authenticateLogin, publishDraft);

export default router;
