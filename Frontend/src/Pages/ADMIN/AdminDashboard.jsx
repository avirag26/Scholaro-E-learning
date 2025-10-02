import { useState, useEffect } from 'react';
import { Bell, Search, ChevronDown, Download, FileText, Users, BookOpen, GraduationCap, DollarSign, TrendingUp, LogOut, User } from 'lucide-react';
import Button from '../../ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Mock data for the chart
const chartData = [
    { month: 'Jan', income: 45000, profit: 35000 },
    { month: 'Feb', income: 52000, profit: 38000 },
    { month: 'Mar', income: 48000, profit: 42000 },
    { month: 'Apr', income: 61000, profit: 45000 },
    { month: 'May', income: 77000, profit: 48000 },
    { month: 'Jun', income: 68000, profit: 52000 },
    { month: 'Jul', income: 72000, profit: 46000 },
    { month: 'Aug', income: 65000, profit: 49000 },
    { month: 'Sep', income: 78000, profit: 55000 },
    { month: 'Oct', income: 82000, profit: 51000 },
    { month: 'Nov', income: 75000, profit: 47000 },
    { month: 'Dec', income: 69000, profit: 43000 }
];

// Mock course data
const courseData = [
    {
        name: 'Web Development',
        students: 120,
        enrolled: 80,
        drafts: 5,
        rating: 4.5,
        notice: '₹2000',
        status: 'Published'
    },
    {
        name: 'Data Science',
        students: 95,
        enrolled: 60,
        drafts: 2,
        rating: 4.2,
        notice: '₹1800',
        status: 'Published'
    },
    {
        name: 'Graphic Design',
        students: 70,
        enrolled: 0,
        drafts: 3,
        rating: 3.9,
        notice: '₹2500',
        status: 'Inactive'
    }
];

export default function AdminDashboard() {
    const [dateFilter, setDateFilter] = useState('This Month');
    const [adminInfo, setAdminInfo] = useState(null);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Get admin info from localStorage
        const storedAdminInfo = localStorage.getItem('adminInfo');
        if (storedAdminInfo) {
            setAdminInfo(JSON.parse(storedAdminInfo));
        }
    }, []);

    const handleDownloadPDF = () => {
        console.log('Downloading PDF...');
        // Implement PDF download logic
    };

    const handleDownloadExcel = () => {
        console.log('Downloading Excel...');
        // Implement Excel download logic
    };

    const handleLogout = () => {
        // Clear admin data from localStorage
        localStorage.removeItem('adminAuthToken');
        localStorage.removeItem('adminInfo');

        // Show success message
        toast.success('Logged out successfully');

        // Redirect to login page
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
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
                                {adminInfo?.name?.charAt(0) || 'A'}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-sm min-h-screen">
                    {/* Profile Section */}
                    <div className="p-6 border-b">
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-sky-600 rounded-full flex items-center justify-center mb-3">
                                <span className="text-white text-2xl font-bold">
                                    {adminInfo?.name?.charAt(0) || 'A'}
                                </span>
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-1">
                                {adminInfo?.name || 'ADMIN'}
                            </h3>
                            <button 
                                onClick={() => navigate('/admin/profile')}
                                className="text-sky-500 text-sm hover:underline"
                            >
                                Profile
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="p-4">
                        <div className="space-y-2">
                            <button className="w-full text-left px-4 py-3 bg-sky-500 text-white rounded-lg font-medium">
                                Dashboard
                            </button>
                            <button 
                                onClick={() => navigate('/admin/profile')}
                                className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center"
                            >
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
                    {/* Dashboard Header */}
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
                        <div className="flex space-x-3">
                            <Button onClick={handleDownloadPDF} className="bg-sky-500 hover:bg-sky-600">
                                <Download className="w-4 h-4 mr-2" />
                                Download PDF
                            </Button>
                            <Button onClick={handleDownloadExcel} className="bg-sky-500 hover:bg-sky-600">
                                <FileText className="w-4 h-4 mr-2" />
                                Download Excel
                            </Button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Total Revenue</p>
                                    <p className="text-2xl font-bold text-gray-800">$200.00</p>
                                </div>
                                <DollarSign className="w-8 h-8 text-sky-500" />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Total Students</p>
                                    <p className="text-2xl font-bold text-gray-800">551</p>
                                </div>
                                <Users className="w-8 h-8 text-sky-500" />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Total Tutors</p>
                                    <p className="text-2xl font-bold text-gray-800">551</p>
                                </div>
                                <GraduationCap className="w-8 h-8 text-sky-500" />
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm">Total Courses</p>
                                    <p className="text-2xl font-bold text-gray-800">23</p>
                                </div>
                                <BookOpen className="w-8 h-8 text-sky-500" />
                            </div>
                        </div>
                    </div>

                    {/* Chart Section */}
                    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-gray-800">Income & Expense</h3>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Date filter</span>
                                <button className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded-lg text-sm">
                                    <span>{dateFilter}</span>
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-center space-x-4 text-sm">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
                                    <span>Income</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    <span>Profit</span>
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-gray-800 mt-2">$77,000</p>
                            <p className="text-sm text-gray-600">06 Projects</p>
                        </div>

                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Line
                                        type="monotone"
                                        dataKey="income"
                                        stroke="#14b8a6"
                                        strokeWidth={3}
                                        dot={false}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="profit"
                                        stroke="#eab308"
                                        strokeWidth={3}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Course Table */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Course Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Students
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Enrolled
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Drafts
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rating
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Notice
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {courseData.map((course, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {course.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {course.students}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {course.enrolled}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {course.drafts}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <span>{course.rating} stars</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {course.notice}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${course.status === 'Published'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {course.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12 mt-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4">About Scholaro</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                Empowering learners through accessible and engaging online education.
                            </p>
                            <p className="text-gray-400 text-sm leading-relaxed mt-2">
                                Byway is a leading online learning platform dedicated to providing high-quality, flexible, and affordable educational experiences.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Get Help</h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                                <li><a href="#" className="hover:text-white">Latest Articles</a></li>
                                <li><a href="#" className="hover:text-white">FAQ</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Programs</h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-white">Art & Design</a></li>
                                <li><a href="#" className="hover:text-white">Business</a></li>
                                <li><a href="#" className="hover:text-white">IT & Software</a></li>
                                <li><a href="#" className="hover:text-white">Languages</a></li>
                                <li><a href="#" className="hover:text-white">Programming</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                            <div className="text-sm text-gray-400 space-y-2">
                                <p>Address: 123 Main Street, Anytown, CA 12345</p>
                                <p>Tel: +1(123) 456-7890</p>
                                <p>Mail: bywayedu@webkul.in</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}