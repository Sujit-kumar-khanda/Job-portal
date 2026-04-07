import express from "express";
import path from "path";
import upload from "../middleware/upload.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile,
  uploadResume,
  uploadProfilePhoto,
} from "../controllers/profileController.js";

const router = express.Router();

// Get current profile
router.get("/me", authMiddleware, getProfile);

// Update profile
router.post("/update", authMiddleware, updateProfile);

// Upload resume
router.post(
  "/upload-resume",
  (req, res, next) => {
    req.uploadDest = path.join(process.cwd(), "uploads", "resumes");
    req.uploadAccept = [".pdf", ".doc", ".docx"];
    next();
  },
  authMiddleware,
  upload.single("resume"),
  uploadResume
);

// Upload profile photo
router.post(
  "/upload-photo",
  (req, res, next) => {
    req.uploadDest = path.join(process.cwd(), "uploads", "profilePics");
    req.uploadAccept = [".png", ".jpg", ".jpeg", ".webp"];
    next();
  },
  authMiddleware,
  upload.single("photo"),
  uploadProfilePhoto
);

export default router;
