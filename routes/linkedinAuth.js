const express = require("express");
const axios = require("axios");
const querystring = require("querystring");
const router = express.Router();

const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI;

// Step 1: Redirect user to LinkedIn authorization URL
router.get("/login", (req, res) => {
  const authUrl = `https://www.linkedin.com/oauth/v2/authorization?${querystring.stringify(
    {
      response_type: "code",
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: "r_liteprofile r_emailaddress",
    }
  )}`;
  res.redirect(authUrl);
});

// Step 2: Handle LinkedIn callback and exchange code for an access token
router.get("/callback", async (req, res) => {
  const { code } = req.query;

  console.log(code);

  try {
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      querystring.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const accessToken = tokenResponse.data.access_token;

    // Step 3: Fetch user profile data
    const profileResponse = await axios.get("https://api.linkedin.com/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const emailResponse = await axios.get(
      "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    res.json({
      profile: profileResponse.data,
      email: emailResponse.data.elements[0]["handle~"].emailAddress,
    });
  } catch (error) {
    console.error("Error during LinkedIn OAuth flow:", error.message);
    res.status(500).json({ error: "Authentication failed" });
  }
});

module.exports = router;
