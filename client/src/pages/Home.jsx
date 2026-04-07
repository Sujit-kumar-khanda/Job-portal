import React from "react";
import { Search, Briefcase, Users } from "lucide-react";
import Testimonials from "../components/Testimonials";
import JobNewsletter from "../components/JobNewsletter";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="mt-20 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-linear-to-br from-indigo-50 via-blue-50 to-sky-100 flex items-center">
        {/* Decorative Blobs */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-sky-200 rounded-full blur-3xl opacity-30"></div>

        <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
              Find Your{" "}
              <span className="text-indigo-600">Dream Job</span>  
              <br /> With Confidence
            </h1>

            <p className="mt-6 text-lg text-gray-700 max-w-xl">
              Discover verified jobs, connect with trusted employers, and take
              the next step in your career journey — all in one place.
            </p>

            {/* Search Bar */}
            <div className="mt-8 bg-white flex items-center shadow-xl rounded-2xl p-2 border border-gray-200 hover:shadow-2xl transition">
              <Search className="text-gray-400 w-5 h-5 ml-3" />
              <input
                type="text"
                placeholder="Search jobs by title or keyword..."
                className="w-full px-4 py-3 outline-none text-gray-700 rounded-2xl"
              />
              <button className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-2xl hover:bg-indigo-700 transition-all duration-300">
                Search
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8 mt-12 max-w-md">
              <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition">
                <div className="flex items-center gap-3">
                  <Briefcase className="text-indigo-600" />
                  <h2 className="text-3xl font-bold text-gray-900">10K+</h2>
                </div>
                <p className="text-gray-600 mt-1">Jobs Posted</p>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition">
                <div className="flex items-center gap-3">
                  <Users className="text-indigo-600" />
                  <h2 className="text-3xl font-bold text-gray-900">5K+</h2>
                </div>
                <p className="text-gray-600 mt-1">Trusted Employers</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center items-center animate-slide-up">
            <img
              src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=700&q=80"
              alt="Job search platform illustration"
              className="w-full max-w-lg rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* Extra Sections */}
      <Testimonials />
      <JobNewsletter />
      <Footer />
    </div>
  );
};

export default Home;
