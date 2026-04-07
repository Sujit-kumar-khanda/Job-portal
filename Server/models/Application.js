import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    seeker: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resume: { type: String, default: "" },
    status: { type: String, enum: ["pending", "selected", "rejected"], default: "pending" },
    seenByEmployer: { type: Boolean, default: false },
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, seeker: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
