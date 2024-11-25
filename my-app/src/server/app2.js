require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const partsRoutes = require('./routes/partsRoutes');
const { client } = require('./config/db');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/parts', partsRoutes);

// Graceful Shutdown
process.on('SIGINT', async () => {
    await client.close();
    console.log('Server shut down gracefully');
    process.exit();
});

module.exports = app;
