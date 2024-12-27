import React, { useState } from 'react';
import { createToDo } from '../services/toDoService.js';
import { useAuth } from '../services/AuthContext.jsx';
import { TextField, Button, MenuItem, Typography, Box } from '@mui/material';


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
            console.log("Sending ToDo to API:", newToDo);
            const createdToDo = await createToDo(newToDo);
            console.log("Received Created ToDo from API:", createdToDo);
            onSubmit(createdToDo);

            setTitle('');
            setDescription('');
            setCategory('A List');
            setCompleted(false);
        } catch (error) {
            setError("Failed to create ToDo");
            console.error("Error creating ToDo:", error);
        }
    };

    if (loading) {
        return <Typography>Loading user data...</Typography>;
    }

    if (!user) {
        return <Typography>Please log in to create ToDos.</Typography>;
    }

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {/* <Typography variant="h6" gutterBottom>
                Create New ToDo
            </Typography> */}
            {error && (
                <Typography color="error" gutterBottom>
                    {error}
                </Typography>
            )}

            <Box sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    required
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </Box>

            <Box sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </Box>

            <Box sx={{ mb: 2 }}>
                <TextField
                    select
                    fullWidth
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    {['A List', 'B List', 'C List'].map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
            </Box>

            <Box sx={{ mb: 2 }}>
                <Typography>
                    <label>
                        <input
                            type="checkbox"
                            checked={completed}
                            onChange={(e) => setCompleted(e.target.checked)}
                        />
                        Mark as Completed
                    </label>
                </Typography>
            </Box>

            <Box>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                >
                    Create ToDo
                </Button>
            </Box>
        </Box>
    );
};

export default ToDoForm;
