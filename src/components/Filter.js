import React, { useState } from "react";
import { Button, Typography, Snackbar } from "@mui/material";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

const Filter = ({
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  onFilter,
}) => {
  const [error, setError] = useState("");

  const validateDates = (checkIn, checkOut) => {
    if (checkOut && checkIn && checkOut < checkIn) {
      setError("Check-Out date must be after Check-In date.");
      return false;
    }
    setError("");
    return true;
  };

  const handleCheckInChange = (newValue) => {
    setCheckInDate(newValue);
    validateDates(newValue, checkOutDate);
  };

  const handleCheckOutChange = (newValue) => {
    setCheckOutDate(newValue);
    validateDates(checkInDate, newValue);
  };

  const handleFilter = () => {
    if (validateDates(checkInDate, checkOutDate)) {
      onFilter();
    }
  };

  return (
    <div className="mb-5 flex justify-center items-center gap-4">
      <div className="flex items-center gap-2">
        <Typography variant="body1" className="text-lg">
          Check-In After:
        </Typography>
        <DesktopDatePicker
          id="checkin-date"
          name="checkinDate"
          inputFormat="dd/MM/yyyy"
          value={checkInDate}
          onChange={handleCheckInChange}
        />
      </div>

      <div className="flex items-center gap-2">
        <Typography variant="body1" className="text-lg">
          Check-Out Before:
        </Typography>
        <DesktopDatePicker
          id="checkout-date"
          name="checkoutDate"
          inputFormat="dd/MM/yyyy"
          value={checkOutDate}
          onChange={handleCheckOutChange}
        />
      </div>

      <Button
        variant="contained"
        className="bg-blue-500 text-white border-none cursor-pointer h-8"
        onClick={handleFilter}
      >
        Filter
      </Button>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
        message={error}
      />
    </div>
  );
};

export default Filter;
