import React, { useEffect, useState } from "react";
import {
  User,
  Phone,
  GraduationCap,
  FileText,
  Image as ImageIcon,
  Edit,
  Briefcase,
  CheckCircle,
  UploadCloud,
  Eye
} from "lucide-react";
import { useAppContext } from "../context/AppContext";

export default function SeekerProfile() {
  const { api, setUser, toast, BASE_URL } = useAppContext();

  const [mode, setMode] = useState("details");
  const [savedProfile, setSavedProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadingObj, setUploadingObj] = useState({ resume: false, photo: false });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    skills: "",
    education: "",
    experience: "",
  });

  const backendUrl = BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile/me");
        setSavedProfile(res.data.user);
        setUser(res.data.user);
      } catch (err) {
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Populate form with current values when entering edit mode
  const enterEditMode = () => {
    if (savedProfile) {
      setForm({
        name: savedProfile.name || "",
        phone: savedProfile.phone || "",
        skills: savedProfile.skills?.join(", ") || "",
        education: savedProfile.education || "",
        experience: savedProfile.experience || "",
      });
    }
    setMode("edit");
  };

  const completeness = (() => {
    if (!savedProfile) return 0;
    const fields = [
      savedProfile.name,
      savedProfile.phone,
      savedProfile.skills?.length,
      savedProfile.education,
      savedProfile.experience,
      savedProfile.resume,
      savedProfile.profilePhoto
    ];
    return Math.round((fields.filter(Boolean).length / 7) * 100);
  })();

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      };
      const res = await api.post("/profile/update", payload);
      setSavedProfile(res.data.user);
      setUser(res.data.user);
      toast.success("Profile updated successfully");
      setMode("details");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploadingObj(prev => ({ ...prev, [type]: true }));
      const fd = new FormData();
      fd.append(type, file);
      const endpoint =
        type === "resume" ? "/profile/upload-resume" : "/profile/upload-photo";
      await api.post(endpoint, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const me = await api.get("/profile/me");
      setSavedProfile(me.data.user);
      setUser(me.data.user);
      toast.success(`${type === "resume" ? "Resume" : "Photo"} uploaded successfully`);
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to upload ${type}`);
    } finally {
      setUploadingObj(prev => ({ ...prev, [type]: false }));
    }
  };

  // Modern Skeleton Loader
  if (mode === "details" && !savedProfile) {
    return (
      <div className="p-6 sm:p-10 h-full animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded-lg mb-8" />
        <div className="bg-white border border-slate-200 rounded-2xl h-48 mb-6" />
        <div className="bg-white border border-slate-200 rounded-2xl h-64" />
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 h-full flex flex-col font-sans">
      
      {/* ── HEADER & COMPLETENESS ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Personal Profile</h2>
          <p className="text-slate-500 text-sm mt-1">
            Manage your details, resume, and professional presence.
          </p>
        </div>
        
        {mode === "details" && (
          <button
            onClick={enterEditMode}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 transition-colors shrink-0"
          >
            <Edit className="w-4 h-4" /> Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 mb-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
        <div className="flex-1 w-full">
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-bold text-slate-700">Profile Completeness</span>
            <span className={`text-sm font-bold ${completeness === 100 ? 'text-emerald-600' : 'text-indigo-600'}`}>
              {completeness}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${completeness === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
              style={{ width: `${completeness}%` }}
            />
          </div>
        </div>
        {completeness === 100 ? (
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg text-sm font-bold shrink-0">
            <CheckCircle className="w-4 h-4" /> All set!
          </div>
        ) : (
          <p className="text-xs text-slate-500 max-w-xs text-center sm:text-left">
            Complete your profile to stand out to top employers.
          </p>
        )}
      </div>

      {/* ── EDIT MODE ── */}
      {mode === "edit" && (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
          <form onSubmit={handleSave} className="space-y-6">
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { label: "Full Name", field: "name", icon: User },
                { label: "Phone Number", field: "phone", icon: Phone },
                { label: "Education (e.g. B.Tech in CS)", field: "education", icon: GraduationCap },
                { label: "Skills (comma separated)", field: "skills", icon: CheckCircle },
              ].map(({ label, field, icon: Icon }) => (
                <div key={field}>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Icon className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      placeholder={`Enter ${label.toLowerCase()}`}
                      value={form[field]}
                      onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Professional Experience</label>
              <textarea
                placeholder="Briefly describe your work experience or projects..."
                rows={4}
                value={form.experience}
                onChange={(e) => setForm({ ...form, experience: e.target.value })}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all resize-none"
              />
            </div>

            {/* UPLOAD ZONES */}
            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              
              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Profile Photo</label>
                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${uploadingObj.photo ? 'bg-slate-50 border-slate-200' : 'border-slate-300 hover:bg-indigo-50 hover:border-indigo-300'}`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploadingObj.photo ? <span className="animate-pulse text-indigo-600 font-semibold">Uploading...</span> : (
                      <>
                        <ImageIcon className="w-6 h-6 text-slate-400 mb-2" />
                        <p className="text-sm text-slate-600 font-semibold">Click to upload photo</p>
                        <p className="text-xs text-slate-400 mt-1">JPG, PNG (Max 5MB)</p>
                      </>
                    )}
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, "photo")} disabled={uploadingObj.photo} />
                </label>
              </div>

              {/* Resume Upload */}
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Resume (PDF)</label>
                <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all ${uploadingObj.resume ? 'bg-slate-50 border-slate-200' : 'border-slate-300 hover:bg-indigo-50 hover:border-indigo-300'}`}>
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {uploadingObj.resume ? <span className="animate-pulse text-indigo-600 font-semibold">Uploading...</span> : (
                      <>
                        <UploadCloud className="w-6 h-6 text-slate-400 mb-2" />
                        <p className="text-sm text-slate-600 font-semibold">Click to upload resume</p>
                        <p className="text-xs text-slate-400 mt-1">PDF or DOCX (Max 5MB)</p>
                      </>
                    )}
                  </div>
                  <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={(e) => handleFileUpload(e, "resume")} disabled={uploadingObj.resume} />
                </label>
              </div>

            </div>

            <div className="flex justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={() => setMode("details")}
                className="px-6 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 hover:shadow-md transition-all disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── DETAILS MODE ── */}
      {mode === "details" && savedProfile && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Card (Left Column) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Top Identity Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-left">
              <div className="w-28 h-28 rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                {savedProfile.profilePhoto ? (
                  <img
                    src={`${backendUrl}${savedProfile.profilePhoto}`}
                    alt="Profile"
                    className="w-full h-full object-cover bg-white"
                  />
                ) : (
                  <User className="w-10 h-10 text-slate-300" />
                )}
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900">{savedProfile.name || "Add your name"}</h3>
                  <p className="text-indigo-600 font-semibold text-sm mt-1">{savedProfile.education || "Add your education"}</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 text-sm text-slate-600">
                  <span className="flex items-center justify-center sm:justify-start gap-2">
                    <Phone className="w-4 h-4 text-slate-400" /> {savedProfile.phone || "No phone added"}
                  </span>
                  <span className="flex items-center justify-center sm:justify-start gap-2">
                    <FileText className="w-4 h-4 text-slate-400" /> {savedProfile.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Experience Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 sm:p-8">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2 mb-4">
                <Briefcase className="w-4 h-4 text-indigo-500" /> Professional Experience
              </h4>
              {savedProfile.experience ? (
                <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {savedProfile.experience}
                </p>
              ) : (
                <p className="text-slate-400 text-sm italic">No experience added yet. Edit profile to update.</p>
              )}
            </div>
          </div>

          {/* Sidebar (Right Column) */}
          <div className="space-y-6">
            
            {/* Attachments Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Attachments</h4>
              <div className="space-y-3">
                
                {savedProfile.resume ? (
                  <a
                    href={`${backendUrl}${savedProfile.resume}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-700">My_Resume.pdf</span>
                    </div>
                    <Eye className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  </a>
                ) : (
                  <div className="p-3 rounded-xl border border-dashed border-slate-300 text-center text-sm text-slate-500 bg-slate-50">
                    No resume uploaded
                  </div>
                )}

                {savedProfile.profilePhoto && (
                  <a
                    href={`${backendUrl}${savedProfile.profilePhoto}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-indigo-700">Profile_Photo</span>
                    </div>
                    <Eye className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
                  </a>
                )}
              </div>
            </div>

            {/* Skills Card */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-4">Top Skills</h4>
              {savedProfile.skills?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {savedProfile.skills.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm italic">No skills added yet.</p>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}