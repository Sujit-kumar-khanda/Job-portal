import express from "express";
import "dotenv/config";

import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import path from "path";



const app = express();

// middlewares
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// DB connect
connectDB();

console.log("CLOUDINARY KEY:", process.env.CLOUDINARY_API_KEY);
console.log("CLOUDINARY NAME:", process.env.CLOUDINARY_CLOUD_NAME);

// routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/applications", applicationRoutes);

// health check
app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);

console.log("DB:", process.env.MONGO_URI);