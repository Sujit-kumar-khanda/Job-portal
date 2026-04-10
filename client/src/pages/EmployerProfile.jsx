// EmployerProfile.jsx
import { User, Edit, Camera, Mail, Image as ImageIcon } from "lucide-react";
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
    baseURL,
    setMode,
    handleOnchange,
    handleSave,
    handleFileUpload,
  } = useEmployerProfile(api, user, setUser, toast);

  if (!savedProfile) {
    return <div className="p-10 text-center">Loading profile...</div>;
  }

  return (
    <div className="pt-20 min-h-screen bg-linear-to-br from-indigo-100 via-white to-blue-100">
      <div className="  max-w-2xl mx-auto bg-white rounded-3xl shadow-xl p-8 mt-6">
        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Employer Profile</h2>
          <p className="text-gray-500 text-sm">
            Manage your company information
          </p>
        </div>

        {/* COMPLETENESS */}
        <div className="mb-6">
          <p className="text-sm mb-1">Profile completeness: {completeness}%</p>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-emerald-600 rounded-full"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>

        {/* EDIT MODE */}
        {mode === "edit" && (
          <form onSubmit={handleSave} className="space-y-6">
            <input
              name="name"
              placeholder="Company Name"
              value={form.name}
              onChange={handleOnchange}
              className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-400 outline-none"
            />

            <input
              name="email"
              type="email"
              placeholder="Company Email"
              value={form.email}
              onChange={handleOnchange}
              className="w-full p-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-400 outline-none"
            />

            {/* PHOTO UPLOAD */}
            <div>
              <label
                htmlFor={`photo-${fileInputKey}`}
                className={`block w-full p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
                  uploading
                    ? "border-gray-300 bg-gray-50 cursor-not-allowed"
                    : "border-gray-200 hover:border-indigo-400 hover:bg-indigo-50"
                }`}
              >
                {uploading ? (
                  "Uploading..."
                ) : (
                  <>
                    <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-lg font-semibold text-gray-700">
                      Upload Company Logo
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
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
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setMode("details")}
                className="px-6 py-2 border border-gray-200 rounded-2xl hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || uploading}
                className="px-8 py-2 bg-emerald-600 text-white rounded-2xl font-semibold hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        )}

        {/* DETAILS MODE */}
        {mode === "details" && (
          <div className="space-y-8">
            {/* HEADER SECTION */}
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gray-100 flex items-center justify-center overflow-hidden relative">
                {savedProfile.profilePhoto ? (
                  <img
                    src={savedProfile.profilePhoto}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {savedProfile.name}
                </h3>
                <p className="text-indigo-600 font-semibold mt-1">
                  {savedProfile.email}
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setMode("edit")}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition"
              >
                <Edit className="w-4 h-4 inline mr-2" />
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
