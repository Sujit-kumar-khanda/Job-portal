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

// =========================
// AUTH ROUTES
// =========================
router.post("/register", register);
router.post("/login", login);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// =========================
// PROTECTED ROUTES
// =========================
router.get("/me", authMiddleware, getMe);

// =========================
// OPTIONAL (RECOMMENDED)
// =========================
router.post("/logout", (req, res) => {
  return res.json({ message: "Logged out successfully" });
});

export default router;