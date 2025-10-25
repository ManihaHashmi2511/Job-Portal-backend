const Job = require("../Models/Job.model.js");

const { isAuthenticated } = require("../Middleware/Authentication.js");

// admin posted jobs
const postJob = async (req, res) => {
  try {
  
    const {
      title,
      description,
      companyId,
      location,
      salary,
      jobType,
      requirements,
      position,
      experience,
    } = req.body;
    const userId = req.user ? req.user._id : null;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    if (
      !title ||
      !description ||
      !companyId ||
      !location ||
      !salary ||
      !jobType ||
      !requirements ||
      !position ||
      !experience
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const job = await Job.create({
      title,
      description,
      companyId: companyId,
      location,
      salary,
      jobType,
      experience,
      requirements: requirements.split(","),
      position,
      postedBy: userId,
    });
    
    res.status(201).json({ message: "Job posted successfully", job });
  } catch (error) {
    console.error("Error posting job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// that user gets jobs based on query parameters
const getAllJobs = async (req, res) => {
  try {
    
    //filter jobs based on query parameters
    const keywords = req.query.keywords || "";
    const query = {
      $or: [
        { title: { $regex: keywords, $options: "i" } },
        { description: { $regex: keywords, $options: "i" } },
      ],
    };
    const jobs = await Job.find(query)
      .populate({ path: "companyId" })
      .populate({ path: "postedBy", select: "name fullName role" })
      .sort({ createdAt: -1 });
    
    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: "No jobs found" });
    }

    res.status(200).json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//that user gets a job on the basis of id---
const getJobById = async (req, res) => {
  try {
    const jobId = req.params.id;
    // Populate the application field with applicants data
    const job = await Job.findById(jobId).populate({
      path: "application",
      populate: {
        path: "applicants",
        select: "_id",
      },
    });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.status(200).json({ job });
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//for admin

const getAdminjobs = async (req, res) => {
  try {
    const adminId = req.user ? req.user._id : null;
    if (!adminId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const jobs = await Job.find({ postedBy: adminId }).populate({
      path: "companyId",
      createdAt: -1,
    });
    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ message: "No jobs found for this admin" });
    }
    res.status(200).json({ jobs });
  } catch (error) {
    console.error("Error fetching admin jobs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// update job
const updateJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const {
      title,
      description,
      companyId,
      location,
      salary,
      jobType,
      requirements,
      position,
      experience,
    } = req.body;
    const userId = req.user ? req.user._id : null;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    if (
      !title ||
      !description ||
      !companyId ||
      !location ||
      !salary ||
      !jobType ||
      !requirements ||
      !position ||
      !experience
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Update the job fields
    job.title = title;
    job.description = description;
    job.companyId = companyId;
    job.location = location;
    job.salary = salary;
    job.jobType = jobType;
    job.experience = experience;
    job.requirements = requirements.split(",");
    job.position = position;

    await job.save();
    res.status(200).json({ message: "Job updated successfully", job });
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  postJob,
  getAllJobs,
  getJobById,
  getAdminjobs,
  updateJob
};
