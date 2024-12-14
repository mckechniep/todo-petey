import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditToDoForm from "./EditToDoForm.jsx";

const ToDoList = ({ todos, setTodos }) => {
  const [groupedTodos, setGroupedTodos] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingToDo, setEditingToDo] = useState(null);

  useEffect(() => {
    // 1. Convert todos object to an array of todos
    const todosArray = Object.values(todos || {}).flat();

    // 2. Group the array by category
    const grouped = groupByCategory(todosArray);
    setGroupedTodos(grouped);

    // IMPORTANT: Update the todos state to be the array version
    
  }, [todos]);

  const groupByCategory = (todosArray) => {
    return todosArray.reduce((groups, todo) => {
      const category = todo.category || "Uncategorized";
      groups[category] = groups[category] || []; // Ensure category exists
      groups[category].push(todo);
      return groups;
    }, {});
  };

  const filteredTodos = selectedCategory === "All"
      ? todos
      : todos && Array.isArray(todos) ? todos.filter((todo) => (todo.category || "Uncategorized").toLowerCase() === selectedCategory.toLowerCase()) : [];


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
            {Object.keys(groupedTodos)
              .sort()
              .map((category) => (
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
