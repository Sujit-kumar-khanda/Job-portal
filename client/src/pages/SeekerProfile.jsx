// SeekerProfile.jsx
import { CircleCheckBig } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useSeekerProfile } from "../components/hooks/seekerHooks/useSeekerProfile";

export default function SeekerProfile() {
  const { api, user, setUser, toast } = useAppContext();

  const {
    mode,
    savedProfile,
    form,
    skillInput,
    suggestions,
    selectedSkills,
    uploading,
    loading,
    fileInputKey,
    completeness,
    setMode,
    handleOnchange,
    handleSkillChange,
    addSkill,
    removeSkill,
    handleSave,
    handleFileUpload,
    getFileUrl,
  } = useSeekerProfile(api, user, setUser, toast);

  if (!savedProfile) {
    return <div className="p-10 text-center">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8 mt-6">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold">My Profile</h2>
        <p className="text-gray-500 text-sm">Manage your information</p>
      </div>

      {/* COMPLETENESS */}
      <div className="mb-6">
        <p className="text-sm mb-1">
          Profile completeness: {completeness}%
        </p>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-indigo-600 rounded-full"
            style={{ width: `${completeness}%` }}
          />
        </div>
      </div>

      {/* EDIT MODE */}
      {mode === "edit" && (
        <form onSubmit={handleSave} className="space-y-4">

          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleOnchange}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleOnchange}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <textarea
            name="headline"
            placeholder="Headline"
            value={form.headline}
            onChange={handleOnchange}
            rows={2}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <input
            name="education"
            placeholder="Education"
            value={form.education}
            onChange={handleOnchange}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {/* SKILLS */}
          <div>
            <input
              type="text"
              value={skillInput}
              onChange={handleSkillChange}
              placeholder="Enter skills"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
            />

            {suggestions.length > 0 && (
              <div className="border mt-2 rounded-xl bg-white shadow max-h-40 overflow-y-auto">
                {suggestions.map((skill, i) => (
                  <div
                    key={i}
                    onClick={() => addSkill(skill)}
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-3">
              {selectedSkills.map((skill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm flex items-center"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-xs hover:text-red-500"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          <textarea
            name="experience"
            placeholder="Experience"
            value={form.experience}
            onChange={handleOnchange}
            rows={4}
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          {/* FILE UPLOAD */}
          <div className="flex gap-4">
            <label className="border p-3 rounded-xl cursor-pointer">
              Upload Resume
              <input
                key={`resume-${fileInputKey}`}
                hidden
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFileUpload(e, "resume")}
                disabled={uploading}
              />
            </label>

            <label className="border p-3 rounded-xl cursor-pointer">
              Upload Photo
              <input
                key={`photo-${fileInputKey}`}
                hidden
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "photo")}
                disabled={uploading}
              />
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setMode("details")}
              className="px-4 py-2 border rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || uploading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-xl disabled:opacity-50"
            >
              {loading ? "Saving..." : uploading ? "Uploading..." : "Save"}
            </button>
          </div>
        </form>
      )}

      {/* DETAILS MODE */}
      {mode === "details" && (
        <div className="space-y-6">

          {/* BASIC INFO */}
          <div className="flex gap-6 items-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
              {savedProfile.profilePhoto ? (
                <img
                  src={getFileUrl(savedProfile.profilePhoto)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold">
                  {savedProfile.name?.charAt(0)}
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <p className="text-xl font-semibold">{savedProfile.name}</p>
                <CircleCheckBig className="w-5 h-5 text-green-500" />
              </div>

              <p className="text-sm text-gray-600">
                {savedProfile.phone || "No phone"} | {user?.email}
              </p>

              <p className="text-sm text-gray-600">
                {savedProfile.headline || "No headline"}
              </p>
            </div>
          </div>

          {/* EDUCATION */}
          <div>
            <h4 className="font-semibold">Education</h4>
            <p>{savedProfile.education || "N/A"}</p>
          </div>

          {/* SKILLS */}
          <div>
            <h4 className="font-semibold mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {(savedProfile.skills || [])
                .filter(Boolean)
                .map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-indigo-100 rounded-full text-sm"
                  >
                    {s}
                  </span>
                ))}
            </div>
          </div>

          {/* EXPERIENCE */}
          <div>
            <h4 className="font-semibold">Experience</h4>
            <p>{savedProfile.experience || "Not added"}</p>
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3">
            <button
              onClick={() => setMode("edit")}
              className="px-5 py-2 bg-indigo-600 text-white rounded-xl"
            >
              Edit Profile
            </button>

            <button
              className="px-5 py-2 border rounded-xl"
              onClick={() => alert("Help section")}
            >
              Help
            </button>
          </div>

        </div>
      )}
    </div>
  );
}