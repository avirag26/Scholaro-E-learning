import Admin from '../Model/AdminModel.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import { sendPasswordResetEmail } from '../utils/emailService.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

/**
 * @desc    Register a new admin
 * @route   POST /api/admin/register
 * @access  Public (Temporarily for first admin setup)
 */
const registerAdmin = async (req, res) => {
  try {
    const { full_name, email, password, role = 'admin' } = req.body;

    // Check if any admin already exists (for security)
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return res.status(403).json({ message: 'Admin registration is disabled. Contact super admin.' });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin already exists with this email.' });
    }

    // Create new admin
    const admin = new Admin({
      full_name,
      email,
      password, // The pre-save hook will hash this
      admin_id: uuidv4(),
      role,
    });

    await admin.save();

    res.status(201).json({
      message: 'Admin registered successfully.',
      admin: {
        _id: admin._id,
        full_name: admin.full_name,
        email: admin.email,
        role: admin.role,
      }
    });
  } catch (error) {
    console.error('Admin Registration Error:', error);
    res.status(500).json({ message: 'Server error during admin registration.' });
  }
};

/**
 * @desc    Auth admin & get token (Login)
 * @route   POST /api/admin/login
 * @access  Public
 */
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for admin by email
    const admin = await Admin.findOne({ email });

    // Check if admin exists and password matches
    if (admin && (await admin.matchPassword(password))) {
      if (!admin.status) {
        return res.status(401).json({ message: 'Admin account is deactivated.' });
      }

      const accessToken = generateAccessToken(admin._id);
      const refreshToken = generateRefreshToken(admin._id);

      // Save refresh token to admin in DB
      admin.refreshToken = refreshToken;
      admin.lastLogin = new Date();
      await admin.save();

      // Send refresh token in an HttpOnly cookie
      res.cookie('jwt_admin', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.json({
        _id: admin._id,
        name: admin.full_name,
        email: admin.email,
        role: admin.role,
        accessToken: accessToken,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

/**
 * @desc    Forgot password
 * @route   POST /api/admin/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });

    if (!admin) {
      // Send a generic success message to prevent email enumeration
      return res.status(200).json({ message: "If an admin with that email exists, a password reset link has been sent." });
    }

    // 1) Generate a random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 2) Hash the token and save it to the admin document
    admin.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 3) Set an expiry for the token (10 minutes)
    admin.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await admin.save({ validateBeforeSave: false });

    // 4) Send the token to the admin's email
    await sendPasswordResetEmail(admin.email, resetToken, 'admin');

    res.status(200).json({ message: "Password reset token sent to email." });
  } catch (error) {
    console.error("Admin Forgot Password Error:", error);
    // In case of error, invalidate the token
    if (req.body.email) {
      const adminToUpdate = await Admin.findOne({ email: req.body.email });
      if (adminToUpdate) {
        adminToUpdate.passwordResetToken = undefined;
        adminToUpdate.passwordResetExpires = undefined;
        await adminToUpdate.save({ validateBeforeSave: false });
      }
    }
    res.status(500).json({ message: "There was an error sending the email. Try again later." });
  }
};

/**
 * @desc    Reset password
 * @route   PATCH /api/admin/reset-password/:token
 * @access  Public
 */
const resetPassword = async (req, res) => {
  try {
    // 1) Get admin based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const admin = await Admin.findOne({ 
      passwordResetToken: hashedToken, 
      passwordResetExpires: { $gt: Date.now() } 
    });

    // 2) If token has not expired, and there is an admin, set the new password
    if (!admin) {
      return res.status(400).json({ message: 'Token is invalid or has expired' });
    }

    // The pre-save hook will hash the password
    admin.password = req.body.password;
    admin.passwordResetToken = undefined;
    admin.passwordResetExpires = undefined;
    await admin.save();

    res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error("Admin Reset Password Error:", error);
    res.status(500).json({ message: "Server error during password reset." });
  }
};

/**
 * @desc    Logout admin
 * @route   POST /api/admin/logout
 * @access  Private
 */
const logoutAdmin = async (req, res) => {
  try {
    // Clear the refresh token from database
    if (req.admin) {
      req.admin.refreshToken = null;
      await req.admin.save();
    }

    // Clear the cookie
    res.clearCookie('jwt_admin');
    res.status(200).json({ message: 'Admin logged out successfully' });
  } catch (error) {
    console.error('Admin Logout Error:', error);
    res.status(500).json({ message: 'Server error during logout.' });
  }
};

export { 
  registerAdmin, 
  loginAdmin, 
  forgotPassword, 
  resetPassword, 
  logoutAdmin 
};