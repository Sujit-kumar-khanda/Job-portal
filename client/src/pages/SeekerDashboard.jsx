import React, { useState, lazy, Suspense, useMemo } from "react";
import { User, Briefcase, FileText, BookOpen } from "lucide-react";

// Lazy components
const SeekerProfile = lazy(() => import("./SeekerProfile"));
const SeekerJobs = lazy(() => import("./SeekerJobs"));
const SeekerApplications = lazy(() => import("./SeekerApplications"));
const ResumeBuilder = lazy(() => import("./ResumeBuilder"));

export default function SeekerDashboard() {
  const [tab, setTab] = useState("profile");

  const tabs = useMemo(
    () => [
      { key: "profile", label: "Profile", icon: User, component: SeekerProfile },
      { key: "jobs", label: "Jobs", icon: Briefcase, component: SeekerJobs },
      { key: "resume", label: "Resume", icon: BookOpen, component: ResumeBuilder },
      { key: "applications", label: "Applications", icon: FileText, component: SeekerApplications },
    ],
    []
  );

  const activeTab = tabs.find((t) => t.key === tab);
  const ActiveComponent = activeTab?.component;

  return (
    <div className="min-h-screen pt-28 text-white bg-[#070A12] relative overflow-hidden">

      {/* BACKGROUND GLOW */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-indigo-600/20 blur-[160px]" />
      <div className="absolute bottom-[-120px] right-[-120px] w-[400px] h-[400px] bg-sky-500/20 blur-[160px]" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* GLASS CARD WRAPPER */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-6">

          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-wide">
              Seeker Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Manage your profile, jobs & applications in one place
            </p>
          </div>

          {/* TABS */}
          <div className="flex flex-wrap gap-3 mb-8">

            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`group flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-300 border
                  ${
                    tab === key
                      ? "bg-gradient-to-r from-indigo-500 to-sky-500 text-white shadow-lg shadow-indigo-500/20 border-transparent"
                      : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:scale-[1.05]"
                  }
                `}
              >
                <Icon className="w-4 h-4 group-hover:scale-110 transition" />
                {label}
              </button>
            ))}

          </div>

          {/* CONTENT AREA */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl min-h-[300px] transition-all">
            <Suspense
              fallback={
                <p className="text-center text-gray-400 animate-pulse">
                  Loading dashboard...
                </p>
              }
            >
              {ActiveComponent && <ActiveComponent />}
            </Suspense>
          </div>

        </div>
      </div>
    </div>
  );
}