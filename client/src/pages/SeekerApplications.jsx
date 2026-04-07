import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function SeekerApplications() {
  const { api, toast, token } = useAppContext();
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return; // Prevent calling API without login

    const fetchApps = async () => {
      try {
        const res = await api.get("/applications/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApps(res.data.applications || []);
      } catch (err) {
        toast.error("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, [api, token, toast]);

  if (loading)
    return (
      <p className="pt-28 text-center text-gray-600 animate-pulse">
        Loading applications...
      </p>
    );

  return (
    <div className="pt-28 px-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
        My Applications
      </h1>

      {apps.length === 0 ? (
        <div className="bg-white p-6 rounded-2xl shadow-md text-center text-gray-500">
          No applications yet
        </div>
      ) : (
        <div className="space-y-5">
          {apps.map((a) => {
            let statusColor, StatusIcon;

            switch (a.status) {
              case "pending":
                statusColor = "bg-yellow-100 text-yellow-800";
                StatusIcon = Clock;
                break;
              case "selected":
                statusColor = "bg-green-100 text-green-800";
                StatusIcon = CheckCircle;
                break;
              case "rejected":
                statusColor = "bg-red-100 text-red-800";
                StatusIcon = XCircle;
                break;
              default:
                statusColor = "bg-gray-100 text-gray-600";
                StatusIcon = Clock;
            }

            return (
              <div
                key={a._id}
                className="bg-white p-5 rounded-2xl shadow-md flex justify-between items-center transition hover:shadow-lg"
              >
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {a.job?.title || "Job Title"}
                  </h3>
                  <p className="text-sm text-gray-500">{a.job?.location || "N/A"}</p>
                  <p className="text-sm text-gray-400">
                    Applied: {new Date(a.createdAt).toLocaleString()}
                  </p>
                </div>

                {/* Status Badge */}
                <div
                  className={`flex items-center gap-2 px-3 py-1 rounded-full font-medium ${statusColor}`}
                >
                  <StatusIcon className="w-4 h-4" />
                  <span className="capitalize">{a.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
