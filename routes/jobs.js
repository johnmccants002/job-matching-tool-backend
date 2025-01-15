const express = require("express");
const axios = require("axios");
const { extractKeywords } = require("../utils/openai");
const { getHiringManagerInfo } = require("../utils/openai");

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

router.post("/get-hiring-manager", async (req, res) => {
  console.log("get-hiring-manager function called");
  console.log(req.body);
  const { companyName } = req.body;
  if (!companyName) {
    return res.status(400).json({ error: "Company name is required" });
  }
  const info = await getHiringManagerInfo(companyName);
  res.json({ companyName, hiringManagerInfo: info });
});

module.exports = router;
