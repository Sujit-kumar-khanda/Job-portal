import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import {
  PlusCircle,
  List,
  Users,
  Trash2,
  Briefcase,
} from "lucide-react";

export default function EmployerDashboard() {
  const { api, user, loadingUser, toast } = useAppContext();

  const [active, setActive] = useState("post");
  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    skills: "",
    jobType: "full-time",
    deadline: "",
  });

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ── FETCH JOB APPLICATIONS ── */
  const fetchJobs = async () => {
    if (!user || user.role !== "employer") return;
    try {
      const res = await api.get("/jobs/employer/applications");
      setJobs(res.data.jobs || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch applications");
    }
  };

  useEffect(() => {
    if (!loadingUser && user?.role === "employer") {
      fetchJobs();
    }
  }, [loadingUser, user]);

  /* ── POST JOB ── */
  const handlePostJob = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description)
      return toast.error("Title & description required");

    try {
      setLoading(true);
      await api.post("/jobs", {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
        deadline: form.deadline || undefined,
      });
      toast.success("Job posted successfully 🎉");
      setForm({ title: "", description: "", location: "", salary: "", skills: "", jobType: "full-time", deadline: "" });
      setActive("myjobs");
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  /* ── DELETE JOB ── */
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job? All applications will also be removed.")) return;
    try {
      await api.delete(`/jobs/${jobId}`);
      toast.success("Job deleted");
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete job");
    }
  };

  /* ── UPDATE APPLICATION STATUS ── */
  const handleStatusChange = async (appId, status) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status });
      toast.success(`Application marked as ${status}`);
      fetchJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  if (loadingUser) return <p className="pt-28 text-center">Loading...</p>;
  if (!user || user.role !== "employer")
    return <p className="pt-28 text-center text-red-600">Access denied</p>;

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex">
      {/* ── SIDEBAR ── */}
      <aside className="w-72 fixed left-0 top-24 h-[calc(100vh-6rem)] bg-white/80 backdrop-blur-xl rounded-tr-3xl rounded-br-3xl p-6 shadow-lg border">
        <h3 className="text-xl font-extrabold text-indigo-600 mb-2">Employer Panel</h3>
        <p className="text-xs text-gray-400 mb-6">Hello, {user.name} 👋</p>

        <button
          onClick={() => setActive("post")}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full mb-3 transition ${
            active === "post" ? "bg-indigo-600 text-white shadow" : "text-gray-700 hover:bg-indigo-50"
          }`}
        >
          <PlusCircle className="w-5 h-5" /> Post Job
        </button>

        <button
          onClick={() => setActive("myjobs")}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full transition ${
            active === "myjobs" ? "bg-indigo-600 text-white shadow" : "text-gray-700 hover:bg-indigo-50"
          }`}
        >
          <List className="w-5 h-5" /> Applications
          {jobs.length > 0 && (
            <span className="ml-auto bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
              {jobs.length}
            </span>
          )}
        </button>

        <button
          onClick={fetchJobs}
          className="mt-6 flex items-center gap-3 px-4 py-3 w-full rounded-xl bg-white border hover:shadow transition text-gray-600"
        >
          <Users className="text-indigo-600 w-5 h-5" /> Refresh
        </button>
      </aside>

      {/* ── MAIN ── */}
      <main className="ml-72 flex-1 p-8 max-w-5xl">

        {/* ── POST JOB ── */}
        {active === "post" && (
          <div className="bg-white rounded-3xl shadow-md p-8 border">
            <h2 className="text-2xl font-bold text-indigo-600 mb-6 flex items-center gap-2">
              <Briefcase /> Post a New Job
            </h2>

            <form className="space-y-4" onSubmit={handlePostJob}>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  placeholder="Job Title *"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="p-4 rounded-xl border focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                  required
                />
                <input
                  placeholder="Location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  className="p-4 rounded-xl border focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                />
                <input
                  placeholder="Salary (e.g. ₹5-8 LPA)"
                  value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })}
                  className="p-4 rounded-xl border focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                />
                <select
                  value={form.jobType}
                  onChange={(e) => setForm({ ...form, jobType: e.target.value })}
                  className="p-4 rounded-xl border focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                >
                  {["full-time", "part-time", "remote", "internship", "contract"].map((t) => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
                <input
                  placeholder="Skills (comma separated)"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                  className="p-4 rounded-xl border focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                />
                <div>
                  <label className="text-xs text-gray-500 ml-1 mb-1 block">Application Deadline (optional)</label>
                  <input
                    type="date"
                    value={form.deadline}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full p-4 rounded-xl border focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                  />
                </div>
              </div>

              <textarea
                rows={5}
                placeholder="Job Description *"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full p-4 rounded-xl border focus:ring-2 focus:ring-indigo-300 focus:outline-none"
                required
              />

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setForm({ title: "", description: "", location: "", salary: "", skills: "", jobType: "full-time", deadline: "" })}
                  className="px-5 py-2 rounded-xl border"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {loading ? "Posting..." : "Post Job"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── APPLICATIONS ── */}
        {active === "myjobs" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Your Posted Jobs</h2>
            {jobs.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl shadow text-gray-500 text-center">
                No jobs posted yet.{" "}
                <button onClick={() => setActive("post")} className="text-indigo-600 underline">Post one now</button>
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job.jobId} className="bg-white rounded-3xl p-6 shadow border">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-indigo-600">
                        {job.title}
                      </h3>
                      <p className="text-sm text-gray-400 mt-0.5">
                        {job.totalApplicants} applicant{job.totalApplicants !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteJob(job.jobId)}
                      className="flex items-center gap-1 text-sm text-red-400 hover:text-red-600 transition px-3 py-1.5 rounded-lg hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" /> Delete Job
                    </button>
                  </div>

                  {job.applicants.length === 0 ? (
                    <p className="text-sm text-gray-400 py-2">No applicants yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {job.applicants.map((app) => (
                        <div
                          key={app.applicationId}
                          className="flex justify-between items-center p-4 rounded-xl border bg-gray-50 gap-4"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 truncate">{app.name}</p>
                            <p className="text-sm text-gray-500 truncate">{app.email}</p>
                            {app.resume && (
                              <a
                                href={app.resume}
                                target="_blank"
                                rel="noreferrer"
                                className="text-indigo-600 text-sm underline"
                              >
                                📄 View Resume
                              </a>
                            )}
                          </div>

                          <div className="flex gap-2 shrink-0">
                            {app.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(app.applicationId, "selected")}
                                  className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium"
                                >
                                  ✓ Select
                                </button>
                                <button
                                  onClick={() => handleStatusChange(app.applicationId, "rejected")}
                                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium"
                                >
                                  ✕ Reject
                                </button>
                              </>
                            )}
                            {app.status === "selected" && (
                              <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                                ✅ Selected
                              </span>
                            )}
                            {app.status === "rejected" && (
                              <span className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium">
                                ✕ Rejected
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

