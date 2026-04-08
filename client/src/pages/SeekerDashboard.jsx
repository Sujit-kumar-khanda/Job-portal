import React, { useState } from "react";
import { User, Briefcase, FileText, BookOpen, ChevronRight, ChevronLeft } from "lucide-react";

// Make sure these paths match your folder structure
import SeekerProfile from "./SeekerProfile";
import SeekerJobs from "./SeekerJobs";
import SeekerApplications from "./SeekerApplications";
import ResumeBuilder from "./ResumeBuilder";

export default function SeekerDashboard() {
  const [tab, setTab] = useState("profile");
  
  // Controls the manual click-to-close/open feature
  const [isPinned, setIsPinned] = useState(false);

  const tabs = [
    { key: "profile", label: "My Profile", icon: User },
    { key: "jobs", label: "Explore Jobs", icon: Briefcase },
    { key: "resume", label: "Resume Builder", icon: BookOpen },
    { key: "applications", label: "Applications", icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12 font-sans text-slate-900">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* DASHBOARD HEADER & TAB NAVIGATION */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
          
          {/* Title Area */}
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Seeker Dashboard
            </h1>
            <p className="text-slate-500 mt-1 text-sm">
              Manage your profile, build your resume, and track applications.
            </p>
          </div>

          {/* ── DYNAMIC ANIMATED PILL NAVIGATION ── */}
          <nav 
            className="group flex items-center gap-2 p-1.5 bg-white border border-slate-200 rounded-full shadow-sm w-max transition-all duration-300 ease-in-out"
          >
            {tabs.map(({ key, label, icon: Icon }) => {
              const isActive = tab === key;

              return (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex items-center justify-center rounded-full transition-all duration-500 ease-in-out overflow-hidden ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200 px-5 py-2.5"
                      : "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900 p-2.5 sm:px-3"
                  }`}
                >
                  {/* Icon */}
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-indigo-100" : ""}`} />
                  
                  {/* Animated Text Label */}
                  <span
                    className={`font-semibold text-sm whitespace-nowrap transition-all duration-500 ease-in-out ${
                      isActive || isPinned
                        ? "max-w-[150px] opacity-100 ml-2.5" // Always show if active or pinned
                        : "max-w-0 opacity-0 ml-0 sm:group-hover:max-w-[150px] sm:group-hover:opacity-100 sm:group-hover:ml-2.5" // Show on hover (desktop only)
                    }`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}

            {/* Vertical Divider */}
            <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>

            {/* Pin/Close Toggle Button */}
            <button
              onClick={() => setIsPinned(!isPinned)}
              className="hidden sm:flex items-center justify-center p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors"
              title={isPinned ? "Collapse Menu" : "Keep Menu Open"}
            >
              {isPinned ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </nav>

        </div>

        {/* MAIN CONTENT AREA */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 min-h-[calc(100vh-16rem)] overflow-hidden flex flex-col">
          
          {/* Dynamic View Container */}
          <div className="flex-1 h-full relative">
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