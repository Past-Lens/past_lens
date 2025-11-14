import { GoogleGenAI } from '@google/genai';

const genAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
});

async function listModels() {
    try {
        const modelList = await genAI.models.list();
        console.log('Available models:', modelList);
    } catch (err) {
        console.error('Error listing models:', err);
    }
}

listModels();
