import CalendarEvent from "../models/calendarEvents.js";
import mongoose from "mongoose";

export const newCalendarEvent = async (req, res) => {
    try {
      const { title, start, end, todoId, description, recurrence, recurrenceEndDate } = req.body;
      const userId = req.user._id; // Retrieved from verifyToken middleware
      const groupId = recurrence !== 'none' ? new mongoose.Types.ObjectId() : null; // Generate a groupId for recurring events
    
      // Calculate event duration once
      const eventDuration = new Date(end).getTime() - new Date(start).getTime();

      const eventsToSave = [];
      let currentDate = new Date(start);
      const recurrenceEnd = recurrenceEndDate ? new Date(recurrenceEndDate) : new Date(start);
    

    // Generate separate events for each occurrence
    while (currentDate <= recurrenceEnd) {
        // Create unique event for this occurrence
      const eventStart = new Date(currentDate);
      const eventEnd = new Date(currentDate.getTime() + eventDuration);

      eventsToSave.push({
        _id: new mongoose.Types.ObjectId(), // Unique ID for each occurrence
        title,
        start: eventStart,
        end: eventEnd,
        todoId,
        description,
        userId,
        recurrence,
        recurrenceEndDate,
        groupId,
        isRecurring: recurrence !== 'none',
        occurrenceDate: eventStart // Track specific occurrence date
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

      
      console.log('Events to save:', eventsToSave); // Add this log
  
      // Save all events in a batch
      const savedEvents = await CalendarEvent.insertMany(eventsToSave);

      console.log('Saved events:', savedEvents); // Add this log
      
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

         // First find the event to get its details
        const event = await CalendarEvent.findOne({ _id: eventId });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Delete the specific instance
        const deletedEvent = await CalendarEvent.findOneAndDelete({
            _id: eventId,
            userId: userId
        });

        if (!deletedEvent) {
            return res.status(404).json({ message: "Failed to delete event" });
        }

        res.status(200).json({
            message: "Event deleted successfully",
            deletedEvent
        });
    } catch (error) {
        console.error('Delete error:', error); // Add this log
        res.status(500).json({ error: error.message });
    }
};



// export const deleteCalendarEvent = async (req, res) => {
//     try {
//         const userId = req.user._id;
//         const eventId = req.params.id;

//         const deletedEvent = await CalendarEvent.findOneAndDelete({ 
//             _id: eventId,
//             userId: userId
//         });

//         if (!deletedEvent)
//             return res.status(404).json({ message: "Event not found" });

//         res.status(200).json({ message: "Event deleted" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

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
