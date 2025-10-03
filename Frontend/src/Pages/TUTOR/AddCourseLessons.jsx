import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaUser, FaBook, FaChartBar, FaComments, FaSignOutAlt, FaUpload, FaPlay, FaTrash, FaEdit } from "react-icons/fa";
import Header from "./Common/Header";
import Footer from "./Common/Footer";
import Swal from "sweetalert2";
import { courseService } from "../../services/courseService";

const profileImage = "https://randomuser.me/api/portraits/men/75.jpg";

export default function AddCourseLessons() {
    const navigate = useNavigate();
    const [tutorName, setTutorName] = useState("Jhony");
    const [courseId, setCourseId] = useState(null);
    const [lessonData, setLessonData] = useState({
        title: "",
        position: 1,
        video: null,
        pdfNotes: null
    });
    const [lessons, setLessons] = useState([]);

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
        
        // Get course ID from localStorage
        const currentCourseId = localStorage.getItem('currentCourseId');
        if (currentCourseId) {
            setCourseId(currentCourseId);
        } else {
            // If no course ID, redirect to add course
            Swal.fire({
                icon: 'warning',
                title: 'No Course Found',
                text: 'Please create a course first before adding lessons.',
            }).then(() => {
                navigate('/tutor/add-course');
            });
        }
    }, [navigate]);

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
        setLessonData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleVideoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('video/')) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid File Type',
                    text: 'Please select a video file (MP4, MOV, etc.)',
                });
                return;
            }
            
            // Validate file size (100MB limit)
            if (file.size > 100 * 1024 * 1024) {
                Swal.fire({
                    icon: 'error',
                    title: 'File Too Large',
                    text: 'Please select a video smaller than 100MB',
                });
                return;
            }
            
            setLessonData(prev => ({
                ...prev,
                video: file
            }));
            
            console.log('Video file selected:', file.name, file.size);
        }
    };

    const handlePdfUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (file.type !== 'application/pdf') {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid File Type',
                    text: 'Please select a PDF file',
                });
                return;
            }
            
            // Validate file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                Swal.fire({
                    icon: 'error',
                    title: 'File Too Large',
                    text: 'Please select a PDF smaller than 10MB',
                });
                return;
            }
            
            setLessonData(prev => ({
                ...prev,
                pdfNotes: file
            }));
            
            console.log('PDF file selected:', file.name, file.size);
        }
    };

    const handleAddLesson = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!lessonData.title || !lessonData.position || !lessonData.video) {
            Swal.fire({
                icon: 'error',
                title: 'Missing Information',
                text: 'Please fill in all required fields and upload a video.',
            });
            return;
        }
        
        if (!courseId) {
            Swal.fire({
                icon: 'error',
                title: 'No Course Selected',
                text: 'Please create a course first.',
            });
            return;
        }
        
        try {
            // Show loading
            Swal.fire({
                title: 'Adding Lesson...',
                text: 'Please wait while we upload your lesson',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
            
            // Add lesson using the API
            const response = await courseService.addLesson(courseId, lessonData);
            
            // Add new lesson to the list
            const newLesson = {
                id: response.lesson._id,
                title: response.lesson.title,
                instructor: tutorName,
                image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
                duration: response.lesson.duration || "02:30 Hour"
            };
            
            setLessons([...lessons, newLesson]);
            
            // Reset form
            setLessonData({
                title: "",
                position: lessons.length + 2,
                video: null,
                pdfNotes: null
            });
            
            Swal.fire({
                icon: 'success',
                title: 'Lesson Added!',
                text: 'Your lesson has been added successfully.',
                timer: 2000,
                showConfirmButton: false
            });
            
        } catch (error) {
            console.error('Error adding lesson:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error Adding Lesson',
                text: error.message || 'Something went wrong. Please try again.',
            });
        }
    };

    const handleDeleteLesson = (lessonId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                setLessons(lessons.filter(lesson => lesson.id !== lessonId));
                Swal.fire("Deleted!", "Your lesson has been deleted.", "success");
            }
        });
    };

    const handleEditLesson = (lessonId) => {
        console.log("Edit lesson:", lessonId);
        // Navigate to edit lesson page or open edit modal
    };

    const handleSubmitCourse = () => {
        if (lessons.length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'No Lessons Added',
                text: 'Please add at least one lesson before submitting the course.',
            });
            return;
        }
        
        Swal.fire({
            title: 'Submit Course?',
            text: `Your course with ${lessons.length} lesson(s) will be submitted for review.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, submit it!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Clear the course ID from localStorage
                localStorage.removeItem('currentCourseId');
                
                Swal.fire({
                    icon: 'success',
                    title: 'Course Submitted!',
                    text: 'Your course has been submitted successfully and is pending approval.',
                    timer: 3000,
                    showConfirmButton: false
                }).then(() => {
                    navigate('/tutor/courses');
                });
            }
        });
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
                    <button
                        onClick={() => navigate('/tutor/add-course')}
                        className="mt-8 bg-sky-500 text-white px-8 py-3 rounded-full flex items-center gap-2 text-lg font-semibold shadow hover:bg-sky-600 transition"
                    >
                        <FaPlus /> Add New Course
                    </button>
                </aside>

                {/* Main Content */}
                <main className="flex-1 my-6 mr-4">
                    <div className="rounded-2xl shadow-md px-8 py-6 bg-white border-4 border-[#b8eec4]/30">
                        {/* Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 text-center">Add New Lesson</h1>
                        </div>

                        {/* Add Lesson Form */}
                        <form onSubmit={handleAddLesson} className="mb-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Left Column */}
                                <div className="space-y-6">
                                    {/* Lesson Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Lesson Title
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={lessonData.title}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-green-50 border border-green-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                            placeholder="Enter lesson title"
                                            required
                                        />
                                    </div>

                                    {/* Lesson Position */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Lesson Position
                                        </label>
                                        <input
                                            type="number"
                                            name="position"
                                            value={lessonData.position}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 bg-green-50 border border-green-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                                            placeholder="Enter lesson position"
                                            required
                                        />
                                    </div>

                                    {/* Upload Video */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Upload Video
                                        </label>
                                        <div className="w-full h-32 bg-green-50 border-2 border-dashed border-green-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-green-100 transition-colors">
                                            <input
                                                type="file"
                                                accept="video/*"
                                                onChange={handleVideoUpload}
                                                className="hidden"
                                                id="video-upload"
                                            />
                                            <label htmlFor="video-upload" className="cursor-pointer text-center">
                                                {lessonData.video ? (
                                                    <>
                                                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                            <FaPlay className="w-4 h-4 text-teal-600" />
                                                        </div>
                                                        <p className="text-teal-600 font-medium">Video Selected!</p>
                                                        <p className="text-sm text-gray-600 mt-1">{lessonData.video.name}</p>
                                                        <p className="text-xs text-gray-400 mt-1">Click to change</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaPlay className="w-6 h-6 text-teal-500 mx-auto mb-2" />
                                                        <p className="text-teal-600 font-medium">Upload Video</p>
                                                        <p className="text-sm text-gray-500 mt-1">Drop your video file here</p>
                                                        <p className="text-xs text-gray-400 mt-1">MP4, MOV (Max 100MB)</p>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-6">
                                    {/* Upload PDF Notes */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Upload PDF notes
                                        </label>
                                        <div className="w-full h-48 bg-green-50 border-2 border-dashed border-green-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-green-100 transition-colors">
                                            <input
                                                type="file"
                                                accept=".pdf"
                                                onChange={handlePdfUpload}
                                                className="hidden"
                                                id="pdf-upload"
                                            />
                                            <label htmlFor="pdf-upload" className="cursor-pointer text-center">
                                                {lessonData.pdfNotes ? (
                                                    <>
                                                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                                                            <FaUpload className="w-4 h-4 text-teal-600" />
                                                        </div>
                                                        <p className="text-teal-600 font-medium">PDF Selected!</p>
                                                        <p className="text-sm text-gray-600 mt-1">{lessonData.pdfNotes.name}</p>
                                                        <p className="text-xs text-gray-400 mt-1">Click to change</p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaUpload className="w-8 h-8 text-teal-500 mx-auto mb-2" />
                                                        <p className="text-teal-600 font-medium">Upload PDF notes</p>
                                                        <p className="text-sm text-gray-500 mt-1">Drop your PDF file here</p>
                                                        <p className="text-xs text-gray-400 mt-2">PDF files only (Max 10MB)</p>
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                    </div>

                                    {/* Add Button */}
                                    <div className="flex justify-center pt-8">
                                        <button
                                            type="submit"
                                            className="bg-teal-500 text-white px-12 py-3 rounded-full font-semibold shadow hover:bg-teal-600 transition text-lg"
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>

                        {/* Lessons Section */}
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Lessons</h2>
                            
                            <div className="space-y-4">
                                {lessons.map((lesson) => (
                                    <div key={lesson.id} className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200">
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={lesson.image}
                                                alt={lesson.title}
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900 mb-1">{lesson.title}</h3>
                                                <p className="text-sm text-gray-600 mb-2">By {lesson.instructor}</p>
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-sm text-gray-500">Lesson Duration: {lesson.duration}</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col space-y-2">
                                                <button
                                                    onClick={() => handleEditLesson(lesson.id)}
                                                    className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm font-medium"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteLesson(lesson.id)}
                                                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Submit Course Button */}
                            <div className="flex justify-center mt-8">
                                <button
                                    onClick={handleSubmitCourse}
                                    className="bg-teal-500 text-white px-12 py-3 rounded-full font-semibold shadow hover:bg-teal-600 transition text-lg"
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}