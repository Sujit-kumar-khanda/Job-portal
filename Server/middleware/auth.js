import jwt from "jsonwebtoken";
import User from "../models/User.js";

// =====================
// AUTH PROTECT
// =====================
export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ FIX: normalize user object
    req.user = {
      id: user._id,
      role: user.role,
      email: user.email,
      name: user.name,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// =====================
// ROLE CHECKS
// =====================
export const isEmployer = (req, res, next) => {
  if (!req.user || req.user.role !== "employer") {
    return res.status(403).json({ message: "Employer only" });
  }
  next();
};

export const isSeeker = (req, res, next) => {
  if (!req.user || req.user.role !== "seeker") {
    return res.status(403).json({ message: "Job seeker only" });
  }
  next();
};