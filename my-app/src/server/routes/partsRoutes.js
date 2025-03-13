import express from 'express';
import { getParts, searchPartsByName, getAllParts, getRecommendations } from '../controllers/partsController.js';

const router = express.Router();

// Define a POST route to fetch parts
router.post('/getParts', getParts);
router.post('/searchPartsByName', searchPartsByName);
router.post('/getAllParts', getAllParts);
router.post('/getRecommendations', getRecommendations);

export default router;