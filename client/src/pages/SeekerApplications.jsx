import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Building2, 
  Calendar, 
  ChevronRight, 
  FileText 
} from "lucide-react";

export default function SeekerApplications() {
  const { api, toast, token, BASE_URL } = useAppContext();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = BASE_URL || "http://localhost:5000";

  useEffect(() => {
    if (!token) return;

    const fetchApps = async () => {
      try {
        const res = await api.get("/applications/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApps(res.data.applications || []);
      } catch (err) {
        toast.error("Failed to load application history");
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [api, token, toast]);

  // Loading Skeleton
  if (loading) {
    return (
      <div className="p-6 sm:p-10 h-full">
        <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse mb-8" />
        <div className="border border-slate-200 rounded-2xl overflow-hidden">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-6 border-b border-slate-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-200 rounded-xl animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-1/3 bg-slate-200 rounded animate-pulse" />
                <div className="h-4 w-1/4 bg-slate-100 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 h-full flex flex-col">
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Application History</h2>
        <p className="text-slate-500 text-sm mt-1">
          You have applied to <span className="font-semibold text-slate-700">{apps.length}</span> {apps.length === 1 ? 'job' : 'jobs'}.
        </p>
      </div>

      {apps.length === 0 ? (
        
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
          <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <FileText className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No applications yet</h3>
          <p className="text-slate-500 max-w-sm mb-6">
            You haven't applied to any jobs yet. Start exploring roles that match your skills to build your career.
          </p>
          <button className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm hover:shadow-md">
            Explore Jobs
          </button>
        </div>

      ) : (

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <ul className="divide-y divide-slate-100">
            {apps.map((a) => {
              
              let statusStyle = { bg: "bg-slate-100", text: "text-slate-600", border: "border-slate-200", icon: Clock };
              
              if (a.status === "pending" || a.status === "reviewing") {
                statusStyle = { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: Clock };
              } else if (a.status === "selected" || a.status === "accepted" || a.status === "hired") {
                statusStyle = { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: CheckCircle };
              } else if (a.status === "rejected") {
                statusStyle = { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200", icon: XCircle };
              }

              const StatusIcon = statusStyle.icon;
              const formattedDate = new Date(a.createdAt).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
              });

              // ⬇️ OPTION 2 LOGIC: Grabbing the data from the deep-populated 'postedBy' user profile
              const employerName = a.job?.postedBy?.companyName || a.job?.postedBy?.name || "Confidential Company";
              const companyLogo = a.job?.postedBy?.profilePhoto;

              return (
                <li 
                  key={a._id} 
                  className="group flex flex-col md:flex-row md:items-center justify-between p-5 hover:bg-slate-50 transition-colors duration-200 cursor-pointer"
                >
                  
                  <div className="flex items-start gap-4 mb-4 md:mb-0">
                    
                    {/* Dynamic Company Logo */}
                    <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden text-slate-400 group-hover:border-indigo-200 transition-colors relative shadow-sm">
                      {companyLogo ? (
                        <>
                          <img 
                            src={`${backendUrl}${companyLogo}`} 
                            alt={employerName} 
                            className="w-full h-full object-cover relative z-10 bg-white"
                            onError={(e) => {
                              e.target.style.display = 'none'; 
                            }}
                          />
                          <Building2 className="w-5 h-5 absolute z-0 text-slate-300" />
                        </>
                      ) : (
                        <Building2 className="w-5 h-5" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {a.job?.title || "Position Closed"}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-slate-500">
                        {/* ⬇️ Render the extracted Employer Name */}
                        <span className="font-semibold text-slate-700">{employerName}</span>
                        <span className="hidden sm:inline text-slate-300">•</span>
                        <span>{a.job?.location || "Location not specified"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 md:w-1/3">
                    <div className="flex flex-col items-start md:items-end gap-1.5">
                      
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        <span className="capitalize tracking-wide">{a.status}</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-xs text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        Applied {formattedDate}
                      </div>
                    </div>

                    <button className="p-2 text-slate-300 group-hover:text-indigo-600 transition-colors rounded-lg group-hover:bg-indigo-50">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}