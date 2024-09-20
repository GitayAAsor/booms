const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const TOKEN_FILE = path.resolve(__dirname, "token.json");
const TOKEN_URL = process.env.HOSTAWAY_TOKEN_URL;
const CLIENT_ID = process.env.HOSTAWAY_CLIENT_ID;
const CLIENT_SECRET = process.env.HOSTAWAY_CLIENT_SECRET;

let tokenData = null;

const loadTokenFromFile = () => {
  try {
    const fileData = fs.readFileSync(TOKEN_FILE, "utf8");
    tokenData = JSON.parse(fileData);
  } catch (error) {
    console.warn("No valid token file found. A new token will be fetched.");
    tokenData = null;
  }
};

const fetchNewToken = async () => {
  try {
    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: "general",
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch token: ${response.statusText} (Status: ${response.status})`
      );
    }

    const data = await response.json();
    tokenData = {
      token: data.access_token,
      expiry: Date.now() + data.expires_in * 1000,
    };

    fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenData));
  } catch (error) {
    console.error("Error fetching token:", error.message);
    throw error;
  }
};

const getToken = async () => {
  if (!tokenData || tokenData.expiry <= Date.now()) {
    await fetchNewToken();
  }
  return tokenData.token;
};

loadTokenFromFile();

module.exports = {
  getToken,
};
