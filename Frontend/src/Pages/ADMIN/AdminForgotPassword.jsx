import React, { useState } from 'react';
import { axiosPublic } from '../../api/axios';
import { toast, Toaster } from 'sonner';
import { Link } from 'react-router-dom';
import DotDotDotSpinner from '../../ui/Spinner/DotDotDotSpinner';

export default function AdminForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address.');
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axiosPublic.post('/api/admin/forgot-password', { email });
      toast.success(response.data.message);
    } catch (err) {
      // Show a generic success message even on failure to prevent email enumeration
      toast.success('If an admin account with that email exists, a password reset link has been sent.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Toaster position="top-center" richColors />
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Admin Password Reset</h2>
        <p className="text-center text-slate-600 mb-6">
          Enter your admin email address below and we'll send you a secure link to reset your password.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Admin Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
              placeholder="admin@example.com"
              required
            />
          </div>
          <button type="submit" className="w-full bg-slate-600 text-white py-3 rounded-lg hover:bg-slate-700 transition disabled:opacity-50" disabled={isSubmitting}>
            {isSubmitting ? <DotDotDotSpinner /> : 'Send Reset Link'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-600 mt-4">
          Remembered your password? <Link to="/admin/login" className="text-slate-600 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}