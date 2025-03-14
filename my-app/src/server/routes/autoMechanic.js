import express from 'express';
const { Router } = express;
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const router = Router();

const apiKey = process.env.GEMINI_API_KEY;
console.log("API Key from env:", apiKey ? "Present" : "Missing!");

const genAI = new GoogleGenerativeAI(apiKey);
console.log("genAI object:", genAI);

// --- CRUCIAL FIX:  Specify apiVersion and model name correctly ---
const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp', // or 'models/gemini-2.0-flash' - try both
    tools: [
        {
            googleSearch: {},
        },
    ],
}, { apiVersion: "v1beta" });


console.log("Initialized Gemini model:", model);

const generationConfig = {
    temperature: 0.7,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 65536,
};

const chatSessions = new Map(); // Store chat sessions by ID

// Configure multer (for image uploads, if needed)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// POST /api/autoMechanic/chat (Initiate chat and return session ID)
router.post('/chat', upload.single('image'), async (req, res) => {
    try {
        const userMessage = req.body.message;
        const imageFile = req.file;

        if (!userMessage && !imageFile) {
            return res.status(400).json({ error: 'Message or Image is required' });
        }

        let parts = [];
        if (userMessage) {
            parts.push({ text: userMessage });
        }
        if (imageFile) {
            parts.push({
                inlineData: {
                    mimeType: imageFile.mimetype,
                    data: imageFile.buffer.toString('base64')
                }
            });
        }

        const result = await model.generateContent(parts); // Use generateContent here
        const response = result.response;
        const text = response.text();

        console.log("Full Response Text:", text);

        if (response.candidates && response.candidates.length > 0) {
            const candidate = response.candidates[0];

            if (candidate.groundingMetadata) {
                console.log("Grounding Metadata:", candidate.groundingMetadata);

                if (candidate.groundingMetadata.webSearchQueries) {
                    console.log("Web Search Queries:", candidate.groundingMetadata.webSearchQueries);
                } else {
                    console.log("No webSearchQueries found in groundingMetadata.");
                }

            } else {
                console.log("No Grounding Metadata in the response.");
            }
        } else {
            console.log("No candidates in the response.");
        }

        res.json({ response: text }); // Just send back the text response


    } catch (error) {
        console.error('Error initiating chat:', error);
        res.status(500).json({ error: 'Failed to initiate chat' });
    }
});

// GET /api/autoMechanic/chat/stream (Stream responses, with detailed logging)
router.get('/chat/stream', async (req, res) => {
    const sessionId = req.query.sessionId;
    const userMessage = req.query.message;

    if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
    }
    if (!userMessage) {
        return res.status(400).json({ error: 'User message is required' });
    }

    const chatSession = chatSessions.get(sessionId);
    if (!chatSession) {
        return res.status(404).json({ error: 'Session not found' });
    }

    try {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const parts = [{ text: userMessage }];
        const resultStream = await chatSession.sendMessageStream(parts);

        let fullResponseText = "";
        for await (const chunk of resultStream.stream) {
            const chunkText = chunk.text();
            res.write(`data: ${JSON.stringify({ role: "model", text: chunkText })}\n\n`);
            fullResponseText += chunkText;
        }

        console.log("Full Response Text:", fullResponseText);

       if (resultStream.response.candidates && resultStream.response.candidates.length > 0) {
            const candidate = resultStream.response.candidates[0];

            if (candidate.groundingMetadata) {
                console.log("Grounding Metadata:", candidate.groundingMetadata);

                // Access and log webSearchQueries (like in the reference output)
                if (candidate.groundingMetadata.webSearchQueries) {
                    console.log("Web Search Queries:", candidate.groundingMetadata.webSearchQueries);
                } else {
                     console.log("No webSearchQueries found in groundingMetadata.");
                }

            } else {
                console.log("No Grounding Metadata in the response.");
            }
        } else {
            console.log("No candidates in the response.");
        }


        res.end();

    } catch (error) {
        console.error('Error during streaming:', error);
        // Log the error *details* - this is VERY important for debugging
        console.error(error);
        res.status(500).write('data: error\n\n');
        res.end();
    }
});

// Reset endpoint (remains unchanged)
router.post('/reset', async (req, res) => {
    for (const [sessionId, chatSession] of chatSessions) {
        chatSessions.delete(sessionId);
    }
    res.json({ message: 'Chat history reset successfully' });
});

export default router;