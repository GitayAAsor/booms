const { LocalStorage } = require("node-localstorage");
const path = require("path");

class LocalStorageService {
  constructor() {
    try {
      this.localStoragePath = path.join(__dirname, "localStorage");
      this.localStorage = new LocalStorage(this.localStoragePath);
      this.storageKey = "reservations";
    } catch (error) {
      throw new Error("Failed to initialize local storage");
    }
  }

  saveReservations(reservations) {
    try {
      this.localStorage.setItem(this.storageKey, JSON.stringify(reservations));
    } catch (error) {
      throw new Error("Failed to save reservations to local storage");
    }
  }

  getReservations(page = 1, pageSize = 100) {
    try {
      const reservations =
        JSON.parse(this.localStorage.getItem(this.storageKey)) || [];
      const start = (page - 1) * pageSize;
      return reservations.slice(start, start + pageSize);
    } catch (error) {
      throw new Error("Failed to retrieve reservations from local storage");
    }
  }

  getReservationById(reservationId) {
    try {
      const reservations =
        JSON.parse(this.localStorage.getItem(this.storageKey)) || [];
      const reservation = reservations.find(
        (reservation) => reservation.id === reservationId - 0
      );
      if (!reservation) {
        throw new Error(`Reservation with ID ${reservationId} not found`);
      }
      return reservation;
    } catch (error) {
      throw new Error(
        `Error fetching reservation by ID ${reservationId}: ${error.message}`
      );
    }
  }

  updateBooking(updatedBooking, reservationId) {
    try {
      const reservations =
        JSON.parse(this.localStorage.getItem(this.storageKey)) || [];

      const index = reservations.findIndex(
        (reservation) => reservation.id === reservationId - 0
      );
      if (index === -1) {
        throw new Error(`Reservation with ID ${reservationId} not found`);
      }

      reservations[index] = { ...reservations[index], ...updatedBooking };
      this.saveReservations(reservations);
    } catch (error) {
      throw new Error(
        `Error updating reservation with ID ${reservationId}: ${error.message}`
      );
    }
  }
}

module.exports = LocalStorageService;
