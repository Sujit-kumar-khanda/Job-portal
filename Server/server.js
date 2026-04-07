import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import fs from "fs";
import path from "path";

dotenv.config();
const app = express();

// ensure upload folders
const uploadsDir = path.join(process.cwd(), "uploads");
const resumesDir = path.join(uploadsDir, "resumes");
const photosDir = path.join(uploadsDir, "profilePics");
fs.mkdirSync(resumesDir, { recursive: true });
fs.mkdirSync(photosDir, { recursive: true });

// middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// serve uploads statically
app.use("/uploads", express.static(uploadsDir));

// DB connect
connectDB();

// routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/applications", applicationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
console.log("DB:", process.env.MONGO_URI);
