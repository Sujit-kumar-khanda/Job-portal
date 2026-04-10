import { useState, useEffect, useCallback } from "react";

const SKILLS = [
  "JavaScript", "React", "Node.js", "Express", "MongoDB",
  "HTML", "CSS", "Tailwind CSS", "Redux", "TypeScript",
  "Next.js", "Python", "Django", "Java", "Spring Boot",
  "SQL", "MySQL", "PostgreSQL", "AWS", "Docker",
  "Kubernetes", "Git", "CI/CD", "Agile Methodologies",
  "Problem Solving", "C++",
];

export const useSeekerProfile = (api, _user, setUser, toast) => {
  const baseURL = import.meta?.env?.VITE_API_URL || "http://localhost:5000";

  const getFileUrl = (path) => {
    if (!path) return null;
    return path.startsWith("http")
      ? path
      : `${baseURL}${path}`;
  };

  const [skillInput, setSkillInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [mode, setMode] = useState("details");
  const [savedProfile, setSavedProfile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isManualEdit, setIsManualEdit] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    headline: "",
    education: "",
    experience: "",
  });

  // GET PROFILE
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile/me");
        setSavedProfile(res.data.user);
        setUser(res.data.user);
      } catch {
        toast.error("Failed to load profile");
      }
    };
    fetchProfile();
  }, [api, setUser, toast]);

  // PREFILL
  useEffect(() => {
    if (mode === "edit" && savedProfile && !isManualEdit) {
      setForm({
        name: savedProfile.name || "",
        phone: savedProfile.phone || "",
        headline: savedProfile.headline || "",
        education: savedProfile.education || "",
        experience: savedProfile.experience || "",
      });

      setSelectedSkills(
        (savedProfile.skills || []).filter((s) => s && s.trim() !== "")
      );
    }
  }, [mode, savedProfile, isManualEdit]);

  // FORM CHANGE
  const handleOnchange = useCallback((e) => {
    setIsManualEdit(true);
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }, []);

  // SKILL SEARCH
  const handleSkillChange = useCallback(
    (e) => {
      setIsManualEdit(true);
      const value = e.target.value;
      setSkillInput(value);

      if (!value.trim()) {
        setSuggestions([]);
        return;
      }

      const filtered = SKILLS.filter(
        (skill) =>
          skill.toLowerCase().includes(value.toLowerCase()) &&
          !selectedSkills.includes(skill)
      );

      setSuggestions(filtered);
    },
    [selectedSkills]
  );

  const addSkill = useCallback((skill) => {
    const trimmed = skill.trim();
    if (!trimmed) return;

    setSelectedSkills((prev) => {
      const exists = prev.some(
        (s) => s.toLowerCase() === trimmed.toLowerCase()
      );
      return exists ? prev : [...prev, trimmed];
    });

    setSkillInput("");
    setSuggestions([]);
  }, []);

  const removeSkill = useCallback((skill) => {
    setSelectedSkills((prev) => prev.filter((s) => s !== skill));
  }, []);

  // SAVE PROFILE
  const handleSave = useCallback(
    async (e) => {
      e.preventDefault();

      if (!form.name.trim()) return toast.error("Name required");

      const phoneRegex = /^[0-9]{10}$/;
      if (form.phone && !phoneRegex.test(form.phone.replace(/\D/g, ""))) {
        return toast.error("Enter valid 10-digit phone");
      }

      try {
        setLoading(true);

        const payload = {
          ...form,
          skills: selectedSkills,
        };

        const res = await api.post("/profile/update", payload);
        

        setSavedProfile(res.data.user);
        setUser(res.data.user);
        toast.success("Profile updated");
        setMode("details");
      } catch (err) {
        toast.error("Update failed");
      } finally {
        setLoading(false);
      }
    },
    [form, selectedSkills, api, setUser, toast]
  );

  // FILE UPLOAD (FIXED)
const handleFileUpload = async (e, type) => {
  const file = e.target?.files?.[0];
  if (!file) return toast.error("No file selected");

  const fd = new FormData();
  if (type === "resume") {
  fd.append("resume", file);
} else {
  fd.append("photo", file);
}

  const endpoint =
    type === "resume"
      ? "/profile/upload-resume"
      : "/profile/upload-photo";

  try {
    setUploading(true);

    const res = await api.post(endpoint, fd); // ✅ FIXED HERE

    const url = res.data.url || res.data.profilePhoto;

    setSavedProfile((prev) => ({
      ...prev,
      ...(type === "resume"
        ? { resume: url }
        : { profilePhoto: url }),
    }));

    setUser((prev) => ({
      ...prev,
      ...(type === "resume"
        ? { resume: url }
        : { profilePhoto: url }),
    }));

    toast.success(`${type} uploaded`);
  } catch (err) {
    console.log(err.response?.data || err.message);
    toast.error(`${type} upload failed`);
  } finally {
    setUploading(false);
  }
};

  // COMPLETENESS
  const completeness = savedProfile
    ? Math.round(
        ([
          savedProfile.name,
          savedProfile.phone,
          savedProfile.skills?.length,
          savedProfile.education,
          savedProfile.experience,
        ].filter(Boolean).length /
          5) *
          100
      )
    : 0;

  return {
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
    baseURL,

    setMode,
    handleOnchange,
    handleSkillChange,
    addSkill,
    removeSkill,
    handleSave,
    handleFileUpload,
    setFileInputKey,
    getFileUrl,
  };
};