import React, { useState, useEffect } from "react";
import {useNavigate ,Link} from 'react-router-dom'
import Button from "../ui/Button";
import Card from "../ui/Card";
import FeatureTabs from "../ui/FeatureTabs";
import AboutSection from "../ui/AboutSection";
import StatsSection from "../ui/StatsSection";
import CategoryCards from "../ui/CategoryCards";
import CourseSections from "../ui/CourseSections";
import Testimonials from "../ui/Testimonials";
import TeamSection from "../ui/TeamSection";
import Footer from '../Pages/TUTOR/Common/Footer'
import LoadingPage from "../ui/LoadingPage";
import HeroImg from "../assets/banner.png";
import OfficeImg from "../assets/Office.svg";
import AboutImg from "../assets/grapics.jpg";
import USER1 from "../assets/User1.jpg";
import { MdFavoriteBorder } from "react-icons/md";
import { Star } from "lucide-react";



// Demo data:
const courses = [
  // { title: "React for Beginners", img: HeroImg },
  // { title: "UI/UX Masterclass", img: AboutImg },
  // { title: "Data Science Bootcamp", img: USER1 },

  
    { _id: '1', title: 'React for Beginners', course_thumbnail: 'https://via.placeholder.com/400x200', tutor: { full_name: 'John Doe' }, rating: 4.5, reviews: { length: 120 }, price: 499, offer_percentage: 10 },
    { _id: '2', title: 'Advanced CSS and Sass', course_thumbnail: 'https://via.placeholder.com/400x200', tutor: { full_name: 'Jane Smith' }, rating: 4.8, reviews: { length: 250 }, price: 799, offer_percentage: 20 },
    { _id: '3', title: 'JavaScript: The Hard Parts', course_thumbnail: 'https://via.placeholder.com/400x200', tutor: { full_name: 'Will Sentance' }, rating: 4.9, reviews: { length: 500 }, price: 999, offer_percentage: 0 },
    { _id: '4', title: 'Node.js, Express, MongoDB', course_thumbnail: 'https://via.placeholder.com/400x200', tutor: { full_name: 'Jonas S.' }, rating: 4.7, reviews: { length: 450 }, price: 899, offer_percentage: 15 },
    { _id: '5', title: 'Python for Everybody', course_thumbnail: 'https://via.placeholder.com/400x200', tutor: { full_name: 'Charles Severance' }, rating: 4.9, reviews: { length: 1000 }, price: 0, offer_percentage: 0 },
    { _id: '6', title: 'UI/UX Design Fundamentals', course_thumbnail: 'https://via.placeholder.com/400x200', tutor: { full_name: 'Gary Simon' }, rating: 4.6, reviews: { length: 300 }, price: 699, offer_percentage: 5 },
  

];
const testimonials = [
  { name: "Jane Doe", img: USER1, quote: "Amazing content and support!", role: "Student" },
  { name: "Alex Smith", img: USER1, quote: "Best platform for remote learning.", role: "Software Developer" }
];
const instructors = [
  { name: "Sarah Smith", img: USER1, role: "React Instructor" },
  { name: "Tom Allen", img: USER1, role: "Data Science Mentor" }
];

export default function LandingPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);
  if (loading) return <LoadingPage />;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header and Hero */}
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto flex items-center h-16 px-4">
          <div className="font-bold text-2xl text-cyan-600">EduSphere</div>
          <nav className="ml-auto hidden md:flex gap-6">
            {[
              {name:"Home", path:"/"},
              {name:"Courses", path:"/notfound"},
              {name:"About", path:"/notfound"},
              {name:"Contact", path:"/notfound"},
            ].map((link) => (
              <Link key={link.name} to={link.path} className="text-gray-700 hover:text-cyan-600 transition">
                {link.name}
              </Link>
            ))}
          </nav>
          <Button className="ml-6 hidden md:inline-flex" onClick={()=>navigate('user/Login')}>Login</Button>
        </div>
      </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 py-12 items-center px-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
              You bring the <span className="text-cyan-600">expertise</span>, we'll make it unforgettable.
            </h1>
            <p className="mb-8 text-lg text-gray-700">
              Energize and motivate your students with personalized content as they progress on their learning journey.
            </p>
            <div className="flex gap-4">
              <Button variant="outline" onClick={()=>navigate('/user/register')}>Register</Button>
              <Button  onClick={()=>navigate('user/login')}>Login</Button>
            </div>
          </div>
          <div className="relative">
            <img src={HeroImg} className="rounded-3xl w-full max-w-lg mx-auto" alt="Hero" />
          </div>
        </section>
         <section className="max-w-3xl mx-auto my-12 px-6 py-10 bg-cyan-50 rounded-3xl shadow-lg flex flex-col items-center">
  <img
    src={OfficeImg}  // Replace with your logo import if different
    alt="Tutor Logo"
    className="w-24 h-24 mb-4 rounded-full border-4 border-cyan-600 shadow"
  />
  <h2 className="text-3xl font-extrabold text-cyan-700 mb-4 text-center">
    Become a Tutor on EduSphere
  </h2>
  <p className="text-lg text-gray-700 mb-8 text-center">
    Share your knowledge, inspire thousands of learners, and grow your career as a top educator.
  </p>
  <Button
    className="bg-cyan-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow hover:bg-cyan-700 transition"
    onClick={() => navigate('/tutor/register')}
  >
    Sign Up as a Tutor
  </Button>
</section>
        {/* Feature Tabs */}
        <FeatureTabs />
        {/* About */}
        <AboutSection officeImg={OfficeImg} aboutImg={AboutImg} />
        {/* Stats */}
        <StatsSection />



        {/* Categories */}
        <CategoryCards />
        {/* Courses */}
        <section className="max-w-6xl mx-auto px-4 py-10">
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
        </section>
        {/* Testimonials */}
        <Testimonials testimonials={testimonials} />
        {/* Instructors */}
        <TeamSection instructors={instructors} />
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
}