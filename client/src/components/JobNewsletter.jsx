import React from "react";

export default function JobNewsletter() {
  return (
    <section className="relative py-20 text-white overflow-hidden">
      {/* Glow Background */}
      <div className="absolute top-0 left-1/3 w-72 h-72 bg-indigo-500 blur-[120px] opacity-20"></div>
      <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-sky-500 blur-[120px] opacity-20"></div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-sky-400 text-transparent bg-clip-text">
          Stay Ahead in Your Career Journey
        </h2>

        {/* Subtext */}
        <p className="mb-6 text-gray-400 max-w-2xl mx-auto">
          Get personalized job opportunities, curated for your skills and goals — delivered directly to your inbox.
        </p>

        {/* Trust Line */}
        <p className="text-sm text-gray-500 mb-10">
          Trusted by 10,000+ job seekers • No spam • Unsubscribe anytime
        </p>

        {/* Form */}
        <form className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Input with Glow */}
          <div className="relative w-full sm:w-2/3 group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>

            <input
              type="email"
              placeholder="Enter your work email"
              className="relative w-full px-4 py-3 rounded-xl bg-black/60 backdrop-blur-xl border border-white/10 outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-sky-500 hover:scale-105 active:scale-95 transition duration-300 shadow-lg shadow-indigo-500/20"
          >
            Get Started
          </button>
        </form>
      </div>
    </section>
  );
}