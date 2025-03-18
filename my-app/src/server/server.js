import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import partsRoutes from './routes/partsRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import autoMechanicRoute from './routes/autoMechanic.js';

const app = express();
const port = process.env.PORT || 5001;

// Middleware
const corsOptions = {
    origin: 'http://localhost:3000', // Specify your React app's origin
    credentials: true // Allow cookies, authorization headers, etc.
};
app.use(cors(corsOptions)); // Use configured cors options

app.use(express.json()); // Parse JSON bodies //Only use this once
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Routes
app.use('/api/parts', partsRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/autoMechanic', autoMechanicRoute);

// Add minimal test route (keep this for now for easy testing)
app.post('/api/test-route', (req, res) => {
    res.status(200).send({ message: 'Test route is working (POST)!' });
});


// Graceful Shutdown
process.on('SIGINT', async () => {
    console.log('Server shutting down...');
    process.exit();
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});