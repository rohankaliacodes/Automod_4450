import express from 'express';
const { Router } = express;
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import ffmpeg from 'fluent-ffmpeg';
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ffmpegStatic from 'ffmpeg-static';

dotenv.config();

const router = Router();

const apiKey = process.env.GEMINI_API_KEY;
console.log("API Key from env:", apiKey ? "Present" : "Missing!");

const genAI = new GoogleGenerativeAI(apiKey);
console.log("genAI object:"/*, genAI*/);

const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-pro-exp',
    tools: [
        {
            googleSearch: {},
        },
    ],
}, { apiVersion: "v1beta" });

console.log("Initialized Gemini model:"/*, model*/);

const generationConfig = {
    temperature: 0.6,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 65536,
};

const chatSessions = new Map();

// --- Multer Configuration (Modified for Temporary Storage) ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}
console.log("Upload directory:", uploadDir);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + uuidv4() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50 MB limit
    },
});

// --- Helper Functions ---

ffmpeg.setFfmpegPath(ffmpegStatic);

const processMedia = (filePath, mimetype) => {
    return new Promise((resolve, reject) => {
        if (!filePath) {
            reject(new Error("No file path provided."));
            return;
        }

        const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/aac', 'audio/mp3'];
        const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];

        if (allowedAudioTypes.includes(mimetype)) {
            console.time(`[processMedia] Read audio file: ${filePath}`);
            fs.readFile(filePath, (err, data) => {
                console.timeEnd(`[processMedia] Read audio file: ${filePath}`);
                if (err) {
                    console.error('Error reading audio file:', err);
                    reject(new Error(`Error reading audio file: ${err.message}`));
                } else {
                    resolve({ buffer: data, mimetype: mimetype });
                }
            });
        } else if (allowedVideoTypes.includes(mimetype)) {
            const tempFilePath = path.join(__dirname, `temp_audio_${uuidv4()}.mp3`);
            console.log(`[processMedia] Starting video to audio conversion: ${filePath} -> ${tempFilePath}`);
            console.time(`[processMedia] FFmpeg conversion: ${filePath}`);

            ffmpeg(filePath)
                .toFormat('mp3')
                .on('progress', (progress) => {
                    // console.log(`[processMedia] FFmpeg progress: ${filePath}`, progress); // Optional
                })
                .on('error', (err) => {
                    console.timeEnd(`[processMedia] FFmpeg conversion: ${filePath}`);
                    console.error('FFmpeg error:', err);
                    reject(new Error(`Error extracting audio from video: ${err.message}`));
                })
                .on('end', () => {
                    console.timeEnd(`[processMedia] FFmpeg conversion: ${filePath}`);
                    console.time(`[processMedia] Read converted audio: ${tempFilePath}`);
                    fs.readFile(tempFilePath, (err, data) => {
                        console.timeEnd(`[processMedia] Read converted audio: ${tempFilePath}`);
                        if (err) {
                            console.error('Error reading extracted audio:', err);
                            reject(new Error(`Error reading extracted audio: ${err.message}`));
                        } else {
                            resolve({ buffer: data, mimetype: 'audio/mp3' });
                        }
                        console.time(`[processMedia] Delete temp audio: ${tempFilePath}`);
                        fs.unlink(tempFilePath, (unlinkErr) => {
                            console.timeEnd(`[processMedia] Delete temp audio: ${tempFilePath}`);
                            if (unlinkErr) {
                                console.error("Error deleting temp audio file:", unlinkErr);
                            }
                        });
                    });
                })
                .save(tempFilePath);
        } else {
            reject(new Error("Unsupported file type."));
        }
    });
};

const processAudio = async (audioBuffer) => {
  try {
      return "Audio received.  Transcription placeholder.";
  } catch (error) {
      console.error("Error in processAudio (even in placeholder):", error);
      return "Error processing audio.";
  }
};

// NO RETRY for streaming.  Retries should be handled at a higher level if needed.
// async function sendMessageWithRetry(...) { ... }  <-- REMOVE THIS

