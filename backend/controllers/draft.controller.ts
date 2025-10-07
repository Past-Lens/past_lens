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

export const createDraft = async (req: any, res: any) => {
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
