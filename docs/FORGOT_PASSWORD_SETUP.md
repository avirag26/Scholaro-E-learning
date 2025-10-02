# Forgot Password Implementation

This document outlines the forgot password functionality that has been added for all three user types: **Users**, **Tutors**, and **Admins**.

## Backend Implementation

### 1. Models Updated
- **User Model** (`Backend/Model/userModel.js`): Added `passwordResetToken` and `passwordResetExpires` fields
- **Tutor Model** (`Backend/Model/TutorModel.js`): Already had password reset fields
- **Admin Model** (`Backend/Model/AdminModel.js`): New model created with password reset functionality

### 2. Controllers
- **User Controller**: Added `forgotPassword` and `resetPassword` functions
- **Tutor Controller**: Updated to use improved email service
- **Admin Controller**: New controller with complete auth functionality

### 3. Email Service Enhanced
- **Enhanced Email Service** (`Backend/utils/emailService.js`): 
  - Added `sendPasswordResetEmail` function
  - Professional HTML email templates
  - Support for different user types (user/tutor/admin)

### 4. Routes
- **User Routes**: Added `/forgot-password` and `/reset-password/:token`
- **Tutor Routes**: Already had forgot password routes
- **Admin Routes**: New routes file with auth endpoints

## Frontend Implementation

### 1. Components Created
- `UserResetPassword.jsx` - Password reset form for users
- `TutorResetPassword.jsx` - Password reset form for tutors  
- `AdminForgotPassword.jsx` - Forgot password form for admins
- `AdminResetPassword.jsx` - Password reset form for admins
- `AdminLogin.jsx` - Admin login page with forgot password link

### 2. Routes Updated
- User routes: Added `/reset-password/:token`
- Tutor routes: Added `/reset-password/:token`
- Admin routes: New routes file with forgot/reset password routes
- Main App.jsx: Added admin routes

### 3. Existing Components
- User and Tutor login pages already had "Forgot Password?" links
- User and Tutor forgot password pages were already implemented

## API Endpoints

### Users
- `POST /api/users/forgot-password` - Send reset email
- `PATCH /api/users/reset-password/:token` - Reset password

### Tutors  
- `POST /api/tutors/forgot-password` - Send reset email
- `PATCH /api/tutors/reset-password/:token` - Reset password

### Admins
- `POST /api/admin/forgot-password` - Send reset email
- `PATCH /api/admin/reset-password/:token` - Reset password
- `POST /api/admin/login` - Admin login
- `POST /api/admin/register` - Admin registration (protected)

## Environment Variables Required

Make sure your `.env` file has these email configuration variables:

```env
EMAIL_USERNAME=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
```

## How It Works

1. **Forgot Password Flow**:
   - User enters email on forgot password page
   - System generates secure token and saves hashed version to database
   - Email sent with reset link containing the unhashed token
   - Token expires in 10 minutes

2. **Reset Password Flow**:
   - User clicks link in email (or enters token manually)
   - System validates token and checks expiry
   - User enters new password
   - Password is hashed and saved, token is cleared

3. **Security Features**:
   - Tokens are cryptographically secure (32 random bytes)
   - Tokens are hashed before storage
   - Short expiry time (10 minutes)
   - Generic success messages to prevent email enumeration
   - Password validation on frontend and backend

## Frontend Routes

### Users
- `/user/forgot-password` - Forgot password form
- `/user/reset-password/:token` - Reset password form

### Tutors
- `/tutor/forgot-password` - Forgot password form  
- `/tutor/reset-password/:token` - Reset password form

### Admins
- `/admin/login` - Admin login
- `/admin/forgot-password` - Forgot password form
- `/admin/reset-password/:token` - Reset password form

## Testing

1. **Start the backend server**: `npm run server` (in Backend directory)
2. **Start the frontend**: `npm run dev` (in Frontend directory)
3. **Test the flow**:
   - Go to login page for any user type
   - Click "Forgot Password?"
   - Enter email and submit
   - Check email for reset link
   - Click link or manually navigate to reset page
   - Enter new password and submit

## Notes

- All password reset emails include professional HTML formatting
- Admin passwords require minimum 8 characters (vs 6 for users/tutors)
- The system prevents email enumeration by showing success messages even for non-existent emails
- All forms include proper validation and error handling
- Responsive design works on mobile and desktop