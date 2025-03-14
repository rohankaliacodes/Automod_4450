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

const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp', // Correctly using gemini-2.0-flash-exp
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

        // Create a new chat session
        const chatSession = model.startChat({ generationConfig, history: [] });
        const sessionId = uuidv4();
        chatSessions.set(sessionId, chatSession);

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

        const initialResult = await chatSession.sendMessage(parts);
        const initialResponse = initialResult.response;
        const initialText = initialResponse.text();
        res.json({ sessionId, initialResponse: initialText });

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
            let chunkGroundingChunks = null; // Initialize

            // *** CRITICAL FIX: Access groundingMetadata from the *chunk* itself ***
            if (chunk.candidates && chunk.candidates.length > 0 && chunk.candidates[0].groundingMetadata && chunk.candidates[0].groundingMetadata.groundingChunks) {
                chunkGroundingChunks = chunk.candidates[0].groundingMetadata.groundingChunks;
            }

            res.write(`data: ${JSON.stringify({ role: "model", text: chunkText, sources: chunkGroundingChunks })}\n\n`);
            fullResponseText += chunkText;
        }

        console.log("Full Response Text:", fullResponseText);

        // Access overall response metadata *after* the loop (for final logging)
       if (resultStream.response.candidates && resultStream.response.candidates.length > 0) {
            console.log("Response Candidates Found:", resultStream.response.candidates.length);

            const candidate = resultStream.response.candidates[0];

            if (candidate.groundingMetadata) {
                console.log("Grounding Metadata: PRESENT");

                if (candidate.groundingMetadata.webSearchQueries) {
                    console.log("Web Search Queries:", candidate.groundingMetadata.webSearchQueries);
                } else {
                     console.log("Web Search Queries: NOT FOUND");
                }

                if (candidate.groundingMetadata.groundingChunks) {
                    console.log("Grounding Chunks: PRESENT", candidate.groundingMetadata.groundingChunks);
                } else {
                    console.log("Grounding Chunks: NOT FOUND");
                }

                if (candidate.groundingMetadata.groundingSupports) {
                    console.log("Grounding Supports: PRESENT", candidate.groundingMetadata.groundingSupports);
                } else {
                    console.log("Grounding Supports: NOT FOUND");
                }


            } else {
                console.log("Grounding Metadata: NOT FOUND");
            }
        } else {
            console.log("Response Candidates: EMPTY or UNDEFINED");
        }


        res.end();

    } catch (error) {
        console.error('Error during streaming:', error);
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