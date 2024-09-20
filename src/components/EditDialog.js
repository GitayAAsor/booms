import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const EditDialog = ({ open, reservation, onClose, onSave }) => {
  const [updatedCheckIn, setUpdatedCheckIn] = useState(
    reservation?.checkIn || ""
  );
  const [updatedCheckOut, setUpdatedCheckOut] = useState(
    reservation?.checkOut || ""
  );
  const [error, setError] = useState("");

  const handleSave = () => {
    if (new Date(updatedCheckIn) >= new Date(updatedCheckOut)) {
      setError("Check-In date must be before Check-Out date.");
      return;
    }
    onSave({
      ...reservation,
      checkIn: updatedCheckIn,
      checkOut: updatedCheckOut,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Reservation</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Check-in Date"
          type="date"
          fullWidth
          variant="standard"
          value={updatedCheckIn}
          onChange={(e) => setUpdatedCheckIn(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          margin="dense"
          label="Check-out Date"
          type="date"
          fullWidth
          variant="standard"
          value={updatedCheckOut}
          onChange={(e) => setUpdatedCheckOut(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditDialog;
