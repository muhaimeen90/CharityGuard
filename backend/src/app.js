import express from 'express';
import authRoutes from './routes/authRoutes.js';
import verificationRoutes from './routes/verificationRoutes.js'; // Add this line
import { errorHandler } from './middleware/errorHandler.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', verificationRoutes); // Add this line

// Error handling
app.use(errorHandler);

export default app;