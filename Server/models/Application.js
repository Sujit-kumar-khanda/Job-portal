import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    seeker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // optional job-specific resume override
    resume: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["pending", "selected", "rejected"],
      default: "pending",
    },

    seenByEmployer: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Prevent duplicate applications
applicationSchema.index({ job: 1, seeker: 1 }, { unique: true });

// Optimize employer dashboard queries
applicationSchema.index({ job: 1, createdAt: -1 });

export default mongoose.model("Application", applicationSchema);