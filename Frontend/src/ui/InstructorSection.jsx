import React from "react";
import Tutor from "../assets/Tutor.svg";
import Student from "../assets/Student.svg";
import Button from "./Button";
import { ArrowRight } from 'lucide-react';

export default function InstructorSection({ handleTutor }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-24">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 order-2 md:order-1">
          <p className="text-green-500 font-semibold">Join Us</p>
          <h2 className="text-3xl font-bold">Become an Instructor</h2>
          <p className="text-gray-600">
            Instructors from around the world teach millions of students on Byway. We provide the tools and skills to teach what you love.
          </p>
          <Button onClick={handleTutor} className="flex items-center group bg-black text-white px-4 py-2 rounded-md">
            Start Your Instructor Journey
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        <div className="relative order-1 md:order-2">
          <img src={Tutor} alt="Instructor" className="rounded-[2.5rem] w-full object-cover" />
        </div>
      </div>
      {/* Students CTA */}
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="relative">
          <img src={Student} alt="Student" className="rounded-[2.5rem] w-full object-cover" />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Transform your life through education</h2>
          <p className="text-gray-600">
            Learners around the world are launching new careers, advancing in their fields, and enriching their lives.
          </p>
          <Button className="flex items-center group bg-black text-white px-4 py-2 rounded-md">
            Checkout Courses
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
}