import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

/* APPLY TO JOB */
export const applyToJob = async (req, res) => {
  try {
    const seekerId = req.user.id;
    const jobId = req.params.jobId;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy.toString() === seekerId)
      return res.status(400).json({ message: "Cannot apply to your own job" });

    const already = await Application.findOne({ job: jobId, seeker: seekerId });
    if (already) return res.status(400).json({ message: "Already applied" });

    const seeker = await User.findById(seekerId);
    const resume = seeker?.resume || "";

    const newApplication = await Application.create({
      job: jobId,
      seeker: seekerId,
      resume,
      status: "pending",
    });

    // Push applicant into Job.applicants
    await Job.findByIdAndUpdate(jobId, {
      $push: {
        applicants: {
          user: seekerId,
          applicationId: newApplication._id,
          status: "pending",
          appliedAt: new Date(),
        },
      },
    });

    res.json({ message: "Applied successfully", application: newApplication });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* GET SEEKER APPLICATIONS */
export const getMyApplications = async (req, res) => {
  try {
    const seekerId = req.user.id;
    const apps = await Application.find({ seeker: seekerId })
      .populate({ path: "job", select: "title location salary postedBy" })
      .sort({ createdAt: -1 });
    res.json({ applications: apps });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* GET APPLICATIONS FOR A JOB (EMPLOYER) */
export const getApplicationsForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const employerId = req.user.id;

    const job = await Job.findById(jobId).populate("postedBy", "_id");
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (job.postedBy._id.toString() !== employerId)
      return res.status(403).json({ message: "Not authorized" });

    const apps = await Application.find({ job: jobId })
      .populate({ path: "seeker", select: "name email resume profilePhoto" })
      .sort({ createdAt: -1 });

    res.json({ applications: apps });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* UPDATE APPLICATION STATUS */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { applicationId } = req.params;

    if (!["pending", "selected", "rejected"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const application = await Application.findById(applicationId);
    if (!application) return res.status(404).json({ message: "Application not found" });

    // Update application
    application.status = status;
    application.seenByEmployer = true;
    await application.save();

    // Update corresponding Job.applicants
    await Job.updateOne(
      { _id: application.job, "applicants.applicationId": application._id },
      { $set: { "applicants.$.status": status } }
    );

    res.json({ message: "Status updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
