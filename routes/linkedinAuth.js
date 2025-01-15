const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken"); // To validate the ID token (if needed)
const router = express.Router();

const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = process.env.LINKEDIN_REDIRECT_URI;
const STATE = process.env.LINKEDIN_STATE;

// Step 1: Redirect user to LinkedIn authorization URL
router.get("/login", (req, res) => {
  const scopes = "openid profile email"; // OIDC scopes
  const state = STATE;

  const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&state=${state}&scope=${scopes}`;

  res.redirect(authorizationUrl); // Redirect user to LinkedIn for authentication
});

// Step 2: Handle LinkedIn callback
router.get("/callback", async (req, res) => {
  const authorizationCode = req.query.code;
  const state = req.query.state;

  // Validate the state parameter to prevent CSRF attacks
  if (!state || state !== STATE) {
    return res.status(400).send("Invalid state parameter.");
  }

  if (!authorizationCode) {
    return res.status(400).send("Authorization code is missing.");
  }

  try {
    // Exchange the authorization code for an access token and ID token
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: authorizationCode,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token: accessToken, id_token: idToken } = tokenResponse.data;

    // Optional: Validate the ID token if your app needs to verify the user's identity
    if (idToken) {
      const decodedToken = jwt.decode(idToken, { complete: true });
      console.log("Decoded ID Token:", decodedToken);
    }

    // Fetch user's profile data
    const profileResponse = await axios.get("https://api.linkedin.com/v2/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Fetch user's email address
    const emailResponse = await axios.get(
      "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    // Send back user data
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
