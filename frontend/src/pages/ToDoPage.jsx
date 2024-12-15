// Considering your ToDoList component already handles fetching, organizing, and rendering your ToDos by category,
// your ToDoPage should act as a parent container that incorporates:
//     Your Existing ToDoList Component: Displays and organizes the ToDos.
//     Sections for Creating, Editing, and Deleting ToDos: Use additional components (e.g., ToDoForm) for these actions.

import React, { useState, useEffect } from 'react';
import ToDoList from '../components/ToDoList.jsx';
import ToDoForm from '../components/ToDoForm.jsx';
import { getTodos } from '../services/toDoService.js';
import { useAuth } from '../services/AuthContext.jsx';

const ToDoPage = () => {
    const [todos, setTodos] = useState([]); // Holds the list of ToDos
    const [showForm, setShowForm] = useState(false); // Controls visibility of the ToDoForm
    const [loading, setLoading] = useState(true); // Tracks loading state
    const [error, setError] = useState(null); // Tracks errors during fetching
    const { user, loading: authLoading } = useAuth();

    // Fetch ToDos from the backend when the component mounts
    useEffect(() => {
        if (!authLoading && user) {
        const fetchTodos = async () => {
            console.log(localStorage.getItem("token"))
            try {
                const data = await getTodos(); // Fetch todos from the backend
                setTodos(Array.isArray(data) ? data : []); // ensure todos is an array
                setLoading(false); // Stop loading
            } catch (err) {
                console.error("Error fetching todos:", err);
                setError("Failed to fetch todos. Please try again later.");
                setLoading(false);
            }
        };
        fetchTodos();
        }
    }, [authLoading, user]);

    // Handles adding a new ToDo and updates the todos state
    const handleCreateToDo = (newToDo) => {
        setTodos((prevTodos) => [...prevTodos, newToDo]);
        setShowForm(false); // Hide the form after submission
    };

    if (loading) return <p>Loading ToDos...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <div>
            <h1>My ToDos</h1>

            <button onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Hide Add ToDo Form' : 'Add ToDo'}
            </button>

            {showForm && <ToDoForm onSubmit={handleCreateToDo} />}

            <ToDoList todos={todos} setTodos={setTodos} /> {/* Pass todos and setTodos */}
        </div>
    );
};

export default ToDoPage;
