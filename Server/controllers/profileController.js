import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

//
// 👤 GET PROFILE
//
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user });
  } catch (err) {
    console.error("GET PROFILE ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

//
// ✏️ UPDATE PROFILE
//
export const updateProfile = async (req, res) => {
  try {
    const allowed = [
      "name",
      "phone",
      "skills",
      "headline",
      "education",
      "experience",
    ];

    const update = {};

    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        update[key] = req.body[key];
      }
    }

    // ✅ skills fix
    if (typeof update.skills === "string") {
      update.skills = update.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // ❗ IMPORTANT: NEVER TOUCH profilePhoto here
    // It will only be updated via uploadProfilePhoto API

    await User.findByIdAndUpdate(
      req.user.id,
      { $set: update },
      { new: true, runValidators: true }
    );

    const user = await User.findById(req.user.id).select("-password");

    return res.json({
      message: "Profile updated",
      user,
    });
  } catch (err) {
    console.error("UPDATE PROFILE ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

//
// ☁️ CLOUDINARY UPLOAD HELPER (FIXED)
//
const uploadToCloudinary = (buffer, folder, resourceType) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        format: resourceType === "raw" ? undefined : undefined, // auto-detect format for images, keep original for raw
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Error:", error);
          return reject(error);
        }
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

//
// 📄 RESUME UPLOAD
//
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (req.file.size > 10 * 1024 * 1024) {
      return res.status(400).json({ message: "File too large" });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      "resumes",
      "raw"
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { resume: result.secure_url },
      { new: true }
    ).select("-password");

    return res.json({
      message: "Resume uploaded",
      url: result.secure_url,
      user,
    });
  } catch (err) {
    console.log("Resume Upload Error:", err.message);
    return res.status(500).json({ message: "Resume upload failed" });
  }
};

//
// 🖼️ PROFILE PHOTO UPLOAD
//
export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      "profile_photos",
      "image"
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        profilePhoto: result.secure_url, // ✅ always full URL
      },
      { new: true }
    ).select("-password");

    return res.json({
      message: "Photo updated",
      url: result.secure_url,
      user,
    });
  } catch (err) {
    console.log("Photo Upload Error:", err.message);
    return res.status(500).json({ message: "Photo upload failed" });
  }
};