import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaShieldAlt,
  FaUsers,
  FaBolt,
  FaCompass,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const WhyUsPage = () => {
  const [stats, setStats] = useState({ users: 0, jobs: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) => {
        const users = Math.min(prev.users + 100, 5000);
        const jobs = Math.min(prev.jobs + 1000, 50000);

        if (users === 5000 && jobs === 50000) {
          clearInterval(interval);
        }

        return { users, jobs };
      });
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const formatK = (num) => {
    return num >= 1000
      ? `${(num / 1000).toFixed(num >= 10000 ? 0 : 1)}K+`
      : num;
  };

  const features = [
    {
      icon: FaSearch,
      title: "Focused Job Search",
      desc: "Find roles that actually match your skills using simple and effective filters.",
    },
    {
      icon: FaShieldAlt,
      title: "Verified Opportunities",
      desc: "Every listing is reviewed to reduce spam and keep things trustworthy.",
    },
    {
      icon: FaUsers,
      title: "Direct Connections",
      desc: "Apply and connect with employers without unnecessary steps.",
    },
    {
      icon: FaCompass,
      title: "Guided Discovery",
      desc: "Explore relevant roles based on your activity and interests.",
    },
    {
      icon: FaBolt,
      title: "Quick Applications",
      desc: "Apply faster and keep track of your progress in one place.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white relative overflow-hidden">

      {/* 🌌 background */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_1px_1px,#1f2937_1px,transparent_0)] [background-size:35px_35px]" />

      {/* ✨ glow */}
      <div className="absolute top-24 left-10 w-72 h-72 bg-indigo-500 blur-[120px] opacity-10" />
      <div className="absolute bottom-24 right-10 w-72 h-72 bg-sky-500 blur-[120px] opacity-10" />

      {/* HERO */}
      <section className="text-center py-28 px-6">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-bold leading-tight"
        >
          A Better Way to
          <br />
          <span className="text-indigo-400">Find Your Next Job</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-gray-400 max-w-xl mx-auto text-lg"
        >
          We keep things simple — helping you discover genuine opportunities
          and move forward in your career with confidence.
        </motion.p>
      </section>

      {/* STATS */}
      <section className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto px-6 mb-24">
        {[
          {
            label: "Active Users",
            value: formatK(stats.users),
          },
          {
            label: "Job Listings",
            value: formatK(stats.jobs),
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ y: -4 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center backdrop-blur-md transition"
          >
            <p className="text-4xl font-semibold">{item.value}</p>
            <p className="text-gray-400 mt-2">{item.label}</p>
          </motion.div>
        ))}
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 mb-28">
        <h2 className="text-3xl text-center mb-12 font-semibold text-gray-200">
          What makes it different
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-md hover:bg-white/10 hover:border-indigo-400/40 transition-all duration-300 cursor-pointer"
              >
                <Icon className="text-indigo-400 text-lg mb-3" />

                <h3 className="text-sm font-semibold mb-1 text-gray-200">
                  {f.title}
                </h3>

                <p className="text-gray-400 text-xs leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center pb-28 px-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="bg-white/5 border border-white/10 rounded-3xl px-10 py-10 max-w-xl mx-auto backdrop-blur-md transition"
        >
          <h3 className="text-2xl font-semibold mb-3">
            Ready to take the next step?
          </h3>

          <p className="text-gray-400 mb-6">
            Start exploring jobs and find something that truly fits you.
          </p>
           <Link to="/jobs">
          <button className="px-6 py-3 bg-indigo-600 rounded-xl hover:bg-indigo-700 transition text-white font-medium">
            Browse Jobs
          </button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
};

export default WhyUsPage;