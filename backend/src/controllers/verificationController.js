import prisma from "../config/prisma.js";
import { VerificationService } from "../services/verificationService.js";

export class VerificationController {
  static async verifyEmail(req, res) {
    try {
      const { email, otp } = req.body;
      
      if (!email || !otp) {
        return res.status(400).json({ error: "Email and OTP are required" });
      }
      
      const verified = await VerificationService.verifyEmailOTP(email, otp);
      
      if (verified) {
        return res.status(200).json({ message: "Email verified successfully" });
      } else {
        return res.status(400).json({ error: "Invalid or expired verification code" });
      }
    } catch (error) {
      console.error("Verification error:", error);
      return res.status(500).json({ error: "An error occurred during verification" });
    }
  }
  
  static async resendOTP(req, res) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      
      try {
        await VerificationService.resendOTP(email);
        return res.status(200).json({ message: "Verification code has been sent" });
      } catch (error) {
        return res.status(400).json({ error: error.message });
      }
    } catch (error) {
      console.error("Error in resendOTP:", error);
      return res.status(500).json({ error: "Failed to resend verification code" });
    }
  }
}