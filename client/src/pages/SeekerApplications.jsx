import React, { useEffect, useState, useCallback } from "react";
import { useAppContext } from "../context/AppContext";
import { CheckCircle, XCircle, Clock } from "lucide-react";

// 🔹 Status config
const STATUS_CONFIG = {
  pending: {
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Icon: Clock,
  },
  selected: {
    color: "bg-green-100 text-green-800 border-green-200",
    Icon: CheckCircle,
  },
  rejected: {
    color: "bg-red-100 text-red-800 border-red-200",
    Icon: XCircle,
  },
  default: {
    color: "bg-gray-100 text-gray-600 border-gray-200",
    Icon: Clock,
  },
};

export default function SeekerApplications() {
  const { api, token } = useAppContext();

  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApps = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError(null);

      const { data } = await api.get("/applications/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setApps(data?.applications || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  }, [api, token]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-gray-500 animate-pulse text-lg">
          Loading applications...
        </div>
      </div>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <p className="text-red-500 mb-4 font-medium">{error}</p>
        <button
          onClick={fetchApps}
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="pt-28 px-4 sm:px-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center text-indigo-600">
        My Applications
      </h1>

      {/* EMPTY STATE */}
      {apps.length === 0 ? (
        <div className="bg-white p-10 rounded-2xl shadow-md text-center border">
          <p className="text-gray-500 text-lg">
            You haven’t applied to any jobs yet.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {apps.map((a) => {
            const config = STATUS_CONFIG[a.status] || STATUS_CONFIG.default;
            const StatusIcon = config.Icon;

            return (
              <div
                key={a._id}
                className="bg-white border border-gray-100 hover:shadow-lg transition-all duration-200 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >

                {/* LEFT SIDE */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-1">
                <img
                  src={
                    a.job?.postedBy?.profilePhoto ||
                    "https://via.placeholder.com/30"
                  }
                  alt="user"
                  className="w-10 h-10 rounded-full object-cover border"
                />
                <span className="text-sm text-gray-600 font-medium">
                  {a.job?.postedBy?.name || "Unknown"}
                </span>
              </div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {a.job?.title || "Job Title"}
                  </h3>

                  <p className="text-sm text-gray-700">
                    📍 {a.job?.location || "Location not specified"}
                  </p>

                  <p className="text-xs text-gray-700">
                    Applied on{" "}
                    {a.createdAt
                      ? new Date(a.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                {/* STATUS BADGE */}
                <div
                  className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-sm font-medium w-fit ${config.color}`}
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