import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

const datasetPath = path.join(__dirname, '../Dataset/dataset.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));

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
