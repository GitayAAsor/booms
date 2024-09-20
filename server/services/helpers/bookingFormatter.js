const formatBooking = (booking) => ({
  id: booking.id,
  checkIn: booking.arrivalDate,
  checkOut: booking.departureDate,
  price: booking.totalPrice,
  created_at: booking.reservationDate,
  guest_name: booking.guestName,
  listingId: booking.listingMapId,
  status: booking.status,
  channel_name: booking.channelName,
});

module.exports = formatBooking;
