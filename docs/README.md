# Scholaro Documentation

This directory contains documentation for the Scholaro e-learning platform.

## Authentication Documentation

- **[Forgot Password Setup](FORGOT_PASSWORD_SETUP.md)** - Complete implementation guide for forgot password functionality
- **[Troubleshooting Forgot Password](TROUBLESHOOTING_FORGOT_PASSWORD.md)** - Common issues and solutions for password reset
- **[Google OAuth Setup](GOOGLE_OAUTH_SETUP.md)** - Complete guide for Google authentication implementation

## Features Implemented

### Forgot Password System
- ✅ User forgot password
- ✅ Tutor forgot password  
- ✅ Admin forgot password
- ✅ Secure token generation
- ✅ Email notifications
- ✅ Token expiry (10 minutes)
- ✅ Professional email templates

### Google OAuth System
- ✅ User Google login/register
- ✅ Tutor Google login/register
- ✅ Automatic account creation
- ✅ Account linking for existing users
- ✅ Profile image from Google
- ✅ Secure token verification

### User Types Supported
- **Users** - Students using the platform
- **Tutors** - Instructors creating and managing courses
- **Admins** - Platform administrators

## Quick Start

1. Make sure your `.env` file in the Backend directory contains:
   ```env
   FRONTEND_URL=http://localhost:5173
   EMAIL_USERNAME=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

2. Start both servers:
   ```bash
   # Backend
   cd Backend && npm run server
   
   # Frontend
   cd Frontend && npm run dev
   ```

3. Test forgot password functionality:
   - Go to any login page
   - Click "Forgot Password?"
   - Enter your email
   - Check email for reset link

## Project Structure

```
Scholaro/
├── Backend/
│   ├── Controllers/
│   │   ├── userController.js      # User auth & forgot password
│   │   ├── tutorController.js     # Tutor auth & forgot password
│   │   └── adminController.js     # Admin auth & forgot password
│   ├── Model/
│   │   ├── userModel.js          # User schema with reset tokens
│   │   ├── TutorModel.js         # Tutor schema with reset tokens
│   │   └── AdminModel.js         # Admin schema with reset tokens
│   ├── Routes/
│   │   ├── userRoute.js          # User API routes
│   │   ├── tutorRoute.js         # Tutor API routes
│   │   └── adminRoute.js         # Admin API routes
│   └── utils/
│       └── emailService.js       # Email sending service
├── Frontend/
│   ├── src/Pages/
│   │   ├── USER/
│   │   │   ├── UserForgotPassword.jsx
│   │   │   └── UserResetPassword.jsx
│   │   ├── TUTOR/
│   │   │   ├── TutorForgotPassword.jsx
│   │   │   └── TutorResetPassword.jsx
│   │   └── ADMIN/
│   │       ├── AdminLogin.jsx
│   │       ├── AdminForgotPassword.jsx
│   │       └── AdminResetPassword.jsx
│   └── Routes/
│       ├── userRoutes.jsx        # User frontend routes
│       ├── tutorRoutes.jsx       # Tutor frontend routes
│       └── adminRoutes.jsx       # Admin frontend routes
└── docs/                         # This documentation
```

## API Endpoints

### Users
- `POST /api/users/forgot-password` - Send reset email
- `PATCH /api/users/reset-password/:token` - Reset password

### Tutors
- `POST /api/tutors/forgot-password` - Send reset email
- `PATCH /api/tutors/reset-password/:token` - Reset password

### Admins
- `POST /api/admin/login` - Admin login
- `POST /api/admin/forgot-password` - Send reset email
- `PATCH /api/admin/reset-password/:token` - Reset password

## Security Features

- Cryptographically secure tokens (32 random bytes)
- Tokens are hashed before database storage
- Short expiry time (10 minutes)
- Generic success messages to prevent email enumeration
- Password validation on frontend and backend
- HTTPS-ready email templates