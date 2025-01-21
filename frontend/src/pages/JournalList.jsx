import React, { useState, useEffect } from "react";
import { getEntries } from "../services/journalService";
import { Link } from "react-router-dom";
import { Box, Typography, List, ListItem, Button } from "@mui/material";
import { EditorState, convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const JournalList = () => {
  const [entries, setEntries] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Journal Entries
      </Typography>
      <List>
        {entries.map((entry) => (
          <ListItem key={entry._id} sx={{ mb: 4 }}>
            <Box>
              {/* Title with link to entry details */}
              <Link to={`/journal/${entry._id}`}>
                <Typography variant="h6" sx={{ textDecoration: "underline" }}>
                  {entry.title}
                </Typography>
              </Link>

              {/* Preview of the content */}
              <Box
                sx={{
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  padding: "10px",
                  minHeight: "100px",
                  mt: 1,
                  backgroundColor: "#f9f9f9",
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

      {/* Add New Entry Button */}
      <Button
        component={Link}
        to="/journal/new"
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
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
