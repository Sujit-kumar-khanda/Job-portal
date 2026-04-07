import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { X } from "lucide-react";

export default function SeekerJobs() {
  const { api, token, user, toast } = useAppContext();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null); 

  // Fetch all jobs
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/jobs/all");
      setJobs(res.data.jobs || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [api]);

  const hasApplied = (job) => {
    if (!user || !job.applicants) return false;
    return job.applicants.some((a) =>
      typeof a === "string" ? a === user._id : a?._id === user._id
    );
  };

  const applyJob = async (jobId) => {
    if (!token) return toast.error("Please login to apply");
    try {
      setApplyingId(jobId);
      const res = await api.post(`/applications/apply/${jobId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data.message || "Applied successfully ✅");

      setJobs((prev) =>
        prev.map((job) =>
          job._id === jobId
            ? { ...job, applicants: [...(job.applicants || []), user._id] }
            : job
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplyingId(null);
    }
  };

  if (loading)
    return (
      <p className="pt-28 text-center text-gray-500 animate-pulse">
        Loading jobs...
      </p>
    );

  if (jobs.length === 0)
    return (
      <p className="pt-28 text-center text-gray-500">
        No jobs available
      </p>
    );

  return (
    <>
      <div className="pt-8 space-y-8 max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-indigo-600 text-center mb-6">
          Available Jobs
        </h2>

        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition border"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-2xl font-bold text-indigo-600">
                  {job.title}
                </h3>
                <p className="text-gray-500">
                  {job.location} • {job.salary}
                </p>
              </div>

              <button
                className={`px-5 py-2 rounded-xl text-white font-semibold ${
                  hasApplied(job)
                    ? "bg-green-500 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                }`}
                onClick={() => applyJob(job._id)}
                disabled={applyingId === job._id || hasApplied(job)}
              >
                {hasApplied(job)
                  ? "✅ Applied"
                  : applyingId === job._id
                  ? "Applying..."
                  : "Apply"}
              </button>
            </div>

            <p className="text-gray-700 line-clamp-2 mb-4">
              {job.description}
            </p>

            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-2">
                {job.skills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <button
                onClick={() => setSelectedJob(job)}
                className="text-indigo-600 font-semibold hover:underline"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* VIEW DETAILS MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white max-w-2xl w-full rounded-2xl p-6 relative shadow-xl animate-scale-in">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <X />
            </button>

            <h3 className="text-2xl font-bold text-indigo-600 mb-2">
              {selectedJob.title}
            </h3>

            <p className="text-gray-500 mb-4">
              {selectedJob.location} • {selectedJob.salary}
            </p>

            <p className="text-gray-700 mb-4">
              {selectedJob.description}
            </p>

            {selectedJob.skills?.length > 0 && (
              <>
                <h4 className="font-semibold mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
