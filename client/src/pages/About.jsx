import React from "react";
import { motion } from "framer-motion";
import { FaUsers, FaShieldAlt, FaBriefcase } from "react-icons/fa";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen bg-[#0b0f1a] text-gray-200">
      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
            Job searching is broken.
            <br />
            <span className="text-indigo-400">We’re fixing it.</span>
          </h1>

          <p className="mt-6 text-gray-400 text-lg leading-relaxed">
            Applying to hundreds of jobs, getting no response, and not knowing
            what went wrong — we’ve all been there.
          </p>

          <p className="mt-4 text-gray-400 leading-relaxed">
            JobSeeker is built to remove that frustration. No fake listings. No
            unnecessary steps. Just real opportunities.
          </p>

          <Link to="/jobs">
            <button className="mt-8 px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition shadow-md shadow-indigo-500/20">
              browse jobs
            </button>
          </Link>
        </div>

        {/* RIGHT CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10"
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

      {/* WHY WE BUILT THIS */}
      <section className="bg-white/5 border-y border-white/10 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Why we built JobSeeker
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
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold mb-12 text-white">What you get</h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-indigo-400 transition">
            <FaBriefcase className="text-indigo-400 text-2xl mb-3" />
            <h3 className="font-semibold mb-2 text-white">
              Real Opportunities
            </h3>
            <p className="text-gray-400 text-sm">
              Every job is verified to ensure authenticity and quality.
            </p>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-indigo-400 transition">
            <FaUsers className="text-indigo-400 text-2xl mb-3" />
            <h3 className="font-semibold mb-2 text-white">Direct Hiring</h3>
            <p className="text-gray-400 text-sm">
              Connect with employers without unnecessary middle layers.
            </p>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-indigo-400 transition">
            <FaShieldAlt className="text-indigo-400 text-2xl mb-3" />
            <h3 className="font-semibold mb-2 text-white">Safe Platform</h3>
            <p className="text-gray-400 text-sm">
              No scams, no fake listings — just trusted hiring.
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 border-y border-white/10">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-3xl font-bold text-white">10K+</h3>
            <p className="mt-2 text-gray-400">Jobs Posted</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-white">5K+</h3>
            <p className="mt-2 text-gray-400">Employers</p>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-white">20K+</h3>
            <p className="mt-2 text-gray-400">Users</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl font-bold mb-4 text-white">
          Ready to find your next opportunity?
        </h2>

        <p className="text-gray-400 mb-8">
          Start exploring jobs and connect with companies that are actually
          hiring.
        </p>
         <Link to="/signup">
        <button className="px-8 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition shadow-lg shadow-indigo-500/20">
          Get Started
        </button>
        </Link>
      </section>
    </div>
  );
};

export default About;
