# Google OAuth Implementation Guide

This guide explains how to set up and use Google OAuth authentication in the Scholaro platform.

## Overview

Google OAuth has been implemented for both **Users** and **Tutors** with the following features:
- ✅ Login with Google account
- ✅ Register with Google account  
- ✅ Automatic account creation for new Google users
- ✅ Account linking for existing users
- ✅ Profile image from Google account
- ✅ No password required for Google users

## Prerequisites

### 1. Google Cloud Console Setup

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select existing project
3. **Enable Google+ API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" 
   - Click "Enable"

4. **Create OAuth 2.0 Credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized origins:
     - `http://localhost:5173` (for development)
     - Your production domain (for production)
   - Add authorized redirect URIs:
     - `http://localhost:5173` (for development)
     - Your production domain (for production)

5. **Copy the Client ID** - you'll need this for configuration

### 2. Environment Configuration

#### Frontend (.env)
```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
VITE_API_URL=http://localhost:5000
```

#### Backend (.env)
```env
GOOGLE_CLIENT_ID=your-google-client-id-here.apps.googleusercontent.com
```

**Important**: Use the same Google Client ID in both frontend and backend.

## How It Works

### Authentication Flow

1. **User clicks "Sign in with Google"**
2. **Google OAuth popup opens**
3. **User authorizes the application**
4. **Google returns a credential token**
5. **Frontend sends token to backend**
6. **Backend verifies token with Google**
7. **Backend creates/updates user account**
8. **Backend returns access token**
9. **User is logged in**

### Account Handling

#### New Google Users
- Automatically creates account
- Sets `is_verified: true`
- No password required
- Uses Google profile image
- Uses Google display name

#### Existing Users
- Links Google account to existing account
- Updates profile image from Google
- Maintains existing user data

## API Endpoints

### Users
- `POST /api/users/google-auth` - Google OAuth for users

### Tutors  
- `POST /api/tutors/google-auth` - Google OAuth for tutors

### Request Format
```json
{
  "credential": "google-jwt-token-here"
}
```

### Response Format
```json
{
  "_id": "user-id",
  "name": "User Name",
  "email": "user@example.com",
  "profileImage": "https://google-profile-image-url",
  "accessToken": "jwt-access-token",
  "message": "Google login successful"
}
```

## Frontend Implementation

### GoogleOAuthProvider Setup
```jsx
// main.jsx
import { GoogleOAuthProvider } from '@react-oauth/google'

<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
  <App />
</GoogleOAuthProvider>
```

### Google Login Button
```jsx
import { GoogleLogin } from "@react-oauth/google";

<GoogleLogin
  onSuccess={handleGoogleSuccess}
  onError={handleGoogleError}
  theme="outline"
  size="large"
  width="100%"
  text="signin_with"
  shape="rectangular"
/>
```

### Success Handler
```jsx
const handleGoogleSuccess = async (credentialResponse) => {
  try {
    const response = await axiosPublic.post("/api/users/google-auth", {
      credential: credentialResponse.credential
    });
    
    // Handle successful authentication
    localStorage.setItem("authToken", response.data.accessToken);
    navigate("/user/home");
  } catch (err) {
    toast.error("Google login failed");
  }
};
```

## Backend Implementation

### Dependencies
```bash
npm install google-auth-library
```

### Token Verification
```javascript
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const ticket = await client.verifyIdToken({
  idToken: credential,
  audience: process.env.GOOGLE_CLIENT_ID,
});

const payload = ticket.getPayload();
const { sub: googleId, email, name, picture } = payload;
```

## Database Schema Updates

### User Model
```javascript
{
  googleId: {
    type: String,
    default: null,
  },
  profileImage: {
    type: String,
    default: null,
  },
  // password is optional for Google users
  password: {
    type: String,
    required: function() { return !this.googleId; }, 
  },
}
```

### Tutor Model
```javascript
{
  googleId: {
    type: String,
    default: null,
  },
  profile_image: {
    type: String,
    default: null,
  },
  // password is optional for Google users
  password: {
    type: String,
    required: function() { return !this.googleId; },
  },
}
```

## Testing

### 1. Start Both Servers
```bash
# Backend
cd Backend && npm run server

# Frontend  
cd Frontend && npm run dev
```

### 2. Test User Google Auth
- Go to `http://localhost:5173/user/login`
- Click "Sign in with Google"
- Authorize with your Google account
- Should redirect to user home page

### 3. Test Tutor Google Auth
- Go to `http://localhost:5173/tutor/login`
- Click "Sign in with Google"
- Authorize with your Google account
- Should redirect to tutor home page

## Security Features

- **Token Verification**: All Google tokens are verified server-side
- **Secure Cookies**: Refresh tokens stored in HttpOnly cookies
- **CORS Protection**: Configured for specific origins
- **Account Linking**: Prevents duplicate accounts with same email
- **Automatic Verification**: Google users are pre-verified

## Troubleshooting

### Common Issues

#### "Invalid Google Client ID"
- Check that `VITE_GOOGLE_CLIENT_ID` matches your Google Console Client ID
- Ensure the Client ID is for a "Web application" type

#### "Unauthorized Origin"
- Add `http://localhost:5173` to authorized origins in Google Console
- For production, add your production domain

#### "Token Verification Failed"
- Check that backend `GOOGLE_CLIENT_ID` matches frontend
- Ensure google-auth-library is installed in backend

#### "CORS Error"
- Check backend CORS configuration includes your frontend URL
- Ensure credentials are allowed in CORS settings

### Debug Logs

Enable debug logging by checking browser console and backend logs:

```javascript
// Backend - add to google auth controller
console.log('Google OAuth payload:', { googleId, email, name });
```

## Production Deployment

### 1. Update Environment Variables
```env
# Frontend
VITE_GOOGLE_CLIENT_ID=your-production-client-id
VITE_API_URL=https://your-api-domain.com

# Backend  
GOOGLE_CLIENT_ID=your-production-client-id
```

### 2. Update Google Console
- Add production domains to authorized origins
- Add production domains to authorized redirect URIs

### 3. HTTPS Required
- Google OAuth requires HTTPS in production
- Ensure your frontend and backend use HTTPS

## Features Not Implemented

- Admin Google OAuth (can be added similarly)
- Google OAuth for password reset
- Google account unlinking
- Multiple Google accounts per user

These features can be added following the same patterns established for users and tutors.