const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const apiRoutes = require("./services/api/apiRoutes");

const HostawayIntegration = require("./services/pmsIntergrations/integrations/hostaway/hostawayIntegration");
const LocalStorageService = require("./services/storage/LocalStorageService");

const app = express();
app.use(bodyParser.json());
app.use(pino);

app.use("/api", apiRoutes);

const hostawayIntegration = new HostawayIntegration();

(async () => {
  try {
    await hostawayIntegration.fetchBookings();

    const localStorageService = new LocalStorageService();
    const bookings = localStorageService.getReservations();

    console.log("Bookings fetched and stored in LocalStorageService:");
    console.log(bookings);
  } catch (error) {
    console.error("Error during initialization:", error);
  }
})();

app.listen(3001, () => {
  console.log("Express server is running on localhost:3001");
});
