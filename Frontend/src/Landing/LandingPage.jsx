import React, { useState, useEffect } from "react";
import Button from "../ui/Button";
import Card from "../ui/Card";
import FeatureTabs from "../ui/FeatureTabs";
import AboutSection from "../ui/AboutSection";
import StatsSection from "../ui/StatsSection";
import CategoryCards from "../ui/CategoryCards";
import CourseSections from "../ui/CourseSections";
import Testimonials from "../ui/Testimonials";
import TeamSection from "../ui/TeamSection";
import Footer from "../ui/Footer";
import LoadingPage from "../ui/LoadingPage";
import HeroImg from "../assets/banner.png";
import OfficeImg from "../assets/Office.svg";
import AboutImg from "../assets/grapics.jpg";
import USER1 from "../assets/User1.jpg";

// Demo data:
const courses = [
  { title: "React for Beginners", img: HeroImg },
  { title: "UI/UX Masterclass", img: AboutImg },
  { title: "Data Science Bootcamp", img: USER1 },
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
            {["Home", "About", "Courses", "Contact"].map(link => (
              <a key={link} href="#" className="font-medium hover:text-cyan-600">{link}</a>
            ))}
          </nav>
          <Button className="ml-6 hidden md:inline-flex">Login</Button>
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
              <Button variant="outline">Register</Button>
              <Button>Login</Button>
            </div>
          </div>
          <div className="relative">
            <img src={HeroImg} className="rounded-3xl w-full max-w-lg mx-auto" alt="Hero" />
          </div>
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
          <CourseSections courses={courses} />
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
