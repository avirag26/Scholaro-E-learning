import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, Edit, Save, X, Camera, Check, User, LogOut } from 'lucide-react';
import Button from "../../ui/Button";
import Card from "../../ui/Card";

export default function AdminProfile() {
  const navigate = useNavigate();
  const [adminInfo, setAdminInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    department: '',
    bio: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const storedAdminInfo = localStorage.getItem('adminInfo');
    const authToken = localStorage.getItem('adminAuthToken');
    
    if (!authToken) {
      navigate('/admin/login');
      return;
    }
    
    if (storedAdminInfo) {
      const admin = JSON.parse(storedAdminInfo);
      setAdminInfo(admin);
      setFormData({
        name: admin.name || admin.full_name || '',
        email: admin.email || '',
        role: admin.role || 'Admin',
        phone: admin.phone || '',
        department: admin.department || '',
        bio: admin.bio || ''
      });
      setImagePreview(admin.profileImage);
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedAdminInfo = {
      ...adminInfo,
      name: formData.name,
      full_name: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      bio: formData.bio,
      profileImage: imagePreview
    };
    localStorage.setItem('adminInfo', JSON.stringify(updatedAdminInfo));
    setAdminInfo(updatedAdminInfo);
    setIsEditing(false);
    alert('Admin profile updated successfully!');
  };

  const handleCancel = () => {
    if (adminInfo) {
      setFormData({
        name: adminInfo.name || adminInfo.full_name || '',
        email: adminInfo.email || '',
        role: adminInfo.role || 'Admin',
        phone: adminInfo.phone || '',
        department: adminInfo.department || '',
        bio: adminInfo.bio || ''
      });
      setImagePreview(adminInfo.profileImage);
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminAuthToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin/login');
  };

  const renderField = (label, name, type = 'text', placeholder = '', disabled = false) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        {isEditing && !disabled ? (
          type === 'textarea' ? (
            <textarea
              name={name}
              value={formData[name]}
              onChange={handleInputChange}
              placeholder={placeholder}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          ) : (
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleInputChange}
              placeholder={placeholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          )
        ) : (
          <div className={`w-full px-4 py-3 border border-gray-200 rounded-lg ${disabled ? 'bg-gray-100' : 'bg-gray-50'} min-h-[48px] flex items-center`}>
            {formData[name] || <span className="text-gray-400">Not set</span>}
          </div>
        )}
        {formData[name] && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - matching AdminDashboard */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left side */}
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-sky-500">Scholaro</h1>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-sky-500">Categories</a>
            </nav>
          </div>

          {/* Center - Search */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search course"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-600 hover:text-sky-500">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {formData.name?.charAt(0) || 'A'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - matching AdminDashboard style exactly */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          {/* Profile Section */}
          <div className="p-6 border-b">
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center mb-3">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Admin Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-2xl font-bold">
                    {formData.name?.charAt(0) || 'A'}
                  </span>
                )}
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-sky-500 text-white p-2 rounded-full hover:bg-sky-600 cursor-pointer">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">
                {formData.name || 'ADMIN'}
              </h3>
              <button className="text-sky-500 text-sm hover:underline">
                Profile
              </button>
            </div>
          </div>

          {/* Navigation - matching AdminDashboard */}
          <nav className="p-4">
            <div className="space-y-2">
              <button 
                onClick={() => navigate('/admin/dashboard')}
                className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Dashboard
              </button>
              <button className="w-full text-left px-4 py-3 bg-sky-500 text-white rounded-lg font-medium flex items-center">
                <User className="w-4 h-4 mr-3" />
                Profile
              </button>
              <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                Category
              </button>
              <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                Students
              </button>
              <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                Orders
              </button>
              <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                Tutors
              </button>
              <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                Coupon
              </button>
              <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                Courses
              </button>
              <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">
                Legal
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Form */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <Button
                        onClick={handleSave}
                        className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 text-sm"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 text-sm"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="border-sky-500 text-sky-600 hover:bg-sky-50 px-4 py-2 text-sm"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-6">
                {renderField('Full Name', 'name', 'text', 'Enter admin name')}
                {renderField('Email', 'email', 'email', 'Enter admin email')}
                {renderField('Role', 'role', 'text', 'Admin role', true)}
                {renderField('Phone', 'phone', 'tel', 'Enter phone number')}
                {renderField('Department', 'department', 'text', 'Enter department')}
                {renderField('Bio', 'bio', 'textarea', 'Admin bio...')}
              </div>
            </Card>

            {/* Admin Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Admin Statistics</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">551</div>
                  <div className="text-sm text-gray-600">Total Users</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">23</div>
                  <div className="text-sm text-gray-600">Active Courses</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">1.2K</div>
                  <div className="text-sm text-gray-600">Total Tutors</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">$25K</div>
                  <div className="text-sm text-gray-600">Revenue</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Quick Actions</h4>
                <Button 
                  onClick={() => navigate('/admin/dashboard')}
                  className="w-full bg-sky-500 hover:bg-sky-600"
                >
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-sky-500 text-sky-600 hover:bg-sky-50"
                >
                  View Reports
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}