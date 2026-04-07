import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      return next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  return res.status(401).json({ message: "No token, Unauthorized" });
};

export const isEmployer = (req, res, next) => {
  if (req.user?.role !== "employer")
    return res.status(403).json({ message: "Employer only" });
  next();
};

export const isSeeker = (req, res, next) => {
  if (req.user?.role !== "seeker")
    return res.status(403).json({ message: "Job seeker only" });
  next();
};
