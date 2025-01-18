import JournalEntry from '../models/journalEntry.js';
import mongoose from 'mongoose';

export const newEntry = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const userId = req.user.id;

        if (!title) {
            return res.status(400).json({ error: "Title is required" });
          }

        const newEntry = new JournalEntry({
            title,
            content,
            tags,
            user: userId
        });

        const savedEntry = await newEntry.save()
        res.status(201).json(savedEntry);
    } catch (error) {
        console.error("Error creating new journal entry:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getEntries = async (req, res) => {
    try {
        const userId = req.user.id;
        // Extracts the page and limit query parameters from the request's query string (req.query).//
        const { page = 1, limit = 10 } = req.query; // Sets default values: page = 1 (first page) and limit = 10 (10 entries per page) if these parameters are not provided in the request.


        // Queries the JournalEntry collection in the database for entries belonging to the logged-in user ({ user: userId }).
        const entries = await JournalEntry.find({ user: userId })
            .sort({ createdAt: -1 }) //Sorts the entries in descending order based on their createdAt timestamp (most recent first).
            .skip((page - 1) * limit) //Skips a certain number of entries based on the current page and limit. This is necessary for pagination (entries per page, it makes that happen).
            .limit(parseInt(limit)); //Limits the number of entries returned to the specified limit, which is also an integer bc of parseInt.
        const total = await JournalEntry.countDocuments({ user: userId }); // Calculate total # of pages. Total = total number of jouranl entries belonging to the user. 

        res.status(200).json({
            entries, // The paginated list of journal entries fetched from the database.
            total, // The total number of entries for the user.
            page: parseInt(page), // The current page number (converted to an integer for consistency).
            totalPages: Math.ceil(total / limit), // The total number of pages calculated by dividing total entries by limit and rounding up with Math.ceil
        });
    } catch (error) {
        console.error("Error fetching journal entries:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getEntryById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const entry = await JournalEntry.findOne({ _id: id, user: userId });

    if (!entry) {
      return res.status(404).json({ error: "Journal entry not found" });
    }
    res.status(200).json(entry);
    } catch (error) {
        console.error("Error fetching journal entires:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const editEntry = async (req, res) => {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    const userId = req.user.id;
    
    try {
        const entry = await JournalEntry.findById(id);
        
        if (!entry) {
            return res.status(404).json({ error: "Journal entry not found "});
        }

        if (entry.user.toString() !== userId) {
            return res.status(403).json({ error: "Not authorized to edit this journal entry" });
        }

        const updatedEntry = await JournalEntry.findByIdAndUpdate(
            id,
            { title, content, tags },
            { new: true }
        );

        res.status(200).json(updatedEntry);
    } catch (error) {
        console.error("Error fetching journal entires:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteEntry = async (req, res) => {
    const { id } = req.params;
    const { ids } = req.body; // array of IDs from the request body
    const userId = req.user.id;

    try {
        // bulk journal entry deletion
        if (ids && Array.isArray(ids)) { // built in JS function to check if a variable is an array
            const resut = await JournalEntry.deleteMany({
                _id: { $in: ids }, // deletes documents where _id field matches any of the IDs the ids array
                user: userId, // Ensures only entries belonging to the authenticated user (userId) are deleted.
            });
        

        if (result.deletedCount === ids.length) {
            return res.status(200).json({
                message: `${result.deletedCount} journal entries successfully deleted`
            });
        } else {
            return res.status(400).json({
                error: "Some journal entries could not be deleted. Please try again later."
            });
        }
    } else if (id) {
        // single journal entry deletion
        const entry = await JournalEntry.findById(id);

        if (!entry) {
            return res.status(404).json({ error: "Journal entry not found "});
        }

        if (entry.user.toString() !== userId) {
            return res.status(403).json({ error: "Not authorized to edit this journal entry" });
        }

       await JournalEntry.findOneAndDelete(id);
       return res.status(200).json({ message: "Journal entry succesfully deleted" });
        } else {
            return res.status(400).json({ error: "Invalid request. Prove an ID or an array of IDs." });
        }
    } catch (error) {
        console.error("Error deleting journal entry:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};