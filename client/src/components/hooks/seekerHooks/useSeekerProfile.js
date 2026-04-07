// hooks/useSeekerProfile.js
import { useState, useEffect, useCallback } from "react";

const SKILLS = [
  "JavaScript",
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "HTML",
  "CSS",
  "Tailwind CSS",
  "Redux",
  "TypeScript",
  "Next.js",
  "Python",
  "Django",
  "Java",
  "Spring Boot",
  "SQL",
  "MySQL",
  "PostgreSQL",
  "AWS",
  "Docker",
  "Kubernetes",
  "Git",
  "CI/CD",
  "Agile Methodologies",
  "Problem Solving",
  "C++",
];

export const useSeekerProfile = (api, _user, setUser, toast) => {
  const baseURL = "http://localhost:5000";

  // States
  const [skillInput, setSkillInput] = useState(""); // For skill search input
  const [suggestions, setSuggestions] = useState([]); // For skill suggestions dropdown
  const [selectedSkills, setSelectedSkills] = useState([]); // For storing selected skills
  const [mode, setMode] = useState("details"); // 'details' or 'edit'
  const [savedProfile, setSavedProfile] = useState(null); // For storing fetched profile data
  const [uploading, setUploading] = useState(false); // For file upload state
  const [loading, setLoading] = useState(false); // For profile save state
  const [isManualEdit, setIsManualEdit] = useState(false); // To track if user has manually edited form to prevent overwriting with fetched data
  const [fileInputKey, setFileInputKey] = useState(0); // To reset file input after upload
  const [form, setForm] = useState({
    name: "",
    phone: "",
    education: "",
    experience: "",
  });

  // Fetch profile
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

  // Prefill form
  useEffect(() => {
    if (mode === "edit" && savedProfile && !isManualEdit) {
      setForm({
        name: savedProfile.name || "",
        phone: savedProfile.phone || "",
        education: savedProfile.education || "",
        experience: savedProfile.experience || "",
      });
      setSelectedSkills(
        (savedProfile.skills || []).filter((s) => s && s.trim() !== ""),
      );
    }
  }, [mode, savedProfile, isManualEdit]);

  // Event handlers
  const handleOnchange = useCallback(
    (e) => {
      setIsManualEdit(true);
      setForm({ ...form, [e.target.name]: e.target.value });
    },
    [form],
  );

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
          !selectedSkills.includes(skill),
      );
      setSuggestions(filtered);
    },
    [selectedSkills],
  );

  const addSkill = useCallback((skill) => {
    const trimmed = skill.trim();
    if (!trimmed) return;

    setSelectedSkills((prev) => {
      const alreadyExists = prev.some(
        (s) => s.toLowerCase() === trimmed.toLowerCase(),
      );
      if (alreadyExists) return prev;
      return [...prev, trimmed];
    });

    setSkillInput("");
    setSuggestions([]);
  }, []);

  const removeSkill = useCallback(
    (skill) => {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    },
    [selectedSkills],
  );

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
        const payload = { ...form, skills: selectedSkills };
        const res = await api.post("/profile/update", payload);

        setSavedProfile(res.data.user);
        setUser(res.data.user);
        toast.success("Profile updated");
        setMode("details");
      } catch {
        toast.error("Update failed");
      } finally {
        setLoading(false);
      }
    },
    [form, selectedSkills, api, setUser, toast],
  );

  const handleFileUpload = useCallback(
    async (e, type) => {
      const file = e.target.files[0];
      if (!file) {
        toast.error("Please select a file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large. Max 5MB allowed");
        return;
      }

      const allowedTypes = {
        resume: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        photo: ["image/jpeg", "image/png", "image/jpg"],
      };

      if (!allowedTypes[type].includes(file.type)) {
        toast.error(
          type === "resume"
            ? "Please upload PDF or Word document"
            : "Please upload JPG, PNG, or JPEG image",
        );
        return;
      }

      setUploading(true);
      setFileInputKey((prev) => prev + 1);

      try {
        const fd = new FormData();
        fd.append(type, file);
        const endpoint =
          type === "resume"
            ? "/profile/upload-resume"
            : "/profile/upload-photo";

        await api.post(endpoint, fd, {
          timeout: 30000,
          headers: { "Content-Type": "multipart/form-data" },
        });

        const me = await api.get("/profile/me");
        const updatedUser = me.data.user;
        setSavedProfile(updatedUser);
        setUser(updatedUser);

        toast.success(
          `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded successfully!`,
        );
      } catch (error) {
        console.error("Upload error:", error);
        if (error.code === "ECONNABORTED") {
          toast.error("Upload timeout. Please try again.");
        } else if (error.response?.status === 413) {
          toast.error("File too large. Max 5MB allowed.");
        } else {
          toast.error(`Failed to upload ${type}. Please try again.`);
        }
      } finally {
        setUploading(false);
      }
    },
    [api, setUser, toast],
  );

  // Computed values
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
          100,
      )
    : 0;

  return {
    // States
    mode, // 'details' or 'edit'
    savedProfile, // Fetched profile data
    form, // Form state for editing
    skillInput, // Current skill search input
    suggestions, // Skill suggestions based on input
    selectedSkills, // List of selected skills
    uploading, // File upload state
    loading, // Profile save state
    fileInputKey, // Key to reset file input
    completeness, // Profile completeness percentage
    baseURL, // Base URL for API calls

    // Actions
    setMode, // To switch between 'details' and 'edit' mode
    handleOnchange, // For handling form input changes
    handleSkillChange, // For handling skill search input changes
    addSkill, // To add a skill to selectedSkills
    removeSkill, // To remove a skill from selectedSkills
    handleSave, // To save profile changes
    handleFileUpload, // To handle resume/photo uploads
    setFileInputKey, // To reset file input after upload
  };
};
