import nodemailer from "nodemailer";

export class EmailService {
  static transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Make sure this is an App Password for Gmail
    },
    debug: true, // Enable for troubleshooting
  });

  static generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async sendOTP(email, otp) {
    console.log(`Sending OTP ${otp} to ${email}`);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Verification OTP for CharityGuard",
      text: `Your one-time password is: ${otp}\n\nPlease enter this code in the verification page to complete your registration.\n\nThis OTP will expire in 10 minutes.`,
      html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Email Verification</h2>
        <p>Your one-time password is: <strong style="font-size: 24px;">${otp}</strong></p>
        <p>Please enter this code in the verification page to complete your registration.</p>
        <p>This OTP will expire in 10 minutes.</p>
      </div>`
    };

    try {
      const info = await EmailService.transporter.sendMail(mailOptions);
      console.log("Email sent: ", info.response);
      return info;
    } catch (error) {
      console.error("Error sending email: ", error);
      throw error;
    }
  }
}