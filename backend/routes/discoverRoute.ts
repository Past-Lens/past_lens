// import express, { Request, Response } from 'express';
// import multer, { Multer } from 'multer';
// import path from 'path';
// import { exec } from 'child_process';
// import fs from 'fs';
// import { promisify } from 'util';

// const execPromise = promisify(exec);
// const router = express.Router();
// const upload: Multer = multer({ dest: 'uploads/' });

// // --- Import culture JSON database ---
// import cultureData from '../data/culture_db.json';

// // --- Define types ---
// interface PredictResult {
//     label: string;
//     confidence?: number;
//     message?: string;
// }

// interface CultureEntry {
//     name: string;
//     community?: string;
//     short_description?: string;
//     detailed_description?: string;
//     uses?: string[];
//     cultural_significance?: string;
//     event_context?: string[];
//     [key: string]: any;
// }

// // --- /api/discover endpoint ---
// router.post(
//     '/discover',
//     upload.single('image'),
//     async (req: Request, res: Response): Promise<void> => {
//         try {
//             const { community } = req.body as { community?: string };
//             const file = req.file;

//             if (!community) {
//                 res.status(400).json({
//                     success: false,
//                     message: 'Community is required.',
//                 });
//                 return;
//             }

//             if (!file) {
//                 res.status(400).json({
//                     success: false,
//                     message: 'Image file is required.',
//                 });
//                 return;
//             }

//             const imagePath = file.path;
//             const pyPath = path.resolve(__dirname, '../predict.py');

//             try {
//                 // --- Run Python inference ---
//                 const { stdout } = await execPromise(
//                     `python "${pyPath}" ${community} "${imagePath}"`
//                 );
//                 const result: PredictResult = JSON.parse(stdout);

//                 if (result.label === 'error') {
//                     res.status(500).json({
//                         success: false,
//                         message: result.message,
//                     });
//                     return;
//                 }

//                 const label = result.label;

//                 // --- Normalize key ---
//                 const key = label
//                     .toLowerCase()
//                     .replace(/kikuyu_|maasai_/g, '')
//                     .replace(/\s+/g, '_')
//                     .replace(/_culture_/g, '_');

//                 // --- Look up entry in JSON database ---
//                 const communityData = (
//                     cultureData as Record<string, Record<string, CultureEntry>>
//                 )[community];
//                 const data =
//                     communityData?.[key] || communityData?.[label] || null;

//                 if (!data) {
//                     res.status(404).json({
//                         success: false,
//                         message: 'Artifact not found.',
//                     });
//                     return;
//                 }

//                 // --- Return only the artifact object ---
//                 res.json(data);
//             } catch (error: any) {
//                 console.error('Python Exec Error:', error);
//                 res.status(500).json({
//                     success: false,
//                     message: error.message,
//                 });
//             } finally {
//                 fs.unlink(
//                     file.path,
//                     (err) => err && console.error('File cleanup failed:', err)
//                 );
//             }
//         } catch (err) {
//             console.error('Server Error:', err);
//             res.status(500).json({
//                 success: false,
//                 message: 'Internal server error.',
//             });
//         }
//     }
// );

// export default router;

// routes/discover.ts
import express, { Request, Response } from 'express';
import multer, { Multer } from 'multer';
import path from 'path';
import { exec } from 'child_process';
import fs from 'fs';
import { promisify } from 'util';
import { AIService } from '../services/ai.service';

const execPromise = promisify(exec);
const router = express.Router();
const upload: Multer = multer({ dest: 'uploads/' });

/**
 * Import culture JSON database (static file).
 * Make sure ../data/culture_db.json exists and is valid JSON.
 */
import cultureData from '../data/culture_db.json';

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

// instantiate AI service (configurable)
const ai = new AIService({
    cacheTTL: 60 * 60, // 1 hour default
    maxRetries: 2,
    defaultModel: process.env.DEFAULT_AI_MODEL || 'gemini-2.5-pro',
});

router.post(
    '/discover',
    upload.single('image'),
    async (req: Request, res: Response): Promise<void> => {
        let fileCleanupPath: string | null = null;
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

            fileCleanupPath = file.path;
            const imagePath = file.path;
            const pyPath = path.resolve(__dirname, '../predict.py');

            try {
                // Run Python inference (predict.py returns JSON to stdout)
                const cmd = `python "${pyPath}" ${community} "${imagePath}"`;
                const { stdout } = await execPromise(cmd);
                const result: PredictResult = JSON.parse(stdout);

                if (result.label === 'error') {
                    res.status(500).json({
                        success: false,
                        message: result.message,
                    });
                    return;
                }

                const label = result.label;

                // Normalize key similar to your earlier code
                const key = label
                    .toLowerCase()
                    .replace(/kikuyu_|maasai_/g, '')
                    .replace(/\s+/g, '_')
                    .replace(/_culture_/g, '_');

                // Look up entry in JSON database
                const communityData = (
                    cultureData as Record<string, Record<string, CultureEntry>>
                )[community];

                const data =
                    communityData?.[key] || communityData?.[label] || null;

                if (!data) {
                    res.status(404).json({
                        success: false,
                        message: 'Artifact not found.',
                        predicted: {
                            label,
                            confidence: result.confidence ?? null,
                        },
                    });
                    return;
                }

                // Attach predicted metadata
                const artifactObject: CultureEntry & { _predicted?: any } = {
                    ...data,
                    _predicted: {
                        label,
                        confidence: result.confidence ?? null,
                    },
                };

                // --- AI enhancement: send the artifact object to AIService ---
                // The service will return enhanced fields and caching is used.
                const enhanced = await ai.enhanceArtifactObject(artifactObject);

                // Merge original artifact + enhanced fields (don't overwrite original unless enhanced provided)
                const merged = {
                    ...artifactObject,
                    enhanced: enhanced, // full AI response (structured)
                };

                // Return artifact + enhancement to frontend
                res.json(merged);
            } catch (error: any) {
                console.error('Python Exec Error:', error);
                res.status(500).json({
                    success: false,
                    message: (error && error.message) || 'Prediction failed',
                });
            } finally {
                // cleanup uploaded image
                if (file && file.path) {
                    fs.unlink(file.path, (err) => {
                        if (err) console.error('File cleanup failed:', err);
                    });
                }
            }
        } catch (err: any) {
            console.error('Server Error:', err);
            // Attempt to cleanup file if it exists
            if (fileCleanupPath) {
                fs.unlink(
                    fileCleanupPath,
                    (e) => e && console.error('Cleanup failed:', e)
                );
            }
            res.status(500).json({
                success: false,
                message: 'Internal server error.',
            });
        }
    }
);

export default router;
