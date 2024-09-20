import React, { useState } from "react";
import ReservationTableRow from "./ReservationTableRow";
import EditDialog from "./EditDialog";
import { updateReservation } from "../api";
import Snackbar from "@mui/material/Snackbar";

const ReservationTable = ({ reservations, onUpdateReservation }) => {
  const [open, setOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [error, setError] = useState("");

  const handleEditClick = (reservation) => {
    setSelectedReservation(reservation);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedReservation(null);
  };

  const handleSave = async (updatedReservation) => {
    try {
      await updateReservation(selectedReservation.id, updatedReservation);
      onUpdateReservation(selectedReservation.id, updatedReservation);
      handleClose();
    } catch (error) {
      console.error("Error updating reservation", error);
      setError("Failed to update reservation.");
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300 table-fixed">
        <thead>
          <tr className="bg-blue-500">
            {[
              "ID",
              "Check-in",
              "Check-out",
              "Price",
              "Guest Name",
              "Listing ID",
              "Status",
              "Channel",
              "Edit",
            ].map((header) => (
              <th
                key={header}
                className="py-3 px-4 border-b border-r text-center text-white"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation) => (
            <ReservationTableRow
              key={reservation.id}
              reservation={reservation}
              onEdit={handleEditClick}
            />
          ))}
        </tbody>
      </table>

      {selectedReservation && (
        <EditDialog
          open={open}
          reservation={selectedReservation}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        message={error}
      />
    </div>
  );
};

export default ReservationTable;
