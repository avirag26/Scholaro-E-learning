
import User from '../Model/userModel.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import { sendOtpEmail, sendPasswordResetEmail } from '../utils/emailService.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { OAuth2Client } from 'google-auth-library';

/**
 * @desc    Register a new user
 * @route   POST /api/users
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { full_name, email, password, phone } = req.body;

    let user = await User.findOne({ email });

    if (user && user.is_verified) {
      res.status(400).json({ message: 'User already exists and is verified.' });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    if (user && !user.is_verified) {
      // User exists but is not verified, update OTP
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    } else {
      // New user
      user = new User({
        full_name,
        email,
        phone,
        password, // The pre-save hook in the model will hash this
        user_id: uuidv4(),
        otp,
        otpExpiry,
      });
      await user.save();
    }

    await sendOtpEmail(email, otp);
    res.status(201).json({
      message: 'OTP sent to your email. Please verify your account.',
    });
  } catch (error) {
    // Enhanced error logging
    console.error('---------------------------------');
    console.error('Registration Error:', error.message);
    if (error.code === 'EAUTH') {
      console.error('Nodemailer Authentication Error: Please check your EMAIL_USERNAME and EMAIL_PASSWORD in the .env file. You may need to use a Google App Password.');
    }
    console.error('---------------------------------');
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

/**
 * @desc    Auth user & get token (Login)
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // Save refresh token to user in DB
      user.refreshToken = refreshToken;
      await user.save();

      // Send refresh token in an HttpOnly cookie
      res.cookie('jwt', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.json({
        _id: user._id,
        name: user.full_name,
        email: user.email,
        accessToken: accessToken,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

/**
 * @desc    Verify OTP and log user in
 * @route   POST /api/users/verify-otp
 * @access  Public
 */
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }

    if (user.otp !== otp || new Date() > user.otpExpiry) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    user.is_verified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    // OTP is correct, now log the user in by issuing tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({
      _id: user._id,
      name: user.full_name,
      email: user.email,
      accessToken: accessToken,
      message: 'User verified successfully.',
    });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({ message: 'Server error during OTP verification.' });
  }
};

/**
 * @desc    Resend OTP
 * @route   POST /api/users/resend-otp
 * @access  Public
 */
const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.is_verified) {
      return res.status(400).json({ message: 'Cannot resend OTP for this user.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    await sendOtpEmail(email, otp);
    res.status(200).json({ message: 'A new OTP has been sent to your email.' });
  } catch (error) {
    console.error('Resend OTP Error:', error);
    res.status(500).json({ message: 'Server error during OTP resend.' });
  }
};

/**
 * @desc    Forgot password
 * @route   POST /api/users/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
  try {
    console.log('Forgot password request for email:', req.body.email);
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      console.log('User not found, but sending generic success message');
      // Send a generic success message to prevent email enumeration
      return res.status(200).json({ message: "If a user with that email exists, a password reset link has been sent." });
    }

    // 1) Generate a random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    console.log('Generated reset token:', resetToken);

    // 2) Hash the token and save it to the user document
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 3) Set an expiry for the token (10 minutes)
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });
    console.log('Token saved to database');

    // 4) Send the token to the user's email
    console.log('Attempting to send password reset email...');
    await sendPasswordResetEmail(user.email, resetToken, 'user');
    console.log('Password reset email sent successfully');

    res.status(200).json({ message: "Password reset token sent to email." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    console.error("Error stack:", error.stack);
    // In case of error, invalidate the token
    if (req.body.email) {
      const userToUpdate = await User.findOne({ email: req.body.email });
      if (userToUpdate) {
        userToUpdate.passwordResetToken = undefined;
        userToUpdate.passwordResetExpires = undefined;
        await userToUpdate.save({ validateBeforeSave: false });
      }
    }
    res.status(500).json({ message: "There was an error sending the email. Try again later." });
  }
};

/**
 * @desc    Reset password
 * @route   PATCH /api/users/reset-password/:token
 * @access  Public
 */
const resetPassword = async (req, res) => {
  try {
    // 1) Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ 
      passwordResetToken: hashedToken, 
      passwordResetExpires: { $gt: Date.now() } 
    });

    // 2) If token has not expired, and there is a user, set the new password
    if (!user) {
      return res.status(400).json({ message: 'Token is invalid or has expired' });
    }

    // The pre-save hook will hash the password
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful.' });
  } catch (error) {
    console.error("Reset Password Error:", error);
    res.status(500).json({ message: "Server error during password reset." });
  }
};

/**
 * @desc    Generic Google OAuth handler
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {mongoose.Model} Model - The Mongoose model (User or Tutor)
 * @param {string} userType - 'user' or 'tutor'
 */
const handleGoogleAuth = async (req, res, Model, userType) => {
  const { credential } = req.body;
  if (!credential) {
    return res.status(400).json({ message: 'Google credential is required' });
  }

  try {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    let entity = await Model.findOne({ $or: [{ email }, { googleId }] });

    if (!entity) {
      // Create new entity
      entity = new Model({
        full_name: name,
        email,
        googleId,
        profileImage: picture, // Ensure model field is 'profileImage'
        [`${userType}_id`]: uuidv4(),
        is_verified: true,
      });
    } else {
      // Update existing entity
      if (!entity.googleId) entity.googleId = googleId;
      if (!entity.profileImage) entity.profileImage = picture; // Only update if not present
    }

    const accessToken = generateAccessToken(entity._id);
    const refreshToken = generateRefreshToken(entity._id);
    entity.refreshToken = refreshToken;
    entity.lastLogin = new Date();
    await entity.save();

    const cookieName = userType === 'tutor' ? 'jwt_tutor' : 'jwt';
    res.cookie(cookieName, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(entity.isNew ? 201 : 200).json({
      _id: entity._id,
      name: entity.full_name,
      email: entity.email,
      profileImage: entity.profileImage,
      accessToken,
      message: `Google ${entity.isNew ? 'registration' : 'login'} successful`,
    });
  } catch (error) {
    console.error(`❌ Google Auth Error for ${userType}:`, error.message);
    if (error.message.includes('Token used too early') || error.message.includes('Invalid token') || error.message.includes('audience')) {
      return res.status(400).json({ message: 'Invalid Google token. Please try again.' });
    }
    res.status(500).json({ message: 'Google authentication failed' });
  }
};

/**
 * @desc    Google OAuth Login/Register
 * @route   POST /api/users/google-auth
 * @access  Public
 */
const googleAuth = async (req, res) => {
  try {
    await handleGoogleAuth(req, res, User, 'user');
  } catch (error) {
    console.error('❌ Google Auth Error:', error.message);
    console.error('Error details:', error);
    
    if (error.message.includes('Token used too early')) {
      return res.status(400).json({ message: 'Invalid Google token. Please try again.' });
    }
    if (error.message.includes('Invalid token')) {
      return res.status(400).json({ message: 'Invalid Google token format.' });
    }
    if (error.message.includes('audience')) {
      return res.status(400).json({ message: 'Google Client ID mismatch.' });
    }
    
    res.status(500).json({ message: 'An unexpected error occurred during Google authentication.' });
  }
};

export { registerUser, loginUser, verifyOtp, resendOtp, forgotPassword, resetPassword, googleAuth };
