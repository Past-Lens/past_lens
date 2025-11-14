import express, { Request, Response } from 'express';
import multer, { Multer } from 'multer';
import path from 'path';
import { exec } from 'child_process';
import fs from 'fs';
import { promisify } from 'util';

const execPromise = promisify(exec);
const router = express.Router();
const upload: Multer = multer({ dest: 'uploads/' });

// --- Import culture JSON database ---
import cultureData from '../data/culture_db.json';

// --- Define types ---
interface PredictResult {
    label: string;
    confidence?: number;
    message?: string;
}

interface CultureEntry {
    name: string;
    community?: string;
    short_description?: string;
    detailed_description?: string;
    uses?: string[];
    cultural_significance?: string;
    event_context?: string[];
    [key: string]: any;
}

// --- /api/discover endpoint ---
router.post(
    '/discover',
    upload.single('image'),
    async (req: Request, res: Response): Promise<void> => {
        try {
            const { community } = req.body as { community?: string };
            const file = req.file;

            if (!community) {
                res.status(400).json({
                    success: false,
                    message: 'Community is required.',
                });
                return;
            }

            if (!file) {
                res.status(400).json({
                    success: false,
                    message: 'Image file is required.',
                });
                return;
            }

            const imagePath = file.path;
            const pyPath = path.resolve(__dirname, '../predict.py');

            try {
                // --- Run Python inference ---
                const { stdout } = await execPromise(
                    `python "${pyPath}" ${community} "${imagePath}"`
                );
                const result: PredictResult = JSON.parse(stdout);

                if (result.label === 'error') {
                    res.status(500).json({
                        success: false,
                        message: result.message,
                    });
                    return;
                }

                const label = result.label;

                // --- Normalize key ---
                const key = label
                    .toLowerCase()
                    .replace(/kikuyu_|maasai_/g, '')
                    .replace(/\s+/g, '_')
                    .replace(/_culture_/g, '_');

                // --- Look up entry in JSON database ---
                const communityData = (
                    cultureData as Record<string, Record<string, CultureEntry>>
                )[community];
                const data =
                    communityData?.[key] || communityData?.[label] || null;

                if (!data) {
                    res.status(404).json({
                        success: false,
                        message: 'Artifact not found.',
                    });
                    return;
                }

                // --- Return only the artifact object ---
                res.json(data);
            } catch (error: any) {
                console.error('Python Exec Error:', error);
                res.status(500).json({
                    success: false,
                    message: error.message,
                });
            } finally {
                fs.unlink(
                    file.path,
                    (err) => err && console.error('File cleanup failed:', err)
                );
            }
        } catch (err) {
            console.error('Server Error:', err);
            res.status(500).json({
                success: false,
                message: 'Internal server error.',
            });
        }
    }
);

export default router;
