import React, { useState } from 'react';
import ToDoList from '../components/ToDoList.jsx';
import ToDoForm from '../components/ToDoForm.jsx';
import { useAuth } from '../services/AuthContext.jsx';
import { Modal, Box, Button, Typography } from '@mui/material';

const ToDoPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [newToDo, setNewToDo] = useState(null);
    const { user, loading: authLoading } = useAuth();

    const handleCreateToDo = (createdToDo) => {
        setNewToDo(createdToDo);
        setShowModal(false); // Close the modal after submission
    };

    if (authLoading) {
        return <p>Loading authentication...</p>;
    }

    if (!user) {
        return <p>Please log in to view your ToDos.</p>;
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Welcome, {user.username}! Here's your Dashboard
            </Typography>

            <Button
                variant="contained"
                color="primary"
                onClick={() => setShowModal(true)}
            >
                Add ToDo
            </Button>

            {/* Modal for the ToDoForm */}
            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                aria-labelledby="todo-form-modal-title"
                aria-describedby="todo-form-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography
                        id="todo-form-modal-title"
                        variant="h6"
                        component="h2"
                        gutterBottom
                    >
                        Create a New ToDo
                    </Typography>
                    <ToDoForm onSubmit={handleCreateToDo} />
                    <Button
                        onClick={() => setShowModal(false)}
                        sx={{ mt: 2 }}
                        variant="outlined"
                        color="secondary"
                    >
                        Cancel
                    </Button>
                </Box>
            </Modal>

            <ToDoList newToDo={newToDo} />
        </div>
    );
};

export default ToDoPage;
