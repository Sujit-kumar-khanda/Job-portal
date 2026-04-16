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

// =========================
// PUBLIC ROUTES
// =========================
router.get("/all", getAllJobs);

// =========================
// SEEKER ROUTES (PUT ABOVE :id)
// =========================
router.get("/applications/me", protect, isSeeker, getMyApplications);

router.post("/:jobId/apply", protect, isSeeker, applyToJob);

// =========================
// EMPLOYER ROUTES
// =========================
router.post("/", protect, isEmployer, createJob);

router.get("/employer", protect, isEmployer, getEmployerJobs);

router.get(
  "/employer/applications",
  protect,
  isEmployer,
  getEmployerApplications
);

// =========================
// DELETE (keep before :id)
// =========================
router.delete("/:id", protect, isEmployer, deleteJob);

// =========================
// PUBLIC (ALWAYS LAST)
// =========================
router.get("/:id", getJobById);
export default router;