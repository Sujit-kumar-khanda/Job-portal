// hooks/useEmployerProfile.js
import { useState, useEffect, useCallback } from "react";

export const useEmployerProfile = (api, user, setUser, toast) => {
  const baseURL = "http://localhost:5000";

  const [form, setForm] = useState({
    name: "",
    email: "",
  });
  const [mode, setMode] = useState("details");
  const [savedProfile, setSavedProfile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [isManualEdit, setIsManualEdit] = useState(false);

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
        email: savedProfile.email || "",
      });
    }
  }, [mode, savedProfile, isManualEdit]);

  const handleOnchange = useCallback(
    (e) => {
      setIsManualEdit(true);
      setForm({ ...form, [e.target.name]: e.target.value });
    },
    [form],
  );

  const handleSave = useCallback(
    async (e) => {
      e.preventDefault();

      if (!form.name.trim()) return toast.error("Name required");
      if (!form.email.trim()) return toast.error("Email required");

      try {
        setLoading(true);
        const payload = { ...form };
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
    [form, api, setUser, toast],
  );

  const handleFileUpload = useCallback(
    async (e) => {
      const file = e.target.files[0];
      if (!file) {
        toast.error("Please select a file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large. Max 5MB allowed");
        return;
      }

      if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
        toast.error("Please upload JPG, PNG, or JPEG image");
        return;
      }

      setUploading(true);
      setFileInputKey((prev) => prev + 1);

      try {
        const fd = new FormData();
        fd.append("photo", file);

        await api.post("/profile/upload-photo", fd, {
          timeout: 30000,
          headers: { "Content-Type": "multipart/form-data" },
        });

        const me = await api.get("/profile/me");
        const updatedUser = me.data.user;
        setSavedProfile(updatedUser);
        setUser(updatedUser);
        toast.success("Photo uploaded successfully!");
      } catch (error) {
        console.error("Upload error:", error);
        if (error.code === "ECONNABORTED") {
          toast.error("Upload timeout. Please try again.");
        } else {
          toast.error("Failed to upload photo. Please try again.");
        }
      } finally {
        setUploading(false);
      }
    },
    [api, setUser, toast],
  );

  const completeness = savedProfile
    ? Math.round(
        ([
          savedProfile.name,
          savedProfile.email,
          savedProfile.profilePhoto,
        ].filter(Boolean).length /
          3) *
          100,
      )
    : 0;

  return {
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
  };
};
