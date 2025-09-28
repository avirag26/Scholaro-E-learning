
import User from '../Model/userModel.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import { sendOtpEmail } from '../utils/emailService.js';
import { v4 as uuidv4 } from 'uuid';

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

export { registerUser, loginUser, verifyOtp, resendOtp };
