import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosPublic } from '../../api/axios';
import { toast, Toaster } from 'sonner';
import { Link } from 'react-router-dom';
import DotDotDotSpinner from '../../ui/Spinner/DotDotDotSpinner';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Admin password must be at least 8 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosPublic.patch(`/api/admin/reset-password/${token}`, {
        password: formData.password
      });
      toast.success(response.data.message);
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Toaster position="top-center" richColors />
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">Reset Admin Password</h2>
        <p className="text-center text-slate-600 mb-6">
          Enter your new admin password below.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
                placeholder="Enter new password (min 8 characters)"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full bg-slate-600 text-white py-3 rounded-lg hover:bg-slate-700 transition disabled:opacity-50" 
            disabled={isSubmitting}
          >
            {isSubmitting ? <DotDotDotSpinner /> : 'Reset Password'}
          </button>
        </form>
        
        <p className="text-center text-sm text-slate-600 mt-4">
          Remember your password? <Link to="/admin/login" className="text-slate-600 hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}