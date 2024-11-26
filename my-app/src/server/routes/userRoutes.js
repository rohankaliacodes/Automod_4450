const express = require('express');
const { registerUser, getUsername, deleteAccount } = require('../controllers/userController'); // Import controllers
const { connectDB } = require('../config/db'); // Import database connection

const router = express.Router();

let Users;

// Initialize the database connection and assign the Users collection
(async () => {
    try {
        const db = await connectDB(); // Connect to the database
        Users = db.collection('Users'); // Assign the Users collection
        console.log('Users collection initialized');
    } catch (err) {
        console.error('Error initializing database connection:', err);
    }
})();

// Register User Route
router.post('/register', async (req, res) => {
    try {
        if (!Users) {
            return res.status(500).json({ message: 'Database connection not initialized' });
        }
        await registerUser(req, res, Users); // Call the registerUser controller
    } catch (err) {
        console.error('Error in /register route:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get Username Route
router.get('/getUsername', async (req, res) => {
    try {
        if (!Users) {
            return res.status(500).json({ message: 'Database connection not initialized' });
        }
        await getUsername(req, res, Users); // Call the getUsername controller
    } catch (err) {
        console.error('Error in /getUsername route:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete Account Route
router.delete('/deleteAccount', async (req, res) => {
    try {
        if (!Users) {
            return res.status(500).json({ message: 'Database connection not initialized' });
        }
        await deleteAccount(req, res, Users); // Call the deleteAccount controller
    } catch (err) {
        console.error('Error in /deleteAccount route:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router; // Export the router
