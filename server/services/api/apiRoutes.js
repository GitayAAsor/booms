const express = require("express");
const router = express.Router();
const LocalStorageService = require("../storage/LocalStorageService");

const localStorageService = new LocalStorageService();

router.get("/reservations", (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    if (page < 1 || pageSize < 1) {
      return res.status(400).json({ error: "Invalid pagination parameters" });
    }

    const reservations = localStorageService.getReservations(page, pageSize);

    if (!reservations) {
      return res.status(404).json({ error: "No reservations found" });
    }

    const filterdReservations = reservations.map((reservation) => {
      const { created_at, ...rest } = reservation;
      return rest;
    });

    res.json(filterdReservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
});

router.put("/reservations/:id", (req, res) => {
  try {
    const reservationId = req.params.id;
    const updatedBooking = req.body;

    if (
      !updatedBooking ||
      !updatedBooking.checkIn ||
      !updatedBooking.checkOut
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingBooking =
      localStorageService.getReservationById(reservationId);
    if (!existingBooking) {
      return res.status(404).json({ error: "Reservation not found" });
    }

    localStorageService.updateBooking(updatedBooking, reservationId);
    res.json({ message: "Booking updated successfully" });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Failed to update booking" });
  }
});

module.exports = router;
