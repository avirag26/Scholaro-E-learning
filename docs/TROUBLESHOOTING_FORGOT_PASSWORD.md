# Troubleshooting Forgot Password Issues

## Issue: "Hmmm… can't reach this page" or "DNS_PROBE_FINISHED_NXDOMAIN"

This error typically occurs when the reset link in the email is malformed or the frontend server is not running.

### Quick Fixes:

1. **Check Frontend Server**
   ```bash
   cd Frontend
   npm run dev
   ```
   Make sure the server is running on `http://localhost:5173`

2. **Verify Environment Variables**
   Check `Backend/.env` file contains:
   ```env
   FRONTEND_URL=http://localhost:5173
   EMAIL_USERNAME=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   ```

3. **Test the URLs Manually**
   Open `test-reset-url.html` in your browser to test all reset password URLs

### Step-by-Step Debugging:

#### 1. Test Email Service
```bash
cd Backend
node test-email.js
```
This should show: `✅ Email test completed successfully!`

#### 2. Test Full Forgot Password Flow
```bash
cd Backend
node test-forgot-password.js
```
This will:
- Find a user in your database
- Generate a reset token
- Send an actual email
- Show the expected URL

#### 3. Check Email Content
Look for an email with subject "Password Reset Request - Scholaro"
The email should contain:
- A blue "Reset My Password" button
- A clickable URL in a gray box
- The URL should start with `http://localhost:5173`

#### 4. Verify Frontend Routes
Test these URLs manually in your browser:
- `http://localhost:5173/user/forgot-password`
- `http://localhost:5173/user/reset-password/test-token`
- `http://localhost:5173/tutor/forgot-password`
- `http://localhost:5173/tutor/reset-password/test-token`
- `http://localhost:5173/admin/forgot-password`
- `http://localhost:5173/admin/reset-password/test-token`

### Common Issues and Solutions:

#### Issue: Email contains "undefined" in URL
**Solution:** Add `FRONTEND_URL=http://localhost:5173` to `Backend/.env`

#### Issue: Frontend shows 404 for reset password page
**Solution:** Make sure the routes are properly imported in the route files

#### Issue: Reset password page loads but shows "Invalid token"
**Solution:** This is normal for test tokens. Use a real token from the email.

#### Issue: Email not being sent
**Solutions:**
1. Check Gmail App Password is correct
2. Enable 2-factor authentication on Gmail
3. Generate a new App Password
4. Update `EMAIL_PASSWORD` in `.env`

#### Issue: CORS errors
**Solution:** Make sure backend CORS is configured for `http://localhost:5173`

### Testing the Complete Flow:

1. **Start both servers:**
   ```bash
   # Terminal 1 - Backend
   cd Backend
   npm run server

   # Terminal 2 - Frontend  
   cd Frontend
   npm run dev
   ```

2. **Test user forgot password:**
   - Go to `http://localhost:5173/user/login`
   - Click "Forgot Password?"
   - Enter a valid email from your database
   - Check your email
   - Click the reset link
   - Enter a new password

3. **Verify the reset worked:**
   - Try logging in with the new password

### Backend Logs to Watch:

When testing, you should see these logs in the backend console:
```
Email service initialized with:
- EMAIL_USERNAME: ✓ Set
- EMAIL_PASSWORD: ✓ Set  
- FRONTEND_URL: http://localhost:5173

Forgot password request for email: user@example.com
Generated reset token: [long-hex-string]
Token saved to database
Attempting to send password reset email...
Password reset email sent successfully
```

### Email Template Preview:

The email should look like this:
- **Header:** Scholaro logo in blue
- **Title:** "Password Reset Request"
- **Button:** Blue "Reset My Password" button
- **Fallback:** Clickable URL in a gray box
- **Warning:** Yellow box with 10-minute expiry notice

### Production Considerations:

For production deployment:
1. Update `FRONTEND_URL` to your production domain
2. Use a professional email service (SendGrid, AWS SES, etc.)
3. Implement rate limiting for forgot password requests
4. Add email templates with your branding
5. Consider longer token expiry times (30 minutes)

### Still Having Issues?

1. Check browser developer console for JavaScript errors
2. Check network tab for failed API requests
3. Verify database connection is working
4. Test with a different email address
5. Try a different browser or incognito mode