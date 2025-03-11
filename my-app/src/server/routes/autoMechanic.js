import express from 'express';
const { Router } = express;
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

const apiKey = process.env.GEMINI_API_KEY;
console.log("API Key from env:", apiKey ? "Present" : "Missing!"); // Check if API key is loaded

const genAI = new GoogleGenerativeAI(apiKey);
console.log("genAI object:", genAI); // Log genAI object immediately after initialization


const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-thinking-exp-01-21",
});
console.log("Initialized Gemini model:", model); // Log model initialization


const generationConfig = {
    temperature: 0.7,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 65536,
    responseMimeType: "text/plain",
};

const chatSessions = new Map();

router.post('/chat', async (req, res) => {
    const userId = req.id;
    const userMessage = req.body.message;

    if (!userMessage) {
        return res.status(400).json({ error: 'Message is required' });
    }

    let chatSession = chatSessions.get(userId);

    if (!chatSession) {
        console.log("chatSession is null, initializing new session...");
        chatSession = model.startChat({
            generationConfig,
            history: [],
        });
        chatSessions.set(userId, chatSession);
        console.log("New chatSession initialized:", chatSession);
        console.log("Type of new chatSession:", typeof chatSession);
    } else {
        console.log("Retrieved existing chatSession:", chatSession);
        console.log("Type of existing chatSession:", typeof chatSession);
    }


    try {
        const result = await chatSession.sendMessage(userMessage);
        const responseText = result.response.text();

        chatSessions.set(userId, chatSession);

        res.json({ response: responseText });
    } catch (error) {
        console.error('Gemini API error:', error);
        res.status(500).json({
            error: 'Failed to send message to AI',
            details: error.message,
            stack: error.stack
        });
    }
});

router.post('/reset', async (req, res) => {
    const userId = req.user.id;
    chatSessions.delete(userId);
    res.json({ message: 'Chat history reset successfully' });
});

export default router;