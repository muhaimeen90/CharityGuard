import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { VerificationService } from "./verificationService.js";

export class AuthService {
  static async registerUser({ email, password, smartWalletAddress, role }) {
    // Check if email already exists in users collection
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new Error("Email already registered");
    }

    const existingWallet = await prisma.user.findUnique({
      where: { smartWalletAddress },
    });

    if (existingWallet) {
      throw new Error("Wallet already registered");
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Instead of creating user, store info in EmailVerification and send OTP
    await VerificationService.startVerification(
      email,
      hashedPassword,
      role,
      smartWalletAddress
    );

    return { email, pendingVerification: true };
  }

  static async loginUser(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) throw new Error("User not found");

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new Error("Invalid password");

    return user;
  }

  static generateToken(user) {
    return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
  }
}
