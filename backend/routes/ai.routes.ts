// src/routes/ai.route.ts
import { Router, Request, Response } from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { AIController } from '../controllers/ai.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { curatorMiddleware } from '../middlewares/curator.middleware';
import { validateRequest } from '../middlewares/validate.middleware';

const router = Router();
const aiController = new AIController();

/* --------------------------- Public Routes --------------------------- */
router.get('/insights/:artifactId', aiController.getInsights);
router.post('/explain/:id', aiController.explain);

/**
 * /generate
 * Enhanced to connect Node with Python for text or cultural generation.
 * Calls ai_gen.py with JSON input { prompt, model } and expects JSON output.
 */
router.post('/generate', async (req: Request, res: Response) => {
    const { prompt, model } = req.body || {};
    if (!prompt)
        return res
            .status(400)
            .json({ success: false, message: 'Prompt is required.' });

    const scriptPath = path.resolve(__dirname, '../ai_gen.py');
    const py = spawn('python', [scriptPath], { env: process.env });

    let stdout = '';
    let stderr = '';

    py.stdout.on('data', (data) => {
        stdout += data.toString();
    });

    py.stderr.on('data', (data) => {
        stderr += data.toString();
    });

    py.on('close', (code) => {
        if (stderr) console.warn('ai_gen stderr:', stderr);

        if (code !== 0) {
            try {
                const parsed = JSON.parse(stdout || '{}');
                return res
                    .status(500)
                    .json({
                        success: false,
                        error: parsed.error || 'ai_gen failed',
                    });
            } catch {
                return res.status(500).json({
                    success: false,
                    error: stdout || stderr || 'ai_gen failed',
                });
            }
        }

        try {
            const output = JSON.parse(stdout);
            return res.json(output);
        } catch {
            return res.status(500).json({
                success: false,
                error: 'Invalid JSON output from ai_gen.py',
                raw: stdout,
            });
        }
    });

    // Send data to Python script
    py.stdin.write(JSON.stringify({ prompt, model }));
    py.stdin.end();
});

/* --------------------------- Protected Routes --------------------------- */
router.use(authMiddleware);
router.post('/compare', aiController.compare);

/* -------------------------- Curator-only Routes ------------------------- */
router.use(curatorMiddleware);
router.post('/generate-image', aiController.generateImage);

export default router;
