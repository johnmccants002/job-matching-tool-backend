const express = require("express");
const { fetchCompanyInfo, summarizeText } = require("../utils/serpapi");

const router = express.Router();

router.post("/", async (req, res) => {
  const { companyName } = req.body;

  try {
    // Step 1: Fetch company info from SerpAPI
    const companyInfo = await fetchCompanyInfo(companyName);

    // Step 2: Summarize the company info
    const summary = await summarizeText(companyInfo);

    res.json({ summary });
  } catch (error) {
    console.error("Error fetching company info:", error);
    res.status(500).json({ error: "Failed to fetch company info" });
  }
});

module.exports = router;
