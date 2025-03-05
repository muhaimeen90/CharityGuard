import prisma from "../config/prisma.js";
import { EmailService } from "./emailService.js";

export class VerificationService {
  static async startVerification(email, hashedPassword, role, smartWalletAddress = "") {
    const otp = EmailService.generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    
    console.log(`Creating verification record for ${email} with OTP ${otp}`);
    
    // Store user registration details along with OTP
    await prisma.emailVerification.upsert({
      where: { email },
      update: { 
        otp, 
        expiry,
        password: hashedPassword,
        role,
        smartWalletAddress
      },
      create: { 
        email, 
        otp, 
        expiry,
        password: hashedPassword,
        role,
        smartWalletAddress
      },
    });

    // Send OTP to email
    return await EmailService.sendOTP(email, otp);
  }

  static async verifyEmailOTP(email, otp) {
    const record = await prisma.emailVerification.findUnique({
      where: { email },
    });
    
    if (!record) {
      console.log(`No verification record found for ${email}`);
      return false;
    }
    
    console.log(`Verifying OTP for ${email}: provided=${otp}, stored=${record.otp}, expired=${record.expiry < new Date()}`);
    
    if (record.otp === otp && record.expiry > new Date()) {
      try {
        const user = await prisma.user.create({
          data: {
            email,
            password: record.password, // Already hashed during registration
            smartWalletAddress: record.smartWalletAddress || "",
            role: record.role,
          },
        });
        
        // Remove verification record
        await prisma.emailVerification.delete({ where: { email } });
        
        console.log(`Successfully verified email and created user for ${email}`);
        return true;
      } catch (error) {
        console.error(`Error creating user after verification: ${error}`);
        throw error;
      }
    }
    
    return false;
  }

  static async resendOTP(email) {
    const record = await prisma.emailVerification.findUnique({
      where: { email },
    });
    
    if (!record) {
      throw new Error("No pending verification found for this email");
    }
    
    const otp = EmailService.generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    
    await prisma.emailVerification.update({
      where: { email },
      data: { otp, expiry }
    });
    
    return await EmailService.sendOTP(email, otp);
  }
}