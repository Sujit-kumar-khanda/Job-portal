import React from "react";

const JobCard = ({ job }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-xl transition transform hover:-translate-y-1 duration-300">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-indigo-600">{job.title}</h3>
        <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
          {job.type}
        </span>
      </div>
      <p className="text-gray-700 font-medium">{job.company}</p>
      <p className="text-gray-500">{job.location}</p>
      {job.salary && (
        <p className="mt-2 text-sm text-gray-600">💰 {job.salary}</p>
      )}
      {job.skills?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {job.skills.map((skill, idx) => (
            <span
              key={idx}
              className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full text-xs"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobCard;
