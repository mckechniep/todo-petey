import JournalEntry from '../models/journalEntry.js';
import ToDo from '../models/toDo.js';

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
        const entries = await JournalEntry.find({ user: userId });

    if (!entries) {
        return res.status(404).json({ error: "No journal entries found for this user "});
    }
    res.status(200).json(entries);
    } catch (error) {
        console.error("Error fetching journal entires:", error);
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
    const userId = req.user.id;

    try {
        const entry = await JournalEntry.findById(id);
        
        if (!entry) {
            return res.status(404).json({ error: "Journal entry not found "});
        }

        if (entry.user.toString() !== userId) {
            return res.status(403).json({ error: "Not authorized to edit this journal entry" });
        }

        const result = await JournalEntry.deleteOne({ _id: id });

        if (result.deletedCount === 1) {
            return res.status(200).json({ message: "Journal entry succesfully deleted" });
        } else {
            return res.status(500).json({ error: "Failed to delete journal entry" });
        }
    } catch (error) {
        console.error("Error deleting journal entry:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};