import Admin from '../Model/AdminModel.js';
import User from '../Model/userModel.js';
import Tutor from '../Model/TutorModel.js';
import Course from '../Model/CourseModel.js';
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



/**
 * @desc    Get all users for admin management
 * @route   GET /api/admin/users
 * @access  Private (Admin only)
 */
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = 'all' } = req.query;
    
    let query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { full_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Status filter
    if (status !== 'all') {
      if (status === 'active') {
        query.is_verified = true;
        query.is_blocked = false;
      } else if (status === 'blocked') {
        query.is_blocked = true;
      } else if (status === 'unverified') {
        query.is_verified = false;
      }
    }

    const users = await User.find(query)
      .select('-password -otp -otpExpiry -refreshToken')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Ensure is_blocked field exists for all users (for backward compatibility)
    const usersWithDefaults = users.map(user => ({
      ...user.toObject(),
      is_blocked: user.is_blocked !== undefined ? user.is_blocked : false
    }));

    const total = await User.countDocuments(query);

    res.status(200).json({
      users: usersWithDefaults,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

/**
 * @desc    Get all tutors for admin management
 * @route   GET /api/admin/tutors
 * @access  Private (Admin only)
 */
const getAllTutors = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = 'all' } = req.query;
    
    let query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { full_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Status filter
    if (status !== 'all') {
      if (status === 'active') {
        query.is_verified = true;
        query.is_blocked = false;
      } else if (status === 'blocked') {
        query.is_blocked = true;
      } else if (status === 'unverified') {
        query.is_verified = false;
      }
    }

    const tutors = await Tutor.find(query)
      .select('-password -otp -otpExpiry -refreshToken')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Get course count for each tutor and ensure is_blocked field exists
    const tutorsWithStats = await Promise.all(
      tutors.map(async (tutor) => {
        const courseCount = await Course.countDocuments({ instructor: tutor._id });
        return {
          ...tutor.toObject(),
          courseCount,
          is_blocked: tutor.is_blocked !== undefined ? tutor.is_blocked : false
        };
      })
    );

    const total = await Tutor.countDocuments(query);

    res.status(200).json({
      tutors: tutorsWithStats,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching tutors:', error);
    res.status(500).json({ message: 'Server error fetching tutors' });
  }
};

/**
 * @desc    Block/Unblock user
 * @route   PATCH /api/admin/users/:id/toggle-block
 * @access  Private (Admin only)
 */
const toggleUserBlock = async (req, res) => {
  try {
    const { id } = req.params;
    console.log('=== TOGGLE USER BLOCK DEBUG ===');
    console.log('User ID:', id);
    
    const user = await User.findById(id);
    if (!user) {
      console.log('User not found with ID:', id);
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User before toggle:', {
      _id: user._id,
      full_name: user.full_name,
      email: user.email,
      is_blocked: user.is_blocked
    });

    user.is_blocked = !user.is_blocked;
    console.log('User after toggle (before save):', {
      _id: user._id,
      is_blocked: user.is_blocked
    });

    await user.save();
    console.log('User saved successfully');

    const responseData = {
      message: `User ${user.is_blocked ? 'blocked' : 'unblocked'} successfully`,
      user: {
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        is_blocked: user.is_blocked
      }
    };

    console.log('Sending response:', responseData);
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error toggling user block:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Block/Unblock tutor
 * @route   PATCH /api/admin/tutors/:id/toggle-block
 * @access  Private (Admin only)
 */
const toggleTutorBlock = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tutor = await Tutor.findById(id);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    tutor.is_blocked = !tutor.is_blocked;
    await tutor.save();

    res.status(200).json({
      message: `Tutor ${tutor.is_blocked ? 'blocked' : 'unblocked'} successfully`,
      tutor: {
        _id: tutor._id,
        full_name: tutor.full_name,
        email: tutor.email,
        is_blocked: tutor.is_blocked
      }
    });
  } catch (error) {
    console.error('Error toggling tutor block:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private (Admin only)
 */
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Delete tutor
 * @route   DELETE /api/admin/tutors/:id
 * @access  Private (Admin only)
 */
const deleteTutor = async (req, res) => {
  try {
    const { id } = req.params;
    
    const tutor = await Tutor.findById(id);
    if (!tutor) {
      return res.status(404).json({ message: 'Tutor not found' });
    }

    // Also delete all courses by this tutor
    await Course.deleteMany({ instructor: id });

    await Tutor.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Tutor and associated courses deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting tutor:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/admin/stats
 * @access  Private (Admin only)
 */
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTutors = await Tutor.countDocuments();
    const totalCourses = await Course.countDocuments();
    const blockedUsers = await User.countDocuments({ is_blocked: true });
    const blockedTutors = await Tutor.countDocuments({ is_blocked: true });
    const unverifiedUsers = await User.countDocuments({ is_verified: false });
    const unverifiedTutors = await Tutor.countDocuments({ is_verified: false });

    res.status(200).json({
      totalUsers,
      totalTutors,
      totalCourses,
      blockedUsers,
      blockedTutors,
      unverifiedUsers,
      unverifiedTutors,
      activeUsers: totalUsers - blockedUsers,
      activeTutors: totalTutors - blockedTutors
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Migration function to add is_blocked field to existing users
const migrateUserBlocks = async (req, res) => {
  try {
    // Update all users without is_blocked field
    const userResult = await User.updateMany(
      { is_blocked: { $exists: false } },
      { $set: { is_blocked: false } }
    );

    // Update all tutors without is_blocked field
    const tutorResult = await Tutor.updateMany(
      { is_blocked: { $exists: false } },
      { $set: { is_blocked: false } }
    );

    // Update all admins without is_blocked field
    const adminResult = await Admin.updateMany(
      { is_blocked: { $exists: false } },
      { $set: { is_blocked: false } }
    );

    res.status(200).json({
      message: 'Migration completed successfully',
      usersUpdated: userResult.modifiedCount,
      tutorsUpdated: tutorResult.modifiedCount,
      adminsUpdated: adminResult.modifiedCount
    });
  } catch (error) {
    console.error('Migration error:', error);
    res.status(500).json({ message: 'Migration failed', error: error.message });
  }
};

export {
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
};