
import User from '../Model/userModel.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * @desc    Register a new user
 * @route   POST /api/users
 * @access  Public
 */
const registerUser = async (req, res) => {
 
  const { full_name, email, password, phone } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Note: Your full userModel is more complex. You'll need to adjust this
  // to create a user with all the required fields from your model.
  const user = await User.create({
    full_name,
    email,
    phone,
    user_id: uuidv4(),
    password, // The pre-save hook in the model will hash this
  });

  if (user) {
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Save the refresh token to the user in the database
    user.refreshToken = refreshToken;
    await user.save();

    // Send the refresh token as an HttpOnly cookie
    res.cookie('jwt', refreshToken, {
      httpOnly: true, // Makes it inaccessible to client-side JS
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      sameSite: 'strict', // Helps prevent CSRF attacks
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send the access token and user info in the response body
    res.status(201).json({
      _id: user._id,
      name: user.full_name,
      email: user.email,
      accessToken: accessToken,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
};

/**
 * @desc    Auth user & get token (Login)
 * @route   POST /api/users/login
 * @access  Public
 */
const loginUser = async (req, res) => {
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
    res.status(401);
    throw new Error('Invalid email or password');
  }
};

export { registerUser, loginUser };
