import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";

// =========================
// GET PROFILE
// =========================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// =========================
// UPDATE PROFILE
// =========================
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

    allowed.forEach((key) => {
      if (req.body[key] !== undefined) {
        update[key] = req.body[key];
      }
    });

    // skills safe normalize
    if (update.skills) {
      update.skills = Array.isArray(update.skills)
        ? update.skills.filter(Boolean)
        : update.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
    }

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: update },
      { new: true, runValidators: true }
    ).select("-password");

    return res.json({
      message: "Profile updated",
      user,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// =========================
// CLOUDINARY UPLOAD HELPER (IMPROVED)
// =========================
const uploadToCloudinary = (buffer, folder, resourceType) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return reject(error);
        }
        resolve(result);
      }
    );

    stream.end(buffer);
  });
};

// =========================
// RESUME UPLOAD (FIXED VALIDATION)
// =========================
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // PDF/DOC validation
    if (!req.file.mimetype.includes("pdf") &&
        !req.file.mimetype.includes("word") &&
        !req.file.mimetype.includes("doc")) {
      return res.status(400).json({ message: "Only PDF/DOC allowed" });
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
    return res.status(500).json({ message: "Resume upload failed" });
  }
};

// =========================
// PROFILE PHOTO UPLOAD (FIXED VALIDATION)
// =========================
export const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // image validation
    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ message: "Only images allowed" });
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      "profile_photos",
      "image"
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePhoto: result.secure_url },
      { new: true }
    ).select("-password");

    return res.json({
      message: "Photo updated",
      url: result.secure_url,
      user,
    });
  } catch (err) {
    return res.status(500).json({ message: "Photo upload failed" });
  }
};