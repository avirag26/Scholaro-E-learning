import React from "react";
import Card from "./Card";
export default function CourseSections({ courses }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {courses.map(course => (
        <Card key={course.title} className="p-5 flex flex-col items-center gap-2">
          <img src={course.img} alt="" className="rounded-md w-16 h-16" />
          <div className="font-bold">{course.title}</div>
          <button className="bg-cyan-600 text-white px-3 py-1 rounded mt-2">Enroll Now</button>
        </Card>
      ))}
    </div>
  );
}