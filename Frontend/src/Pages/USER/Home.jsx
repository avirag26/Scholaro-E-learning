import React, { useState, useEffect } from "react";
import { 
  Star,
  Monitor,
  Palette,
  Database,
  Briefcase,
} from "lucide-react";

import Banner from "../../assets/banner.png";
import Card from "../../ui/Card";

import avatar from "../../assets/avt.webp";
import Header from "./Common/Header"; // Using separate Header
import Footer from "./Common/Footer"; // Using separate Footer
import { MdFavoriteBorder } from "react-icons/md";

export default function UserHomePage() {
  // Use static user data
  const user = { full_name: "Aviral", profileImage: avatar };
  // Disable theme toggling by fixing theme value to 'light'
  const [theme] = useState("light");
  const [isOpen, setIsOpen] = useState(false); // State for sidebar

  // Remove any dark class on root so dark mode never applies
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("dark");
    root.classList.add("light");
  }, []);

  // Static course data
  const courses = [
    { _id: '1', title: 'React for Beginners', course_thumbnail: 'https://via.placeholder.com/400x200', tutor: { full_name: 'John Doe' }, rating: 4.5, reviews: { length: 120 }, price: 499, offer_percentage: 10 },
    { _id: '2', title: 'Advanced CSS and Sass', course_thumbnail: 'https://via.placeholder.com/400x200', tutor: { full_name: 'Jane Smith' }, rating: 4.8, reviews: { length: 250 }, price: 799, offer_percentage: 20 },
    { _id: '3', title: 'JavaScript: The Hard Parts', course_thumbnail: 'https://via.placeholder.com/400x200', tutor: { full_name: 'Will Sentance' }, rating: 4.9, reviews: { length: 500 }, price: 999, offer_percentage: 0 },
    { _id: '4', title: 'Node.js, Express, MongoDB', course_thumbnail: 'https://via.placeholder.com/400x200', tutor: { full_name: 'Jonas S.' }, rating: 4.7, reviews: { length: 450 }, price: 899, offer_percentage: 15 },
    { _id: '5', title: 'Python for Everybody', course_thumbnail: 'https://via.placeholder.com/400x200', tutor: { full_name: 'Charles Severance' }, rating: 4.9, reviews: { length: 1000 }, price: 0, offer_percentage: 0 },
    { _id: '6', title: 'UI/UX Design Fundamentals', course_thumbnail: 'https://via.placeholder.com/400x200', tutor: { full_name: 'Gary Simon' }, rating: 4.6, reviews: { length: 300 }, price: 699, offer_percentage: 5 },
  ];

  // Categories data with sky blue instead of green
  const categories = [
    { title: "Design", icon: Palette, color: "sky", courses: 11 },
    { title: "Development", icon: Monitor, color: "blue", courses: 11 },
    { title: "Data Science", icon: Database, color: "purple", courses: 11 },
    { title: "Business", icon: Briefcase, color: "orange", courses: 11 },
  ];

  // Update color mappings to use sky blue instead of green
  const categoryColorClasses = {
    sky: { bg: "bg-sky-100", text: "text-sky-500" },
    blue: { bg: "bg-blue-100", text: "text-blue-500" },
    purple: { bg: "bg-purple-100", text: "text-purple-500" },
    orange: { bg: "bg-orange-100", text: "text-orange-500" },
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={user}
          theme={theme}
          onMenuClick={() => setIsOpen(!isOpen)}
          onToggle={() => {}} // Disable toggle
        />

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto scrollbar-hide">
          {/* Welcome Section */}
          <section className="container mx-auto px-4 py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
                  Welcome,{" "}
                  <span className="text-sky-500">
                    {user?.full_name || "Guest"}
                  </span>
                </h1>
                <p className="text-xl text-gray-600">
                  Continue your learning journey with personalized courses and
                  activities.
                </p>

                <h1 className="text-5xl font-bold leading-tight">
                  You bring the{" "}
                  <span className="text-sky-500">expertise</span>, we'll make
                  it unforgettable.
                </h1>
                <p className="text-gray-600 text-lg max-w-md">
                  Using highly personalised activities, videos and animations
                  you can energize your students and motivate them to achieve
                  their learning goals as they progress through a journey.
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-sky-500 rounded-full filter blur-3xl opacity-20"></div>
                <img
                  alt="Learning illustration"
                  className="relative rounded-3xl w-full max-w-md mx-auto"
                  src={Banner}
                />
              </div>
            </div>
          </section>

          {/* Course Cards */}
          <section className="container mx-auto px-4 py-20">
            <div className="space-y-12">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  All Courses
                </h2>
                <a href="#" className="text-sky-500 hover:underline">See All</a>
              </div>
              <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="flex-none w-[300px]"
                  >
                    <div className="h-full border rounded-lg overflow-hidden hover:shadow-md transition-shadow relative">
                      <img
                        src={
                          course.course_thumbnail ||
                          "https://via.placeholder.com/400x200"
                        }
                        alt={course.title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                        <MdFavoriteBorder className="w-6 h-6" />
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium mb-2">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <img
                            src={
                              course.tutor?.profile_image ||
                              "https://via.placeholder.com/40"
                            }
                            alt={course.tutor?.full_name || "Tutor"}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-sm text-gray-600">
                            {course.tutor?.full_name || "Unknown Tutor"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(course.rating || 0) ? "fill-current" : ""}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            ({course.reviews?.length || 0} reviews)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sky-500 font-semibold">
                            ₹
                            {Math.round(
                              course.price -
                              course.price *
                              ((course.offer_percentage || 0) / 100)
                            )}
                          </span>
                          {course.offer_percentage > 0 && (
                            <>
                              <span className="text-gray-400 line-through text-sm">
                                ₹{course.price}
                              </span>
                              <span className="bg-sky-100 text-sky-600 text-xs px-2 py-1 rounded">
                                {course.offer_percentage}% OFF
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Categories Grid */}
          <section className="container mx-auto px-4 py-20">
            <div className="space-y-12">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  Explore Categories
                </h2>
                <a href="#" className="text-sky-500 hover:underline">
                  See All
                </a>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((category, index) => (
                  <Card
                    key={index}
                    className="p-6 space-y-4 flex flex-col items-center justify-center bg-white"
                  >
                    <div
                      className={`h-12 w-12 ${categoryColorClasses[category.color]?.bg || 'bg-gray-100'} rounded-lg flex items-center justify-center`}
                    >
                      <category.icon
                        className={`h-6 w-6 ${categoryColorClasses[category.color]?.text || 'text-gray-500'}`}
                      />
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold">
                        {category.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {category.courses} Courses
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
          <Footer />
        </div>
      </div>
    </div>
  );
}
