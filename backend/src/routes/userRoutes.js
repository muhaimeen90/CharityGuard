import express from 'express';
import { UserController } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js'; // Correct path to auth middleware

const router = express.Router();

// Get user by wallet address - making it public so profile pages are viewable by anyone
router.get('/wallet/:address', UserController.getUserByWalletAddress);

// Add other user routes that require authentication
router.get('/me', authenticate, UserController.getCurrentUser);
// Add more protected routes as needed

// ...existing code...

// Add this route to your user routes file - make it public without auth requirement
router.get('/address/:walletAddress', async (req, res) => {
    try {
      const { walletAddress } = req.params;
      
      if (!walletAddress) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }
      
      // Look up user by wallet address (case-insensitive)
      const user = await prisma.user.findFirst({
        where: {
          walletAddress: {
            equals: walletAddress,
            mode: 'insensitive'
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          walletAddress: true
        }
      });
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      return res.status(200).json(user);
    } catch (error) {
      console.error('Error fetching user by wallet address:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  // ...existing code...
export default router;