router.post('/chat', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'media', maxCount: 1 }
]), async (req, res) => {
    try {
        const userMessage = req.body.message;
        const imageFile = req.files?.image?.[0];
        const mediaFile = req.files?.media?.[0];
        const carData = req.body.carData;

        if (!userMessage && !imageFile && !mediaFile) {
            return res.status(400).json({ error: 'Message, Image, or Media is required' });
        }

      let initialHistory = [];
        if (carData) {
            initialHistory.push({
                role: "user",
                parts: [{ text: `User's Car: ${JSON.stringify(carData)}` }],
            });
            initialHistory.push({
                role: "model",
                parts: [{ text: "Understood." }],
            });
        }

        // Process media *before* starting the chat
        let mediaResult = null;
        if (mediaFile) {
            const mediaFilePath = mediaFile.path;
            console.log(`[chat] Received media file: ${mediaFilePath}`);
            try {
                console.time(`[chat] Process media: ${mediaFilePath}`);
                mediaResult = await processMedia(mediaFilePath, mediaFile.mimetype); // Await the result
                console.timeEnd(`[chat] Process media: ${mediaFilePath}`);
            } catch (mediaError) {
                console.error("Error processing media:", mediaError);
                return res.status(400).json({ error: mediaError.message });
            } finally {
                console.time(`[chat] Delete temp media: ${mediaFilePath}`);
                fs.unlink(mediaFilePath, (unlinkErr) => { // Correctly placed unlink
                    console.timeEnd(`[chat] Delete temp media: ${mediaFilePath}`);
                    if (unlinkErr) {
                        console.error("Error deleting temporary media file:", unlinkErr);
                    }
                });
            }
        }
      
        if (imageFile) {
            const imageFilePath = imageFile.path;
            console.log(`[chat] Received image file: ${imageFilePath}`);

            try {
                console.time(`[chat] Read image file: ${imageFilePath}`);
                const fileData = fs.readFileSync(imageFilePath);
                console.timeEnd(`[chat] Read image file: ${imageFilePath}`);
                initialHistory.push( {role: "user",
                                       parts: [{
                                        inlineData: {
                                            mimeType: imageFile.mimetype,
                                            data: fileData.toString('base64')
                                        }
                                      }]
                                    });
            } catch (readError) {
                console.error("Error reading image file:", readError);
                return res.status(500).json({ error: `Error reading image file: ${readError.message}` });
            } finally {
                console.time(`[chat] Delete temp image: ${imageFilePath}`);
                fs.unlink(imageFilePath, (unlinkErr) => {
                    console.timeEnd(`[chat] Delete temp image: ${imageFilePath}`);
                    if (unlinkErr) {
                        console.error("Error deleting temporary image file:", unlinkErr);
                    }
                });
            }
        }
      
        // Add media to initialHistory if it exists
        if (mediaResult) {
            initialHistory.push({
                role: "user", // Correct role for history
                parts: [{
                    inlineData: {
                        mimeType: mediaResult.mimetype,
                        data: mediaResult.buffer.toString('base64')
                    }
                }]
            });
        }

        if (userMessage) {
              initialHistory.push( {role: "user", parts: [{ text: userMessage }]});
        }

        initialHistory.push({role: "model", parts: [{ text: "Understood." }]});

        const chatSession = model.startChat({ generationConfig, history: initialHistory }); // Use initialHistory
        const sessionId = uuidv4();
        chatSessions.set(sessionId, chatSession);

        // For the initial response, we DO want to use sendMessage (not the stream)
        // This gets the *first* response, which acknowledges the input.
        console.time(`[chat] Initial sendMessage to Gemini (Session ID: ${sessionId})`);
        const initialResult = await chatSession.sendMessage(userMessage || "Processing your media..."); // Send something, even if no text message
        console.timeEnd(`[chat] Initial sendMessage to Gemini (Session ID: ${sessionId})`);
        const initialResponse = initialResult.response;
        const initialText = initialResponse.text();
        res.json({ sessionId, initialResponse: initialText });


    } catch (error) {
        console.error('Error initiating chat:', error);

        if (error.constructor.name === 'GoogleGenerativeAIFetchError') {
            console.error("Google API Error Details:");
            console.error("  Status:", error.status);
            console.error("  Status Text:", error.statusText);
            console.error("  Error Details:", error.errorDetails);
            console.error("  Response Body (if available):", await error.response?.text());

            res.status(error.status || 500).json({
                error: `Google Generative AI Error: ${error.status} - ${error.statusText}`,
                details: error.errorDetails,
            });

        } else if (error.message.startsWith("Error extracting audio")) {
            res.status(500).json({ error: error.message });
        } else if (error.message.startsWith("Error reading extracted audio")) {
            res.status(500).json({ error: error.message });
        }else if (error.message.startsWith("Unsupported file type")) {
            res.status(400).json({ error: error.message});
        } else {
            res.status(500).json({ error: 'Failed to initiate chat', details: error.message });
        }
    }
});

router.get('/chat/stream', async (req, res) => {
    const sessionId = req.query.sessionId;
    const userMessage = req.query.message; // Get the user message from query params
    const carDataString = req.query.carData;
    const carData = carDataString ? JSON.parse(decodeURIComponent(carDataString)) : null;

    if (!sessionId) {
        return res.status(400).json({ error: 'Session ID is required' });
    }

    const chatSession = chatSessions.get(sessionId);
    if (!chatSession) {
        return res.status(404).json({ error: 'Session not found' });
    }

    try {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // NO initial parts array.  We've already sent the initial data.
        // Only send subsequent text messages through the stream.

        // If there's a follow-up text message, send it *through* the stream.
        if (userMessage) {
            const resultStream = await chatSession.sendMessageStream(userMessage); // Just the text

            for await (const chunk of resultStream.stream) {
                const chunkText = chunk.text();
                console.log("Received chunk from Gemini:", chunkText);
                let chunkData = {
                    role: "model",
                    text: chunkText,
                    sources: [],
                    supports: []
                };

                if (chunk.candidates && chunk.candidates.length > 0 && chunk.candidates[0].groundingMetadata) {
                    const metadata = chunk.candidates[0].groundingMetadata;

                    if (metadata.groundingChunks) {
                        chunkData.sources = metadata.groundingChunks.map(chunk => {
                            if (chunk.web) {
                                return {
                                    uri: chunk.web.uri,
                                    title: chunk.web.title
                                };
                            }
                            return null;
                        }).filter(source => source !== null);
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
        }
        res.end(); // Always end the response

    } catch (error) {
        console.error('Error during streaming:', error);
        res.status(500);
        res.write(`data: ${JSON.stringify({error: "An error occurred during streaming."})}\n\n`);
        res.end();
    }
});

router.post('/reset', async (req, res) => {
    for (const [sessionId, chatSession] of chatSessions) {
        chatSessions.delete(sessionId);
    }
    res.json({ message: 'Chat history reset successfully' });
});

export default router;