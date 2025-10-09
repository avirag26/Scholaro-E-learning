import express from 'express';
const router = express.Router();
import {
  registerUser,
  loginUser,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  googleAuth,
  getUserProfile,
  updateUserProfile,
  logoutUser
} from '../Controllers/userController.js';
import { protectUser } from '../Middleware/authMiddleware.js';

// Public routes - No authentication required
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.post('/google-auth', googleAuth);

// Protected routes - Authentication required
router.get('/profile', protectUser, getUserProfile);
router.put('/profile', protectUser, updateUserProfile);
router.post('/logout', protectUser, logoutUser);

export default router;
