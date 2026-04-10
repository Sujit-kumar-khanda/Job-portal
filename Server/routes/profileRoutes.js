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
router.get("/me", authMiddleware, getProfile);

router.post("/update", authMiddleware, updateProfile);
// 📄 RESUME
router.post(
  "/upload-resume",(req, res, next) => {
  console.log("ROUTE HIT");
  next();
},
  authMiddleware,
  upload.single("resume"),
  uploadResume
);

// 🖼️ PHOTO
router.post(
  "/upload-photo",
  authMiddleware,
  upload.single("photo"),
  uploadProfilePhoto
);

export default router;