import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import EditToDoForm from "./EditToDoForm.jsx";
import { getToDos } from "../services/toDoService.js"; // Updated import to match new function name
import { useAuth } from "../services/AuthContext.jsx";

const ToDoList = ({ newToDo }) => {
  const [todos, setTodos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingToDo, setEditingToDo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { user, loading: authLoading } = useAuth();

  // Load todos from local storage on initial render
  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
      setLoading(false);
    }
  }, []);

  // Fetch todos when user is authenticated
  useEffect(() => {
    const fetchTodos = async () => {
      if (!authLoading && user) {
        try {
          const data = await getToDos(); // Call the updated getToDos function
          setTodos(data);
          localStorage.setItem('todos', JSON.stringify(data));
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

  // Whenever todos change, update local storage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // If a new todo is passed down from ToDoPage, add it to the list
  useEffect(() => {
    if (newToDo) {
      setTodos((prevTodos) => [...prevTodos, newToDo]);
    }
  }, [newToDo]);

  const filteredTodos = selectedCategory === "All"
    ? todos
    : todos.filter((todo) =>
        (todo.category || "Uncategorized").toLowerCase() ===
        selectedCategory.toLowerCase()
      );

  const handleUpdate = (updatedToDo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === updatedToDo._id ? updatedToDo : todo
      )
    );
    setEditingToDo(null);
  };

  const handleCancel = () => {
    setEditingToDo(null);
  };

  if (loading) return <p>Loading ToDos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>ToDo List</h1>

      {editingToDo ? (
        <EditToDoForm
          todo={editingToDo}
          onUpdate={handleUpdate}
          onCancel={handleCancel}
        />
      ) : (
        <>
          <label htmlFor="categoryFilter">Filter by Category:</label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="All">All</option>
            {["A List", "B List", "C List", "Uncategorized"].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <button onClick={() => setSelectedCategory("All")}>
            Clear Filter
          </button>

          <ul>
            {filteredTodos.map((todo) => (
              <li key={todo._id}>
                <Link to={`/todos/${todo._id}`}>{todo.title}</Link>
                <button
                  onClick={() => setEditingToDo(todo)}
                  disabled={editingToDo && editingToDo._id !== todo._id}
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ToDoList;
