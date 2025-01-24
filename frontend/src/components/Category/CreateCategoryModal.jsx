import React, { useState } from "react";
import { Box, Button, Modal, TextField, Typography } from "@mui/material";
import categoryService from "../../services/categoryService";

const CreateCategoryModal = ({ onCategoryCreated }) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTitle("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCategory = await categoryService.createCategory(title);
      onCategoryCreated(newCategory); // Pass the newly created category back to parent
      handleClose();
    } catch (err) {
      setError("Failed to create category. Please try again.");
      console.error("Error creating category:", err);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleOpen}
        sx={{ ml: 2 }}
      >
        Add Category
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" gutterBottom>
            Create New Category
          </Typography>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Category Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Create
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default CreateCategoryModal;
