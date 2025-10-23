// use untyped req/res to avoid express typing conflicts between @types packages
import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import fs from 'fs';
import path from 'path';

function uploadBufferToCloudinary(
    buffer: Buffer,
    folder = 'drafts'
): Promise<string> {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) return reject(error);
                if (result && result.secure_url) resolve(result.secure_url);
                else reject(new Error('Upload failed'));
            }
        );
        stream.end(buffer);
    });
}

export const createDraft = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId || 'anonymous';
        const { title = '', description = '', type = '' } = req.body;

        const files: any = req.files || {};
        const uploaded: Record<string, string[]> = {};

        // fields: audio, photo, files (array)
        if (files.audio && files.audio[0]) {
            const buf = files.audio[0].buffer as Buffer;
            const url = await uploadBufferToCloudinary(buf, 'drafts/audio');
            uploaded.audio = [url];
        }
        if (files.photo && files.photo[0]) {
            const buf = files.photo[0].buffer as Buffer;
            const url = await uploadBufferToCloudinary(buf, 'drafts/photo');
            uploaded.photo = [url];
        }
        if (files.files && files.files.length) {
            uploaded.files = [];
            for (const f of files.files) {
                const url = await uploadBufferToCloudinary(
                    f.buffer as Buffer,
                    'drafts/files'
                );
                uploaded.files.push(url);
            }
        }

        const id = `draft_${Date.now()}`;
        const draftsDir = path.join(__dirname, '..', 'drafts');
        if (!fs.existsSync(draftsDir)) fs.mkdirSync(draftsDir);

        const draft = {
            id,
            userId,
            title,
            description,
            type,
            uploaded,
            createdAt: new Date().toISOString(),
        };

        fs.writeFileSync(
            path.join(draftsDir, `${id}.json`),
            JSON.stringify(draft, null, 2)
        );

        res.json({ success: true, draft });
    } catch (err: any) {
        console.error('Draft creation failed', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Draft creation failed',
        });
    }
};

export const deleteDraft = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const draftsDir = path.join(__dirname, '..', 'drafts');
        const file = path.join(draftsDir, `${id}.json`);
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
            return res.json({ success: true });
        }
        return res
            .status(404)
            .json({ success: false, message: 'Draft not found' });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Could not delete draft',
        });
    }
};

export const listDrafts = async (req: any, res: any) => {
    try {
        const draftsDir = path.join(__dirname, '..', 'drafts');
        if (!fs.existsSync(draftsDir))
            return res.json({ success: true, drafts: [] });
        const files = fs
            .readdirSync(draftsDir)
            .filter((f) => f.endsWith('.json'));
        const drafts: any[] = [];
        for (const file of files) {
            try {
                const content = fs.readFileSync(
                    path.join(draftsDir, file),
                    'utf-8'
                );
                drafts.push(JSON.parse(content));
            } catch (err) {
                console.warn('Failed to read draft file', file, err);
            }
        }
        // sort by createdAt desc
        drafts.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
        res.json({ success: true, drafts });
    } catch (err: any) {
        console.error('List drafts failed', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Could not list drafts',
        });
    }
};

export const getDraft = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const draftsDir = path.join(__dirname, '..', 'drafts');
        const file = path.join(draftsDir, `${id}.json`);
        if (!fs.existsSync(file))
            return res
                .status(404)
                .json({ success: false, message: 'Draft not found' });
        const content = fs.readFileSync(file, 'utf-8');
        const draft = JSON.parse(content);
        res.json({ success: true, draft });
    } catch (err: any) {
        console.error('Get draft failed', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Could not get draft',
        });
    }
};

export const publishDraft = async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const draftsDir = path.join(__dirname, '..', 'drafts');
        const file = path.join(draftsDir, `${id}.json`);
        if (!fs.existsSync(file))
            return res
                .status(404)
                .json({ success: false, message: 'Draft not found' });
        const content = fs.readFileSync(file, 'utf-8');
        const draft = JSON.parse(content);

        const datasetDir = path.join(__dirname, '..', 'Dataset');
        const datasetPath = path.join(datasetDir, 'dataset.json');
        if (!fs.existsSync(datasetDir)) fs.mkdirSync(datasetDir);
        let dataset: any[] = [];
        if (fs.existsSync(datasetPath)) {
            dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));
        }

        const artifact = {
            Artifact_ID: `artifact_${Date.now()}`,
            Title: draft.title || 'Untitled',
            Description: draft.description || '',
            Type: draft.type || '',
            Uploaded: draft.uploaded || {},
            CreatedAt: draft.createdAt || new Date().toISOString(),
            SourceDraftId: draft.id,
        };

        dataset.push(artifact);
        fs.writeFileSync(datasetPath, JSON.stringify(dataset, null, 2));

        // Optionally delete draft file after publishing
        // fs.unlinkSync(file);

        res.json({ success: true, artifact });
    } catch (err: any) {
        console.error('Publish draft failed', err);
        res.status(500).json({
            success: false,
            message: err.message || 'Could not publish draft',
        });
    }
};
