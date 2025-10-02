import jwt from 'jsonwebtoken';
import Tutor from '../Model/TutorModel.js';

const protectTutor = async (req, res, next) => {
  let token;

  // Read the JWT from the 'Authorization' header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get tutor from the token (select everything except the password)
      req.tutor = await Tutor.findById(decoded.id).select('-password');

      if (!req.tutor) {
        res.status(401);
        throw new Error('Not authorized, tutor not found');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export { protectTutor };