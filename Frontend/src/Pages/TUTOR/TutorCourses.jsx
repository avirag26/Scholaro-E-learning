import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaUser, FaBook, FaChartBar, FaComments, FaSignOutAlt, FaSearch } from "react-icons/fa";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Header from "./Common/Header";
import Footer from "./Common/Footer";
import Swal from "sweetalert2";
import { courseService } from "../../services/courseService";

const profileImage = "https://randomuser.me/api/portraits/men/75.jpg";



export default function TutorCourses() {
    const navigate = useNavigate();
    const [tutorName, setTutorName] = useState("Jhony");
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'listed', 'unlisted'
    const coursesPerPage = 3;

    useEffect(() => {
        const tutorInfo = localStorage.getItem("tutorInfo");
        const tutorToken = localStorage.getItem("tutorAuthToken");
        
        console.log('=== TUTOR COURSES DEBUG ===');
        console.log('Tutor Info:', tutorInfo);
        console.log('Tutor Token:', tutorToken ? 'Present' : 'Missing');
        
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
        
        // Load courses from API
        loadCourses();
    }, []);

    const loadCourses = async () => {
        try {
            setLoading(true);
            const response = await courseService.getTutorCourses();
            console.log('API Response:', response); // Debug log
            
            if (response.courses && response.courses.length > 0) {
                setCourses(response.courses.map(course => ({
                    id: course.id,
                    title: course.title,
                    description: course.description,
                    instructor: course.instructorName,
                    image: `http://localhost:5000${course.imageUrl}`, // Full URL for images
                    status: course.isApproved ? 'Active' : 'Pending',
                    progress: Math.floor(Math.random() * 100), // Mock progress for now
                    students: course.enrolledStudents || 0,
                    featured: false,
                    listed: course.isListed,
                    category: course.category,
                    regularPrice: course.regularPrice,
                    finalPrice: course.finalPrice,
                    totalLessons: course.totalLessons || 0,
                    rating: course.rating || 0
                })));
            } else {
                setCourses([]);
            }
        } catch (error) {
            console.error('Error loading courses:', error);
            // If there's an authentication error, don't show error popup
            if (error.message?.includes('expired') || error.message?.includes('authorized')) {
                return;
            }
            Swal.fire({
                icon: 'error',
                title: 'Error Loading Courses',
                text: 'Failed to load your courses. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

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

    const handleEditCourse = (courseId) => {
        console.log("Edit course:", courseId);
        // Navigate to edit course page or open edit modal
    };

    const handleDeleteCourse = (courseId) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await courseService.deleteCourse(courseId);
                    setCourses(courses.filter(course => course.id !== courseId));
                    Swal.fire("Deleted!", "Your course has been deleted.", "success");
                } catch (error) {
                    console.error('Error deleting course:', error);
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: error.message || 'Failed to delete course',
                    });
                }
            }
        });
    };

    const handleAddNewCourse = () => {
        navigate('/tutor/add-course');
    };

    const handleToggleListing = async (courseId) => {
        try {
            const response = await courseService.toggleCourseListing(courseId);
            
            // Update local state
            setCourses(courses.map(course => 
                course.id === courseId 
                    ? { ...course, listed: !course.listed }
                    : course
            ));
            
            Swal.fire({
                icon: 'success',
                title: response.message,
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error toggling course listing:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Failed to update course listing',
            });
        }
    };

    // Filter courses based on active filter
    const filteredCourses = courses.filter(course => {
        if (activeFilter === 'listed') return course.listed;
        if (activeFilter === 'unlisted') return !course.listed;
        return true; // 'all'
    });

    // Pagination logic
    const indexOfLastCourse = currentPage * coursesPerPage;
    const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

    // Reset to page 1 when filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeFilter]);

    const CourseCard = ({ course }) => (
        <div className={`bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 mb-4 ${course.featured ? 'border-2 border-blue-400' : 'border border-gray-200'}`}>
            <div className="flex items-center space-x-4">
                <img
                    src={course.image}
                    alt={course.title}
                    className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{course.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">By {course.instructor}</p>
                </div>
                <div className="flex flex-col space-y-2">
                    <button
                        onClick={() => handleToggleListing(course.id)}
                        className={`px-6 py-2 rounded-lg transition-colors text-sm font-medium ${course.listed
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                    >
                        {course.listed ? 'Unlist' : 'List'}
                    </button>
                    <button
                        onClick={() => handleEditCourse(course.id)}
                        className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm font-medium"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDeleteCourse(course.id)}
                        className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                        Delete
                    </button>
                </div>
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
                        <li className="flex items-center px-8 py-2 bg-sky-500 text-white rounded-l-full font-semibold mb-1">
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
                    <button
                        onClick={handleAddNewCourse}
                        className="mt-8 bg-sky-500 text-white px-8 py-3 rounded-full flex items-center gap-2 text-lg font-semibold shadow hover:bg-sky-600 transition"
                    >
                        <FaPlus /> Add New Course
                    </button>
                </aside>

                {/* Main Content */}
                <main className="flex-1 my-6 mr-4">
                    <div className="rounded-2xl shadow-md px-8 py-6 bg-white border-4 border-[#b8eec4]/30">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold text-sky-600">My Courses ({filteredCourses.length})</h1>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={loadCourses}
                                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                                >
                                    Refresh
                                </button>
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent w-64"
                                    />
                                </div>
                                <button
                                    onClick={handleAddNewCourse}
                                    className="bg-sky-500 text-white px-6 py-3 rounded-full flex items-center gap-2 font-semibold shadow hover:bg-sky-600 transition"
                                >
                                    <FaPlus /> Add New Course
                                </button>
                            </div>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex items-center space-x-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
                            <button
                                onClick={() => setActiveFilter('all')}
                                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${activeFilter === 'all'
                                    ? 'bg-white text-sky-600 shadow-sm'
                                    : 'text-gray-600 hover:text-sky-600'
                                    }`}
                            >
                                All Courses ({courses.length})
                            </button>
                            <button
                                onClick={() => setActiveFilter('listed')}
                                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${activeFilter === 'listed'
                                    ? 'bg-white text-sky-600 shadow-sm'
                                    : 'text-gray-600 hover:text-sky-600'
                                    }`}
                            >
                                Listed ({courses.filter(c => c.listed).length})
                            </button>
                            <button
                                onClick={() => setActiveFilter('unlisted')}
                                className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${activeFilter === 'unlisted'
                                    ? 'bg-white text-sky-600 shadow-sm'
                                    : 'text-gray-600 hover:text-sky-600'
                                    }`}
                            >
                                Unlisted ({courses.filter(c => !c.listed).length})
                            </button>
                        </div>

                        {/* Courses List */}
                        <div className="space-y-4 mb-8">
                            {loading ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
                                    <p className="text-gray-500">Loading your courses...</p>
                                </div>
                            ) : currentCourses.length > 0 ? (
                                currentCourses.map((course) => (
                                    <CourseCard key={course.id} course={course} />
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 text-6xl mb-4">📚</div>
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No courses found</h3>
                                    <p className="text-gray-500">
                                        {activeFilter === 'listed' && "No listed courses available."}
                                        {activeFilter === 'unlisted' && "No unlisted courses available."}
                                        {activeFilter === 'all' && "No courses available at the moment. Create your first course!"}
                                    </p>
                                    {activeFilter === 'all' && (
                                        <button
                                            onClick={() => navigate('/tutor/add-course')}
                                            className="mt-4 bg-sky-500 text-white px-6 py-2 rounded-lg hover:bg-sky-600 transition-colors"
                                        >
                                            Create Your First Course
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center space-x-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-full bg-sky-100 text-sky-600 hover:bg-sky-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                {[...Array(totalPages)].map((_, index) => (
                                    <button
                                        key={index + 1}
                                        onClick={() => setCurrentPage(index + 1)}
                                        className={`w-10 h-10 rounded-full font-medium transition-colors ${currentPage === index + 1
                                            ? 'bg-sky-500 text-white'
                                            : 'bg-sky-100 text-sky-600 hover:bg-sky-200'
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-full bg-sky-100 text-sky-600 hover:bg-sky-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}