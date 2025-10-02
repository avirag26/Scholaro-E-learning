import express from "express";
const router = express.Router();
import {
  registerTutor,
  loginTutor,
  verifyTutorOtp,
  resendTutorOtp,
  forgotPassword,
  resetPassword,
  googleAuthTutor,
} from "../Controllers/tutorController.js";
import { protectTutor } from "../Middleware/tutorAuthMiddleware.js";

// Public routes
router.post("/register", registerTutor);
router.post("/login", loginTutor);
router.post("/verify-otp", verifyTutorOtp);
router.post("/resend-otp", resendTutorOtp);
router.post("/forgot-password", forgotPassword);
router.patch("/reset-password/:token", resetPassword);
router.post("/google-auth", googleAuthTutor);

// Protected routes - only for logged-in tutors
router.get('/profile', protectTutor, (req, res) => {
    // Thanks to the middleware, we have access to the logged-in tutor's data
    res.json(req.tutor);
});

export default router;