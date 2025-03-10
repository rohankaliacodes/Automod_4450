import express from 'express';
const { Router } = express; // For specifically the Router from express
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv'

dotenv.config()

    const router = Router();

    const apiKey = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-thinking-exp-01-21",
    });

    const generationConfig = {
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 65536,
        responseMimeType: "text/plain",
    };

    // Store chat sessions, ideally this should be in a database for production
    const chatSessions = new Map();

    // Route for sending a message to the model
    router.post('/chat', async (req, res) => {
        const userId = req.id;
        const userMessage = req.body.message;

        if (!userMessage) {
            return res.status(400).json({ error: 'Message is required' });
        }

        let chatSession = chatSessions.get(userId);

        if (!chatSession) {
            chatSession = model.startChat({
                generationConfig,
                history: [], // Initialize history if no session exists
            });
            chatSessions.set(userId, chatSession);
        }

        try {
            const result = await chatSession.sendMessage(userMessage);
            const responseText = result.response.text();

            // Update chat history in memory (for this session)
            const history = await chatSession.getHistory();
            chatSessions.set(userId, {...chatSession, history: history});


            res.json({ response: responseText });
        } catch (error) {
            console.error('Gemini API error:', error);
            res.status(500).json({ error: 'Failed to send message to AI', details: error.message });
        }
    });

    // Route for resetting the chat history
    router.post('/reset', async (req, res) => {
        const userId = req.user.id;

        chatSessions.delete(userId); // Remove the chat session for the user, effectively resetting it

        res.json({ message: 'Chat history reset successfully' });
    });

    export default router;