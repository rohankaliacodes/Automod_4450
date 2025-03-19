import express from 'express';
const { Router } = express;
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import ffmpeg from 'fluent-ffmpeg'; // Import fluent-ffmpeg
import { Readable } from 'stream';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const router = Router();

const apiKey = process.env.GEMINI_API_KEY;
console.log("API Key from env:", apiKey ? "Present" : "Missing!");

const genAI = new GoogleGenerativeAI(apiKey);
console.log("genAI object:", genAI);

const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-pro-exp', // Or your chosen model.  Make *sure* it supports vision (audio/video).
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

// Configure multer (for image and audio/video uploads)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50 MB limit (adjust as needed)
    },
    // timeout: 60000 //  60 seconds (example) - Primarily for upload, not processing.  OPTIONAL.
});

// --- Helper Functions ---

// Processes audio or video files, extracting audio if necessary.
const processMedia = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided."));
      return;
    }

    const allowedAudioTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/aac', 'audio/mp3']; // Added mp3
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];

    if (allowedAudioTypes.includes(file.mimetype)) {
      // It's already an audio file, so just return the file object with buffer and mimetype.
        resolve({ buffer: file.buffer, mimetype: file.mimetype }); // Return an object with buffer and mimetype
    } else if (allowedVideoTypes.includes(file.mimetype)) {
      // It's a video file, so extract the audio.

      // Create a temporary file path for the extracted audio.
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const tempFilePath = path.join(__dirname, `temp_audio_${uuidv4()}.mp3`); // Use .mp3 for extracted audio

      const stream = new Readable();
      stream.push(file.buffer);
      stream.push(null); // Indicate end of stream

      ffmpeg(stream)
        .toFormat('mp3') // Convert to MP3 format.
        .on('error', (err) => {
          console.error('FFmpeg error:', err); //  Log the FULL error object.
          reject(new Error(`Error extracting audio from video: ${err.message}`)); // Include error details.
        })
        .on('end', () => {
            // Read the extracted audio file and resolve with the buffer.
            fs.readFile(tempFilePath, (err, data) => {
                if (err) {
                  console.error('Error reading extracted audio:', err);
                    reject(new Error(`Error reading extracted audio: ${err.message}`)); // More details.
                } else {
                    resolve({ buffer: data, mimetype: 'audio/mp3' }); // Resolve with an object
                }

                // Delete the temporary file.
                fs.unlink(tempFilePath, (unlinkErr) => {
                    if (unlinkErr) {
                      console.error("Error deleting temp file:", unlinkErr);
                    }
                });
            });
        })
        .save(tempFilePath); // Save to the temporary file.
    } else {
      reject(new Error("Unsupported file type."));
    }
  });
};


const processAudio = async (audioBuffer) => {
  try {
      // *** Placeholder for Audio Processing (Speech-to-Text) ***
      // In a real application, you'd send the audioBuffer to a Speech-to-Text API.
      // Example (using a hypothetical STT service):
      /*
      const sttResponse = await yourSttService.transcribe(audioBuffer);
      const transcribedText = sttResponse.text;
      return transcribedText;
      */

      // Placeholder:  For now, we'll just return a placeholder message.
      return "Audio received.  Transcription placeholder."; // Keep this, but it's *less* important now.
  } catch (error) {
      console.error("Error in processAudio (even in placeholder):", error);
      return "Error processing audio."; // Return an error message.
  }
};



// POST /api/autoMechanic/chat (Initiate chat and return session ID)
router.post('/chat', upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'media', maxCount: 1 }  //  'media' now handles both audio/video
]), async (req, res) => {
    try {
        const userMessage = req.body.message;
        const imageFile = req.files?.image?.[0]; // Back to individual file handling
        const mediaFile = req.files?.media?.[0]; //  Handles audio *OR* video
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

        const chatSession = model.startChat({ generationConfig, history: initialHistory });
        const sessionId = uuidv4();
        chatSessions.set(sessionId, chatSession);

        let parts = [];
        if (userMessage) {
            parts.push({ text: userMessage });
        }
        if (imageFile) {
            //  Back to original image handling
            parts.push({
                inlineData: {
                    mimeType: imageFile.mimetype,
                    data: imageFile.buffer.toString('base64')
                }
            });
        }

        if (mediaFile) {
            try {
                const mediaResult = await processMedia(mediaFile); // Get processed media object
                parts.push({
                    inlineData: {
                        mimeType: mediaResult.mimetype, // Use the returned MIME type
                        data: mediaResult.buffer.toString('base64') // Use the returned buffer
                    }
                });
            } catch (mediaError) {
                console.error("Error processing media:", mediaError);
                return res.status(400).json({ error: mediaError.message }); // Send specific error message.
            }
        }

        const initialResult = await chatSession.sendMessage(parts);
        const initialResponse = initialResult.response;
        const initialText = initialResponse.text();
        res.json({ sessionId, initialResponse: initialText });

    } catch (error) {
        console.error('Error initiating chat:', error); // Log the full error.
        // Check for specific error types and send more informative messages:
        if (error.message.startsWith("Error extracting audio")) {
            res.status(500).json({ error: error.message }); // Send the specific ffmpeg error
        } else if (error.message.startsWith("Error reading extracted audio")) {
              res.status(500).json({ error: error.message });
        }else if (error.message.startsWith("Unsupported file type")) {
            res.status(400).json({ error: error.message}); // Bad Request for unsupported files
        } else {
            res.status(500).json({ error: 'Failed to initiate chat' }); // Generic error
        }
    }
});


// GET /api/autoMechanic/chat/stream (Stream responses) - NO CHANGES NEEDED HERE
router.get('/chat/stream', async (req, res) => {
    const sessionId = req.query.sessionId;
    const userMessage = req.query.message; // Text message
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
        res.end();

    } catch (error) {
        console.error('Error during streaming:', error);
        res.status(500); //  Set the status code.
        res.write(`data: ${JSON.stringify({error: "An error occurred during streaming."})}\n\n`); // Send an error message as data
        res.end(); //  Make sure to end the response.
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