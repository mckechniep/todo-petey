import React, { useState } from 'react';
import { createToDo } from '../services/toDoService.js';
import { useAuth } from '../services/AuthContext.jsx'


// ToDoForm is a functional component
// onSubmit is a prop passed from the parent component
    /* parent component that passes the onSubmit prop to the ToDoForm component would typically be 
            the main page or container that manages the list of ToDos. This parent component should 
            handle updating the state for the ToDos after a new one is created. */
const ToDoForm = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('A List');
    const [completed, setCompleted] = useState(false);
    const { user, loading } = useAuth();
    const [error, setError] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const newToDo = {
                title,
                description,
                category,
                completed,
                user: user._id,
            };

            // call the API to create the ToDo
            const createdToDo = await createToDo(newToDo);
            onSubmit(createdToDo); 

            setTitle('');
            setDescription('');
            setCategory('A List');
            setCompleted(false);
        } catch (error) {
            setError("Failed to create ToDo");
            console.log("it's fucked innit");
            console.error("Error creating ToDo:", error);
        }
    };

    if (loading) {
        return <div>Loading user data...</div>; // Or a spinner
    }

    if (!user) {
        return <div>Please log in to create ToDos.</div>;
    }
    

    return (
        <form onSubmit={handleSubmit}>
            <h2>Create New ToDo</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div>
                <label htmlFor="title">Title:</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="description">Description:</label>
                <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="category">Category:</label>
                <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="A List">A List</option>
                    <option value="B List">B List</option>
                    <option value="C List">C List</option>
                </select>
            </div>

            <div>
                <label htmlFor="completed">Completed:</label>
                <input
                    type="checkbox"
                    id="completed"
                    checked={completed}
                    onChange={(e) => setCompleted(e.target.checked)}
                />
            </div>

            <button type="submit">Create ToDo</button>
        </form>
    );
};

export default ToDoForm;