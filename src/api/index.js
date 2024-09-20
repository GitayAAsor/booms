export const getReservations = async () => {
  try {
    const response = await fetch(`/api/reservations`);
    if (!response.ok) {
      throw new Error(`Error fetching reservations: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch reservations. Please try again.");
  }
};

export const updateReservation = async (id, updatedData) => {
  try {
    const response = await fetch(`/api/reservations/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    });

    if (!response.ok) {
      throw new Error(`Error updating reservation: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to update reservation. Please try again.");
  }
};
