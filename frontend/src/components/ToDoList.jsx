import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EditToDoForm from "./EditToDoForm.jsx";

const ToDoList = ({ todos, setTodos }) => {
  const [groupedTodos, setGroupedTodos] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingToDo, setEditingToDo] = useState(null); // Tracks the ToDo being edited

    // Ensure todos is an array before using array methods
    const todosArray = Array.isArray(todos) ? todos : [];

  // Grouping function to organize todos by category
  const groupByCategory = (todos) => {
    return todos.reduce((groups, todo) => {
      const category = todo.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(todo);
      return groups;
    }, {});
  };

  // Update groupedTodos whenever todos or selectedCategory changes
  useEffect(() => {
    const grouped = groupByCategory(todosArray);
    setGroupedTodos(grouped);
  }, [todosArray]);

  // Filtered todos based on selected category
  const filteredTodos =
     selectedCategory === "All"
      ? todosArray
      : todosArray.filter((todo) => todo.category === selectedCategory);

  // Update the list of ToDos after editing
  const handleUpdate = (updatedToDo) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === updatedToDo._id ? updatedToDo : todo
      )
    );
    setEditingToDo(null); // Close the edit form
  };

  const handleCancel = () => {
    setEditingToDo(null); // Close the edit form without saving changes
  };

  return (
    <div>
      <h1>ToDo List</h1>

      {/* Render Edit Form if a ToDo is being edited */}
      {editingToDo ? (
        <EditToDoForm
          todo={editingToDo}
          onUpdate={handleUpdate}
          onCancel={handleCancel}
        />
      ) : (
        <>
          {/* Category Filter */}
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

          {/* Render the ToDo List */}
    
          <ul>
            {filteredTodos.map((todo) => (
              <li key={todo._id}>
                <Link to={`/todos/${todo._id}`}>{todo.title}</Link>
                <button onClick={() => setEditingToDo(todo)}>Edit</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ToDoList;
