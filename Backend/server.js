import express from 'express';
import dotenv from 'dotenv';
dotenv.config(); // Move this to the top

import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './Middleware/errorMiddleware.js';

// Import routes
import userRoutes from './Routes/userRoute.js';

const port = process.env.PORT || 5000;
console.log("hey")
connectDB();

const app = express();

// CORS Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true
}));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('API is running....');
});

// Use routes
app.use('/api/users', userRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running on port ${port}`));
