import express from "express";
import {
  createJob,
  getAllJobs,
  getEmployerJobs,
  deleteJob,
  applyToJob,
  getMyApplications,
  getJobById,
  getEmployerApplications,
} from "../controllers/jobController.js";

import { protect, isEmployer, isSeeker } from "../middleware/auth.js";

const router = express.Router();

// Public
router.get("/all", getAllJobs);

// Seeker - must be before /:id to avoid route conflict
router.get("/applications/me", protect, isSeeker, getMyApplications);

// Employer routes
router.post("/", protect, isEmployer, createJob);
router.get("/employer", protect, isEmployer, getEmployerJobs);
router.get("/employer/applications", protect, isEmployer, getEmployerApplications);
router.delete("/:id", protect, isEmployer, deleteJob);

// Job detail & apply (seeker)
router.get("/:id", getJobById);
router.post("/:id/apply", protect, isSeeker, applyToJob);

export default router;