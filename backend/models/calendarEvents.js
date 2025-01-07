import mongoose from "mongoose";

const CalendarEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  todoId: { type: mongoose.Schema.Types.ObjectId, ref: "Todo" },
  description: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  recurrence: {
    type: String,
    enum: ["none", "daily", "weekly", "monthly"], // Options for recurrence
    default: "none",
  },
  recurrenceEndDate: { type: Date }, // End date for recurring events
});

const CalendarEvent = mongoose.model("CalendarEvent", CalendarEventSchema);
export default CalendarEvent;
