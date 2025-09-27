import React from "react";
import Card from "./Card";

export default function AboutSection({ aboutImg, officeImg }) {
  return (
    <section className="px-4 py-12 bg-white">
      <div className="grid md:grid-cols-2 gap-6 items-center max-w-5xl mx-auto">
        <Card className="p-6 flex flex-col gap-2 justify-between">
          <span className="text-cyan-600 font-semibold">About Us</span>
          <h2 className="text-2xl font-bold mb-2">eLearnHub: best opportunities for students, globally.</h2>
          <p className="text-gray-600 text-base">
            We provide a global learning platform, offering courses designed to help students develop new skills and succeed.
          </p>
        </Card>
        <div className="flex flex-col gap-4 items-center">
          <img src={officeImg} className="rounded-xl w-full" alt="Office space" />
          <img src={aboutImg} className="rounded-xl w-full" alt="Environment" />
        </div>
      </div>
    </section>
  );
}