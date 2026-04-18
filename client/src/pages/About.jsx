import React from "react";
import { motion } from "framer-motion";
import { FaUsers, FaShieldAlt, FaBriefcase } from "react-icons/fa";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-[#0b0f1a] text-gray-200 pt-24">

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16 grid md:grid-cols-2 gap-12 items-center">
        
        {/* LEFT */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
            Job searching is broken.
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">
              We’re fixing it.
            </span>
          </h1>

          <p className="mt-6 text-gray-400 text-lg leading-relaxed">
            Applying to hundreds of jobs, getting no response, and not knowing
            what went wrong — we’ve all been there.
          </p>

          <p className="mt-4 text-gray-400 leading-relaxed">
            CareerLink is built to remove that frustration. No fake listings. No
            unnecessary steps. Just real opportunities.
          </p>

          <Link to="/jobs">
            <button className="mt-8 px-7 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/30">
              Browse Jobs
            </button>
          </Link>
        </div>

        {/* RIGHT CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/5 backdrop-blur-xl p-8 rounded-2xl border border-white/10 hover:shadow-lg hover:shadow-indigo-500/10 transition"
        >
          <h3 className="text-xl font-semibold mb-4 text-white">
            What makes us different
          </h3>

          <ul className="space-y-4 text-gray-400">
            <li>✔ Verified job listings only</li>
            <li>✔ Direct connection with employers</li>
            <li>✔ Clean and simple experience</li>
            <li>✔ Built for freshers & professionals</li>
          </ul>
        </motion.div>
      </section>

      {/* WHY */}
      <section className="bg-white/5 border-y border-white/10 py-16">
        <div className="max-w-5xl mx-auto px-6 lg:px-12">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Why we built CareerLink
          </h2>

          <p className="text-gray-400 leading-relaxed">
            Most job platforms are overloaded with spam, outdated listings, and
            complicated workflows. Candidates apply endlessly without hearing
            back.
          </p>

          <p className="text-gray-400 mt-4 leading-relaxed">
            We wanted something simpler — a platform where job seekers can
            actually trust what they see and employers can find the right people
            faster.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <h2 className="text-3xl font-bold mb-12 text-white">What you get</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[{
            icon: <FaBriefcase className="text-indigo-400 text-2xl" />,
            title: "Real Opportunities",
            desc: "Every job is verified to ensure authenticity and quality.",
          },{
            icon: <FaUsers className="text-sky-400 text-2xl" />,
            title: "Direct Hiring",
            desc: "Connect with employers without unnecessary middle layers.",
          },{
            icon: <FaShieldAlt className="text-indigo-400 text-2xl" />,
            title: "Safe Platform",
            desc: "No scams, no fake listings — just trusted hiring.",
          }].map((item, i) => (
            <div
              key={i}
              className="p-6 bg-white/5 border border-white/10 rounded-xl transition hover:border-indigo-400 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-500/10"
            >
              <div className="mb-3">{item.icon}</div>
              <h3 className="font-semibold mb-2 text-white">{item.title}</h3>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 border-y border-white/10">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 grid md:grid-cols-3 gap-8 text-center">
          {[
            { value: "10K+", label: "Jobs Posted" },
            { value: "5K+", label: "Employers" },
            { value: "20K+", label: "Users" },
          ].map((item, i) => (
            <div key={i}>
              <h3 className="text-3xl font-bold text-white">{item.value}</h3>
              <p className="mt-2 text-gray-400">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 lg:px-12 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">
          Ready to find your next opportunity?
        </h2>

        <p className="text-gray-400 mb-8">
          Start exploring jobs and connect with companies that are actually hiring.
        </p>

        <Link to="/signup">
          <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/30">
            Get Started
          </button>
        </Link>
      </section>

    </div>
  );
};

export default About;