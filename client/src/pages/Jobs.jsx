import React, { useEffect, useMemo, useState } from "react";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Building2, 
  CalendarClock, 
  Clock, 
  Banknote 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function Jobs() {
  const { api, toast, loadingUser, BASE_URL } = useAppContext();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const backendUrl = BASE_URL || "http://localhost:5000";

  useEffect(() => {
    if (loadingUser) return;

    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs/all");
        setJobs(res.data.jobs || []);
      } catch {
        toast.error("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [api, loadingUser, toast]);

  const filteredJobs = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();
    const locationTerm = location.toLowerCase().trim();

    return jobs.filter((job) => {
      const title = (job.title || "").toLowerCase();
      const jobLocation = (job.location || "").toLowerCase();
      const company = (job.postedBy?.companyName || job.postedBy?.name || "").toLowerCase();
      const description = (job.description || "").toLowerCase();

      const matchesSearch =
        !searchTerm ||
        title.includes(searchTerm) ||
        company.includes(searchTerm) ||
        description.includes(searchTerm);

      const matchesLocation =
        !locationTerm || jobLocation.includes(locationTerm);

      return matchesSearch && matchesLocation;
    });
  }, [jobs, search, location]);

  // Modern Skeleton Loader
  if (loadingUser || loading) {
    return (
      <div className="pt-28 min-h-screen bg-slate-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="h-12 w-64 bg-slate-200 rounded-lg animate-pulse mx-auto mb-10" />
          <div className="h-16 w-full bg-slate-200 rounded-2xl animate-pulse mb-10" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white h-72 rounded-2xl border border-slate-200 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16 min-h-screen bg-slate-50 px-4 sm:px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* PAGE HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Job Opportunities
          </h1>
          <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
            Discover roles that match your skills, connect with top companies, and take the next step in your career.
          </p>
        </div>

        {/* MODERN SEARCH & FILTER BAR */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-2 mb-10 flex flex-col md:flex-row gap-2">
          
          <div className="flex items-center gap-3 w-full px-4 py-2 bg-slate-50 rounded-xl border border-transparent focus-within:border-indigo-200 focus-within:bg-white transition-colors">
            <Search className="text-slate-400 shrink-0" size={18} />
            <input
              className="w-full bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400 py-1.5"
              placeholder="Search job title, company, or keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-80 px-4 py-2 bg-slate-50 rounded-xl border border-transparent focus-within:border-indigo-200 focus-within:bg-white transition-colors">
            <MapPin className="text-slate-400 shrink-0" size={18} />
            <input
              className="w-full bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400 py-1.5"
              placeholder="City, state, or remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

        </div>

        {/* RESULTS FEED */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
              <Search className="text-slate-400 w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No jobs found</h3>
            <p className="text-slate-500 mt-1 max-w-sm">
              We couldn't find any jobs matching your search criteria. Try adjusting your filters or keywords.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => {
              
              // Extract variables safely
              const companyName = job.postedBy?.companyName || job.postedBy?.name || "Confidential Company";
              const companyLogo = job.postedBy?.profilePhoto;
              
              // Format deadline
              const hasDeadline = !!job.deadline;
              const deadlineDate = hasDeadline 
                ? new Date(job.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                : "Open";
              
              // Check if deadline has passed
              const isExpired = hasDeadline && new Date(job.deadline) < new Date();

              return (
                <div
                  key={job._id}
                  onClick={() => navigate(`/jobs/${job._id}`)}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200 p-6 flex flex-col h-full cursor-pointer group"
                >
                  
                  {/* Top: Logo & Title */}
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
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-1">
                        {job.title}
                      </h3>
                      <p className="text-sm font-medium text-slate-500 mt-1 line-clamp-1">
                        {companyName}
                      </p>
                    </div>
                  </div>

                  {/* Middle: Badges */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">
                      <MapPin size={12} /> {job.location || "Remote"}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold capitalize">
                      <Clock size={12} /> {job.jobType || "Full-time"}
                    </span>
                    {job.salary && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold">
                        <Banknote size={12} /> {job.salary}
                      </span>
                    )}
                  </div>

                  {/* Description Preview */}
                  <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-1">
                    {job.description}
                  </p>

                  {/* Bottom: Deadline & Button */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                    
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${isExpired ? 'text-rose-500' : 'text-slate-500'}`}>
                      <CalendarClock size={14} />
                      {isExpired ? "Expired" : `Apply by ${deadlineDate}`}
                    </div>

                    <span className="text-sm font-bold text-indigo-600 group-hover:text-indigo-700">
                      View Details →
                    </span>
                    
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}