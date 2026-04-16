import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Briefcase, ArrowLeft } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

export default function JobDetails() {
  const { api, token, user } = useAppContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const fetchJob = useCallback(async () => {
    try {
      setLoading(true);

      const res = await api.get(`/jobs/${id}`);
      const jobData = res.data?.job;

      setJob(jobData || null);

      const applicants = jobData?.applicants || [];

      if (user?._id) {
        const applied = applicants.some((a) =>
          typeof a === "string" ? a === user._id : a?.user === user._id
        );

        setHasApplied(applied);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load job details");
    } finally {
      setLoading(false);
    }
  }, [api, id, user]);

  useEffect(() => {
    fetchJob();
  }, [fetchJob]);

  const handleApply = async () => {
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      setApplying(true);

      const res = await api.post(`/jobs/${id}/apply`);
      toast.success(res.data?.message || "Applied successfully");

      setHasApplied(true);
    } catch (err) {
      const action = err?.response?.data?.action;
      const message = err?.response?.data?.message || "Failed to apply";

      if (action === "UPLOAD_RESUME") {
        toast.error("Please upload your resume first");
        navigate("/seeker-dashboard");
        return;
      }

      toast.error(message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-28 text-center text-gray-400">
        Loading job details...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="pt-28 text-center text-red-400">
        Job not found
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 bg-gradient-to-br from-black via-[#0b0f19] to-[#0a0a0a]">

      <div className="max-w-5xl mx-auto">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-300 mb-6 hover:text-indigo-200 transition"
        >
          <ArrowLeft size={18} />
          Back to Jobs
        </button>

        {/* MAIN CARD */}
        <div className="bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl rounded-3xl p-8 md:p-10 text-white">

          {/* TITLE */}
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 text-white">
            {job.title}
          </h1>

          {/* META */}
          <div className="flex flex-wrap gap-3 mb-6 text-sm">

            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-gray-200">
              <MapPin size={15} />
              {job.location}
            </span>

            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-gray-200">
              <Briefcase size={15} />
              {job.postedBy?.name || "Company"}
            </span>

            <span className="px-4 py-2 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold">
              💰 {job.salary}
            </span>

          </div>

          {/* DESCRIPTION */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-semibold mb-2 text-gray-200">
              Job Description
            </h2>

            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
              {job.description}
            </p>
          </div>

          {/* SKILLS */}
          {job.skills?.length > 0 && (
            <div className="mb-10">
              <h2 className="text-lg font-semibold mb-3 text-gray-200">
                Required Skills
              </h2>

              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-4 py-1.5 bg-indigo-500/20 text-indigo-300 rounded-full text-sm border border-indigo-500/30 hover:bg-indigo-500/30 transition"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* APPLY BUTTON */}
          {token && user?.role === "seeker" && (
            <button
              onClick={handleApply}
              disabled={hasApplied || applying}
              className={`w-full md:w-auto px-10 py-3 rounded-2xl font-semibold text-lg transition shadow-lg ${
                hasApplied
                  ? "bg-green-500/20 text-green-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {hasApplied
                ? "✅ Already Applied"
                : applying
                ? "Applying..."
                : "Apply for this Job"}
            </button>
          )}

        </div>
      </div>
    </div>
  );
}