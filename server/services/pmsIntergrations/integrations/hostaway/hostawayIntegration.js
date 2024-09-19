const PMSIntegration = require("../../pmsIntegrationFactory");
const fetch = require("node-fetch");
const { getToken } = require("./tokenManager");
const LocalStorageService = require("../../../storage/LocalStorageService");

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

      const bookings = await response.json();

      const storage = new LocalStorageService();
      storage.saveReservations(
        bookings.result.map((booking) => ({
          id: booking.id,
          checkIn: booking.arrivalDate,
          checkOut: booking.departureDate,
          price: booking.totalPrice,
          created_at: booking.reservationDate,
          guest_name: booking.guestName,
          listingId: booking.listingMapId,
          status: booking.status,
          channel_name: booking.channelName,
        }))
      );
      return bookings;
    } catch (error) {
      console.error("Error fetching bookings from Hostaway:", error);
      throw error;
    }
  }
}

module.exports = HostawayIntegration;
