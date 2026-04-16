import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useAppContext } from "../context/AppContext";
import { X } from "lucide-react";
import toast from "react-hot-toast";

export default function SeekerJobs() {
  const { api, token, user } = useAppContext();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  // FETCH JOBS
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/jobs/all");
      setJobs(data.jobs || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // CHECK APPLIED
  const hasApplied = useCallback(
    (job) => {
      if (!user || !job?.applicants) return false;

      return job.applicants.some((a) => {
        const id = typeof a.user === "object" ? a.user?._id : a.user;
        return id === user._id;
      });
    },
    [user],
  );

  // APPLY JOB
  const applyJob = async (jobId) => {
    if (!token) return toast.error("Please login to apply");

    try {
      setApplyingId(jobId);

      const { data } = await api.post(
        `/jobs/${jobId}/apply`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success(data.message || "Applied successfully");

      setJobs((prev) =>
        prev.map((job) =>
          job._id === jobId
            ? {
                ...job,
                applicants: [
                  ...(job.applicants || []).filter((a) => {
                    const id = typeof a.user === "object" ? a.user._id : a.user;
                    return id !== user._id;
                  }),
                  {
                    user: user._id,
                    status: "pending",
                    appliedAt: new Date(),
                  },
                ],
              }
            : job,
        ),
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplyingId(null);
    }
  };

  // JOB LIST UI
  const jobList = useMemo(() => {
    return jobs.map((job) => {
      const applied = hasApplied(job);

      return (
        <div
          key={job._id}
          className="bg-white border rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-lg transition w-full"
        >
          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div className="min-w-0">
              {/* ✅ NEW: User Info */}
              <div className="flex items-center gap-2 mb-1">
                <img
                  src={
                    job.postedBy?.profilePhoto ||
                    "https://via.placeholder.com/30"
                  }
                  alt="user"
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <span className="text-sm text-gray-600 font-medium">
                  {job.postedBy?.name || "Unknown"}
                </span>
              </div>

              {/* EXISTING CODE (unchanged) */}
              <h3 className="text-lg sm:text-2xl font-bold text-indigo-600 break-words">
                {job.title}
              </h3>

              <p className="text-gray-500 text-sm sm:text-base">
                {job.location} • {job.salary}
              </p>
            </div>

            <button
              className={`w-full sm:w-auto px-4 py-2 rounded-xl font-semibold text-white transition ${
                applied
                  ? "bg-green-500 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700"
              }`}
              onClick={() => applyJob(job._id)}
              disabled={applyingId === job._id || applied}
            >
              {applied
                ? "Applied"
                : applyingId === job._id
                  ? "Applying..."
                  : "Apply"}
            </button>
          </div>

          {/* DESCRIPTION */}
          <p className="text-gray-700 mt-3 text-sm sm:text-base line-clamp-2">
            {job.description}
          </p>

          {/* FOOTER */}
          <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {job.skills?.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-indigo-50 text-indigo-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>

            <button
              onClick={() => setSelectedJob(job)}
              className="text-indigo-600 font-semibold hover:underline text-sm sm:text-base text-left sm:text-right"
            >
              View Details →
            </button>
          </div>
        </div>
      );
    });
  }, [jobs, applyingId, hasApplied]);

  // LOADING
  if (loading) {
    return (
      <p className="pt-28 text-center text-gray-500 animate-pulse">
        Loading jobs...
      </p>
    );
  }

  // EMPTY
  if (!jobs.length) {
    return <p className="pt-28 text-center text-gray-500">No jobs available</p>;
  }

  return (
    <>
      {/* CONTAINER */}
      <div className="pt-10 pb-10 px-4 sm:px-6 max-w-6xl mx-auto space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-600 text-center">
          Available Jobs
        </h2>

        <div className="space-y-5">{jobList}</div>
      </div>

      {/* MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl p-5 sm:p-6 relative max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <X />
            </button>

            <h3 className="text-xl sm:text-2xl font-bold text-indigo-600 mb-2 pr-8">
              {selectedJob.title}
            </h3>

            <p className="text-gray-500 text-sm sm:text-base mb-4">
              {selectedJob.location} • {selectedJob.salary}
            </p>

            <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
              {selectedJob.description}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
