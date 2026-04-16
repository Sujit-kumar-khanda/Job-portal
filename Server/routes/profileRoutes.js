import express from "express";
import upload from "../middleware/upload.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  uploadResume,
  uploadProfilePhoto,
  getProfile,
  updateProfile,
} from "../controllers/profileController.js";

const router = express.Router();

// =========================
// PROFILE
// =========================
router.get("/me", authMiddleware, getProfile);

router.post("/update", authMiddleware, updateProfile);

// =========================
// RESUME UPLOAD (FIXED ORDER)
// =========================
router.post(
  "/upload-resume",
  authMiddleware,
  upload.single("resume"),
  uploadResume
);

// =========================
// PROFILE PHOTO UPLOAD (FIXED ORDER)
// =========================
router.post(
  "/upload-photo",
  authMiddleware,
  upload.single("photo"),
  uploadProfilePhoto
);

export default router;