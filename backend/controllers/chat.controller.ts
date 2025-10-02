import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from '@google/genai';
import { Request, Response } from 'express';
import SystemInstruction from '../Dataset/chatbot_system_instruction';
const apiKey = process.env.GEMINI_API_KEY;

const bot = new GoogleGenAI({ apiKey });
const model = 'gemini-flash-latest';

const config = {
    thinkingConfig: {
        thinkingBudget: 4578,
    },
    safetySettings: [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE, // Block none
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH, // Block few
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE, // Block none
        },
    ],
    systemInstruction: [
        {
            text: SystemInstruction,
        },
    ],
};

const conversationHistory: { role: string; content: string }[] = [];

function buildPrompt(
    history: { role: string; content: string }[],
    latestInput: string
) {
    const context = history.map((m) => `${m.role}: ${m.content}`).join('\n');
    return `Conversation so far:\n${context}\n\nLatest user input: ${latestInput}`;
}

const chat = async (req: Request, res: Response) => {
    const { chatInput } = req.body;
    // console.log(chatInput); // output user input from frontend
    conversationHistory.push({ role: 'user:', content: chatInput });
    try {
        const response = await bot.models.generateContent({
            model,
            config,
            contents: [
                {
                    role: 'user',
                    parts: [
                        { text: buildPrompt(conversationHistory, chatInput) },
                    ],
                },
            ],
        });
        if (response) {
            // console.log(response.text); // output response of the chatBot
            conversationHistory.push({
                role: 'LensAi',
                content: response.text!,
            });
            return res.status(200).json({ botResponse: response.text });
        }
    } catch (e) {
        console.log(e);
        return res.status(400).json(e);
    }
};

export default chat;
