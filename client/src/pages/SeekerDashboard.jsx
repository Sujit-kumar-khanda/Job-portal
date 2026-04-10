import React, { useState } from "react";
import { User, Briefcase, FileText, BookOpen } from "lucide-react";
import SeekerProfile from "./SeekerProfile";
import SeekerJobs from "./SeekerJobs";
import SeekerApplications from "./SeekerApplications";
import ResumeBuilder from "./ResumeBuilder";


export default function SeekerDashboard() {
  const [tab, setTab] = useState("profile"); // profile | jobs | applications

  const tabs = [
    { key: "profile", label: "Profile", icon: User },
    {key: "posts", label: "Posts", icon: FileText},
    { key: "jobs", label: "Jobs", icon: Briefcase },
    { key: "resume", label: "Resume Builder", icon: BookOpen },
    { key: "applications", label: "Applications", icon: FileText },
  ];

  return (
    <div className="pt-28 min-h-screen bg-linear-to-br from-indigo-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Dashboard Card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Seeker Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your profile, explore jobs, and track applications
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-3 mb-8">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all ${
                  tab === key
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="animate-fade-in">
            {tab === "profile" && <SeekerProfile />}
            
            {tab === "jobs" && <SeekerJobs />}
            {tab === "resume" && <ResumeBuilder />}
            {tab === "applications" && <SeekerApplications />}
          </div>
        </div>
      </div>
    </div>
  );
}
