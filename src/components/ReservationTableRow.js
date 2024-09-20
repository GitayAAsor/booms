import React from "react";
import { Button } from "@mui/material";

const ReservationTableRow = ({ reservation, onEdit }) => (
  <tr className="border-b">
    {Object.entries(reservation).map(([key, value]) => (
      <td key={key} className="py-2 px-1 border-r text-center">
        {key === "price" ? `$${value}` : value}
      </td>
    ))}
    <td className="py-2 px-1 text-center">
      <Button
        variant="contained"
        style={{
          backgroundColor: "#4CAF50",
          color: "white",
          padding: "1px",
        }}
        onClick={() => onEdit(reservation)}
      >
        Edit
      </Button>
    </td>
  </tr>
);

export default ReservationTableRow;
