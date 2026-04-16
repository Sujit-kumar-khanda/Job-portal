import React from "react";
import { useAppContext } from "../context/AppContext";
import { PlusCircle, List, Users, Briefcase } from "lucide-react";
import { useEmployerDashboard } from "../components/hooks/employerHooks/useEmployerDashboard";

export default function EmployerDashboard() {
  const { api, user, loadingUser, toast } = useAppContext();

  const {
    skillInput,
    suggestions,
    selectedSkills,
    active,
    formData,
    jobs,
    loading,
    setActive,
    setFormData,
    setSelectedSkills,
    handleSkillChange,
    addSkill,
    removeSkill,
    handlePostJob,
    fetchJobs,
    handleStatusChange,
  } = useEmployerDashboard(api, user, loadingUser, toast);

  if (loadingUser)
    return <p className="pt-28 text-center text-gray-500">Loading...</p>;

  if (!user || user.role !== "employer")
    return (
      <p className="pt-28 text-center text-red-600 font-semibold">
        Access denied
      </p>
    );

  return (
    <div className="pt-24 min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-72 fixed left-0 top-24 h-[calc(100vh-6rem)] bg-white/80 backdrop-blur-xl border-r border-gray-200 p-6 shadow-lg">

        <h3 className="text-xl font-bold text-indigo-600 mb-8">
          Employer Panel
        </h3>

        <div className="space-y-3">
          {[
            { key: "post", label: "Post Job", icon: <PlusCircle size={18} /> },
            { key: "myjobs", label: "Applications", icon: <List size={18} /> },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setActive(item.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                active === item.key
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-600 hover:bg-indigo-50"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}

          
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="ml-72 flex-1 p-6 md:p-10 max-w-6xl">

        {/* ================= POST JOB ================= */}
        {active === "post" && (
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 md:p-8">

            <h2 className="text-2xl font-semibold text-indigo-600 mb-6 flex items-center gap-2">
              <Briefcase size={22} />
              Post a New Job
            </h2>

            <form className="space-y-4" onSubmit={handlePostJob}>

              {["title", "location", "salary"].map((field) => (
                <input
                  key={field}
                  name={field}
                  value={formData[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                  placeholder={field}
                  className="w-full p-4 rounded-xl border focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              ))}

              {/* SKILLS */}
              <div className="relative">

                <input
                  value={skillInput}
                  onChange={handleSkillChange}
                  placeholder="Enter skills (React, Node...)"
                  className="w-full p-4 rounded-xl border focus:ring-2 focus:ring-indigo-400 outline-none"
                />

                {/* suggestions */}
                {suggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border rounded-xl mt-1 shadow-lg max-h-44 overflow-y-auto">
                    {suggestions.map((skill, i) => (
                      <div
                        key={i}
                        onClick={() => addSkill(skill)}
                        className="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                )}

                {/* selected skills */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedSkills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center gap-2"
                    >
                      {skill}
                      <button onClick={() => removeSkill(skill)}>✕</button>
                    </span>
                  ))}
                </div>
              </div>

              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Job Description"
                className="w-full p-4 rounded-xl border focus:ring-2 focus:ring-indigo-400 outline-none"
              />

              <div className="flex justify-end gap-3">
                <button
                  type="reset"
                  onClick={() => {
                    setFormData({
                      title: "",
                      description: "",
                      location: "",
                      salary: "",
                      skills: "",
                    });
                    setSelectedSkills([]);
                  }}
                  className="px-5 py-2 rounded-xl border hover:bg-gray-50"
                >
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  {loading ? "Posting..." : "Post Job"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= APPLICATIONS ================= */}
        {active === "myjobs" && (
          <div className="space-y-6">

            {jobs.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl shadow text-center text-gray-500">
                No applications received yet
              </div>
            ) : (
              jobs.map((job) => (
                <div
                  key={job.jobId}
                  className="bg-white rounded-2xl p-6 border shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-indigo-600 mb-4">
                    {job.title}
                    <span className="text-sm text-gray-500 ml-2">
                      ({job.totalApplicants} applicants)
                    </span>
                  </h3>

                  {job.applicants.length === 0 ? (
                    <p className="text-gray-500 text-sm">No applicants yet</p>
                  ) : (
                    job.applicants.map((app) => (
                      <div
                        key={app.applicationId}
                        className="flex justify-between items-center p-4 mb-3 rounded-xl border bg-gray-50"
                      >
                        <div>
                          <p className="font-medium">{app.name}</p>
                          <p className="text-sm text-gray-500">{app.email}</p>

                          {app.resume && (
                            <a
                              href={app.resume}
                              target="_blank"
                              className="text-indigo-600 text-sm underline"
                            >
                              View Resume
                            </a>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {app.status === "pending" ? (
                            <>
                              <button
                                onClick={() =>
                                  handleStatusChange(app.applicationId, "selected")
                                }
                                className="px-3 py-1 bg-green-500 text-white rounded-lg"
                              >
                                Select
                              </button>

                              <button
                                onClick={() =>
                                  handleStatusChange(app.applicationId, "rejected")
                                }
                                className="px-3 py-1 bg-red-500 text-white rounded-lg"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <span
                              className={`px-3 py-1 text-sm rounded-full ${
                                app.status === "selected"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {app.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
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