import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaUser, FaBook, FaChartBar, FaComments, FaSignOutAlt, FaUpload } from "react-icons/fa";
import Header from "./Common/Header";
import Footer from "./Common/Footer";
import Swal from "sweetalert2";
import { courseService } from "../../services/courseService";

const profileImage = "https://randomuser.me/api/portraits/men/75.jpg";

export default function AddCourse() {
    const navigate = useNavigate();
    const [tutorName, setTutorName] = useState("Jhony");
    const [courseData, setCourseData] = useState({
        title: "",
        category: "",
        regularPrice: "",
        offerPercentage: "",
        description: "",
        image: null
    });

    useEffect(() => {
        const tutorInfo = localStorage.getItem("tutorInfo");
        if (tutorInfo) {
            try {
                const parsedInfo = JSON.parse(tutorInfo);
                if (parsedInfo.name) {
                    setTutorName(parsedInfo.name);
                }
            } catch (error) {
                console.error("Failed to parse tutorInfo from localStorage", error);
            }
        }
    }, []);

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "You will be logged out of your account.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, logout!",
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem("tutorAuthToken");
                localStorage.removeItem("tutorInfo");

                Swal.fire({
                    icon: "success",
                    title: "Logged out!",
                    text: "You have successfully logged out.",
                    timer: 1500,
                    showConfirmButton: false,
                });

                setTimeout(() => {
                    navigate("/tutor/login");
                }, 1500);
            }
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCourseData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid File Type',
                    text: 'Please select an image file (JPG, PNG, etc.)',
                });
                return;
            }
            
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                Swal.fire({
                    icon: 'error',
                    title: 'File Too Large',
                    text: 'Please select an image smaller than 5MB',
                });
                return;
            }
            
            setCourseData(prev => ({
                ...prev,
                image: file
            }));
            
            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'Image Selected!',
                text: `Selected: ${file.name}`,
                timer: 2000,
                showConfirmButton: false
            });
        }
    };

    const handleAddCourseLessons = () => {
        navigate('/tutor/add-course-lessons');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!courseData.title || !courseData.description || !courseData.category || !courseData.regularPrice) {
            Swal.fire({
                icon: 'error',
                title: 'Missing Information',
                text: 'Please fill in all required fields',
            });
            return;
        }
        
        if (!courseData.image) {
            Swal.fire({
                icon: 'error',
                title: 'Missing Image',
                text: 'Please select a cover image for your course',
            });
            return;
        }
        
        try {
            // Test authentication first
            console.log('Testing authentication...');
            await courseService.testAuth();
            console.log('Authentication successful');
            
            // Show loading
            Swal.fire({
                title: 'Creating Course...',
                text: 'Please wait while we create your course',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            // Create course using the API
            const response = await courseService.createCourse(courseData);
            
            Swal.fire({
                icon: 'success',
                title: 'Course Created!',
                text: 'Your course has been created successfully.',
                timer: 2000,
                showConfirmButton: false
            }).then(() => {
                // Store course ID for adding lessons
                localStorage.setItem('currentCourseId', response.course.id);
                navigate('/tutor/add-course-lessons');
            });
            
        } catch (error) {
            console.error('Error creating course:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error Creating Course',
                text: error.message || 'Something went wrong. Please try again.',
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#f2fbf6] w-full flex flex-col">
            <Header />

            {/* Main container */}
            <div className="flex flex-1 w-full">
                {/* Sidebar - matching TutorHome style exactly */}
                <aside className="w-64 bg-white mx-4 my-6 rounded-2xl shadow-md flex flex-col items-center py-8">
                    <img src={profileImage} className="w-24 h-24 rounded-full shadow" alt="profile" />
                    <div className="mt-4 text-sky-500 font-semibold text-lg">{tutorName}</div>
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
                        <li
                            onClick={() => navigate('/tutor/profile')}
                            className="flex items-center px-8 py-2 text-sky-500 hover:bg-sky-50 rounded-l-full cursor-pointer mb-1"
                        >
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
                        <li className="flex items-center px-8 py-2 text-sky-500 hover:bg-sky-50 rounded-l-full cursor-pointer mb-1">
                            <FaBook className="mr-3" /> Quiz
                        </li>
                        <li
                            onClick={handleLogout}
                            className="flex items-center px-8 py-2 text-sky-500 hover:bg-sky-50 rounded-l-full cursor-pointer"
                        >
                            <FaSignOutAlt className="mr-3" /> LogOut
                        </li>
                    </ul>
                </aside>

                {/* Main Content */}
                <main className="flex-1 my-6 mr-4">
                    <div className="rounded-2xl shadow-md px-8 py-6 bg-white border-4 border-[#b8eec4]/30">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 text-center">Add New Course</h1>
                        </div>

                        {/* Add Course Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Course Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Course Title
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={courseData.title}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-green-50 border border-green-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                            placeholder="Enter course title"
                                            required
                                        />
                                    </div>

                                    {/* Course Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Course Category
                                        </label>
                                        <select
                                            name="category"
                                            value={courseData.category}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-green-50 border border-green-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            <option value="development">Development</option>
                                            <option value="design">Design</option>
                                            <option value="marketing">Marketing</option>
                                            <option value="business">Business</option>
                                            <option value="data-science">Data Science</option>
                                            <option value="photography">Photography</option>
                                            <option value="music">Music</option>
                                        </select>
                                    </div>

                                    {/* Regular Price */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Regular Price
                                        </label>
                                        <input
                                            type="number"
                                            name="regularPrice"
                                            value={courseData.regularPrice}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-green-50 border border-green-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                            placeholder="Enter price"
                                            required
                                        />
                                    </div>

                                    {/* Offer Percentage */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Offer Percentage
                                        </label>
                                        <input
                                            type="number"
                                            name="offerPercentage"
                                            value={courseData.offerPercentage}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-green-50 border border-green-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                            placeholder="Enter offer percentage"
                                            min="0"
                                            max="100"
                                        />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Upload Cover Image */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Upload Cover Image *
                                        </label>
                                        <div className="w-full h-48 bg-green-50 border-2 border-dashed border-green-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-green-100 transition-colors">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                id="image-upload"
                                            />
                                            <label htmlFor="image-upload" className="cursor-pointer text-center">
                                                {courseData.image ? (
                                                    <>
                                                        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                            <FaUpload className="w-6 h-6 text-teal-600" />
                                                        </div>
                                                        <p className="text-teal-600 font-medium">Image Selected!</p>
                                                        <p className="text-sm text-gray-600 mt-1">{courseData.image.name}</p>
                                                        <p className="text-xs text-gray-400 mt-1">Click to change</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaUpload className="w-8 h-8 text-teal-500 mx-auto mb-2" />
                                                        <p className="text-teal-600 font-medium">Upload cover image</p>
                                                        <p className="text-sm text-gray-500 mt-1">Drop your file here</p>
                                                        <p className="text-xs text-gray-400 mt-1">JPG, PNG (Max 5MB)</p>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            name="description"
                                            value={courseData.description}
                                            onChange={handleInputChange}
                                            rows={6}
                                            className="w-full px-4 py-3 bg-green-50 border border-green-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                                            placeholder="Enter course description"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-center mt-8">
                                <button
                                    type="submit"
                                    className="bg-sky-500 text-white px-12 py-3 rounded-full font-semibold shadow hover:bg-sky-600 transition text-lg"
                                >
                                    Create Course & Add Lessons
                                </button>
                            </div>


                        </form>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}