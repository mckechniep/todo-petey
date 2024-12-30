import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { format } from "date-fns";

const CalendarModal = ({
  open,
  onClose,
  onSave,
  onDelete,
  todo,
  initialDate,
  editingEvent,
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    if (editingEvent) {
      setStartDate(format(new Date(editingEvent.start), "yyyy-MM-dd'T'HH:mm"));
      setEndDate(format(new Date(editingEvent.end), "yyyy-MM-dd'T'HH:mm"));
    } else if (initialDate) {
      const startDateTime = new Date(initialDate);
      setStartDate(format(startDateTime, "yyyy-MM-dd'T'HH:mm"));
      setEndDate(
        format(
          new Date(startDateTime.getTime() + 60 * 60 * 1000),
          "yyyy-MM-dd'T'HH:mm"
        )
      );
    }
  }, [editingEvent, initialDate]);

  const handleSave = () => {
    const eventData = {
      ...(editingEvent && { _id: editingEvent._id }),
      title: editingEvent ? editingEvent.title : todo ? todo.title : "",
      start: new Date(startDate),
      end: new Date(endDate),
      todoId: editingEvent ? editingEvent.todoId : todo ? todo._id : null,
      description: editingEvent
        ? editingEvent.description
        : todo
        ? todo.description
        : "",
    };

    onSave(eventData);
    onClose();
  };

  const handleDelete = () => {
    if (editingEvent && editingEvent._id) {
      onDelete(editingEvent._id);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {editingEvent
          ? `Edit Event: ${editingEvent.title}`
          : todo
          ? `Schedule Task: ${todo.title}`
          : "Create Event"}
      </DialogTitle>
      <DialogContent>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {editingEvent && ( // Simplified condition
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        )}
        <Button onClick={handleSave} variant="contained" color="primary">
          {editingEvent ? "Update" : "Save"} Event
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CalendarModal;
