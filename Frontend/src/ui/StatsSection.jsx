import React from "react";
export default function StatsSection() {
  const blocks = [
    { value: "250+", label: "Courses" },
    { value: "3500+", label: "Students" },
    { value: "15K+", label: "Tests" },
    { value: "240K+", label: "Hours" },
  ];
  return (
    <div className="bg-gray-900 py-10">
      <div className="flex justify-center gap-16 max-w-4xl mx-auto">
        {blocks.map(block => (
          <div key={block.label} className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-cyan-400">{block.value}</div>
            <div className="text-gray-300">{block.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}