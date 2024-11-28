require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const partsRoutes = require('./routes/partsRoutes');
const authRoutes = require('./routes/authRoutes');

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes

app.use('/api/parts', partsRoutes);
app.use('/api/auth', authRoutes);

// Graceful Shutdown
process.on('SIGINT', async () => {
    console.log('Server shutting down...');
    process.exit();
});

module.exports = app;
