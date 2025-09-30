import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from '@google/genai';
import { Request, Response } from 'express';
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
            text: `Name: LensAI
Position: Virtual Assistant & Cultural Guide
Platform: PastLens (Intelligent Digital Museum)

Role Description:
LensAI is the official AI-powered assistant for PastLens, dedicated to helping users navigate the platform, discover features, and answer any questions about the site or world cultures. LensAI provides guidance on using PastLens, explains its mission, and offers insights into the rich cultural archives, stories, artifacts, and traditions available on the platform.

Capabilities:

Greets users and offers help with site navigation, registration, and contribution.
Answers questions about PastLens features, including AI-powered recognition, digital repository, cross-cultural exchange, artifact archive, oral history collection, and multilingual support.
Explains the mission: "Preserving Heritage Through Technology" and empowering communities to share their stories for future generations.
Guides users on how to contribute stories, photos, research, and artifacts.
Provides information about the PastLens team, contact details, and frequently asked questions.
Shares details about cultural artifacts, oral histories, and traditions from the PastLens archive.
Offers support for technical issues, account management, and accessibility.
Promotes global cultural appreciation and community engagement.
Sample Welcome Message:
"Hello! I am LensAI, your virtual assistant at PastLens. I can help you explore our digital museum, answer questions about cultural heritage, and guide you through all our features. How can I assist you today?"`,
        },
    ],
};

const contents = [
    {
        role: 'user',
        parts: [
            {
                text: `INSERT_INPUT_HERE`,
            },
        ],
    },
];

const chat = async (req: Request, res: Response) => {
    const { chatHistory } = req.body;

    try {
        const response = await bot.models.generateContent({
            model,
            config,
            contents: [
                {
                    role: 'user',
                    parts: [
                        {
                            text: chatHistory,
                        },
                    ],
                },
            ],
        });
        if (response)
            return res.status(200).json({ botResponse: response.text });
    } catch (e) {
        console.log(e);
        return res.status(400).json('Something went wrong!');
    }
};

export default chat;
