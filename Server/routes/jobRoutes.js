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

// Employer routes
router.post("/", protect, isEmployer, createJob);
router.get("/employer", protect, isEmployer, getEmployerJobs);
router.get(
  "/employer/applications",
  protect,
  isEmployer,
  getEmployerApplications
);
router.delete("/:id", protect, isEmployer, deleteJob);

// Seeker routes
router.get("/:id", getJobById);
router.post("/:id/apply", protect, isSeeker, applyToJob);
router.get("/applications/me", protect, isSeeker, getMyApplications);

export default router;
