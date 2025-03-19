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
    model: 'gemini-2.0-pro-exp', // Or your chosen model.
    tools: [
        {
            googleSearch: {},
        },
    ],
}, { apiVersion: "v1beta" });


console.log("Initialized Gemini model:", model);

const generationConfig = {
    temperature: 0.6,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 65536,
};

const chatSessions = new Map(); // Store chat sessions by ID

// Configure multer (for image and audio uploads)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB limit (adjust as needed)
    },
});

// --- Helper Functions ---
const processAudio = async (audioBuffer) => {
    // *** Placeholder for Audio Processing (Speech-to-Text) ***
    // In a real application, you'd send the audioBuffer to a Speech-to-Text API.
    // Example (using a hypothetical STT service):
    /*
    try {
        const sttResponse = await yourSttService.transcribe(audioBuffer);
        const transcribedText = sttResponse.text;
        return transcribedText;
    } catch (error) {
        console.error("Error during STT:", error);
        return "Error transcribing audio."; // Or some other error message
    }
    */

    // Placeholder:  For now, we'll just return a placeholder message.
    return "Audio received.  Transcription placeholder.";
};


// POST /api/autoMechanic/chat (Initiate chat and return session ID)
router.post('/chat', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
]), async (req, res) => {
    try {
        const userMessage = req.body.message;
        const imageFile = req.files?.image?.[0];  // Access using req.files
        const audioFile = req.files?.audio?.[0];  // Access using req.files
        const carData = req.body.carData; // Access carData from the request body


        if (!userMessage && !imageFile && !audioFile) {
            return res.status(400).json({ error: 'Message, Image, or Audio is required' });
        }

        // Construct initial history with carData context
        let initialHistory = [];
        if (carData) {
            initialHistory.push({
                role: "user",
                parts: [{ text: `User's Car: ${JSON.stringify(carData)}` }], // Include car data in history
            });
            initialHistory.push({
                role: "model",
                parts: [{ text: "Understood." }],
            });
        }


        // Create a new chat session
        const chatSession = model.startChat({ generationConfig, history: initialHistory }); // Pass initialHistory
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

        if(audioFile) {
            // Process the audio (get text from audio).
            const audioText = await processAudio(audioFile.buffer);
            parts.push({ text: `Audio transcription: ${audioText}` });
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
// GET /api/autoMechanic/chat/stream (Stream responses)
router.get('/chat/stream', async (req, res) => {
    const sessionId = req.query.sessionId;
    const userMessage = req.query.message; // Text message
    const carDataString = req.query.carData; // Get carData as a string
    const carData = carDataString ? JSON.parse(decodeURIComponent(carDataString)) : null; // Parse carData

    if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
    }
    // No longer require a user message, as we can now have image/audio.

    const chatSession = chatSessions.get(sessionId);
    if (!chatSession) {
        return res.status(404).json({ error: 'Session not found' });
    }

    try {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Construct the parts array.  This is now *only* text.  Media was handled
        // in the initial POST.
        let parts = [];
        if (userMessage) {
            parts.push({ text: userMessage });
        }

        const resultStream = await chatSession.sendMessageStream(parts);

        for await (const chunk of resultStream.stream) {
            const chunkText = chunk.text();
            let chunkData = {
                role: "model",
                text: chunkText,
                sources: [], // Initialize sources as an empty array
                supports: [] // Initialize supports as an empty array
            };

            if (chunk.candidates && chunk.candidates.length > 0 && chunk.candidates[0].groundingMetadata) {
                const metadata = chunk.candidates[0].groundingMetadata;

                if (metadata.groundingChunks) {
                    // Map groundingChunks to a simpler format for the client
                    chunkData.sources = metadata.groundingChunks.map(chunk => {
                        if (chunk.web) {  // Only process web chunks
                            return {
                                uri: chunk.web.uri,
                                title: chunk.web.title
                            };
                        }
                        return null; // Or handle other chunk types if needed
                    }).filter(source => source !== null); // Remove null entries (non-web chunks)
                }

                if (metadata.groundingSupports) {
                    chunkData.supports = metadata.groundingSupports.map(support => ({
                        startIndex: support.segment.startIndex,
                        endIndex: support.segment.endIndex,
                        chunkIndices: support.groundingChunkIndices
                    }));
                }
            }

            res.write(`data: ${JSON.stringify(chunkData)}\n\n`);
        }
        res.end();

    } catch (error) {
        console.error('Error during streaming:', error);
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