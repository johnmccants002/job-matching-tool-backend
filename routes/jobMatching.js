const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const parseResume = require("../utils/resumeParser");
const fetchJobListings = require("../utils/remotive");
const { getHiringManagerInfo } = require("../utils/openai");

// Configure Multer for file uploads
const upload = multer({
  dest: "uploads/", // Temporary storage for uploaded files
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const fileTypes = /pdf|doc|docx/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    if (extname) {
      return cb(null, true);
    }
    cb(new Error("Only .pdf, .doc, or .docx files are allowed!"));
  },
});

// Job matching route
router.post("/match", upload.single("resume"), async (req, res) => {
  try {
    // Step 1: Check if a file was uploaded
    if (!req.file) {
      console.error("No file uploaded."); // Debug log for missing file
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Log file path for debugging
    const filePath = req.file.path;
    console.log(`Resume file uploaded to: ${filePath}`);

    // Step 2: Parse the resume to extract skills
    console.log("Starting resume parsing...");
    const extractedData = await parseResume(filePath);
    console.log("Resume parsed successfully.");
    console.log("Extracted skills:", extractedData.skills);

    // Step 3: Fetch job listings based on extracted skills
    console.log("Fetching job listings based on extracted skills...");
    const matchedJobs = await fetchJobListings(extractedData.skills);
    console.log("Matched jobs:", matchedJobs);
    console.log("Job listings fetched successfully.");
    // Step 4: Return matched jobs to the client
    res.status(200).json({
      message: "Job matching successful",
      jobs: matchedJobs,
    });
  } catch (error) {
    // Log detailed error message for debugging
    console.error("Error in job matching:", error.message);
    console.error("Stack trace:", error.stack);

    // Send error response
    res.status(500).json({ error: "Failed to match jobs" });
  }
});

module.exports = router;
