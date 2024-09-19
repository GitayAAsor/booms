const { LocalStorage } = require("node-localstorage");
const path = require("path");

class LocalStorageService {
  constructor() {
    this.localStoragePath = path.join(__dirname, "localStorage");
    this.localStorage = new LocalStorage(this.localStoragePath);
    this.storageKey = "reservations";
  }

  saveReservations(reservations) {
    this.localStorage.setItem(this.storageKey, JSON.stringify(reservations));
  }

  getReservations(page = 1, pageSize = 10) {
    const reservations =
      JSON.parse(this.localStorage.getItem(this.storageKey)) || [];
    const start = (page - 1) * pageSize;
    return reservations.slice(start, start + pageSize);
  }

  updateBooking(updatedBooking) {
    const reservations =
      JSON.parse(this.localStorage.getItem(this.storageKey)) || [];
    const index = reservations.findIndex(
      (reservation) => reservation.id === updatedBooking.id
    );
    if (index !== -1) {
      reservations[index] = updatedBooking;
      this.saveReservations(reservations);
    }
  }
}

module.exports = LocalStorageService;
