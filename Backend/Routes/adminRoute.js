import express from 'express';
const router = express.Router();
import {
  registerAdmin,
  loginAdmin,
  forgotPassword,
  resetPassword,
  logoutAdmin,
  getAllUsers,
  getAllTutors,
  toggleUserBlock,
  toggleTutorBlock,
  deleteUser,
  deleteTutor,
  getDashboardStats,
  migrateUserBlocks
} from '../Controllers/adminController.js';
import { protectAdmin } from '../Middleware/adminAuthMiddleware.js';

// Public routes
router.post('/login', loginAdmin);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.post('/logout', protectAdmin, logoutAdmin);

// Protected routes
router.post('/register', registerAdmin); // Should be protected by super admin middleware in production

// Admin management routes
router.get('/stats', protectAdmin, getDashboardStats);
router.get('/users', protectAdmin, getAllUsers);
router.get('/tutors', protectAdmin, getAllTutors);
router.patch('/users/:id/toggle-block', protectAdmin, toggleUserBlock);
router.patch('/tutors/:id/toggle-block', protectAdmin, toggleTutorBlock);
router.delete('/users/:id', protectAdmin, deleteUser);
router.delete('/tutors/:id', protectAdmin, deleteTutor);

// Migration route (temporary)
router.post('/migrate-blocks', protectAdmin, migrateUserBlocks);

export default router;