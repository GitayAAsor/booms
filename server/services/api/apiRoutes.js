const express = require("express");
const router = express.Router();
const LocalStorageService = require("../storage/LocalStorageService");

const localStorageService = new LocalStorageService();

router.get("/reservations", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 10;
  const reservations = localStorageService.getReservations(page, pageSize);
  res.json(reservations);
});

router.put("/reservations/:id", (req, res) => {
  const id = req.params.id;
  const updatedBooking = req.body;
  updatedBooking.id = id;
  localStorageService.updateBooking(updatedBooking);
  res.json({ message: "Booking updated successfully" });
});

module.exports = router;
