import React from "react";
import { Star } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      name: "Rahul Sharma",
      role: "Frontend Developer",
      message: "I got my first job within 2 weeks using this platform!",
    },
    {
      name: "Ananya Verma",
      role: "UI/UX Designer",
      message: "Very easy to use and employers respond quickly.",
    },
    {
      name: "Amit Singh",
      role: "Backend Developer",
      message: "Clean UI and genuine job postings. Highly recommended.",
    },
  ];

  return (
    <section className="py-16 bg-indigo-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-12">
          What Job Seekers Say
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 text-yellow-400 mr-1" />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">“{r.message}”</p>
              <h4 className="font-semibold text-indigo-600">{r.name}</h4>
              <span className="text-sm text-gray-500">{r.role}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
