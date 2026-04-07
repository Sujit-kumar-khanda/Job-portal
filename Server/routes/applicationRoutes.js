import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

const router = express.Router();

// Apply for a job (Seeker)
router.post("/apply/:jobId", authMiddleware, applyToJob);

// Get my applications (Seeker)
router.get("/me", authMiddleware, getMyApplications);

// Get all applications for a specific job (Employer)
router.get("/job/:jobId", authMiddleware, getApplicationsForJob);

// Update status of an application (Employer)
router.patch("/:applicationId/status", authMiddleware, updateApplicationStatus);

export default router;
