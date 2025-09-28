import express from 'express';
const router = express.Router();
import {
  registerUser,
  loginUser,
  verifyOtp,
  resendOtp,
} from '../Controllers/userController.js';

// Route for registering a new user
router.route('/').post(registerUser);
router.post('/login', loginUser);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);


export default router;
