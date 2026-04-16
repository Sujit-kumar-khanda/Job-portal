import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
const SKILLS = [
  "JavaScript", "React", "Node.js", "Express", "MongoDB",
  "HTML", "CSS", "Tailwind CSS", "Redux", "TypeScript",
  "Next.js", "Python", "Django", "Java", "Spring Boot",
  "SQL", "MySQL", "PostgreSQL", "AWS", "Docker",
  "Kubernetes", "Git", "CI/CD", "Agile Methodologies",
  "Problem Solving", "C++",
];

export const useSeekerProfile = (api, user, setUser) => {
  const baseURL =
    import.meta?.env?.VITE_API_URL || "http://localhost:5000";

  const getFileUrl = useCallback(
    (path) => {
      if (!path) return null;
      return path.startsWith("http")
        ? path
        : `${baseURL}${path}`;
    },
    [baseURL]
  );

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

  // ================= FETCH PROFILE =================
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/profile/me");

        setSavedProfile(res.data.user);
        setUser(res.data.user);
      } catch (err) {
        toast.error(
          err?.response?.data?.message || "Failed to load profile"
        );
      }
    };

    fetchProfile();
  }, [api, setUser, toast]);

  // ================= PREFILL =================
  useEffect(() => {
    if (mode !== "edit" || !savedProfile || isManualEdit) return;

    setForm({
      name: savedProfile.name || "",
      phone: savedProfile.phone || "",
      headline: savedProfile.headline || "",
      education: savedProfile.education || "",
      experience: savedProfile.experience || "",
    });

    setSelectedSkills(
      Array.isArray(savedProfile.skills)
        ? savedProfile.skills.filter(Boolean)
        : []
    );
  }, [mode, savedProfile, isManualEdit]);

  // ================= FORM CHANGE =================
  const handleOnchange = useCallback((e) => {
    const { name, value } = e.target;

    setIsManualEdit(true);
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // ================= SKILL SEARCH =================
  const handleSkillChange = useCallback(
    (e) => {
      const value = e.target.value;

      setIsManualEdit(true);
      setSkillInput(value);

      if (!value.trim()) {
        setSuggestions([]);
        return;
      }

      const filtered = SKILLS.filter(
        (skill) =>
          skill.toLowerCase().includes(value.toLowerCase()) &&
          !selectedSkills.some(
            (s) => s.toLowerCase() === skill.toLowerCase()
          )
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
    setSelectedSkills((prev) =>
      prev.filter((s) => s !== skill)
    );
  }, []);

  // ================= SAVE PROFILE =================
  const handleSave = useCallback(
    async (e) => {
      e.preventDefault();

      if (!form.name.trim()) {
        return toast.error("Name required");
      }

      const phoneDigits = form.phone?.replace(/\D/g, "");
      if (form.phone && phoneDigits.length !== 10) {
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
        setIsManualEdit(false);
      } catch (err) {
        toast.error(
          err?.response?.data?.message || "Update failed"
        );
      } finally {
        setLoading(false);
      }
    },
    [form, selectedSkills, api, setUser, toast]
  );

  // ================= FILE UPLOAD =================
  const handleFileUpload = useCallback(
    async (e, type) => {
      const file = e.target?.files?.[0];
      if (!file) return toast.error("No file selected");

      const fd = new FormData();
      fd.append(type === "resume" ? "resume" : "photo", file);

      const endpoint =
        type === "resume"
          ? "/profile/upload-resume"
          : "/profile/upload-photo";

      try {
        setUploading(true);
        setFileInputKey((prev) => prev + 1);

        const res = await api.post(endpoint, fd);

        const url =
          res.data.url ||
          res.data.profilePhoto ||
          res.data.resume;

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
        console.error(err);
        toast.error(`${type} upload failed`);
      } finally {
        setUploading(false);
      }
    },
    [api, setUser, toast]
  );

  // ================= COMPLETENESS =================
  const fields = [
    savedProfile?.name,
    savedProfile?.phone,
    savedProfile?.headline,
    savedProfile?.education,
    savedProfile?.experience,
    savedProfile?.skills?.length > 0,
    savedProfile?.profilePhoto,
    savedProfile?.resume,
  ];

  const completeness = savedProfile
    ? Math.round(
        (fields.filter(Boolean).length / fields.length) * 100
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