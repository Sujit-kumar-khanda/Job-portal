import mongoose from "mongoose";
import bcrypt from "bcryptjs";

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

    resume: { type: String, default: "" },
    profilePhoto: { type: String, default: "" },

    // RESET PASSWORD (IMPROVED)
    resetPasswordToken: { type: String, index: true },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);



/* =========================
   HASH PASSWORD AUTOMATICALLY
========================= */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

/* =========================
   COMPARE PASSWORD METHOD
========================= */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);