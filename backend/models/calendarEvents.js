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
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  occurrenceDate: {
    type: Date,
    required: false,
  },
});

const CalendarEvent = mongoose.model("CalendarEvent", CalendarEventSchema); //The string "CalendarEvent" inside mongoose.model() is the actual collection name that will be used in MongoDB
export default CalendarEvent;
