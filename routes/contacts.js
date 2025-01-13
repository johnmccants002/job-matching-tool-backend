const express = require("express");
const axios = require("axios");

const router = express.Router();

router.post("/", async (req, res) => {
  const { companyName, jobTitle } = req.body;

  try {
    // Query LinkedIn or similar API (replace with your method)
    const response = await axios.get(
      `https://api.linkedin.com/v2/search?q=${encodeURIComponent(
        companyName + " " + jobTitle
      )}`,
      {
        headers: { Authorization: `Bearer ${process.env.LINKEDIN_API_KEY}` },
      }
    );

    res.json(response.data.elements);
  } catch (error) {
    console.error("Error fetching contacts:", error);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
});

module.exports = router;
