// hooks/useEmployerProfile.js
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
export const useEmployerProfile = (api, user, setUser) => {
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

  // ================= FETCH PROFILE =================
  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get("/profile/me");

      setSavedProfile(res.data.user);
      setUser(res.data.user);
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Failed to load profile"
      );
    }
  }, [api, setUser, toast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ================= PREFILL FORM =================
  useEffect(() => {
    if (mode !== "edit" || !savedProfile || isManualEdit) return;

    setForm({
      name: savedProfile.name || "",
      email: savedProfile.email || "",
    });
  }, [mode, savedProfile, isManualEdit]);

  // ================= HANDLE INPUT =================
  const handleOnchange = useCallback((e) => {
    const { name, value } = e.target;

    setIsManualEdit(true);
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // ================= SAVE PROFILE =================
  const handleSave = useCallback(
    async (e) => {
      e.preventDefault();

      if (!form.name.trim()) return toast.error("Name required");
      if (!form.email.trim()) return toast.error("Email required");

      try {
        setLoading(true);

        const res = await api.post("/profile/update", {
          name: form.name.trim(),
          email: form.email.trim(),
        });

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
    [form, api, setUser, toast]
  );

  // ================= FILE UPLOAD =================
  const handleFileUpload = useCallback(
    async (e) => {
      const file = e.target.files?.[0];
      if (!file) return toast.error("Please select a file");

      if (file.size > 5 * 1024 * 1024) {
        return toast.error("File too large. Max 5MB allowed");
      }

      const allowed = ["image/jpeg", "image/png", "image/jpg"];
      if (!allowed.includes(file.type)) {
        return toast.error("Only JPG, PNG, JPEG allowed");
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
      } catch (err) {
        console.error("Upload error:", err);

        if (err.code === "ECONNABORTED") {
          toast.error("Upload timeout. Try again.");
        } else {
          toast.error(
            err?.response?.data?.message || "Upload failed"
          );
        }
      } finally {
        setUploading(false);
      }
    },
    [api, setUser, toast]
  );

  // ================= COMPLETENESS =================
  const completeness = savedProfile
    ? Math.round(
        ([
          savedProfile.name,
          savedProfile.email,
          savedProfile.profilePhoto,
        ].filter(Boolean).length /
          3) *
          100
      )
    : 0;

  return {
    // state
    mode,
    savedProfile,
    form,
    uploading,
    loading,
    fileInputKey,
    completeness,
    baseURL,

    // setters
    setMode,

    // handlers
    handleOnchange,
    handleSave,
    handleFileUpload,
  };
};