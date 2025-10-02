import Tutor from "../Model/TutorModel.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/generateToken.js";
import { sendOtpEmail, sendPasswordResetEmail } from "../utils/emailService.js";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { OAuth2Client } from 'google-auth-library';

/**
 * @desc    Register a new tutor
 * @route   POST /api/tutors/register
 * @access  Public
 */
const registerTutor = async (req, res) => {
  try {
    const { full_name, email, password, phone } = req.body;

    let tutor = await Tutor.findOne({ email });

    if (tutor && tutor.is_verified) {
      return res
        .status(400)
        .json({ message: "Tutor already exists and is verified." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    if (tutor && !tutor.is_verified) {
      // Tutor exists but is not verified, update OTP and hash new password if provided
      tutor.otp = otp;
      tutor.otpExpiry = otpExpiry;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        tutor.password = await bcrypt.hash(password, salt);
      }
      await tutor.save();
    } else {
      // New tutor
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      tutor = new Tutor({
        full_name,
        email,
        phone,
        password: hashedPassword,
        tutor_id: uuidv4(),
        otp,
        otpExpiry,
      });
      await tutor.save();
    }

    await sendOtpEmail(email, otp);
    res.status(201).json({
      message: "OTP sent to your email. Please verify your account.",
    });
  } catch (error) {
    console.error("---------------------------------");
    console.error("Tutor Registration Error:", error.message);
    if (error.code === "EAUTH") {
      console.error(
        "Nodemailer Authentication Error: Please check your EMAIL_USERNAME and EMAIL_PASSWORD in the .env file. You may need to use a Google App Password."
      );
    }
    console.error("---------------------------------");
    res.status(500).json({ message: "Server error during registration." });
  }
};

/**
 * @desc    Verify OTP and log tutor in
 * @route   POST /api/tutors/verify-otp
 * @access  Public
 */
const verifyTutorOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const tutor = await Tutor.findOne({ email });

    if (!tutor) {
      return res.status(400).json({ message: "Tutor not found." });
    }

    if (tutor.otp !== otp || new Date() > tutor.otpExpiry) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    tutor.is_verified = true;
    tutor.otp = undefined;
    tutor.otpExpiry = undefined;
    await tutor.save();

    // OTP is correct, now log the tutor in by issuing tokens
    const accessToken = generateAccessToken(tutor._id);
    const refreshToken = generateRefreshToken(tutor._id);

    tutor.refreshToken = refreshToken;
    await tutor.save();

    res.cookie("jwt_tutor", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({
      _id: tutor._id,
      name: tutor.full_name,
      email: tutor.email,
      accessToken: accessToken,
      message: "Tutor verified successfully.",
    });
  } catch (error) {
    console.error("Tutor OTP Verification Error:", error);
    res.status(500).json({ message: "Server error during OTP verification." });
  }
};

/**
 * @desc    Auth tutor & get token (Login)
 * @route   POST /api/tutors/login
 * @access  Public
 */
const loginTutor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const tutor = await Tutor.findOne({ email });

    if (tutor && (await bcrypt.compare(password, tutor.password))) {
      if (!tutor.is_verified) {
        return res.status(401).json({ message: "Tutor not verified. Please check your email for an OTP." });
      }

      const accessToken = generateAccessToken(tutor._id);
      const refreshToken = generateRefreshToken(tutor._id);

      tutor.refreshToken = refreshToken;
      await tutor.save();

      res.cookie("jwt_tutor", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.json({
        _id: tutor._id,
        name: tutor.full_name,
        email: tutor.email,
        accessToken: accessToken,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Tutor Login Error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};

/**
 * @desc    Resend OTP for tutor
 * @route   POST /api/tutors/resend-otp
 * @access  Public
 */
const resendTutorOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const tutor = await Tutor.findOne({ email });

    if (!tutor || tutor.is_verified) {
      return res.status(400).json({ message: "Cannot resend OTP for this tutor." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    tutor.otp = otp;
    tutor.otpExpiry = otpExpiry;
    await tutor.save();

    await sendOtpEmail(email, otp);
    res.status(200).json({ message: "A new OTP has been sent to your email." });
  } catch (error) {
    console.error("Resend Tutor OTP Error:", error);
    res.status(500).json({ message: "Server error during OTP resend." });
  }
};

/**
 * @desc    Forgot password
 * @route   POST /api/tutors/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
  try {
    const tutor = await Tutor.findOne({ email: req.body.email });

    if (!tutor) {
      // Send a generic success message to prevent email enumeration
      return res.status(200).json({ message: "If a user with that email exists, a password reset link has been sent." });
    }

    // 1) Generate a random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // 2) Hash the token and save it to the user document
    tutor.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // 3) Set an expiry for the token (10 minutes)
    tutor.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    await tutor.save({ validateBeforeSave: false });

    // 4) Send the token to the tutor's email
    await sendPasswordResetEmail(tutor.email, resetToken, 'tutor');

    res.status(200).json({ message: "Password reset token sent to email." });
  } catch (error) {
    console.error("Forgot Password Error:", error);
    // In case of error, invalidate the token
    if (req.body.email) {
      const tutorToUpdate = await Tutor.findOne({ email: req.body.email });
      if (tutorToUpdate) {
        tutorToUpdate.passwordResetToken = undefined;
        tutorToUpdate.passwordResetExpires = undefined;
        await tutorToUpdate.save({ validateBeforeSave: false });
      }
    }
    res.status(500).json({ message: "There was an error sending the email. Try again later." });
  }
};

/**
 * @desc    Reset password
 * @route   PATCH /api/tutors/reset-password/:token
 * @access  Public
 */
const resetPassword = async (req, res) => {
    // 1) Get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const tutor = await Tutor.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    // 2) If token has not expired, and there is a user, set the new password
    if (!tutor) {
        return res.status(400).json({ message: 'Token is invalid or has expired' });
    }
    const salt = await bcrypt.genSalt(10);
    tutor.password = await bcrypt.hash(req.body.password, salt);
    tutor.passwordResetToken = undefined;
    tutor.passwordResetExpires = undefined;
    await tutor.save();

    res.status(200).json({ message: 'Password reset successful.' });
};

/**
 * @desc    Google OAuth Login/Register for Tutors
 * @route   POST /api/tutors/google-auth
 * @access  Public
 */
const googleAuthTutor = async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    // Initialize Google OAuth client
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    console.log('Google OAuth payload for tutor:', { googleId, email, name });

    // Check if tutor already exists
    let tutor = await Tutor.findOne({ 
      $or: [
        { email: email },
        { googleId: googleId }
      ]
    });

    if (tutor) {
      // Tutor exists - update Google ID if not set
      if (!tutor.googleId) {
        tutor.googleId = googleId;
        tutor.profile_image = picture;
        await tutor.save();
      }
      
      // Generate tokens
      const accessToken = generateAccessToken(tutor._id);
      const refreshToken = generateRefreshToken(tutor._id);

      // Save refresh token
      tutor.refreshToken = refreshToken;
      tutor.lastLogin = new Date();
      await tutor.save();

      // Set cookie
      res.cookie('jwt_tutor', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.json({
        _id: tutor._id,
        name: tutor.full_name,
        email: tutor.email,
        profileImage: tutor.profile_image,
        accessToken: accessToken,
        message: 'Google login successful'
      });
    } else {
      // Create new tutor
      const newTutor = new Tutor({
        full_name: name,
        email: email,
        googleId: googleId,
        profile_image: picture,
        tutor_id: uuidv4(),
        is_verified: true, // Google tutors are automatically verified
        // No password required for Google tutors
      });

      await newTutor.save();

      // Generate tokens
      const accessToken = generateAccessToken(newTutor._id);
      const refreshToken = generateRefreshToken(newTutor._id);

      // Save refresh token
      newTutor.refreshToken = refreshToken;
      newTutor.lastLogin = new Date();
      await newTutor.save();

      // Set cookie
      res.cookie('jwt_tutor', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      res.status(201).json({
        _id: newTutor._id,
        name: newTutor.full_name,
        email: newTutor.email,
        profileImage: newTutor.profile_image,
        accessToken: accessToken,
        message: 'Google registration successful'
      });
    }
  } catch (error) {
    console.error('Google Auth Error for Tutor:', error);
    if (error.message.includes('Token used too early')) {
      return res.status(400).json({ message: 'Invalid Google token. Please try again.' });
    }
    res.status(500).json({ message: 'Google authentication failed' });
  }
};

export { registerTutor, verifyTutorOtp, loginTutor, resendTutorOtp, forgotPassword, resetPassword, googleAuthTutor };