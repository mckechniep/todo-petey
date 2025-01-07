import CalendarEvent from "../models/calendarEvents.js";

export const newCalendarEvent = async (req, res) => {
    try {
      const { title, start, end, todoId, description, recurrence, recurrenceEndDate } = req.body;
      const userId = req.user._id; // Retrieved from verifyToken middleware
  
      const eventsToSave = [];
      let currentDate = new Date(start);
      const recurrenceEnd = recurrenceEndDate ? new Date(recurrenceEndDate) : new Date(start);
  
      while (currentDate <= recurrenceEnd) {
        eventsToSave.push({
          title,
          start: new Date(currentDate),
          end: new Date(currentDate.getTime() + (new Date(end).getTime() - new Date(start).getTime())),
          todoId,
          description,
          userId,
          recurrence,
          recurrenceEndDate,
        });
  
        // Advance the date based on recurrence type
        if (recurrence === "daily") {
          currentDate.setDate(currentDate.getDate() + 1);
        } else if (recurrence === "weekly") {
          currentDate.setDate(currentDate.getDate() + 7);
        } else if (recurrence === "monthly") {
          currentDate.setMonth(currentDate.getMonth() + 1);
        } else {
          break; // If recurrence is "none" or invalid
        }
      }
  
      // Save all events in a batch
      const savedEvents = await CalendarEvent.insertMany(eventsToSave);
      res.status(201).json(savedEvents);
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

        const deletedEvent = await CalendarEvent.findOneAndDelete({ 
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
