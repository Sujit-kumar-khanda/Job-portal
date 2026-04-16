import React, { useEffect, useMemo, useState } from "react";
import { Search, MapPin, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function Jobs() {
  const { api, toast, loadingUser } = useAppContext();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (loadingUser) return;

    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await api.get("/jobs/all");
        setJobs(res.data?.jobs || []);
      } catch (err) {
        toast.error(err?.response?.data?.message || "Failed to load jobs");
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
      const title = job.title?.toLowerCase() || "";
      const jobLocation = job.location?.toLowerCase() || "";
      const company = job.postedBy?.name?.toLowerCase() || "";
      const description = job.description?.toLowerCase() || "";

      return (
        (!searchTerm ||
          title.includes(searchTerm) ||
          company.includes(searchTerm) ||
          description.includes(searchTerm)) &&
        (!locationTerm || jobLocation.includes(locationTerm))
      );
    });
  }, [jobs, search, location]);

  if (loadingUser || loading) {
    return (
      <div className="pt-32 text-center text-gray-500 animate-pulse">
        Loading jobs...
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#0b0f1a] text-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold">
            Explore <span className="text-indigo-400">Jobs</span>
          </h1>
          <p className="text-gray-400 mt-2">
            Discover real opportunities built for your career growth
          </p>
        </div>

        {/* SEARCH SECTION (HUMANIZED UI) */}
        <div className="mb-10 grid md:grid-cols-2 gap-4">
          {/* Search */}
          <div
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3
                          hover:bg-white/10 transition duration-300"
          >
            <Search size={18} className="text-gray-400" />
            <input
              className="w-full bg-transparent outline-none text-white placeholder-gray-500"
              placeholder="Search jobs, companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Location */}
          <div
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3
                          hover:bg-white/10 transition duration-300"
          >
            <MapPin size={18} className="text-gray-400" />
            <input
              className="w-full bg-transparent outline-none text-white placeholder-gray-500"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        {/* EMPTY STATE */}
        {filteredJobs.length === 0 ? (
          <div className="text-center text-gray-500 py-10">No jobs found</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="group bg-white/5 border border-white/10 rounded-2xl p-6
                           transition-all duration-300
                           hover:-translate-y-1 hover:bg-white/10
                           hover:shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
              >
                {/* Title */}
                <h3 className="text-xl font-semibold text-indigo-300">
                  {job.title}
                </h3>

                {/* Meta */}
                <p className="text-sm text-gray-400 mt-1">
                  {job.location} • {job.salary}
                </p>

                {/* Description */}
                <p className="text-gray-300 text-sm mt-4 line-clamp-3">
                  {job.description}
                </p>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400 text-sm">
                    <img
                      src={
                        job.postedBy?.profilePhoto ||
                        "https://via.placeholder.com/30"
                      }
                      alt="company"
                      className="w-8 h-8 rounded-full object-cover border"
                    />

                    {job.postedBy?.name || "Company"}
                  </div>

                  <button
                    onClick={() => navigate(`/jobs/${job._id}`)}
                    className="px-4 py-2 rounded-lg bg-indigo-500/90
                               hover:bg-indigo-500
                               active:scale-95
                               transition"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
