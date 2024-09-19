const PMSIntegration = require("../../pmsIntegration");
const fetch = require("node-fetch");
const { getToken } = require("./tokenManager");

class HostawayIntegration extends PMSIntegration {
  constructor() {
    super();
  }

  async fetchBookings() {
    try {
      const token = await getToken();

      const response = await fetch("https://api.hostaway.com/v1/reservations", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 403) {
        await fetchNewToken();
        return this.fetchBookings();
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching bookings from Hostaway:", error);
      throw error;
    }
  }
}

module.exports = HostawayIntegration;
