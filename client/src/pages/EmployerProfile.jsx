import { Edit, Camera, Image as ImageIcon } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useEmployerProfile } from "../components/hooks/employerHooks/useEmployerProfile";

export default function EmployerProfile() {
  const { api, user, setUser, toast } = useAppContext();

  const {
    mode,
    savedProfile,
    form,
    uploading,
    loading,
    fileInputKey,
    completeness,
    setMode,
    handleOnchange,
    handleSave,
    handleFileUpload,
  } = useEmployerProfile(api, user, setUser, toast);

  if (!savedProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-4">

      {/* MAIN CARD */}
      <div className="max-w-4xl mx-auto bg-white/80  backdrop-blur-xl shadow-2xl rounded-3xl border border-gray-100 p-8 mt-10">

        {/* HERO HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">

          {/* LEFT */}
          <div className="flex items-center gap-5">
            <div className="w-24 h-24 rounded-2xl bg-gray-100 overflow-hidden flex items-center justify-center shadow">
              {savedProfile.profilePhoto ? (
                <img
                  src={savedProfile.profilePhoto}
                  alt="logo"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-10 h-10 text-gray-400" />
              )}
            </div>

            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                {savedProfile.name}
              </h2>
              <p className="text-indigo-600 font-medium">
                {savedProfile.email}
              </p>

              <span className="inline-flex mt-2 px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                Active Employer
              </span>
            </div>
          </div>

          {/* RIGHT - COMPLETENESS */}
          <div className="w-full md:w-64">
            <p className="text-sm mb-1 text-gray-600">
              Profile completeness: {completeness}%
            </p>

            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        </div>

        {/* ================= EDIT MODE ================= */}
        {mode === "edit" && (
          <form onSubmit={handleSave} className="space-y-5">

            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="name"
                placeholder="Company Name"
                value={form.name}
                onChange={handleOnchange}
                className="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-indigo-400 outline-none"
              />

              <input
                name="email"
                type="email"
                placeholder="Company Email"
                value={form.email}
                onChange={handleOnchange}
                className="w-full p-4 border rounded-2xl focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>

            {/* UPLOAD CARD */}
            <label
              htmlFor={`photo-${fileInputKey}`}
              className={`block w-full p-8 border-2 border-dashed rounded-2xl text-center cursor-pointer transition ${
                uploading
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:border-indigo-400 hover:bg-indigo-50"
              }`}
            >
              {uploading ? (
                <p className="text-gray-500">Uploading...</p>
              ) : (
                <>
                  <Camera className="w-10 h-10 mx-auto mb-2 text-gray-400" />
                  <p className="font-semibold text-gray-700">
                    Upload Company Logo
                  </p>
                  <p className="text-sm text-gray-500">
                    JPG, PNG up to 5MB
                  </p>
                </>
              )}

              <input
                id={`photo-${fileInputKey}`}
                key={fileInputKey}
                hidden
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={handleFileUpload}
              />
            </label>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setMode("details")}
                className="px-6 py-2 border rounded-2xl hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || uploading}
                className="px-8 py-2 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        )}

        {/* ================= DETAILS MODE ================= */}
        {mode === "details" && (
          <div className="space-y-6">

            {/* INFO CARD */}
            <div className="bg-gray-50 rounded-2xl p-6 border flex items-center justify-between">

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white shadow overflow-hidden flex items-center justify-center">
                  {savedProfile.profilePhoto ? (
                    <img
                      src={savedProfile.profilePhoto}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                <div>
                  <p className="font-bold text-lg text-gray-800">
                    {savedProfile.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {savedProfile.email}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setMode("edit")}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}