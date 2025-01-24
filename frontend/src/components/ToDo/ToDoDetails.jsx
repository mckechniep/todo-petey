import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getToDoById } from "../../services/toDoService.js";
import categoryService from "../../services/categoryService.js";
import EditToDoForm from "./EditToDoForm.jsx";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  FormControlLabel,
  Checkbox,
  Paper,
  Stack,
  Divider
} from "@mui/material";

const ToDoDetails = () => {
  const { id } = useParams();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchToDo = async () => {
      try {
        const fetchedToDo = await getToDoById(id);
        setTodo(fetchedToDo);
      } catch (error) {
        setError("Error fetching ToDo details");
        console.error("Error fetching ToDo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchToDo();
  }, [id]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getCategories();
        setCategories(data);

      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleUpdate = (updatedToDo) => {
    setTodo(updatedToDo); // Update the current ToDo with new data
    setIsEditing(false); // Exit edit mode
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", color: "error.main", mt: 4 }}>
        <Typography variant="h6">{error}</Typography>
      </Box>
    );
  }

  if (!todo) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography variant="h6">ToDo not found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 3, mt: 4 }}>
      {isEditing ? (
        <EditToDoForm
          todo={todo}
          onUpdate={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <Paper elevation={3} sx={{ maxWidth: 500, width: "100%" }}>
          <CardContent>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              ToDo Details
            </Typography>

            <Stack spacing={3}>
              <TextField
                label="Title"
                value={todo.title}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
              />

              <TextField
                label="Description"
                value={todo.description}
                fullWidth
                multiline
                rows={4}
                InputProps={{ readOnly: true }}
                variant="outlined"
              />

              <TextField
                label="Category"
                value={todo.category}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={todo.completed}
                    disabled
                    color="primary"
                  />
                }
                label="Completed"
              />

              <TextField
                label="Date Created"
                value={new Date(todo.createdAt).toLocaleString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                fullWidth
                InputProps={{ readOnly: true }}
                variant="outlined"
              />

              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsEditing(true)}
                fullWidth
                sx={{ mt: 2 }}
              >
                Edit ToDo
              </Button>
            </Stack>
          </CardContent>
        </Paper>
      )}
    </Box>
  );
};
export default ToDoDetails;
