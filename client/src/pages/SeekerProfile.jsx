import { CircleCheckBig, Phone, Mail } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useSeekerProfile } from "../components/hooks/seekerHooks/useSeekerProfile";
import toast from "react-hot-toast";

export default function SeekerProfile() {
  const { api, user, setUser } = useAppContext();

  const {
    mode,
    savedProfile,
    form,
    skillInput,
    suggestions,
    selectedSkills,
    uploading, // { resume: false, photo: false }
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
    return (
      <div className="text-center text-gray-400 animate-pulse py-10">
        Loading profile...
      </div>
    );
  }

  const skills = Array.isArray(savedProfile.skills)
    ? savedProfile.skills
    : [];

  return (
    <div className="w-full text-white">
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-xl">

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold">My Profile</h2>
          <p className="text-gray-400 text-sm">
            Manage your personal and professional details
          </p>
        </div>

        {/* PROGRESS */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Profile Strength</span>
            <span>{completeness}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-sky-500"
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>

        {/* EDIT MODE */}
        {mode === "edit" && (
          <form onSubmit={handleSave} className="space-y-4">

            {["name", "phone", "education"].map((field) => (
              <input
                key={field}
                name={field}
                placeholder={field.toUpperCase()}
                value={form[field]}
                onChange={handleOnchange}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            ))}

            <textarea
              name="headline"
              placeholder="Headline"
              value={form.headline}
              onChange={handleOnchange}
              rows={2}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
            />

            <textarea
              name="experience"
              placeholder="Experience (internships, jobs, projects...)"
              value={form.experience}
              onChange={handleOnchange}
              rows={3}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
            />

            {/* SKILLS */}
            <div>
              <input
                value={skillInput}
                onChange={handleSkillChange}
                placeholder="Add skills"
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white"
              />

              {suggestions.length > 0 && (
                <div className="mt-2 rounded-xl bg-[#0B0F1A]/90 border border-white/10 shadow-lg">
                  {suggestions.map((skill, i) => (
                    <div
                      key={i}
                      onClick={() => addSkill(skill)}
                      className="p-2 hover:bg-white/10 cursor-pointer"
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
                    className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-2 text-xs hover:text-red-400"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* ✅ UPDATED FILE UPLOAD UI ONLY */}
            <div className="flex gap-3">

              {/* RESUME */}
              <label className="flex-1 flex flex-col items-center justify-center px-4 py-3 rounded-xl bg-white/5 border border-dashed border-white/10 cursor-pointer hover:bg-white/10 hover:border-indigo-400 transition relative">

                {/* STATUS */}
                <span className="text-sm flex items-center gap-2">
                  {uploading.resume ? (
                    "Uploading..."
                  ) : savedProfile.resume ? (
                    <>
                      Uploaded <CircleCheckBig className="w-4 h-4 text-green-400" />
                    </>
                  ) : (
                    "Upload Resume"
                  )}
                </span>

                <span className="text-xs text-gray-400 mt-1">
                  PDF, DOC
                </span>

                <input
                  key={`resume-${fileInputKey}`}
                  hidden
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, "resume")}
                />
              </label>

              {/* PHOTO */}
              <label className="flex-1 flex flex-col items-center justify-center px-4 py-3 rounded-xl bg-white/5 border border-dashed border-white/10 cursor-pointer hover:bg-white/10 hover:border-indigo-400 transition relative">

                {/* STATUS */}
                <span className="text-sm flex items-center gap-2">
                  {uploading.photo ? (
                    "Uploading..."
                  ) : savedProfile.profilePhoto ? (
                    <>
                      Uploaded <CircleCheckBig className="w-4 h-4 text-green-400" />
                    </>
                  ) : (
                    "Upload Photo"
                  )}
                </span>

                <span className="text-xs text-gray-400 mt-1">
                  JPG, PNG
                </span>

                <input
                  key={`photo-${fileInputKey}`}
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(e, "photo")}
                />
              </label>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setMode("details")}
                className="px-5 py-2 rounded-xl border border-white/20"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || uploading.resume || uploading.photo}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        )}

        {/* DETAILS MODE (UNCHANGED) */}
        {mode === "details" && (
          <div className="space-y-6">
            <div className="flex gap-6 items-center pb-4 border-b border-white/10">
              <div className="w-20 h-20 rounded-full overflow-hidden border border-white/10">
                {savedProfile.profilePhoto ? (
                  <img
                    src={getFileUrl(savedProfile.profilePhoto)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-xl font-bold">
                    {savedProfile.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  {savedProfile.name}
                  <CircleCheckBig className="w-5 h-5 text-green-400" />
                </h3>

                <p className="text-gray-400 text-sm flex gap-3 mt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Phone size={14} /> {savedProfile.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail size={14} /> {savedProfile.email}
                  </span>
                </p>

                <p className="text-gray-400 mt-1">
                  {savedProfile.headline}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-medium">Education</h4>
              <p className="text-gray-400">{savedProfile.education}</p>
            </div>

            <div>
              <h4 className="font-medium">Experience</h4>
              <p className="text-gray-400 whitespace-pre-line">
                {savedProfile.experience || "No experience added yet"}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-sm"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setMode("edit")}
                className="px-5 py-2 rounded-xl bg-indigo-600"
              >
                Edit Profile
              </button>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}