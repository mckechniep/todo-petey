import React, { useState, useEffect } from 'react';
import { editToDo } from '../../services/toDoService.js';
import {
    Box,
    TextField,
    FormControl,
    Select,
    MenuItem,
    InputLabel,
    FormControlLabel,
    Checkbox,
    Button,
    Typography,
    Paper,
    Stack
  } from '@mui/material';


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
            const updatedToDo = {
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
        <Paper elevation={3} sx={{ 
            p: 3, 
            maxWidth: 500,  
            width: "100%",   // Match ToDoDetails width
            mx: 'auto'       // Center the form
        }}>
            <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Edit ToDo
                </Typography>
                
                {error && (
                    <Typography color="error" variant="body2">
                        {error}
                    </Typography>
                )}

                <TextField
                    fullWidth
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    variant="outlined"
                />

                <TextField
                    fullWidth
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    multiline
                    rows={4}
                    variant="outlined"
                />

                <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        variant="outlined"
                        label="Category"
                    >
                        <MenuItem value="A List">A List</MenuItem>
                        <MenuItem value="B List">B List</MenuItem>
                        <MenuItem value="C List">C List</MenuItem>
                    </Select>
                </FormControl>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={completed}
                            onChange={(e) => setCompleted(e.target.checked)}
                            color="primary"
                        />
                    }
                    label="Completed"
                />

                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                        fullWidth
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={onCancel}
                        disabled={loading}
                        fullWidth
                    >
                        Cancel
                    </Button>
                </Stack>
            </Box>
        </Paper>
    );
};


export default EditToDoForm;
