const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const apiRoutes = require("./services/api/apiRoutes");
const PMSIntegrationFactory = require("./services/pmsIntergrations/pmsIntegrationFactory");
const LocalStorageService = require("./services/storage/LocalStorageService");
const formatBooking = require("./services/helpers/bookingFormatter");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;
const FETCH_INTERVAL = Number(process.env.FETCH_INTERVAL) || 3600000;

const localStorageService = new LocalStorageService();

const fetchAndStoreBookings = async () => {
  try {
    const integration = PMSIntegrationFactory.createIntegration("hostaway");
    const bookings = await integration.fetchBookings();

    if (Array.isArray(bookings) && bookings.length > 0) {
      const formattedBookings = bookings.map(formatBooking);

      await localStorageService.saveReservations(formattedBookings);
      console.log("Bookings fetched and stored successfully.");
    } else {
      console.warn("No bookings fetched from Hostaway.");
    }
  } catch (error) {
    console.error("Error fetching and storing bookings:", error.message);
  }
};

fetchAndStoreBookings();
const intervalId = setInterval(fetchAndStoreBookings, FETCH_INTERVAL);

app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Express server is running on http://localhost:${PORT}`);
});

const gracefulShutdown = () => {
  console.log("Shutting down server gracefully...");
  clearInterval(intervalId);
  process.exit(0);
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
