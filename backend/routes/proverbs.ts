import { Router } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import NodeCache from 'node-cache';
import { AIService } from '../services/ai.service';
// Assuming this path is correct

const router = Router();
const explanationCache = new NodeCache({ stdTTL: 3600 }); // 1-hour cache

const aiService = new AIService({
    cacheTTL: 3600,
    maxRetries: 3,
    defaultModel: 'gemini-2.5-pro',
});

// --- GET PROVERBS LIST --------------------------------------------------------

/**
 * GET proverbs list
 * Endpoint: /proverbs?community=Maasai
 */
router.get('/', async (req, res) => {
    const community = req.query.community as string;
    if (!community)
        return res.status(400).json({ error: 'Community is required' });

    try {
        const filePath = path.resolve(
            __dirname,
            '..',
            'data',
            `${community.toLowerCase()}_proverbs_db.json`
        );

        console.log('Resolved proverb file path:', filePath);
        if (!fs.existsSync(filePath)) {
            console.warn(
                `Proverb file not found for ${community}. Checking existence failed at: ${filePath}`
            );
            console.log(`Sending empty array for ${community} proverbs.`);
            return res.status(200).json([]);
        }

        const rawData = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(rawData); // ⭐ --- CRITICAL FIX ---
        // This logic now looks for the correct keys from your JSON files

        const proverbs: string[] = Array.isArray(data)
            ? data.map((item: any) => {
                  // 1. Check if item itself is a string
                  if (typeof item === 'string') {
                      return item;
                  } // 2. Check for the 'maasai' key
                  if (typeof item.maasai === 'string') {
                      return item.maasai;
                  } // 3. Check for the 'Proverb (Gĩkũyũ)' key
                  if (typeof item['Proverb (Gĩkũyũ)'] === 'string') {
                      return item['Proverb (Gĩkũyũ)'];
                  } // 4. Fallback check for 'text' key
                  if (typeof item.text === 'string') {
                      return item.text;
                  } // 5. If no valid key is found, return empty
                  return '';
              })
            : []; // ⭐ --- END OF FIX ---
        // Filter out any potential empty strings resulting from parsing
        const filteredProverbs = proverbs.filter((p) => p.length > 0); // This log should now show the correct number

        console.log(
            `Sending ${filteredProverbs.length} proverbs for ${community}.`
        );

        res.json(filteredProverbs); // Send the list of proverb strings
    } catch (err) {
        console.error('FETCH PROVERBS ERROR:', err);
        res.status(500).json({ error: 'Failed to fetch proverbs' });
    }
});

// --- POST EXPLAIN PROVERB ----------------------------------------------------

/** POST explain a proverb */
router.post('/explain', async (req, res) => {
    const { proverb, community } = req.body;

    if (!proverb || !community) {
        return res
            .status(400)
            .json({ error: 'Proverb and community are required' });
    }

    const cacheKey = `${community}_${proverb}`;
    const cached = explanationCache.get(cacheKey);
    if (cached) return res.json({ explanation: cached });

    try {
        let explanation = await aiService.explainProverb(proverb, community);
        explanationCache.set(cacheKey, explanation);

        res.json({ explanation });
    } catch (err: any) {
        console.error('EXPLAIN ERROR:', err);
        res.status(500).json({
            error: 'The AI model is busy. Please try again in a few seconds.',
        });
    }
});

export default router;
