import express from "express";
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
} from "../controllers/authController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// ✅ Protected route to get current logged-in user
router.get("/me", authMiddleware, getMe);

export default router;
