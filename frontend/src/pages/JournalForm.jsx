import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import { newEntry } from "../services/journalService.js";
import { Box, TextField, Button, Typography } from "@mui/material";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useNavigate } from "react-router-dom";

const JournalForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [tags, setTags] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert React-Draft-Wysiwyg editor content to raw JSON
      const rawContent = JSON.stringify(convertToRaw(editorState.getCurrentContent()));
      const entryDetails = {
        title,
        content: rawContent, // Store content as a JSON string
        tags: tags.split(",").map((tag) => tag.trim()), // Convert comma-separated tags to an array
      };
      
      await newEntry(entryDetails);
      navigate("/journal");
    } catch (error) {
      console.error("Error creating journal entry:", error);
      setError("Failed to create entry.");
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Journal Entry
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      
      {/* Title Input */}
      <TextField
        fullWidth
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        sx={{ mb: 2 }}
      />

      {/* Content Editor */}
      <Typography variant="h6" gutterBottom>
        Content
      </Typography>
      <Box
        sx={{
          border: "1px solid #ddd",
          borderRadius: "4px",
          padding: "10px",
          minHeight: "200px",
          marginBottom: "16px",
        }}
      >
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState} // Update editor state
          placeholder="Write your journal entry here..."
          toolbar={{
            options: [
              "inline",
              "blockType",
              "fontSize",
              "list",
              "textAlign",
              "colorPicker",
              "link",
              "history",
            ],
          }}
        />
      </Box>

      {/* Tags Input */}
      <TextField
        fullWidth
        label="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* Submit Button */}
      <Button type="submit" variant="contained" color="primary">
        Save
      </Button>
    </Box>
  );
};

export default JournalForm;
