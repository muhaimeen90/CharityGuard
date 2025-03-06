import express from 'express';
import authRoutes from './routes/authRoutes.js';
import verificationRoutes from './routes/verificationRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import userRoutes from './routes/userRoutes.js'; // Import the user routes
import { errorHandler } from './middleware/errorHandler.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', verificationRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes); // Add user routes

// Error handling
app.use(errorHandler);

export default app;