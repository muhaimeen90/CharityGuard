import { Router } from "express";
import { VerificationController } from "../controllers/verificationController.js";

const router = Router();

router.post("/verify-email", VerificationController.verifyEmail);
router.post("/resend-otp", VerificationController.resendOTP);

export default router;