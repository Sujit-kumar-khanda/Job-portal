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

      {/* GLASS INNER CARD (dashboard style) */}
      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-xl transition-all">

        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold tracking-wide">
            My Profile
          </h2>
          <p className="text-gray-400 text-sm">
            Manage your personal and professional details
          </p>
        </div>

        {/* COMPLETION BAR */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Profile Strength</span>
            <span>{completeness}%</span>
          </div>

          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-sky-500 transition-all duration-500"
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
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none transition"
              />
            ))}

            <textarea
              name="headline"
              placeholder="Headline"
              value={form.headline}
              onChange={handleOnchange}
              rows={2}
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            {/* SKILLS */}
            <div>
              <input
                value={skillInput}
                onChange={handleSkillChange}
                placeholder="Add skills"
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />

              {suggestions.length > 0 && (
                <div className="mt-2 rounded-xl bg-black/60 border border-white/10 overflow-hidden">
                  {suggestions.map((skill, i) => (
                    <div
                      key={i}
                      onClick={() => addSkill(skill)}
                      className="p-2 hover:bg-white/10 cursor-pointer transition"
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
                    className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-sm hover:scale-105 transition"
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

            {/* FILES */}
            <div className="flex gap-3">
              <label className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition">
                {uploading ? "Uploading..." : "Resume"}
                <input
                  key={`resume-${fileInputKey}`}
                  hidden
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileUpload(e, "resume")}
                />
              </label>

              <label className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition">
                {uploading ? "Uploading..." : "Photo"}
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
                className="px-5 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || uploading}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-sky-500 hover:scale-105 transition"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        )}

        {/* DETAILS MODE */}
        {mode === "details" && (
          <div className="space-y-6">

            {/* TOP INFO */}
            <div className="flex gap-6 items-center">

              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/10">
                {savedProfile.profilePhoto ? (
                  <img
                    src={getFileUrl(savedProfile.profilePhoto)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xl font-bold">
                    {savedProfile.name?.charAt(0) || "U"}
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold">
                    {savedProfile.name}
                  </h3>
                  <CircleCheckBig className="w-5 h-5 text-green-400" />
                </div>

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

            {/* SECTIONS */}
            <div className="space-y-4">
              <div>
                <h4 className="text-white font-medium">Education</h4>
                <p className="text-gray-400">{savedProfile.education}</p>
              </div>

              <div>
                <h4 className="text-white font-medium">Experience</h4>
                <p className="text-gray-400">
                  {savedProfile.experience || "Not added"}
                </p>
              </div>
            </div>

            {/* SKILLS */}
            <div>
              <h4 className="text-white font-medium mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full text-sm hover:scale-105 transition"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3">
              <button
                onClick={() => setMode("edit")}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 transition"
              >
                Edit Profile
              </button>

              <button
                className="px-5 py-2 rounded-xl border border-white/20 hover:bg-white/10 transition"
              >
                Help
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}