import React from "react";

const JobCard = ({ job }) => {
  return (
    <div className="relative group">

      {/* Glow Border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-sky-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500"></div>

      {/* Card */}
      <div className="relative bg-[#0b0f1a] border border-white/10 text-white rounded-2xl p-6 
        shadow-lg transition-all duration-500 
        group-hover:-translate-y-2 group-hover:shadow-2xl">

        {/* TOP */}
        <div className="flex justify-between items-start mb-4">

          <div>
            <h3 className="text-xl font-semibold text-white group-hover:text-indigo-300 transition">
              {job.title}
            </h3>

            <p className="text-gray-400 text-sm mt-1">
              {job.company}
            </p>
          </div>

          <span className="px-3 py-1 text-xs rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            {job.type}
          </span>
        </div>

        {/* LOCATION */}
        <p className="text-gray-400 text-sm">
          📍 {job.location}
        </p>

        {/* SALARY */}
        {job.salary && (
          <p className="mt-2 text-sm text-gray-300">
            💰 <span className="text-green-400 font-medium">{job.salary}</span>
          </p>
        )}

        {/* SKILLS */}
        {job.skills?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {job.skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-xs px-3 py-1 rounded-full 
                bg-white/5 border border-white/10 text-gray-300
                hover:bg-indigo-500/10 hover:text-indigo-300
                transition duration-300"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* FOOTER FAKE CTA FEEL */}
        <div className="mt-5 pt-4 border-t border-white/10 flex justify-between items-center">

          <span className="text-xs text-gray-500">
            Posted recently
          </span>

          <button className="text-xs px-4 py-2 rounded-lg 
            bg-gradient-to-r from-indigo-500 to-sky-500 
            hover:scale-105 active:scale-95 transition duration-300">
            View
          </button>

        </div>
      </div>
    </div>
  );
};

export default JobCard;