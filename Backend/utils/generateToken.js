import jwt from 'jsonwebtoken';

export const generateAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '24h', // Extended for development - should be shorter in production
  });
};

export const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d', // A long-lived refresh token
  });
};

