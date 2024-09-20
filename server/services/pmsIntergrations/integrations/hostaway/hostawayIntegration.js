const PMSIntegration = require("../../pmsIntegration");
const fetch = require("node-fetch");
const { getToken } = require("./tokenManager");

const URL = process.env.HOSTAWAY_URL;

class HostawayIntegration extends PMSIntegration {
  constructor() {
    super();
  }

  async fetchBookings() {
    try {
      const token = await this.getTokenWithRefresh();
      const response = await this.makeRequest(token);

      if (!response.ok) {
        this.handleFetchError(response);
      }

      const bookings = await response.json();
      return bookings.result;
    } catch (error) {
      console.error("Error fetching bookings from Hostaway:", error);
      throw error;
    }
  }

  async getTokenWithRefresh() {
    return getToken();
  }

  async makeRequest(token) {
    return fetch(URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  handleFetchError(response) {
    if (response.status === 403) {
      console.warn("Received 403 Forbidden. Attempting to refresh the token.");
      return this.getTokenWithRefresh().then(() => this.fetchBookings());
    } else {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  }
}

module.exports = HostawayIntegration;
