import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getEntryById, editEntry, deleteEntry } from "../services/journalService.js";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Box, Typography, Button, Dialog, DialogActions, DialogTitle } from "@mui/material";

const JournalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [error, setError] = useState(null);

  // Fetch the journal entry details
  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const fetchedEntry = await getEntryById(id);
        setEntry(fetchedEntry);

        // Initialize EditorState with the rich text content
        if (fetchedEntry.content) {
          const contentState = convertFromRaw(JSON.parse(fetchedEntry.content));
          setEditorState(EditorState.createWithContent(contentState));
        }
      } catch (error) {
        setError("Failed to fetch journal entry.");
      }
    };
    fetchEntry();
  }, [id]);

  // Handle edit submission
  const handleSaveEdit = async () => {
    try {
      const rawContent = JSON.stringify(convertToRaw(editorState.getCurrentContent()));

      const updatedEntry = {
        ...entry,
        content: rawContent,
      };

      const result = await editEntry(id, updatedEntry);
      setEntry(result); // Update the current entry with the new data
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      setError("Failed to update the journal entry.");
    }
  };

  // Handle delete confirmation
  const handleDelete = async () => {
    try {
      await deleteEntry(id);
      navigate("/journal"); // Redirect to journal list after deletion
    } catch (error) {
      setError("Failed to delete the journal entry.");
    }
  };

  if (error) return <Typography color="error">{error}</Typography>;
  if (!entry) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      {isEditing ? (
        // Edit Mode: React-Draft-Wysiwyg Editor for editing the journal content
        <>
          <Typography variant="h4" gutterBottom>
            Edit Journal Entry
          </Typography>
          <Box
            sx={{
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "10px",
              minHeight: "200px",
              mb: 2,
            }}
          >
            <Editor
              editorState={editorState}
              onEditorStateChange={setEditorState}
              toolbar={{
                options: ["inline", "blockType", "fontSize", "list", "textAlign", "colorPicker", "link", "history"],
              }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button variant="contained" color="primary" onClick={handleSaveEdit}>
              Save
            </Button>
            <Button variant="outlined" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </Box>
        </>
      ) : (
        // View Mode: React-Draft-Wysiwyg Editor for displaying the content in read-only mode
        <>
          <Typography variant="h4" gutterBottom>
            {entry.title}
          </Typography>
          <Box
            sx={{
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "10px",
              minHeight: "200px",
              mb: 2,
            }}
          >
            <Editor
              editorState={editorState}
              toolbarHidden
              readOnly
            />
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="contained" color="primary" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              Delete
            </Button>
          </Box>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Are you sure you want to delete this entry?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JournalDetails;
