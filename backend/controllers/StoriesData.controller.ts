import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

//paths
const datasetPath = path.join(__dirname, '../Dataset/dataset.json');
const storiesPath = path.join(__dirname, '../Dataset/stories.json');

//load datasets
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));
const stories = JSON.parse(fs.readFileSync(storiesPath, 'utf-8'));

export const getAllArtifacts = (req: Request, res: Response) => {
    res.json(dataset);
};

export const getArtifactById = (req: Request, res: Response) => {
    const { id } = req.params;
    const artifact = dataset.find(
        (item: any) => item.Artifact_ID.toLowerCase() === id.toLowerCase()
    );

    if (!artifact) {
        return res.status(404).json({ message: 'Artifact not found' });
    }

    res.json(artifact);
};

export const getArtifactByTitle = (req: Request, res: Response) => {
    const { title } = req.params;
    const artifact = dataset.find(
        (item: any) => item.Title.toLowerCase() === title.toLowerCase()
    );

    if (!artifact) {
        return res.status(404).json({ message: 'Artifact not found' });
    }

    res.json(artifact);
};

// === STORIES CONTROLLERS ===

// Get all stories (optionally filter by culture)
export const getAllStories = (req: Request, res: Response) => {
    const { culture } = req.query;

    if (culture) {
        const cultureKey = culture.toString().trim();
        const cultureStories = stories[cultureKey];

        if (!cultureStories) {
            return res
                .status(404)
                .json({
                    message: `No stories found for culture: ${cultureKey}`,
                });
        }

        return res.json({ culture: cultureKey, stories: cultureStories });
    }

    res.json(stories);
};

// Get a single story by culture + title
export const getStoryByTitle = (req: Request, res: Response) => {
    const { culture, title } = req.params;
    const cultureStories = stories[culture];

    if (!cultureStories) {
        return res
            .status(404)
            .json({ message: `Culture ${culture} not found` });
    }

    const story = cultureStories.find(
        (s: any) => s.title.toLowerCase() === title.toLowerCase()
    );

    if (!story) {
        return res
            .status(404)
            .json({
                message: `Story titled "${title}" not found in ${culture}`,
            });
    }

    res.json(story);
};
