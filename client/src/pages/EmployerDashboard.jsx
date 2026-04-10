import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { PlusCircle, List, Users, Briefcase } from "lucide-react";
import { useEmployerDashboard } from "../components/hooks/employerHooks/useEmployerDashboard";

export default function EmployerDashboard() {
  const { api, user, loadingUser, toast } = useAppContext();

  // ================= CUSTOM HOOK =================
  const {
    skillInput, // for skill input field
    suggestions, // for skill suggestions dropdown
    selectedSkills, // for storing selected skills as an array of strings
    active, // "post" or "myjobs"
    formData, // form data for posting a job
    jobs, // jobs posted by employer along with applicants
    loading, // for post job button loading state
    setActive, // to switch between "post" and "myjobs" views
    setFormData, // to update form data for posting a job
    setSelectedSkills, // to update selected skills for a job


    // ================= HANDLERS =================
    handleSkillChange, // to handle changes in skill input and show suggestions
    addSkill, // to add a skill from suggestions to selected skills
    removeSkill, // to remove a skill from selected skills
    handlePostJob, // to handle posting a new job
    fetchJobs, // to fetch jobs posted by employer along with applicants
    handleStatusChange, // to handle status change of an application (select/reject)
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
    <div className="pt-24 min-h-screen bg-linear-to-br from-indigo-100 via-white to-purple-100 flex">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-72 fixed left-0 top-24 h-[calc(100vh-7rem)] bg-white/70 backdrop-blur-xl rounded-tr-3xl rounded-br-3xl p-6 shadow-xl border border-gray-100">
        <h3 className="text-xl font-bold text-indigo-600 mb-8">
          Employer Panel
        </h3>

        {[
          { key: "post", label: "Post Job", icon: <PlusCircle size={18} /> },
          { key: "myjobs", label: "Applications", icon: <List size={18} /> },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full mb-3 transition ${
              active === item.key
                ? "bg-indigo-600 text-white shadow-md"
                : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}

        <button
          onClick={fetchJobs}
          className="mt-6 flex items-center gap-3 px-4 py-3 w-full rounded-xl bg-white border border-gray-200 hover:shadow-md transition"
        >
          <Users size={18} className="text-indigo-600" />
          Refresh
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="ml-72 flex-1 p-8 max-w-6xl">
        {/* ================= POST JOB ================= */}
        {active === "post" && (
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
            <h2 className="text-2xl font-semibold text-indigo-600 mb-6 flex items-center gap-2">
              <Briefcase size={22} /> Post a New Job
            </h2>

            <form className="space-y-4" onSubmit={handlePostJob}>
              {["title", "location", "salary"].map((field) => (
                <input
                  key={field}
                  placeholder={field}
                  name={field}
                  value={formData[field]}
                  onChange={(e) =>
                    setFormData({ ...formData, [field]: e.target.value })
                  }
                  className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                />
              ))}
              {/* skills input with suggestions */}
              <div className="relative">
                <input
                  type="text"
                  value={skillInput}
                  onChange={handleSkillChange}
                  placeholder="Enter skills (React, Node...)"
                  className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                />

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border rounded-xl mt-1 shadow-lg max-h-48 overflow-y-auto">
                    {suggestions.map((skill, index) => (
                      <div
                        key={index}
                        onClick={() => addSkill(skill)}
                        className="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                )}

                {/* Selected Skills */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {selectedSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-2 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-xs hover:text-red-500"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              </div>
              {/* description textarea */}
              <textarea
                rows={5}
                placeholder="Job Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <div className="flex justify-end gap-4">
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
                  className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-100"
                >
                  Reset
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
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
                No applications received yet.
              </div>
            ) : (
              jobs.map((job) => (
                <div
                  key={job.jobId}
                  className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition"
                >
                  <h3 className="text-lg font-semibold text-indigo-600 mb-4">
                    {job.title}
                    <span className="ml-2 text-sm text-gray-500">
                      ({job.totalApplicants} applicants)
                    </span>
                  </h3>

                  {job.applicants.length === 0 ? (
                    <p className="text-sm text-gray-500">No applicants yet</p>
                  ) : (
                    job.applicants.map((app) => (
                      <div
                        key={app.applicationId}
                        className="flex justify-between items-center p-4 rounded-xl border border-gray-100 mb-3 bg-gray-50 hover:shadow-sm"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {app.name}
                          </p>
                          <p className="text-sm text-gray-500">{app.email}</p>

                          {app.resume && (
                            <a
                              href={app.resume}
                              target="_blank"
                              rel="noreferrer"
                              className="text-indigo-600 text-sm underline hover:text-indigo-800"
                            >
                              View Resume
                            </a>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {app.status === "pending" && (
                            <>
                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    app.applicationId,
                                    "selected",
                                  )
                                }
                                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                              >
                                Select
                              </button>

                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    app.applicationId,
                                    "rejected",
                                  )
                                }
                                className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {app.status === "selected" && (
                            <span className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                              Selected
                            </span>
                          )}

                          {app.status === "rejected" && (
                            <span className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-full">
                              Rejected
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