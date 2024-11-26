const express = require('express');
const { getParts } = require('../controllers/partsController');
const { connectDB } = require('../config/db');

const router = express.Router();

let PartsList;

// Initialize the database connection and assign the collection
(async () => {
    try {
        const db = await connectDB();
        PartsList = db.collection('Parts');
    } catch (err) {
        console.error('Error initializing database connection:', err);
    }
})();

router.get('/getParts', async (req, res) => {
    try {
        if (!PartsList) {
            return res.status(500).json({ message: 'Database connection not initialized' });
        }
        await getParts(req, res, PartsList);
    } catch (err) {
        console.error('Error in /getParts route:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
