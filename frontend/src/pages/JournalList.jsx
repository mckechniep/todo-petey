import React, { useState, useEffect } from "react";
import { getEntries, deleteEntry } from "../services/journalService"; // Import deleteEntry function
import { Link } from "react-router-dom";
import { Box, Typography, List, ListItem, Button, Checkbox } from "@mui/material";
import { EditorState, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const JournalList = () => {
  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedEntries, setSelectedEntries] = useState([]); // Track selected entries for bulk delete

  // Fetch journal entries when the page changes
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await getEntries(page);
        setEntries(data.entries);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching journal entries:", error);
      }
    };
    fetchEntries();
  }, [page]);

  // Helper function to convert content to EditorState
  const getEditorState = (content) => {
    try {
      const contentState = convertFromRaw(JSON.parse(content));
      return EditorState.createWithContent(contentState);
    } catch (error) {
      console.error("Error parsing content:", error);
      return EditorState.createEmpty(); // Fallback to empty editor state
    }
  };

  // Handle selection toggling
  const handleSelectEntry = (id) => {
    setSelectedEntries((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((entryId) => entryId !== id) // Remove if already selected
        : [...prevSelected, id] // Add if not selected
    );
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    try {
        await deleteEntry(selectedEntries); // Pass the array of IDs directly
        setEntries((prevEntries) =>
            prevEntries.filter((entry) => !selectedEntries.includes(entry._id))
        ); // Remove deleted entries from the state
        setSelectedEntries([]); // Clear selected entries
    } catch (error) {
        console.error("Error deleting entries:", error);
        alert("Failed to delete selected entries. Please try again.");
    }
};

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Journal Entries
      </Typography>

      {/* List of Journal Entries */}
      <List>
        {entries.map((entry) => (
          <ListItem
            key={entry._id}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              mb: 4,
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "10px",
              backgroundColor: "#f9f9f9",
            }}
          >
            {/* Checkbox for Selection */}
            <Checkbox
              checked={selectedEntries.includes(entry._id)}
              onChange={() => handleSelectEntry(entry._id)}
            />

            {/* Entry Content */}
            <Box sx={{ flexGrow: 1 }}>
              {/* Title with link to entry details */}
              <Link to={`/journal/${entry._id}`}>
                <Typography variant="h6" sx={{ textDecoration: "underline" }}>
                  {entry.title}
                </Typography>
              </Link>

              {/* Preview of the content */}
              <Box
                sx={{
                  mt: 1,
                  minHeight: "100px",
                }}
              >
                <Editor
                  editorState={getEditorState(entry.content)}
                  toolbarHidden
                  readOnly
                />
              </Box>
            </Box>
          </ListItem>
        ))}
      </List>

      {/* Bulk Delete Button */}
      <Button
        variant="contained"
        color="error"
        onClick={handleBulkDelete}
        disabled={selectedEntries.length === 0} // Disable if no entries are selected
        sx={{ mb: 2 }}
      >
        Delete Selected
      </Button>

      {/* Add New Entry Button */}
      <Button
        component={Link}
        to="/journal/new"
        variant="contained"
        color="primary"
        sx={{ mb: 2, ml: 2 }}
      >
        Add New Entry
      </Button>

      {/* Pagination Controls */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
        <Button
          variant="outlined"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outlined"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default JournalList;
