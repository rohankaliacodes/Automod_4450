import express from 'express';
const { Router } = express;
import { GoogleGenerativeAI, DynamicRetrievalMode } from '@google/generative-ai';
import dotenv from 'dotenv';
import multer from 'multer';

dotenv.config();

const router = Router();

const apiKey = process.env.GEMINI_API_KEY;
console.log("API Key from env:", apiKey ? "Present" : "Missing!");

const genAI = new GoogleGenerativeAI(apiKey);
console.log("genAI object:", genAI);

// Updated Model Initialization for Gemini 2.0 Pro Experimental with **Empty Object** Google Search
const model = genAI.getGenerativeModel({
    model: "gemini-2.0-pro-exp", // Changed to Gemini 2.0 Pro Experimental
    tools: [
        {
            googleSearch: {},  // **Use an empty object for googleSearch**
        },
    ],
    apiVersion: "v1beta", // Explicitly set apiVersion to v1beta - keep this for now
});

console.log("Initialized Gemini model:", model);

const generationConfig = {
    temperature: 0.7,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 65536,
    responseMimeType: "text/plain",
};

const chatSessions = new Map();

// Configure multer for handling file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Updated chat route to handle image uploads and grounding
router.post('/chat', upload.single('image'), async (req, res) => {
    const userId = req.id;
    const userMessage = req.body.message;
    const imageFile = req.file;

    if (!userMessage && !imageFile) {
        return res.status(400).json({ error: 'Message or Image is required' });
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

    let parts = [];

    if (userMessage) {
        parts.push({ text: userMessage });
    }

    if (imageFile) {
        console.log('Image received:', imageFile.originalname, imageFile.mimetype, imageFile.buffer.length);
        parts.push({
            inlineData: {  // Using inlineData for image as per docs example
                mimeType: imageFile.mimetype,
                data: imageFile.buffer.toString('base64') // Convert buffer to base64 string
            }
        });
    }


    try {
        const result = await chatSession.sendMessage(parts); // Corrected line: Passing parts array directly
        const responseText = result.response.text();

        // Log grounding metadata if available
        if (result.response.candidates && result.response.candidates[0].groundingMetadata) {
            console.log("Grounding Metadata:", result.response.candidates[0].groundingMetadata);
        } else {
            console.log("No Grounding Metadata in the response.");
        }


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