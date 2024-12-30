import CalendarEvent from "../models/calendarEvents.js";

export const newCalendarEvent = async (req, res) => {
    try {
        const { title, start, end, todoId, description } = req.body;
        const userId = req.user._id; // from verifyToken middleware

        const event = new CalendarEvent({
            title,
            start,
            end,
            todoId,
            description,
            userId
        });

        const savedEvent = await event.save();
        res.status(201).json(savedEvent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getCalendarEvents = async (req, res) => {
    try {
        const userId = req.user._id; // from verifyToken middleware
        const events = await CalendarEvent.find({ userId });
        // res.setHeader('Content-Type', 'application/json');
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteCalendarEvent = async (req, res) => {
    try {
        const userId = req.user._id;
        const eventId = req.params.id;

        const deletedEvent = await CalendarEvent.findByIdAndDelete({ 
            _id: eventId,
            userId: userId
        });

        if (!deletedEvent)
            return res.status(404).json({ message: "Event not found" });

        res.status(200).json({ message: "Event deleted" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const editCalendarEvent = async (req, res) => {
    try {
        const userId = req.user._id;
        const eventId = req.params.id;
        const updates = req.body;

        const updatedEvent = await CalendarEvent.findOneAndUpdate(
            { _id: eventId, userId: userId },
            updates,
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
