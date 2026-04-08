import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["employer", "seeker"], default: "seeker" },

    // profile fields
    companyName: { type: String, default: "" }, // 👈 ADDED THIS!
    phone: { type: String, default: "" },
    skills: { type: [String], default: [] },
    education: { type: String, default: "" },
    experience: { type: String, default: "" },

    // files (local paths)
    resume: { type: String, default: "" },
    profilePhoto: { type: String, default: "" },

    // existing fields for password reset etc...
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);