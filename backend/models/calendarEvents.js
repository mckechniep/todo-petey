import mongoose from 'mongoose';

const CalendarEventSchema = new mongoose.Schema({
    title: {type: String},
    start: {type: Date},
    end: {type: Date},
    todoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Todo' },
    description: {type: String},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const CalendarEvent = mongoose.model('CalendarEvent', CalendarEventSchema);
export default CalendarEvent;