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
} from '../Controllers/userController.js';

// Route for registering a new user
router.route('/').post(registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.post('/google-auth', googleAuth);


export default router;
