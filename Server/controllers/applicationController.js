import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";

/* APPLY TO JOB */
export const applyToJob = async (req, res) => {
  try {
    const seekerId = req.user.id;
    const jobId = req.params.jobId;

    // check if job exists
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // prevent applying to own job
    if (job.postedBy.toString() === seekerId)
      return res.status(400).json({ message: "Cannot apply to your own job" });

    // prevent applying twice
    const already = await Application.findOne({ job: jobId, seeker: seekerId });
    if (already) return res.status(400).json({ message: "Already applied" });

   // 🔍 4. Get seeker
    const seeker = await User.findById(seekerId);
    if (!seeker) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❗ 5. Ensure resume exists
    if (!seeker.resume) {
      return res.status(400).json({
        message: "Please upload your resume before applying",
      });
    }
    // ✅ 6. Ensure resume is a valid URL (Cloudinary)
    const isValidUrl = seeker.resume.startsWith("http");
    if (!isValidUrl) {
      return res.status(400).json({
        message: "Invalid resume. Please re-upload your resume.",
      });
    }

    const newApplication = await Application.create({
      job: jobId,
      seeker: seekerId,
      resume: seeker.resume || "",
      status: "pending",
      appliedAt: new Date(),
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

    // 🔍 1. Check job exists
    const job = await Job.findById(jobId).populate("postedBy", "_id");
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 🔐 2. Check ownership
    if (job.postedBy._id.toString() !== employerId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // 📥 3. Get applications
    const applications = await Application.find({ job: jobId })
      .populate({
        path: "seeker",
        select: "name email resume profilePhoto",
      })
      .sort({ createdAt: -1 });

    // 🔥 4. Normalize data (CLOUDINARY SAFE)
    const formattedApplications = applications.map((app) => {
      let resume = app.seeker?.resume || "";
      let profilePhoto = app.seeker?.profilePhoto || "";

      // ✅ If NOT cloudinary → ignore (or fallback)
      if (resume && !resume.startsWith("http")) {
        resume = ""; // ❌ prevent broken link
      }

      if (profilePhoto && !profilePhoto.startsWith("http")) {
        profilePhoto = "";
      }

      return {
        applicationId: app._id,
        name: app.seeker?.name || "Unknown",
        email: app.seeker?.email || "N/A",
        resume,
        profilePhoto,
        status: app.status,
        appliedAt: app.createdAt,
      };
    });

    // ✅ 5. Response
    res.status(200).json({
      jobId: job._id,
      totalApplicants: formattedApplications.length,
      applications: formattedApplications,
    });

  } catch (err) {
    console.error("GetApplicationsForJob Error:", err);
    res.status(500).json({ message: "Server error" });
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