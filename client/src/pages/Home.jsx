import React from "react";
import { Briefcase, Users } from "lucide-react";
import Testimonials from "../components/Testimonials";
import JobNewsletter from "../components/JobNewsletter";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="mt-20 overflow-hidden bg-[#0b0f1a] text-white">
      {/* HERO */}
      <section className="relative min-h-screen flex items-center">
        
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-black to-sky-900 opacity-90"></div>

        {/* Glow */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500 rounded-full blur-[120px] opacity-20"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-sky-500 rounded-full blur-[120px] opacity-20"></div>

        <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">

          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col"
          >
            <h1 className="text-5xl md:text-6xl font-bold leading-tight">
              Find Your{" "}
              <span className="text-indigo-400">Next Opportunity</span>
              <br />
              Without the Noise
            </h1>

            <p className="mt-6 text-lg text-gray-300 max-w-xl">
              We help you discover genuine job opportunities and connect
              directly with employers — no clutter, no confusion.
            </p>

            {/* ✅ CTA BUTTONS (REPLACED SEARCH) */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4">

              {/* Primary */}
              <Link to="/signup">
                <button className="px-8 py-3 bg-indigo-600 rounded-xl font-semibold hover:bg-indigo-700 transition duration-300 shadow-md hover:shadow-indigo-500/20">
                  Get Started
                </button>
              </Link>

              {/* Secondary */}
              <Link to="/jobs">
                <button className="px-8 py-3 border border-white/20 rounded-xl hover:bg-white/10 transition duration-300">
                  Browse Jobs
                </button>
              </Link>

            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-8 mt-12 max-w-md">
              {[{
                icon: <Briefcase className="text-indigo-400" />,
                value: "10K+",
                label: "Jobs Posted",
              }, {
                icon: <Users className="text-sky-400" />,
                value: "5K+",
                label: "Employers",
              }].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -4 }}
                  className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 transition"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <h2 className="text-2xl font-semibold">{item.value}</h2>
                  </div>
                  <p className="text-gray-400 mt-1 text-sm">{item.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT IMAGE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="flex justify-center"
          >
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=700&q=80"
                alt="Job search"
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </motion.div>

        </div>
      </section>

      {/* EXTRA */}
      <div className="bg-[#0b0f1a]">
        <Testimonials />
        <JobNewsletter />
        <Footer />
      </div>
    </div>
  );
};

export default Home;