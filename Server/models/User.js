import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["employer", "seeker"],
      default: "seeker",
    },

    phone: { type: String, default: "" },
    headline: { type: String, default: "" },
    skills: { type: [String], default: [] },
    education: { type: String, default: "" },
    experience: { type: String, default: "" },

    resume: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" }
    },
    profilePhoto: { type: String, default: "" },

    resetPasswordToken: { type: String, index: true },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;



