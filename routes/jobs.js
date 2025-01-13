const express = require("express");
const axios = require("axios");
const { extractKeywords } = require("../utils/openai");

const router = express.Router();

router.post("/", async (req, res) => {
  const { resumeText } = req.body;

  try {
    // Step 1: Extract keywords from the resume
    const keywords = await extractKeywords(resumeText);

    // Step 2: Query the job board API for matching jobs
    const jobResponse = await axios.get(
      `https://remoteok.io/api?tags=${encodeURIComponent(keywords.join(","))}`
    );

    // Step 3: Send the matching jobs back to the client
    res.json(jobResponse.data);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

module.exports = router;
