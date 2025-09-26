import React from "react";
import Card from "./Card";
export default function TeamSection({ instructors }) {
  return (
    <section className="py-16 px-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-8">Meet the Instructors</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {instructors.map(ins => (
          <Card key={ins.name} className="flex items-center gap-4 p-6">
            <img src={ins.img} alt={ins.name} className="w-20 h-20 rounded-full" />
            <div>
              <div className="font-semibold">{ins.name}</div>
              <div className="text-gray-600">{ins.role}</div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
