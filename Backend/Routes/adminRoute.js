import express from 'express';
const router = express.Router();
import {
  registerAdmin,
  loginAdmin,
  forgotPassword,
  resetPassword,
  logoutAdmin,
} from '../Controllers/adminController.js';

// Public routes
router.post('/login', loginAdmin);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

// Protected routes (you'll need to create admin auth middleware)
router.post('/register', registerAdmin); // Should be protected by super admin middleware
router.post('/logout', logoutAdmin); // Should be protected by admin auth middleware

export default router;