import express from "express";
import {
  getAllJobs,
  getJobById,
  createJob,
  getEmployerJobs,
  deleteJob,
} from "../controllers/jobController.js";

import { protect, isEmployer, isSeeker } from "../middleware/auth.js";

const router = express.Router();

// PUBLIC ROUTES
router.get("/all", getAllJobs);
router.get("/:id", getJobById);

// EMPLOYER ROUTES
router.post("/", protect, isEmployer, createJob);
router.get("/employer", protect, isEmployer, getEmployerJobs);

// DELETE (keep before :id)
router.delete("/:id", protect, isEmployer, deleteJob);

export default router;