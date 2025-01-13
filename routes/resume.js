const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Multer setup for file uploads
const upload = multer({
  dest: "uploads/", // Directory where files will be stored
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, DOC, and DOCX are allowed."));
    }
  },
});

// Resume upload route
router.post("/upload", upload.single("resume"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  const filePath = path.join(__dirname, "..", req.file.path);
  console.log("Uploaded file path:", filePath);

  res.status(200).json({ message: "Resume uploaded successfully!", filePath });
});

// Export the router
module.exports = router;
