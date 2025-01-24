import React, { useState, useEffect } from "react";
import { createToDo } from "../../services/toDoService.js";
import categoryService from "../../services/categoryService.js";
import { useAuth } from "../../services/AuthContext.jsx";
import { TextField, Button, MenuItem, Typography, Box } from "@mui/material";

const ToDoForm = ({ onSubmit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(""); // Store selected category
  const [categories, setCategories] = useState([]); // Store fetched categories
  const [completed, setCompleted] = useState(false);
  const { user, loading } = useAuth();
  const [error, setError] = useState(null);

  // Fetch categories when the form loads
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data); // Assuming data is an array of category objects
        if (data.length > 0) {
          setCategory(data[0]._id); // Default to the first category if available
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to load categories. Please refresh the page.");
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newToDo = {
        title,
        description,
        category, // Use selected category
        completed,
        user: user._id, // Add user ID for backend association
      };

      const createdToDo = await createToDo(newToDo);
      onSubmit(createdToDo);

      // Reset the form
      setTitle("");
      setDescription("");
      setCategory(categories[0]?._id || ""); // Reset to the first category
      setCompleted(false);
    } catch (error) {
      setError("Failed to create ToDo");
      console.error("Error creating ToDo:", error);
    }
  };

  if (loading) {
    return <Typography>Loading user data...</Typography>;
  }

  if (!user) {
    return <Typography>Please log in to create ToDos.</Typography>;
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      {error && (
        <Typography color="error" gutterBottom>
          {error}
        </Typography>
      )}

      {/* Title Input */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          required
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Box>

      {/* Description Input */}
      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Box>

      {/* Category Dropdown */}
      <Box sx={{ mb: 2 }}>
        <TextField
          select
          fullWidth
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          disabled={categories.length === 0} // Disable if no categories available
        >
          {categories.length > 0 ? (
            categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>
                {cat.name}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No categories available</MenuItem>
          )}
        </TextField>
      </Box>

      {/* Completed Checkbox */}
      <Box sx={{ mb: 2 }}>
        <Typography>
          <label>
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            Mark as Completed
          </label>
        </Typography>
      </Box>

      {/* Submit Button */}
      <Box>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Create ToDo
        </Button>
      </Box>
    </Box>
  );
};

export default ToDoForm;
