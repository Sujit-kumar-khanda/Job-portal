import React, { useState, useEffect } from "react";
import {
  FaDatabase,
  FaBrain,
  FaFileAlt,
  FaShieldAlt,
  FaUsers,
} from "react-icons/fa";

const WhyUsPage = () => {
  const [stats, setStats] = useState({ jobs: 0, users: 0, interviews: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        jobs: stats.jobs < 10000000 ? stats.jobs + 100000 : 10000000,
        users: stats.users < 10 ? stats.users + 1 : 10,
        interviews: stats.interviews < 3 ? stats.interviews + 0.1 : 3,
      });
    }, 50);
    return () => clearInterval(interval);
  }, [stats]);

  const features = [
    {
      icon: FaDatabase,
      title: "Vast Job Database",
      desc: "Access millions of verified listings across industries, updated daily from top employers worldwide.",
    },
    {
      icon: FaBrain,
      title: "Smart Matching",
      desc: "AI-powered algorithms match your skills, experience, and preferences to the best opportunities, saving you time.",
    },
    {
      icon: FaFileAlt,
      title: "Resume Builder",
      desc: "Free professional templates and optimization tools to boost your profile visibility by up to 40%.",
    },
    {
      icon: FaShieldAlt,
      title: "Scam-Free Guarantee",
      desc: "Rigorous vetting ensures every job is legitimate, giving you peace of mind.",
    },
    {
      icon: FaUsers,
      title: "Trusted by Millions",
      desc: "Over 10 million job seekers and thousands of employers rely on JobSeeker for seamless connections.",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-20 px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto text-center mb-20">
        <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 animate-fade-in">
          Why Choose JobSeeker?
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-12 animate-fade-in-up">
          JobSeeker stands out as a premier job portal designed specifically for
          ambitious professionals seeking their next career move.
        </p>
      </section>

      {/* Stats Section */}
      <section className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8 mb-24 text-center">
        <div className="p-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50 animate-float">
          <FaUsers className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-bounce" />
          <p className="text-4xl font-bold text-blue-600">
            {Math.floor(stats.users)}M
          </p>
          <p className="text-gray-600 font-semibold">Users</p>
        </div>
        <div className="p-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50 animate-float delay-200">
          <FaDatabase className="w-16 h-16 text-green-500 mx-auto mb-4 animate-pulse" />
          <p className="text-4xl font-bold text-green-600">
            {Math.floor(stats.jobs).toLocaleString()}
          </p>
          <p className="text-gray-600 font-semibold">Jobs</p>
        </div>
        <div className="p-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/50 animate-float delay-400">
          <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-ping">
            <span className="text-white font-bold text-lg">3x</span>
          </div>
          <p className="text-2xl font-bold text-purple-600">
            {stats.interviews.toFixed(1)}x
          </p>
          <p className="text-gray-600 font-semibold">Faster Interviews</p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto mb-20">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-16 animate-fade-in-up">
          Key Advantages
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:bg-linear-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-500 hover:-translate-y-4 cursor-pointer border border-gray-100 hover:border-blue-200 animate-slide-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Icon className="w-12 h-12 text-blue-500 group-hover:scale-110 transition-transform duration-300 mb-6 animate-spin-slow" />
                <h3 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Success Story */}
      <section className="max-w-4xl mx-auto text-center p-12 bg-linear-to-r from-purple-500 to-blue-600 text-white rounded-3xl shadow-2xl animate-fade-in-up">
        <blockquote className="text-xl md:text-2xl italic mb-6">
          &quot;JobSeeker found me my dream role in tech after weeks of
          fruitless searching elsewhere.&quot;
        </blockquote>
        <p className="text-2xl font-semibold opacity-90">
          - Priya, Chennai[web:1]
        </p>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out;
        }
        .animate-slide-in {
          animation: slide-in 0.8s ease-out forwards;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
};

export default WhyUsPage;
