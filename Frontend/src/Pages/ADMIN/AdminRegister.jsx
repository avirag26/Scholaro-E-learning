import { useState } from 'react';
import { Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { axiosPublic } from "../../api/axios.js";
import { toast, Toaster } from "sonner";
import DotDotDotSpinner from "../../ui/Spinner/DotDotDotSpinner";

export default function AdminRegister() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await axiosPublic.post("/api/admin/register", formData);
      
      toast.success("Admin account created successfully!");
      setTimeout(() => {
        navigate('/admin/login');
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Scholaro</h1>
          <h2 className="text-xl font-semibold text-slate-700 mb-2">Create Admin Account</h2>
          <p className="text-slate-600">Set up your first admin account</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.full_name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              } focus:outline-none focus:ring-2 focus:border-blue-500 transition-all duration-300`}
              placeholder="Enter your full name"
              required
            />
            {errors.full_name && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertTriangle size={16} className="mr-2" />
                {errors.full_name}
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              } focus:outline-none focus:ring-2 focus:border-blue-500 transition-all duration-300`}
              placeholder="Enter your email"
              required
            />
            {errors.email && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertTriangle size={16} className="mr-2" />
                {errors.email}
              </div>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:ring-blue-500"
              } focus:outline-none focus:ring-2 focus:border-blue-500 transition-all duration-300`}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors duration-300"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <div className="flex items-center text-red-500 text-sm mt-1">
                <AlertTriangle size={16} className="mr-2" />
                {errors.password}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? <DotDotDotSpinner /> : "Create Admin Account"}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-slate-600">
            Already have an admin account?{" "}
            <Link to="/admin/login" className="text-blue-600 hover:underline">
              Login here
            </Link>
          </p>
        </form>
        
        <Toaster />
      </div>
    </div>
  );
}