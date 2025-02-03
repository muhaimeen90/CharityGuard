import { AuthService } from '../services/authService.js';

export class AuthController {
  static async register(req, res) {
    try {
      const user = await AuthService.registerUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  static async login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await AuthService.loginUser(email, password);
        const token = AuthService.generateToken(user);
        res.status(200).json({ user, token });
      } catch (error) {
        res.status(400).json({ error: error.message });
    }
  }
}