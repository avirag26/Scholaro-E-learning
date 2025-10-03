import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Common/Header";
import Footer from "./Common/Footer";
import CourseSection from "../../ui/CourseSection";
import CategoryCard from "../../ui/CategoryCard";
import { featuredCourses, categories, recommendedCourses, popularCourses } from "../../data/coursesData";

export default function UserCourses() {
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const authToken = localStorage.getItem('authToken');
        const storedUserInfo = localStorage.getItem('userInfo');

        if (!authToken) {
            navigate('/user/login');
            return;
        }

        if (storedUserInfo) {
            setUser(JSON.parse(storedUserInfo));
        }
    }, [navigate]);

    const handleThemeToggle = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleMenuClick = () => {
        // Handle mobile menu toggle if needed
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header
                user={user}
                theme={theme}
                onToggle={handleThemeToggle}
                onMenuClick={handleMenuClick}
            />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, ready for your next lesson?
                    </h2>
                    <p className="text-gray-600">Choose from over 100+ courses and start learning today</p>
                </div>

                {/* Featured Courses */}
                <CourseSection courses={featuredCourses} featured={true} />

                {/* Categories Section */}
                <section className="mb-12">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                        Choose favourite course from top category
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category.name}
                                category={category}
                                isSelected={selectedCategory === category.name}
                                onClick={() => setSelectedCategory(category.name)}
                            />
                        ))}
                    </div>
                </section>

                {/* Recommended Courses */}
                <CourseSection
                    title="Recommended for you"
                    courses={recommendedCourses}
                />

                {/* Popular Courses */}
                <CourseSection
                    title="Popular Courses"
                    courses={popularCourses}
                />

                {/* Top Rated Courses */}
                <CourseSection
                    title="Top Rated Courses"
                    courses={popularCourses.slice().reverse()}
                />
            </div>

            <Footer />
        </div>
    );
}