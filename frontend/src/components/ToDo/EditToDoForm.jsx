import React, { useState, useEffect } from "react";
import { editToDo } from "../../services/toDoService.js";
import categoryService from "../../services/categoryService.js"; // For fetching categories
import {
  Box,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Paper,
  Stack,
} from "@mui/material";

const EditToDoForm = ({ todo, onUpdate, onCancel }) => {
  const [title, setTitle] = useState(todo.title || "");
  const [description, setDescription] = useState(todo.description || "");
  const [category, setCategory] = useState(todo.category || "");
  const [categories, setCategories] = useState([]); // To hold the list of categories
  const [completed, setCompleted] = useState(todo.completed || false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch categories when the form is rendered
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data); // Assuming the backend sends an array of categories
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories. Please try again.");
      }
    };

    fetchCategories();
  }, []);

  // Update form fields if the `todo` prop changes
  useEffect(() => {
    setTitle(todo.title || "");
    setDescription(todo.description || "");
    setCategory(todo.category || "");
    setCompleted(todo.completed || false);
  }, [todo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updatedToDo = {
        ...todo,
        title,
        description,
        category,
        completed,
      };

      const res = await editToDo(todo._id, updatedToDo);
      onUpdate(res); // Pass the updated ToDo back to the parent
    } catch (err) {
      setError("Failed to update ToDo");
      console.error("Error updating ToDo:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        maxWidth: 500,
        width: "100%",
        mx: "auto", // Center the form
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        <Typography variant="h5" component="h2" gutterBottom>
          Edit ToDo
        </Typography>

        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        <TextField
          fullWidth
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          variant="outlined"
        />

        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          rows={4}
          variant="outlined"
        />

        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            variant="outlined"
            label="Category"
            disabled={categories.length === 0} // Disable if no categories available
          >
            {categories.length > 0 ? (
              categories.map((cat) => (
                <MenuItem key={cat._id} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No categories available</MenuItem>
            )}
          </Select>
        </FormControl>

        <FormControlLabel
          control={
            <Checkbox
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              color="primary"
            />
          }
          label="Completed"
        />

        <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            fullWidth
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={loading}
            fullWidth
          >
            Cancel
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default EditToDoForm;
