
import User from "../models/User.js";
import path from "path";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const allowed = ["name","phone","skills","education","experience"];
    const update = {};
    for (const k of allowed) if (req.body[k] !== undefined) update[k] = req.body[k];
    if (update.skills && typeof update.skills === "string") update.skills = update.skills.split(",").map(s=>s.trim()).filter(Boolean);

    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select("-password");
    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Resume required" });
    const resumePath = `/uploads/resumes/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user.id, { resume: resumePath }, { new: true }).select("-password");
    res.json({ message: "Resume uploaded", resume: user.resume });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Photo required" });
    const photoPath = `/uploads/profilePics/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user.id, { profilePhoto: photoPath }, { new: true }).select("-password");
    res.json({ message: "Photo uploaded", profilePhoto: user.profilePhoto });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
