import express from 'express';
const router = express.Router();
import {
  registerUser,
  loginUser,
} from '../Controllers/userController.js';

// Route for registering a new user
router.route('/').post(registerUser);
router.post('/login', loginUser);

export default router;
