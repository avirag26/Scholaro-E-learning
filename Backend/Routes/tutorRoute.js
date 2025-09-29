import express from "express";
const router = express.Router();
import {
  registerTutor,
  loginTutor,
  verifyTutorOtp,
  resendTutorOtp,
} from "../Controllers/tutorController.js";

// Public routes
router.post("/register", registerTutor);
router.post("/login", loginTutor);
router.post("/verify-otp", verifyTutorOtp);
router.post("/resend-otp", resendTutorOtp);

// Protected routes can be added here later

export default router;