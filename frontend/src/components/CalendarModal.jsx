import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { format } from "date-fns";
import {
  saveCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
  getCalendarEvents
} from "../services/calendarService";

const CalendarModal = ({
  open,
  onClose,
  todo,
  initialDate,
  editingEvent,
  onEventSaved,
  onEventDeleted,
}) => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [recurrence, setRecurrence] = useState("none");
  const [recurrenceEndDate, setRecurrenceEndDate] = useState("");

  useEffect(() => {
    if (editingEvent) {
      // Populate fields for editing an existing event
      setTitle(editingEvent.title || "");
      setStartDate(format(new Date(editingEvent.start), "yyyy-MM-dd'T'HH:mm"));
      setEndDate(format(new Date(editingEvent.end), "yyyy-MM-dd'T'HH:mm"));
      setDescription(editingEvent.description || "");
      setRecurrence(editingEvent.recurrence || "none");
      setRecurrenceEndDate(
        editingEvent.recurrenceEndDate
          ? format(new Date(editingEvent.recurrenceEndDate), "yyyy-MM-dd")
          : ""
      );
    } else if (initialDate) {
      // Populate fields for creating a new event
      const startDateTime = new Date(initialDate);
      setTitle(todo ? todo.title : "");
      setStartDate(format(startDateTime, "yyyy-MM-dd'T'HH:mm"));
      setEndDate(
        format(
          new Date(startDateTime.getTime() + 60 * 60 * 1000),
          "yyyy-MM-dd'T'HH:mm"
        )
      );
      setDescription(todo ? todo.description : "");
      setRecurrence("none");
      setRecurrenceEndDate("");
    }
  }, [editingEvent, initialDate, todo]);

  const handleSave = async () => {
    const eventData = {
      title,
      start: new Date(startDate),
      end: new Date(endDate),
      todoId: todo ? todo._id : null,
      description,
      recurrence,
      recurrenceEndDate:
        recurrence === "none" ? null : new Date(recurrenceEndDate),
      isRecurring: recurrence !== "none",
      occurrenceDate: new Date(startDate),
    };

    try {
      let savedEvents;
      if (editingEvent) {
        savedEvents = await updateCalendarEvent(editingEvent._id, eventData);
        savedEvents = [savedEvents]; // Wrap in array for consistency
      } else {
        savedEvents = await saveCalendarEvent(eventData); // Returns array
      }
      onEventSaved(savedEvents);
      onClose();
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDelete = async () => {
    if (editingEvent && editingEvent._id) {
      try {
        await deleteCalendarEvent(editingEvent._id);
    
        // Fetch fresh events after deletion
        const updatedEvents = await getCalendarEvents();
        const formattedEvents = updatedEvents.map(event => ({
            ...event,
            start: new Date(event.start),
            end: new Date(event.end),
            occurrenceDate: event.occurrenceDate ? new Date(event.occurrenceDate) : null
        }));
        
        // Pass the full updated events list to parent
        onEventSaved(formattedEvents);
        onClose();
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    }
};


  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {editingEvent ? `Edit Event: ${editingEvent.title}` : "Create Event"}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Start Date & Time"
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date & Time"
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          rows={2}
        />

        {/* Recurrence Section */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Recurrence</InputLabel>
          <Select
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value)}
            label="Recurrence"
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="daily">Daily</MenuItem>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
          </Select>
        </FormControl>

        {recurrence !== "none" && (
          <TextField
            label="Recurrence End Date"
            type="date"
            value={recurrenceEndDate}
            onChange={(e) => setRecurrenceEndDate(e.target.value)}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {editingEvent && (
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        )}
        <Button onClick={handleSave} variant="contained" color="primary">
          {editingEvent ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CalendarModal;
