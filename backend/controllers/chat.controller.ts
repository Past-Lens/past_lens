import { GoogleGenAI } from '@google/genai';
import { Request, Response } from 'express';
const apiKey = process.env.GEMINI_API_KEY;

const bot = new GoogleGenAI({ apiKey });

const chat = async () => {};

export default chat;
