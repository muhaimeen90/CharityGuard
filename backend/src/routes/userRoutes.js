import express from 'express';
import { UserController } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js'; // Correct path to auth middleware

const router = express.Router();

// Get user by wallet address - making it public so profile pages are viewable by anyone
router.get('/wallet/:address', UserController.getUserByWalletAddress);

// Add other user routes that require authentication
router.get('/me', authenticate, UserController.getCurrentUser);
// Add more protected routes as needed

export default router;