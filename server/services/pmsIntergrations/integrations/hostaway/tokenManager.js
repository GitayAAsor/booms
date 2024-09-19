const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

const TOKEN_FILE = path.resolve(__dirname, "token.json");
const TOKEN_URL = "https://api.hostaway.com/v1/accessTokens";

const CLIENT_ID = process.env.HOSTAWAY_CLIENT_ID;
const CLIENT_SECRET = process.env.HOSTAWAY_CLIENT_SECRET;

let tokenData = null;

async function getToken() {
  if (tokenData && tokenData.expiry > Date.now()) {
    return tokenData.token;
  } else {
    await fetchNewToken();
    return tokenData.token;
  }
}

async function fetchNewToken() {
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
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    tokenData = {
      token: data.access_token,
      expiry: Date.now() + data.expires_in * 1000,
    };

    fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenData));
  } catch (error) {
    console.error("Error fetching token:", error);
    throw error;
  }
}

function loadTokenFromFile() {
  try {
    const fileData = fs.readFileSync(TOKEN_FILE, "utf8");
    tokenData = JSON.parse(fileData);
  } catch (error) {
    tokenData = null;
  }
}

loadTokenFromFile();

module.exports = {
  getToken,
};
