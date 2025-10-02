import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './Middleware/errorMiddleware.js';

// This must be the very first thing to run
dotenv.config();

// Import routes
import userRoutes from './Routes/userRoute.js';
import tutorRoutes from './Routes/tutorRoute.js';
import adminRoutes from './Routes/adminRoute.js';

const port = process.env.PORT || 5000;
connectDB();

const app = express();

// CORS Middleware
app.use(cors({
  origin: 'http://localhost:5174', // Your frontend URL
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
app.use('/api/tutors', tutorRoutes);
app.use('/api/admin', adminRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`✅ Server running on http://localhost:${port}`));
