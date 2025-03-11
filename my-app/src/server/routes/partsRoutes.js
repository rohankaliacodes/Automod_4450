import express from 'express';
import { getParts, searchPartsByName } from '../controllers/partsController.js';

const router = express.Router();

// Define a POST route to fetch parts
router.post('/getParts', getParts);
router.post('/searchPartsByName', searchPartsByName);

export default router;