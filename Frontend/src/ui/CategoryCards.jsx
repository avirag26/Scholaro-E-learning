import React from "react";
import Card from "./Card";
export default function CategoryCards() {
  const cats = [
    { label: "Design", color: "bg-fuchsia-100 text-fuchsia-600" },
    { label: "Development", color: "bg-cyan-100 text-cyan-600" },
    { label: "Database", color: "bg-green-100 text-green-600" },
    { label: "Business", color: "bg-orange-100 text-orange-600" },
  ];
  return (
    <section className="max-w-5xl mx-auto py-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl md:text-3xl font-bold">Top Categories</h2>
        <a className="text-cyan-600 font-medium hover:underline" href="#">See All</a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cats.map(cat => (
          <Card key={cat.label} className={`py-8 px-4 flex flex-col items-center ${cat.color}`}>
            <span className="font-medium text-xl">{cat.label}</span>
            <span className="mt-1 text-sm text-gray-600">11 Courses</span>
          </Card>
        ))}
      </div>
    </section>
  );
}
