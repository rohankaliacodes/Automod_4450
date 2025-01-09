require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const partsRoutes = require('./routes/partsRoutes');
const authRoutes = require('./routes/authRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Routes
app.use('/api/parts', partsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/recommendations', recommendationRoutes);

// Graceful Shutdown
process.on('SIGINT', async () => {
    console.log('Server shutting down...');
    process.exit();
});

module.exports = app;
