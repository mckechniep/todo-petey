import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getToDoById } from "../services/toDoService.js";
import EditToDoForm from "./EditToDoForm.jsx";

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  if (!todo) {
    return <div>ToDo not found.</div>;
  }

  return (
    <div>
      {isEditing ? (
        <EditToDoForm
          todo={todo}
          onUpdate={handleUpdate} // Update the item on successful edit
          onCancel={() => setIsEditing(false)} // Exit edit mode without saving
        />
      ) : (
        <>
          <h2>{todo.title}</h2>
          <p>Description: {todo.description}</p>
          <p>Category: {todo.category}</p>
          <p>Completed: {todo.completed ? "Yes" : "No"}</p>
          <p>Date Created: {todo.createdAt}</p>
          <button onClick={() => setIsEditing(true)}>Edit ToDo</button>
        </>
      )}
    </div>
  );
};

export default ToDoDetails;
