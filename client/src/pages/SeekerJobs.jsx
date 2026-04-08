import React, { useEffect, useState, useCallback } from "react";
import { useAppContext } from "../context/AppContext";
import { 
  X, 
  Search, 
  MapPin, 
  Clock, 
  Building2, 
  CalendarClock, 
  Banknote,
  Briefcase
} from "lucide-react";

const JOB_TYPES = ["all", "full-time", "part-time", "remote", "internship", "contract"];

export default function SeekerJobs() {
  const { api, token, user, toast, BASE_URL } = useAppContext();
  const [jobs, setJobs] = useState([]);
  const [appliedIds, setAppliedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const backendUrl = BASE_URL || "http://localhost:5000";

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/jobs/all");
      setJobs(res.data.jobs || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }, [api]);

  const fetchMyApplications = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get("/applications/me");
      const ids = new Set((res.data.applications || []).map((a) => a.job?._id));
      setAppliedIds(ids);
    } catch {
      // silently fail
    }
  }, [api, token]);

  useEffect(() => {
    fetchJobs();
    fetchMyApplications();
  }, [fetchJobs, fetchMyApplications]);

  const applyJob = async (jobId) => {
    if (!token) return toast.error("Please login to apply");
    try {
      setApplyingId(jobId);
      const res = await api.post(`/applications/apply/${jobId}`);
      toast.success(res.data.message || "Applied successfully ✅");
      setAppliedIds((prev) => new Set([...prev, jobId]));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to apply");
    } finally {
      setApplyingId(null);
    }
  };

  // Filter jobs client-side
  const filteredJobs = jobs.filter((job) => {
    const q = search.toLowerCase();
    const companyName = (job.postedBy?.companyName || job.postedBy?.name || "").toLowerCase();
    
    const matchSearch =
      !q ||
      job.title?.toLowerCase().includes(q) ||
      companyName.includes(q) ||
      job.skills?.some((s) => s.toLowerCase().includes(q)) ||
      job.description?.toLowerCase().includes(q);
      
    const matchLocation =
      !locationFilter ||
      job.location?.toLowerCase().includes(locationFilter.toLowerCase());
      
    const matchType = typeFilter === "all" || job.jobType === typeFilter;
    
    return matchSearch && matchLocation && matchType;
  });

  // Modern Skeleton Loader
  if (loading) {
    return (
      <div className="p-6 sm:p-10 h-full">
        <div className="h-12 w-full bg-slate-200 rounded-2xl animate-pulse mb-8" />
        <div className="grid sm:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-white h-64 rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 h-full flex flex-col relative">
      
      {/* ── HEADER & SEARCH CONTROLS ── */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-4">
          Recommended Jobs
        </h2>

        {/* Filter Bar */}
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-2 flex flex-col md:flex-row gap-2">
          
          <div className="flex items-center gap-3 w-full flex-1 px-4 py-2 bg-white rounded-xl border border-transparent focus-within:border-indigo-200 transition-colors shadow-sm">
            <Search className="text-slate-400 shrink-0" size={18} />
            <input
              type="text"
              placeholder="Job title, company, or skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400 py-1"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-64 px-4 py-2 bg-white rounded-xl border border-transparent focus-within:border-indigo-200 transition-colors shadow-sm">
            <MapPin className="text-slate-400 shrink-0" size={18} />
            <input
              type="text"
              placeholder="Location"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="w-full bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400 py-1"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full md:w-48 px-4 py-3 bg-white rounded-xl border border-transparent outline-none text-sm text-slate-700 shadow-sm focus:border-indigo-200 cursor-pointer"
          >
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "All Types" : t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <p className="text-sm text-slate-500 mt-3 font-medium">
          Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
        </p>
      </div>

      {/* ── JOB CARDS GRID ── */}
      {filteredJobs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
          <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <Search className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No jobs found</h3>
          <p className="text-slate-500 max-w-sm mb-4">
            Try adjusting your search or clearing your filters to see more results.
          </p>
          <button
            onClick={() => { setSearch(""); setLocationFilter(""); setTypeFilter("all"); }}
            className="text-indigo-600 font-semibold hover:text-indigo-700"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {filteredJobs.map((job) => {
            const applied = appliedIds.has(job._id);
            const companyName = job.postedBy?.companyName || job.postedBy?.name || "Confidential Company";
            const companyLogo = job.postedBy?.profilePhoto;
            
            const hasDeadline = !!job.deadline;
            const isExpired = hasDeadline && new Date(job.deadline) < new Date();
            const deadlineDate = hasDeadline ? new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Open";

            return (
              <div
                key={job._id}
                className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-slate-200 flex flex-col group"
              >
                
                {/* Header: Logo & Title */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden text-slate-400 group-hover:border-indigo-200 transition-colors">
                    {companyLogo ? (
                      <img 
                        src={`${backendUrl}${companyLogo}`} 
                        alt={companyName} 
                        className="w-full h-full object-cover bg-white"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <Building2 className="w-6 h-6" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-sm font-medium text-slate-500 truncate">
                      {companyName}
                    </p>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">
                    <MapPin size={12} /> {job.location || "Remote"}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold capitalize">
                    <Briefcase size={12} /> {job.jobType || "Full-time"}
                  </span>
                  {job.salary && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold">
                      <Banknote size={12} /> {job.salary}
                    </span>
                  )}
                </div>

                <p className="text-slate-600 text-sm line-clamp-2 mb-5 flex-1">
                  {job.description}
                </p>

                {/* Footer: Deadline & Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                  
                  <div className={`flex items-center gap-1.5 text-xs font-semibold ${isExpired ? 'text-rose-500' : 'text-slate-500'}`}>
                    <CalendarClock size={14} />
                    {isExpired ? "Expired" : `Apply by ${deadlineDate}`}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="px-4 py-2 rounded-lg text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                    >
                      Details
                    </button>
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-bold text-white transition-colors ${
                        applied || isExpired
                          ? "bg-slate-300 cursor-not-allowed"
                          : "bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                      }`}
                      onClick={() => applyJob(job._id)}
                      disabled={applyingId === job._id || applied || isExpired}
                    >
                      {applied ? "Applied" : applyingId === job._id ? "..." : isExpired ? "Closed" : "Apply"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── SLEEK VIEW DETAILS MODAL ── */}
      {selectedJob && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4 sm:p-6"
          onClick={(e) => e.target === e.currentTarget && setSelectedJob(null)}
        >
          <div className="bg-white max-w-3xl w-full rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-500 transition-colors z-10"
            >
              <X size={20} />
            </button>

            {/* Modal Scrollable Content */}
            <div className="overflow-y-auto p-8 sm:p-10 flex-1">
              
              {/* Modal Header */}
              <div className="flex items-center gap-5 mb-8">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden text-slate-400">
                  {selectedJob.postedBy?.profilePhoto ? (
                    <img 
                      src={`${backendUrl}${selectedJob.postedBy.profilePhoto}`} 
                      alt="Company" 
                      className="w-full h-full object-cover bg-white"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  ) : (
                    <Building2 className="w-8 h-8" />
                  )}
                </div>
                <div className="pr-10">
                  <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
                    {selectedJob.title}
                  </h2>
                  <p className="text-indigo-600 font-semibold mt-1">
                    {selectedJob.postedBy?.companyName || selectedJob.postedBy?.name || "Confidential Company"}
                  </p>
                </div>
              </div>

              {/* Quick Facts */}
              <div className="bg-slate-50 rounded-xl border border-slate-100 p-5 grid grid-cols-2 gap-4 mb-8">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Location</p>
                  <p className="font-semibold text-slate-900 flex items-center gap-1.5"><MapPin size={16} className="text-slate-400"/>{selectedJob.location || "N/A"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Job Type</p>
                  <p className="font-semibold text-slate-900 flex items-center gap-1.5 capitalize"><Briefcase size={16} className="text-slate-400"/>{selectedJob.jobType || "Full-time"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Salary</p>
                  <p className="font-semibold text-slate-900 flex items-center gap-1.5"><Banknote size={16} className="text-emerald-500"/>{selectedJob.salary || "Not Disclosed"}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Deadline</p>
                  <p className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <CalendarClock size={16} className={selectedJob.deadline && new Date(selectedJob.deadline) < new Date() ? "text-rose-500" : "text-slate-400"}/>
                    {selectedJob.deadline ? new Date(selectedJob.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric'}) : "Open"}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-bold text-slate-900 mb-3">About the Role</h3>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">
                  {selectedJob.description}
                </p>
              </div>

              {/* Skills */}
              {selectedJob.skills?.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedJob.skills.map((skill, i) => (
                      <span key={i} className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-3 py-1.5 rounded-lg text-sm font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer / Actions */}
            <div className="border-t border-slate-100 p-6 bg-slate-50 flex items-center justify-between shrink-0 rounded-b-[2rem]">
              <p className="text-xs font-medium text-slate-500">
                Posted on {new Date(selectedJob.createdAt).toLocaleDateString()}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedJob(null)}
                  className="px-6 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { applyJob(selectedJob._id); setSelectedJob(null); }}
                  disabled={appliedIds.has(selectedJob._id) || (selectedJob.deadline && new Date(selectedJob.deadline) < new Date())}
                  className={`px-8 py-2.5 rounded-xl text-white font-bold transition-all shadow-sm ${
                    appliedIds.has(selectedJob._id) || (selectedJob.deadline && new Date(selectedJob.deadline) < new Date())
                      ? "bg-slate-300 cursor-not-allowed shadow-none"
                      : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-md"
                  }`}
                >
                  {appliedIds.has(selectedJob._id) ? "Applied ✓" : "Apply Now"}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}