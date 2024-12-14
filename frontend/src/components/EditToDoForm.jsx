import React, { useState, useEffect } from 'react';
import { editToDo } from '../services/toDoService.js';


/* Props: todo, onUpdate, OnCancel
todo - todo object being edited (called to be edited)
onUpdate - callback funcction after updating the toDo
onCancel - callback function to close form w/o saving changes
*/
const EditToDoForm = ({ todo, onUpdate, onCancel }) => {
    // tracks the title input field value, initializes title from todo prop, or empty string
    const [title, setTitle] = useState(todo.title || '');
    const [description, setDescription] = useState(todo.description || '');
    const [category, setCategory] = useState(todo.category || 'A List');
    const [completed, setCompleted] = useState(todo.completed || false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false); // Tracks the loading state during API

    /* useEffect allows form to dynamically update input fields if the todo 
    prop changes (if different todo is selected) while edit form is already
    rendered. it's basically like live updating. */
    useEffect(() => {
        setTitle(todo.title || '');
        setDescription(todo.description || '');
        setCategory(todo.category || 'A List');
        setCompleted(todo.completed || false);
    }, [todo]); // [todo] dependency means effect runs only when the todo prop changes

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null); //clear previous error msgs

        try {
            //construct updated ToDo payload, new object with updated values
            const updatedToDo ={
                ...todo, // retain original ToDo ID (and created date i think?)
                title,
                description,
                category,
                completed,
            };

            // call the API to update the ToDo
            const res = await editToDo(todo._id, updatedToDo);
            /* calls onUpdate callback with updated ToDo object returned from API (res)
            allows the parent component, like ToDoPage, to handle the updated ToDo object
            by replacing the old one with the new one.
            For example, something like onUpdate={handleUpdate} in the form,
            and handleUpdate maps through prevTodos with updatedToDo etc. etc. */
            onUpdate(res);
        } catch (error) {
            setError("Failed to update ToDo");
            console.error("Error updating ToDo:", error);
        } finally {
            setLoading(false); // Stop the loading indicator
        }
    };

    return (
        <form onSubmit={handleSubmit}>
             <h2>Edit ToDo</h2>
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

            <button type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'} 
            </button>

            <button type="button" onClick={onCancel} disabled={loading}>
                Cancel
            </button>
        </form>
    );
};

export default EditToDoForm;
