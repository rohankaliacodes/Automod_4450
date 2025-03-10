import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import partsRoutes from './routes/partsRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import autoMechanicRoute from './routes/autoMechanic.js';


const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Routes
app.use('/api/parts', partsRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/autoMechanic', autoMechanicRoute);

// Graceful Shutdown
process.on('SIGINT', async () => {
    console.log('Server shutting down...');
    process.exit();
});

export default app;