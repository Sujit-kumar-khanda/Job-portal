import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    location: { type: String, default: "" },
    salary: { type: String, default: "" },
    skills: { type: [String], default: [] },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Index for faster job listing
jobSchema.index({ createdAt: -1 });

export default mongoose.model("Job", jobSchema);