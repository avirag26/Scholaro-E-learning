import React from "react";
import Card from "./Card";
export default function Testimonials({ testimonials }) {
  return (
    <section className="bg-gray-100 py-16">
      <h2 className="text-2xl font-bold mb-8 text-center">What students say</h2>
      <div className="flex gap-6 justify-center">
        {testimonials.map(t => (
          <Card key={t.name} className="p-6 flex flex-col items-center min-w-[250px] max-w-xs">
            <img src={t.img} alt={t.name} className="w-14 h-14 rounded-full" />
            <p className="italic text-gray-700 mt-3 mb-2">"{t.quote}"</p>
            <div className="font-semibold">{t.name}</div>
            <div className="text-sm text-gray-500">{t.role}</div>
          </Card>
        ))}
      </div>
    </section>
  );
}