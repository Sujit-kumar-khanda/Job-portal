import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

// APPLY TO JOB
export const applyToJob = async (req, res) => {
  try {
    const seekerId = req.user.id;
    const jobId = req.params.jobId;

    // Check job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Prevent self-apply
    if (job.postedBy.toString() === seekerId) {
      return res.status(400).json({ message: "Cannot apply to your own job" });
    }

    // Check duplicate application
    const already = await Application.findOne({
      job: jobId,
      seeker: seekerId,
    });

    if (already) {
      return res.status(400).json({ message: "Already applied" });
    }

    // Get user
    const seeker = await User.findById(seekerId);
    if (!seeker) {
      return res.status(404).json({ message: "User not found" });
    }

    // Resume check
    if (!seeker.resume) {
      return res.status(400).json({
        message: "Please upload your resume before applying",
      });
    }

    // Create application (SINGLE SOURCE OF TRUTH)
    const application = await Application.create({
      job: jobId,
      seeker: seekerId,
      resume: seeker.resume,
      status: "pending",
    });

    return res.status(201).json({
      message: "Applied successfully",
      application,
    });
  } catch (err) {
    console.error("Error in applyToJob:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET MY APPLICATIONS (SEEKER)
export const getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ seeker: req.user.id })
      .populate({
        path: "job",
        select: "title  location salary postedBy ",
        populate: {
          path: "postedBy",
          select: "name email profilePhoto",
        }
      })
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      applications: apps,
    });
  } catch (err) {
    console.log("Error in getMyApplications:", err);

    return res.status(500).json({ message: err.message });
  }
};

// GET APPLICATIONS FOR JOB (EMPLOYER)
export const getApplicationsForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const employerId = req.user.id;

    // Validate job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Ownership check
    if (job.postedBy.toString() !== employerId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Get applications
    const applications = await Application.find({ job: jobId })
      .populate("seeker", "name email resume profilePhoto")
      .sort({ createdAt: -1 });

    const formatted = applications.map((app) => ({
      applicationId: app._id,
      name: app.seeker?.name,
      email: app.seeker?.email,
      resume: app.seeker?.resume,
      profilePhoto: app.seeker?.profilePhoto,
      status: app.status,
      appliedAt: app.createdAt,
    }));

    return res.json({
      success: true,
      jobId,
      totalApplicants: formatted.length,
      applications: formatted,
    });
  } catch (err) {
    console.error("Error in getApplicationsForJob :", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// UPDATE APPLICATION STATUS (EMPLOYER)
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { applicationId } = req.params;

    if (!["pending", "selected", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // 🔥 IMPORTANT FIX
    const job = await Job.findById(application.job);
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    application.status = status;
    application.seenByEmployer = true;

    await application.save();

    return res.json({
      success: true,
      message: "Status updated successfully",
    });
  } catch (err) {
    console.error("Error in updateApplicationStatus: ", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// Add application Count Endpoint

// export const getMyApplicationStats = async (req, res) => {
//   try {
//     const stats = await Application.aggregate([
//       { $match: { seeker: req.user._id } },
//       {
//         $group: {
//           _id: "$status",
//           count: { $sum: 1 },
//         },
//       },
//     ]);

//     return res.json({ success: true, stats });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };//