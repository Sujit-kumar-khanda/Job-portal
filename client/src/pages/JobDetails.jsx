import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, Briefcase, ArrowLeft } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api, toast, token, user } = useAppContext();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.job);
      } catch {
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, api, toast]);

  const hasApplied = () => {
    if (!user || !job?.applicants) return false;
    return job.applicants.some((a) =>
      typeof a === "string" ? a === user._id : a?.user === user._id,
    );
  };

  const handleApply = async () => {
    try {
      setApplying(true);
      await api.post(`/jobs/${id}/apply`);
      toast.success("Applied successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <p className="pt-28 text-center">Loading...</p>;
  if (!job) return <p className="pt-28 text-center">Job not found</p>;

  return (
    <div className="pt-28 pb-10 min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-10 border">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-indigo-600 mb-8 hover:underline"
        >
          <ArrowLeft size={18} /> Back to Jobs
        </button>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
          {job.title}
        </h1>

        <div className="flex flex-wrap gap-5 text-gray-600 mb-6">
          <span className="flex items-center gap-2">
            <MapPin size={16} /> {job.location}
          </span>
          <span className="flex items-center gap-2">
            <Briefcase size={16} /> {job.postedBy?.name || "Company"}
          </span>
          <span className="font-semibold text-indigo-600">💰 {job.salary}</span>
        </div>

        <div className="bg-indigo-50 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">Job Description</h2>
          <p className="text-gray-700 text-sm max-w-prose leading-relaxed whitespace-pre-wrap wrap-break-word">
            {job.description}
          </p>
        </div>

        {job.skills?.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-3">Required Skills</h2>
            <div className="flex flex-wrap gap-3">
              {job.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </>
        )}

        {token && user?.role === "seeker" && (
          <div className="mt-10">
            <button
              disabled={hasApplied() || applying}
              onClick={handleApply}
              className={`w-full sm:w-auto px-8 py-3 rounded-2xl text-lg font-semibold transition ${
                hasApplied()
                  ? "bg-green-100 text-green-700 cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {hasApplied()
                ? "✅ Already Applied"
                : applying
                  ? "Applying..."
                  : "Apply for this Job"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
