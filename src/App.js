import React, { useState, useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { getReservations, updateReservation } from "./api";
import Filter from "./components/Filter";
import ReservationTable from "./components/ReservationTable";

const App = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getReservations();
      setReservations(data);
      setFilteredReservations(data);
    } catch (error) {
      console.error("Error fetching reservations", error);
      setError("Failed to fetch reservations. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const applyFilter = () => {
    const filtered = reservations.filter(
      (reservation) =>
        (new Date(reservation.checkIn) >= new Date(checkInDate) ||
          !checkInDate) &&
        (new Date(reservation.checkOut) <= new Date(checkOutDate) ||
          !checkOutDate)
    );
    setFilteredReservations(filtered);
  };

  const handleUpdateReservation = async (id, updatedReservation) => {
    try {
      await updateReservation(id, updatedReservation);
      const updatedReservations = reservations.map((reservation) =>
        reservation.id === id ? updatedReservation : reservation
      );
      setReservations(updatedReservations);
      setFilteredReservations((prev) =>
        prev.map((reservation) =>
          reservation.id === id ? updatedReservation : reservation
        )
      );
    } catch (error) {
      console.error("Error updating reservation", error);
      setError("Failed to update reservation. Please try again later.");
    }
  };

  if (loading) return <div>Loading reservations...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="max-w-[1000px] mx-auto bg-white p-5 shadow-lg">
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <h1 className="text-2xl font-bold text-center mb-5">Reservations</h1>
        <Filter
          checkInDate={checkInDate}
          setCheckInDate={setCheckInDate}
          checkOutDate={checkOutDate}
          setCheckOutDate={setCheckOutDate}
          onFilter={applyFilter}
        />
        <ReservationTable
          reservations={filteredReservations}
          onUpdateReservation={handleUpdateReservation}
        />
      </LocalizationProvider>
    </div>
  );
};

export default App;
