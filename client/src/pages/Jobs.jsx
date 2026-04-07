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
      const company = (job.postedBy?.name || "").toLowerCase();
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

  if (loadingUser || loading) {
    return <p className="pt-28 text-center text-gray-500">Loading jobs...</p>;
  }

  return (
    <div className="pt-28 min-h-screen bg-linear-to-br from-indigo-100 via-white to-purple-100 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Explore Job Opportunities
          </h1>
          <p className="text-gray-600 mt-2">
            Find roles that match your skills & passion
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow p-4 mb-10 flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-3 w-full">
            <Search className="text-gray-400" size={18} />
            <input
              className="w-full bg-transparent outline-none"
              placeholder="Search job title, company, description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-64">
            <MapPin className="text-gray-400" size={18} />
            <input
              className="w-full bg-transparent outline-none"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        {filteredJobs.length === 0 ? (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-600">
            No jobs found
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-3xl shadow-md hover:shadow-2xl transition-all border border-gray-100 p-6 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-bold text-indigo-600 mb-1">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {job.location} • {job.salary}
                  </p>
                  <p className="text-gray-700 text-sm line-clamp-3 wrap-break-word">
                    {job.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Briefcase size={16} />
                    {job.postedBy?.name || "Company"}
                  </div>

                  <button
                    onClick={() => navigate(`/jobs/${job._id}`)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                  >
                    View Details
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
