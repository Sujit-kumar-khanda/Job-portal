import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isEmployer, isSeeker } from "../middleware/auth.js";

import {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

const router = express.Router();

// =========================
// SEEKER ROUTES
// =========================

// Apply for a job (ONLY SEEKER)
router.post(
  "/apply/:jobId",
  authMiddleware,
  isSeeker,
  applyToJob
);

// Get my applications (ONLY SEEKER)
router.get(
  "/me",
  authMiddleware,
  isSeeker,
  getMyApplications
);

// =========================
// EMPLOYER ROUTES
// =========================

// Get applications for a job (ONLY EMPLOYER)
router.get(
  "/job/:jobId",
  authMiddleware,
  isEmployer,
  getApplicationsForJob
);

// Update application status (ONLY EMPLOYER)
router.patch(
  "/:applicationId/status",
  authMiddleware,
  isEmployer,
  updateApplicationStatus
);

export default router;