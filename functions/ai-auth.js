// Cloud Function to provide auth tokens for AI Brewmaster
const {GoogleAuth} = require("google-auth-library");

const auth = new GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/cloud-platform"],
});

exports.getAIAuthToken = async (req, res) => {
  // Set CORS headers
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(204).send("");
    return;
  }

  try {
    // Get auth client
    const authClient = await auth.getClient();

    // Get access token
    const accessToken = await authClient.getAccessToken();

    res.json({
      access_token: accessToken.token,
      expires_in: 3600,
    });
  } catch (error) {
    console.error("Error getting auth token:", error);
    res.status(500).json({
      error: "Failed to get authentication token",
    });
  }
};
