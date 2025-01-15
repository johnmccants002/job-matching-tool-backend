const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// LinkedIn OAuth route
const linkedinAuthRoutes = require("./routes/linkedinAuth");
app.use("/auth/linkedin", linkedinAuthRoutes);

// Resume upload route
const resumeRoutes = require("./routes/resume");
app.use("/api/resume", resumeRoutes);

// Jobs route
const jobsRoutes = require("./routes/jobs");
app.use("/api/jobs", jobsRoutes);

// Job matching route
const jobMatchingRoutes = require("./routes/jobMatching");
app.use("/api/jobs-matching", jobMatchingRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
