// SeekerProfile.jsx
import {
  User,
  Phone,
  GraduationCap,
  FileText,
  Image,
  Edit,
  HelpCircle,
  X,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useSeekerProfile } from "../components/hooks/seekerHooks/useSeekerProfile";

export default function SeekerProfile() {
  const { api, user, setUser, toast } = useAppContext();
  const {
    mode, // 'details' or 'edit'
    savedProfile, // Fetched profile data from server
    form, // Form state for name, phone, education, experience
    skillInput, // Input state for skill search
    suggestions, // Skill suggestions based on input
    selectedSkills, // List of selected skills
    uploading, // State for file upload
    loading, // State for profile save
    fileInputKey, // Key to reset file input after upload
    completeness, // Computed profile completeness percentage
    baseURL, // Base URL for API calls

    // Action handlers
    setMode, // To switch between 'details' and 'edit' mode
    handleOnchange, // For handling form input changes
    handleSkillChange, // For handling skill search input changes
    addSkill, // To add a skill to selectedSkills
    removeSkill, // To remove a skill from selectedSkills
    handleSave, // To save profile changes to server
    handleFileUpload, // To handle resume/photo uploads
    setFileInputKey, // To reset file input after upload
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
        <p className="text-sm mb-1">Profile completeness: {completeness}%</p>
        <div className="h-2 bg-gray-200 rounded-full">
          <div
            className="h-full bg-indigo-600 rounded-full"
            style={{ width: `${completeness}%` }}
          />
        </div>
      </div>

      {/* EDIT MODE - COMPLETE FORM */}
      {mode === "edit" && (
        <form onSubmit={handleSave} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleOnchange}
            className="w-full p-3 border rounded-xl"
          />
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleOnchange}
            className="w-full p-3 border rounded-xl"
          />
          <input
            name="education"
            placeholder="Education"
            value={form.education}
            onChange={handleOnchange}
            className="w-complete p-3 border rounded-xl"
          />

          {/* SKILLS */}
          <div className="relative">
            <input
              type="text"
              value={skillInput}
              onChange={handleSkillChange}
              placeholder="Enter skills (React, Node...)"
              className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
            {suggestions.length > 0 && (
              <div className="border rounded-xl mt-2 bg-white shadow max-h-40 overflow-y-auto">
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
              {selectedSkills.map((skill, index) => (
                <span
                  className="flex items-center justify-between px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm min-w-[120px]"
                  key={index}
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="ml-2 text-xs hover:text-red-500 transition-colors"
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
            rows={4}
            value={form.experience}
            onChange={handleOnchange}
            className="w-full p-3 border rounded-xl"
          />

          {/* FILE UPLOAD */}
          <div className="flex gap-4">
            <label
              htmlFor={`resume-${fileInputKey}`}
              className={`cursor-pointer border p-3 rounded-xl ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Upload Resume
              <input
                id={`resume-${fileInputKey}`}
                key={fileInputKey}
                hidden
                type="file"
                accept=".pdf,.doc,.docx"
                disabled={uploading}
                onChange={(e) => handleFileUpload(e, "resume")}
              />
            </label>
            <label
              className={`cursor-pointer border p-3 rounded-xl ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Upload Photo
              <input
                key={fileInputKey}
                hidden
                type="file"
                accept="image/*"
                disabled={uploading}
                onChange={(e) => handleFileUpload(e, "photo")}
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

      {/* DETAILS MODE - COMPLETE VIEW */}
      {mode === "details" && (
        <div className="space-y-6">
          {/* BASIC INFO */}
          <div className="flex gap-6 items-center">
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              {savedProfile.profilePhoto ? (
                <img
                  src={`${baseURL}${savedProfile.profilePhoto}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xl font-bold">
                  {savedProfile.name?.charAt(0)}
                </span>
              )}
            </div>
            <div>
              <p className="text-xl font-semibold">{savedProfile.name}</p>
              <p className="text-gray-600">{savedProfile.phone || "N/A"}</p>
              <p className="text-gray-600">{savedProfile.education || "N/A"}</p>
            </div>
          </div>

          {/* SKILLS */}
          <div>
            <h4 className="font-semibold mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {(savedProfile.skills || []).filter(Boolean).map((s, i) => (
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
              className="px-5 py uded-2 border rounded-xl"
              onClick={() => alert("Edit profile, upload resume & photo")}
            >
              Help
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
