import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Save, X, Camera, Check } from 'lucide-react';
import { FaPlus, FaUser, FaBook, FaChartBar, FaComments, FaSignOutAlt } from "react-icons/fa";
import Button from "../../ui/Button";
import Card from "../../ui/Card";
import Header from "./Common/Header";
import Footer from "./Common/Footer";

export default function TutorProfile() {
  const navigate = useNavigate();
  const [tutorInfo, setTutorInfo] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    phone: '',
    subject: '',
    experience: '',
    bio: '',
    qualification: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    const storedTutorInfo = localStorage.getItem('tutorInfo');
    const authToken = localStorage.getItem('tutorAuthToken');
    
    if (!authToken) {
      navigate('/tutor/login');
      return;
    }
    
    if (storedTutorInfo) {
      const tutor = JSON.parse(storedTutorInfo);
      setTutorInfo(tutor);
      setFormData({
        name: tutor.name || tutor.full_name || '',
        email: tutor.email || '',
        role: tutor.role || 'Tutor',
        phone: tutor.phone || '',
        subject: tutor.subject || '',
        experience: tutor.experience || '',
        bio: tutor.bio || '',
        qualification: tutor.qualification || ''
      });
      setImagePreview(tutor.profileImage);
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
    const updatedTutorInfo = {
      ...tutorInfo,
      name: formData.name,
      full_name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      experience: formData.experience,
      bio: formData.bio,
      qualification: formData.qualification,
      profileImage: imagePreview
    };
    localStorage.setItem('tutorInfo', JSON.stringify(updatedTutorInfo));
    setTutorInfo(updatedTutorInfo);
    setIsEditing(false);
    alert('Tutor profile updated successfully!');
  };

  const handleCancel = () => {
    if (tutorInfo) {
      setFormData({
        name: tutorInfo.name || tutorInfo.full_name || '',
        email: tutorInfo.email || '',
        role: tutorInfo.role || 'Tutor',
        phone: tutorInfo.phone || '',
        subject: tutorInfo.subject || '',
        experience: tutorInfo.experience || '',
        bio: tutorInfo.bio || '',
        qualification: tutorInfo.qualification || ''
      });
      setImagePreview(tutorInfo.profileImage);
    }
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('tutorAuthToken');
    localStorage.removeItem('tutorInfo');
    navigate('/tutor/login');
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
            {disabled && <Check className="w-4 h-4 ml-2 text-gray-400" />}
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
    <div className="min-h-screen bg-[#f2fbf6] w-full flex flex-col">
      <Header />

      {/* Main container */}
      <div className="flex flex-1 w-full">
        {/* Sidebar - matching TutorHome style exactly */}
        <aside className="w-64 bg-white mx-4 my-6 rounded-2xl shadow-md flex flex-col items-center py-8">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <img
              src={imagePreview || `https://ui-avatars.com/api/?name=${formData.name}&background=0ea5e9&color=fff`}
              alt="Tutor Profile"
              className="w-full h-full rounded-full object-cover shadow"
            />
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
          <div className="mt-4 text-sky-500 font-semibold text-lg">{formData.name || 'Tutor Name'}</div>
          <button className="mt-2 px-4 py-1 bg-sky-50 rounded-full text-sky-600 text-sm border flex items-center gap-1 hover:bg-sky-100 transition">
            Share Profile
          </button>
          <ul className="w-full mt-6">
            <li 
              onClick={() => navigate('/tutor/home')}
              className="flex items-center px-8 py-2 text-sky-500 hover:bg-sky-50 rounded-l-full cursor-pointer mb-1"
            >
              <FaChartBar className="mr-3" /> Dashboard
            </li>
            <li className="flex items-center px-8 py-2 bg-sky-500 text-white rounded-l-full font-semibold mb-1">
              <FaUser className="mr-3" /> Profile
            </li>
            <li 
              onClick={() => navigate('/tutor/courses')}
              className="flex items-center px-8 py-2 text-sky-500 hover:bg-sky-50 rounded-l-full cursor-pointer mb-1"
            >
              <FaBook className="mr-3" /> Courses
            </li>
            <li className="flex items-center px-8 py-2 text-sky-500 hover:bg-sky-50 rounded-l-full cursor-pointer mb-1">
              <FaChartBar className="mr-3" /> Revenues
            </li>
            <li className="flex items-center px-8 py-2 text-sky-500 hover:bg-sky-50 rounded-l-full cursor-pointer mb-1">
              <FaComments className="mr-3" /> Chat & video
            </li>
            <li 
              onClick={handleLogout}
              className="flex items-center px-8 py-2 text-sky-500 hover:bg-sky-50 rounded-l-full cursor-pointer"
            >
              <FaSignOutAlt className="mr-3" /> LogOut
            </li>
          </ul>
          <button className="mt-8 bg-sky-500 text-white px-8 py-3 rounded-full flex items-center gap-2 text-lg font-semibold shadow hover:bg-sky-600 transition">
            <FaPlus /> Add New Course
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 my-6 mr-4">
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
                      className="border-sky-500 text-sky-500 hover:bg-sky-50 px-4 py-2 text-sm"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-6">
                {renderField('Full Name', 'name', 'text', 'Enter tutor name')}
                {renderField('Email', 'email', 'email', 'Enter tutor email')}
                {renderField('Role', 'role', 'text', 'Tutor role', true)}
                {renderField('Phone', 'phone', 'tel', 'Enter phone number')}
                {renderField('Subject', 'subject', 'text', 'Enter teaching subject')}
                {renderField('Experience', 'experience', 'text', 'Years of experience')}
                {renderField('Qualification', 'qualification', 'text', 'Enter qualifications')}
                {renderField('Bio', 'bio', 'textarea', 'Tell about yourself...')}
              </div>
            </Card>

            {/* Tutor Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Teaching Statistics</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-sky-50 rounded-lg">
                  <div className="text-2xl font-bold text-sky-500">45</div>
                  <div className="text-sm text-gray-600">Students</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">12</div>
                  <div className="text-sm text-gray-600">Courses</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">4.8</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">120</div>
                  <div className="text-sm text-gray-600">Hours</div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Quick Actions</h4>
                <Button 
                  onClick={() => navigate('/tutor/home')}
                  className="w-full bg-sky-500 hover:bg-sky-600"
                >
                  Go to Dashboard
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-sky-500 text-sky-500 hover:bg-sky-50"
                >
                  View My Courses
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-green-500 text-green-600 hover:bg-green-50"
                >
                  Create New Course
                </Button>
              </div>
            </Card>
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}