import express from "express";
import upload from "../middleware/upload.js";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/upload-resume",
  authMiddleware,
  upload.single("file"),
  async (req, res) => {
    try {
      console.log("FILE:", req.file);
      console.log("BODY:", req.body);
      const userId = req.user.id;

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const resumeUrl = req.file.path;

      const user = await User.findById(userId);

      // delete old resume
      if (user.resume?.public_id) {
        await cloudinary.uploader.destroy(user.resume.public_id, {
          resource_type: "raw",
        });
      }

      user.resume = {
        url: resumeUrl,
        public_id: req.file.filename || null,
      };

      await user.save();

      res.json({
        message: "Resume uploaded successfully",
        resume: user.resume,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

export default router;
