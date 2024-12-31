import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDrag } from "react-dnd";
import EditToDoForm from "./EditToDoForm.jsx";
import { getToDos, editToDo } from "../services/toDoService.js";
import { useAuth } from "../services/AuthContext.jsx";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import AssignmentIcon from "@mui/icons-material/Assignment";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const ToDoList = ({ newToDo }) => {
  const [todos, setTodos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingToDo, setEditingToDo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    const fetchTodos = async () => {
      if (!authLoading && user) {
        try {
          const data = await getToDos();
          setTodos(data);
          setLoading(false);
        } catch (err) {
          console.error("Error fetching todos:", err);
          setError("Failed to fetch todos. Please try again later.");
          setLoading(false);
        }
      }
    };
    fetchTodos();
  }, [authLoading, user]);

  useEffect(() => {
    if (newToDo) {
      setTodos((prevTodos) => [...prevTodos, newToDo]);
    }
  }, [newToDo]);

  const filteredTodos = todos.filter((todo) => {
    if (selectedCategory === "All") return !todo.completed;
    if (selectedCategory === "Completed") return todo.completed;
    return todo.category === selectedCategory && !todo.completed;
  });

  const handleToggleCompleted = async (updatedToDo) => {
    try {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === updatedToDo._id
            ? { ...todo, completed: updatedToDo.completed }
            : todo
        )
      );
      await editToDo(updatedToDo._id, updatedToDo);
    } catch (error) {
      console.error("Failed to update ToDo:", error);
      alert("Could not update ToDo. Please try again.");
    }
  };

  const handleCancel = () => {
    setEditingToDo(null);
  };

  if (loading)
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

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 700,
          color: "#1976d2",
          textAlign: "center",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          borderBottom: "3px solid #1976d2",
          paddingBottom: "8px",
          marginBottom: "20px",
        }}
      >
        ToDo Lists
      </Typography>

      {editingToDo ? (
        <EditToDoForm
          todo={editingToDo}
          onUpdate={handleToggleCompleted}
          onCancel={handleCancel}
        />
      ) : (
        <>
          {/* <Typography variant="subtitle1">Filter by Category:</Typography> */}
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            displayEmpty
            sx={{ mb: 2, width: "200px" }}
          >
            <MenuItem value="All">All</MenuItem>
            {["A List", "B List", "C List"].map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
          <Button onClick={() => setSelectedCategory("All")} sx={{ mb: 2 }}>
            Clear Filter
          </Button>

          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {filteredTodos.map((todo) => (
              <DraggableToDo
                key={todo._id}
                todo={todo}
                setEditingToDo={setEditingToDo}
                handleToggleCompleted={handleToggleCompleted}
              />
            ))}
          </List>
        </>
      )}
    </div>
  );
};

const DraggableToDo = ({ todo, setEditingToDo, handleToggleCompleted }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: "TODO",
    item: {
      _id: todo._id,
      title: todo.title,
      description: todo.description,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <ListItem
      ref={dragRef}
      secondaryAction={
        <IconButton
          edge="end"
          onClick={() => setEditingToDo(todo)}
          size="small"
        >
          <EditIcon fontSize="small" />
        </IconButton>
      }
      sx={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "grab",
        backgroundColor: isDragging ? "rgba(0, 0, 0, 0.1)" : "transparent",
        transform: isDragging ? "scale(0.95)" : "scale(1)",
        transition: "all 0.2s",
      }}
    >
      <ListItemAvatar>
        <Avatar>
          <AssignmentIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={<Link to={`/todos/${todo._id}`}>{todo.title}</Link>}
        secondary={
          <Typography component="div">
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() =>
                  handleToggleCompleted({ ...todo, completed: !todo.completed })
                }
              />
              <span>Completed</span>
            </Box>
          </Typography>
        }
      />
    </ListItem>
  );
};

export default ToDoList;
