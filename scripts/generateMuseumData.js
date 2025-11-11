/*
 * generateMuseumData.js
 *
 * Scans `frontend/Dataset/dataset.json` and `frontend/Dataset/other.json`,
 * copies referenced local images into `frontend/public/images/dataset/`, and
 * writes a TypeScript file `frontend/src/utils/museumData.generated.ts` that
 * exports a `museumData: MuseumData` object compatible with the app types.
 *
 * Run from repo root with: node scripts/generateMuseumData.js
 *
 * Note: this script uses only Node built-ins so it should work without extra deps.
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const frontendDatasetDir = path.join(repoRoot, 'frontend', 'Dataset');
const frontendPublicDir = path.join(
    repoRoot,
    'frontend',
    'public',
    'images',
    'dataset'
);
const frontendSrcUtils = path.join(repoRoot, 'frontend', 'src', 'utils');

function readJson(p) {
    try {
        return JSON.parse(fs.readFileSync(p, 'utf8'));
    } catch (e) {
        console.error('Failed to read JSON', p, e.message);
        return null;
    }
}

function findLocalFileByName(basename) {
    // Recursively search frontend/Dataset for a file with this basename
    const walk = (dir) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const en of entries) {
            const full = path.join(dir, en.name);
            if (en.isDirectory()) {
                const found = walk(full);
                if (found) return found;
            } else if (en.isFile()) {
                if (en.name === basename) return full;
            }
        }
        return null;
    };
    return walk(frontendDatasetDir);
}

function ensureDir(dir) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function safeFilename(s) {
    return s.replace(/[^a-z0-9._-]/gi, '_');
}

(function main() {
    ensureDir(frontendPublicDir);
    ensureDir(frontendSrcUtils);

    const datasetJsonPath = path.join(frontendDatasetDir, 'dataset.json');
    const otherJsonPath = path.join(frontendDatasetDir, 'other.json');

    const dataset = readJson(datasetJsonPath) || [];
    const other = readJson(otherJsonPath) || {};
    const storiesJsonPath = path.join(frontendDatasetDir, 'stories.json');
    const storiesData = readJson(storiesJsonPath) || {};

    const artifacts = [];

    // Process dataset.json (coastal, kikuyu entries etc.)
    dataset.forEach((entry, idx) => {
        if (!entry || entry.Type !== 'Image') return; // only images for artifacts
        const media = entry.Media_Link;
        let publicUrl = null;
        if (media) {
            const found = findLocalFileByName(media);
            if (found) {
                const destName = `${safeFilename(entry.Artifact_ID || 'img')}_${path.basename(media)}`;
                const destPath = path.join(frontendPublicDir, destName);
                try {
                    fs.copyFileSync(found, destPath);
                    publicUrl = `/images/dataset/${destName}`;
                } catch (e) {
                    console.warn(
                        'Failed to copy',
                        found,
                        '=>',
                        destPath,
                        e.message
                    );
                }
            } else {
                // Maybe Media_Link is already a URL
                if (/^https?:\/\//i.test(media)) publicUrl = media;
            }
        }

        artifacts.push({
            id: entry.Artifact_ID || `ds_${idx}`,
            name: entry.Title || 'Untitled',
            period: entry.Period || '',
            origin: entry.Community_Origin || '',
            description: entry.Description || '',
            imageUrl: publicUrl || '',
            model3dUrl: '',
            category: entry.Community_Origin || entry.Type || 'Uncategorized',
            position: [0, 0, -5],
        });
    });

    // Process other.json (Kikuyu data) -> other.museumData.artifacts
    if (other && Array.isArray(other.artifacts)) {
        other.artifacts.forEach((a) => {
            const id = a.id || `other_${artifacts.length + 1}`;
            let imageUrl = '';
            if (a.imageUrl && /^https?:\/\//.test(a.imageUrl))
                imageUrl = a.imageUrl;
            // attempt to find a local image by name (not reliable but best-effort)
            if (!imageUrl && a.name) {
                // try some candidate basenames
                const candidates = [
                    `${a.name}.jpg`,
                    `${a.name}.jpeg`,
                    `${a.name}.png`,
                    `${a.name.replace(/\s+/g, '_')}.jpg`,
                ];
                for (const c of candidates) {
                    const found = findLocalFileByName(c);
                    if (found) {
                        const destName = `${safeFilename(id)}_${path.basename(found)}`;
                        const destPath = path.join(frontendPublicDir, destName);
                        try {
                            fs.copyFileSync(found, destPath);
                            imageUrl = `/images/dataset/${destName}`;
                            break;
                        } catch (e) {
                            // ignore
                        }
                    }
                }
            }
            artifacts.push({
                id,
                name: a.name || 'Untitled',
                period: a.period || a.year || '',
                origin: other.museumData?.title || a.source || '',
                description: a.description || '',
                imageUrl: imageUrl || '',
                model3dUrl: '',
                category: a.category || 'Kikuyu',
                position: [0, 0, -5],
            });
        });
    }

    // Map stories.json into culturalStories, libraryContent and guideTour steps
    const culturalStories = [];
    const libraryContent = [];
    const guideSteps = [];

    Object.keys(storiesData).forEach((cultureKey) => {
        const arr = storiesData[cultureKey];
        if (!Array.isArray(arr)) return;
        arr.forEach((s, idx) => {
            const storyId = `${cultureKey}-${idx + 1}`;
            // try to find an image file for the story title
            let imageUrl = '';
            if (s.imageUrl && /^https?:\/\//.test(s.imageUrl))
                imageUrl = s.imageUrl;
            else if (s.media && typeof s.media === 'string') {
                const found = findLocalFileByName(s.media);
                if (found) {
                    const destName = `${safeFilename(storyId)}_${path.basename(found)}`;
                    const destPath = path.join(frontendPublicDir, destName);
                    try {
                        fs.copyFileSync(found, destPath);
                        imageUrl = `/images/dataset/${destName}`;
                    } catch (e) {}
                }
            }

            culturalStories.push({
                id: storyId,
                title: s.title || `Story ${storyId}`,
                culture: cultureKey,
                period: s.period || '',
                description: s.story || s.description || '',
                audioUrl: s.audioUrl || '',
                imageUrl: imageUrl || '',
                duration: s.duration || '',
            });

            // Add to library content
            libraryContent.push({
                id: storyId,
                title: s.title || `Story ${storyId}`,
                category: cultureKey,
                author: s.author || 'Unknown',
                readTime: s.readTime || '5 min',
                excerpt: (s.story || s.description || '').slice(0, 220),
                imageUrl: imageUrl || '',
            });

            // Create guide step (first few will be used)
            if (guideSteps.length < 6) {
                guideSteps.push({
                    id: guideSteps.length + 1,
                    title: s.title || `Step ${guideSteps.length + 1}`,
                    description: (s.story || s.description || '').slice(0, 300),
                    location: cultureKey,
                    videoUrl: s.videoUrl || '',
                });
            }
        });
    });

    // Build minimal museumData object
    const museumData = {
        artifacts,
        culturalStories,
        libraryContent,
        guideTour: {
            welcomeVideo: other.museumData?.welcomeVideo || '',
            steps: guideSteps,
        },
        categories: [],
    };

    // Write TypeScript output
    const outPath = path.join(frontendSrcUtils, 'museumData.generated.ts');
    const header = `// This file is generated by scripts/generateMuseumData.js - do not edit by hand\n`;
    const content = `${header}import type { MuseumData } from '@/types/museum';\n\nexport const museumData: MuseumData = ${JSON.stringify(museumData, null, 2)} as any;\n`;

    fs.writeFileSync(outPath, content, 'utf8');
    console.log('Generated', outPath);
    console.log('Artifacts:', artifacts.length);
})();
