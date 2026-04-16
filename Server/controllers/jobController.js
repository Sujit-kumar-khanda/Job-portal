import Job from "../models/Job.js";
import Application from "../models/Application.js";
import User from "../models/User.js";

// =========================
// CREATE JOB
// =========================
export const createJob = async (req, res) => {
  try {
    const { title, description, location, salary, skills } = req.body;

    const job = await Job.create({
      title,
      description,
      location,
      salary,
      skills: Array.isArray(skills)
        ? skills
        : skills
        ? skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      postedBy: req.user.id,
    });

    res.status(201).json({ message: "Job created", job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// GET ALL JOBS
// =========================
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("postedBy", "name email profilePhoto");
    
    res.json({ jobs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// GET EMPLOYER JOBS
// =========================
export const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).lean();

    const jobsWithApplicants = await Promise.all(
      jobs.map(async (job) => {
        const applications = await Application.find({ job: job._id })
          .populate("seeker", "name email profilePhoto resume")
          .sort({ createdAt: -1 });

        return {
          ...job,
          applicants: applications.map((app) => ({
            _id: app._id,
            user: app.seeker,
            status: app.status,
            appliedAt: app.createdAt,
          })),
        };
      })
    );

    res.json({ jobs: jobsWithApplicants });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// GET EMPLOYER APPLICATIONS
// =========================
export const getEmployerApplications = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id }).select("title");

    const result = await Promise.all(
      jobs.map(async (job) => {
        const applications = await Application.find({ job: job._id })
          .populate("seeker", "name email resume")
          .sort({ createdAt: -1 });

        return {
          jobId: job._id,
          title: job.title,
          totalApplicants: applications.length,
          applicants: applications.map((app) => ({
            applicationId: app._id,
            name: app.seeker?.name,
            email: app.seeker?.email,
            resume: app.seeker?.resume,
            status: app.status,
            appliedAt: app.createdAt,
          })),
        };
      })
    );

    res.status(200).json({ jobs: result });
  } catch (error) {
    res.status(500).json({ message: "Failed to load applications" });
  }
};

// =========================
// DELETE JOB
// =========================
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await Job.findByIdAndDelete(req.params.id);

    await Application.deleteMany({ job: req.params.id });

    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =========================
// GET JOB BY ID
// =========================
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name email"
    );

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json({ job });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// =========================
// APPLY JOB
// =========================
export const applyToJob = async (req, res) => {
  try {
    const jobId = req.params.jobId; // FIXED
    const seekerId = req.user.id;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    // prevent self-apply
    if (job.postedBy.toString() === seekerId) {
      return res.status(400).json({ message: "Cannot apply to your own job" });
    }

    const seeker = await User.findById(seekerId);
    if (!seeker) return res.status(404).json({ message: "User not found" });

    if (!seeker.resume) {
      return res.status(400).json({
        message: "Please upload your resume before applying",
      });
    }

    const existing = await Application.findOne({
      job: jobId,
      seeker: seekerId,
    });

    if (existing) {
      return res.status(400).json({ message: "Already applied" });
    }

    const application = await Application.create({
      job: jobId,
      seeker: seekerId,
      resume: seeker.resume,
      status: "pending",
    });

    return res.json({
      message: "Applied successfully",
      application,
    });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
  }
};

// =========================
// MY APPLICATIONS
// =========================
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ seeker: req.user.id })
      .populate({ path: "job", select: "title location salary" })
      .sort({ createdAt: -1 });

    const result = applications.map((app) => ({
      _id: app.job._id,
      title: app.job.title,
      location: app.job.location,
      salary: app.job.salary,
      myStatus: app.status,
    }));

    res.json({ jobs: result });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};