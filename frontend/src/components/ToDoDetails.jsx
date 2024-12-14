import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getToDoById } from '../services/toDoService.js';

const ToDoDetails = () => {
    const { id } = useParams();
    const [todo, setTodo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
    }, [id]); // runs whenever the :id changes

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div style={{ color: 'red' }}>{error}</div>;
    }

    if (!todo) {
        return <div>ToDo not found.</div>;
    }


    return (
        <div>
            <h2>{todo.title}</h2>
            <p>Description: {todo.description}</p>
            <p>Category: {todo.category}</p>
            <p>Completed: {todo.completed}</p>
            <p>Date Created: {todo.createdAt}</p>
        </div>
    );
};

export default ToDoDetails;