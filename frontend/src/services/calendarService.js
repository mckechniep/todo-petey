import api from "./api";

// Save a calendar event (handles single or recurring events)
export const saveCalendarEvent = async (eventData) => {
  const token = localStorage.getItem("token");
  const res = await api.post("/calendar/events", eventData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // This returns all saved events (including recurring instances)
};

// Fetch all calendar events for the logged-in user
export const getCalendarEvents = async () => {
  const token = localStorage.getItem("token");
  const res = await api.get("/calendar/events", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // Returns an array of all events
};

// Update a calendar event by ID
export const updateCalendarEvent = async (id, eventData) => {
  const token = localStorage.getItem("token");
  const res = await api.put(`/calendar/events/${id}`, eventData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // Returns the updated event
};

// Delete a calendar event by ID
export const deleteCalendarEvent = async (id) => {
  const token = localStorage.getItem("token");
  const res = await api.delete(`/calendar/events/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data; // Returns a success message or confirmation
};
