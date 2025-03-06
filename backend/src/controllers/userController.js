import { UserService } from '../services/userService.js';

export class UserController {
  static async getUserByWalletAddress(req, res) {
    try {
      const { address } = req.params;
      
      if (!address) {
        return res.status(400).json({ error: 'Wallet address is required' });
      }
      
      const user = await UserService.findByWalletAddress(address);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Return user data including email and wallet address but exclude sensitive info
      res.status(200).json({
        id: user.id,
        email: user.email,
        smartWalletAddress: user.smartWalletAddress,
        role: user.role,
        createdAt: user.createdAt
      });
    } catch (error) {
      console.error('Error fetching user by wallet address:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  static async getCurrentUser(req, res) {
    try {
      const userId = req.user.id;
      const user = await UserService.findById(userId);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      // Return user data without sensitive information
      res.status(200).json({
        id: user.id,
        email: user.email,
        smartWalletAddress: user.smartWalletAddress,
        role: user.role,
        createdAt: user.createdAt
      });
    } catch (error) {
      console.error('Error fetching current user:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  // Add more controller methods as needed
}