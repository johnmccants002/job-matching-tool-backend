const express = require("express");
const axios = require("axios");
const router = express.Router();

const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI;
const STATE = process.env.LINKEDIN_STATE;

// Step 1: Redirect user to LinkedIn authorization URL
router.get("/login", (req, res) => {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  // Use process.env for a consistent redirect URI
  const redirectUri = encodeURIComponent(REDIRECT_URI); // Use the same environment variable

  const scopes = "openid profile email"; // Updated scopes
  const state = STATE;

  const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scopes}`;

  res.redirect(authorizationUrl); // Redirect user to LinkedIn for authentication
});

router.get("/callback", async (req, res) => {
  const authorizationCode = req.query.code;

  if (!authorizationCode) {
    return res.status(400).send("Authorization code is missing.");
  }

  try {
    const response = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: authorizationCode,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    console.log("Rate Limit Info:", response.headers);
    console.log("Access Token:", response.data.access_token);

    const accessToken = response.data.access_token;

    // Fetch user's profile data
    const profileResponse = await axios.get("https://api.linkedin.com/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const emailResponse = await axios.get(
      "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    res.status(200).send({
      profile: profileResponse.data,
      email: emailResponse.data.elements[0]["handle~"].emailAddress,
    });
  } catch (error) {
    console.error(
      "Error during OAuth callback:",
      error.response?.data || error.message
    );
    res.status(500).send("Failed to authenticate.");
  }
});

module.exports = router;
