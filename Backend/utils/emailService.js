import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Ensure environment variables are loaded before this code runs,
// typically by calling dotenv.config() at the top of your main server file.

// Check for missing email credentials
if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
  console.error("Email credentials (EMAIL_USERNAME, EMAIL_PASSWORD) are not defined in your .env file.");
  throw new Error("Missing email credentials in .env file");
}

const transporter = nodemailer.createTransport({
  service: 'gmail', // Or your preferred email service
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendOtpEmail = async (to, otp) => {
  try {
    const mailOptions = {
      from: `"Scholaro" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject: 'Your OTP for Scholaro Verification',
      html: `<p>Your One-Time Password is: <b>${otp}</b>. It will expire in 10 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${to}`);
  } catch (error) {
    console.error('Failed to send OTP email:', error);
    throw error; // Re-throw or handle error appropriately in calling code
  }
};

export { sendOtpEmail };
