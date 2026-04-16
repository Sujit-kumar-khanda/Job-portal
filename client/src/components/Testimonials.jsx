import React from "react";
import { Star } from "lucide-react";
import { motion } from "framer-motion";

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
    <section className="relative py-20 text-white overflow-hidden">
      {/* Glow Background (same theme, no bg override) */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-indigo-500 blur-[120px] opacity-20"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-sky-500 blur-[120px] opacity-20"></div>

      <div className="relative max-w-6xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-extrabold text-center mb-14"
        >
          <span className="bg-gradient-to-r from-indigo-400 to-sky-400 text-transparent bg-clip-text">
            What Job Seekers Say
          </span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-10">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="relative group"
            >
              {/* Glow Border */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>

              {/* Card */}
              <div className="relative bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl">
                {/* Stars */}
                <div className="flex mb-4">
                  {[...Array(5)].map((_, idx) => (
                    <Star
                      key={idx}
                      className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400 transition duration-300 group-hover:scale-125 group-hover:drop-shadow-[0_0_10px_rgba(255,215,0,1)]"
                    />
                  ))}
                </div>

                {/* Message */}
                <p className="text-gray-300 mb-6 italic leading-relaxed">
                  “{r.message}”
                </p>

                {/* User */}
                <h4 className="font-semibold text-indigo-400 text-lg">
                  {r.name}
                </h4>
                <span className="text-sm text-gray-500">{r.role}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
