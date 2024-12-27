import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getToDoById } from "../services/toDoService.js";
import EditToDoForm from "./EditToDoForm.jsx";
import { Box, Typography, Button, Card, CardContent, CircularProgress } from "@mui/material";

const ToDoDetails = () => {
  const { id } = useParams();
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

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
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        height: "100vh",
        px: 2,
        mt: 5
      }}
    >
      {isEditing ? (
        <EditToDoForm
          todo={todo}
          onUpdate={handleUpdate} // Update the item on successful edit
          onCancel={() => setIsEditing(false)} // Exit edit mode without saving
        />
      ) : (
        <Card sx={{ maxWidth: 500, width: "100%", boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {todo.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Description:</strong> {todo.description}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Category:</strong> {todo.category}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Completed:</strong> {todo.completed ? "Yes" : "No"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              <strong>Date Created:</strong>{" "}
              {new Date(todo.createdAt).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setIsEditing(true)}
              >
                Edit ToDo
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ToDoDetails;
