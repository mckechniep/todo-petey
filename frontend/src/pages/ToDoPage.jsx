import React, { useState } from 'react';
import ToDoList from '../components/ToDo/ToDoList.jsx';
import ToDoForm from '../components/ToDo/ToDoForm.jsx';
import MyCalendar from '../components/Calendar/MyCalendar.jsx';
import { Modal, Box, Button, Typography } from '@mui/material';
import { useAuth } from '../services/AuthContext.jsx';

const ToDoPage = () => {
    const [showModal, setShowModal] = useState(false);
    const [newToDo, setNewToDo] = useState(null);
    const { user } = useAuth();

    const handleCreateToDo = (createdToDo) => {
        setNewToDo(createdToDo);
        setShowModal(false);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Welcome, {user.username}!
            </Typography>
    
            {/* Main container for side-by-side layout */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 3,
                    justifyContent: 'space-between',
                }}
            >
                {/* ToDo List Section */}
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        border: '1px solid #ddd',
                        borderRadius: 2,
                        p: 2,
                        minHeight: 400,
                        boxShadow: "0 8px 14px rgba(0, 0, 0, 0.15)",
                    }}
                >
                    <Box sx={{ flexGrow: 1 }}>
                        <ToDoList newToDo={newToDo} />
                    </Box>
                    
                    {/* Add ToDo Button at bottom */}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setShowModal(true)}
                        sx={{ mt: 2, alignSelf: 'center' }}
                    >
                        Add ToDo
                    </Button>
                </Box>
    
                {/* Calendar Section */}
                <Box
                    sx={{
                        flex: 2,
                        height: '800px',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    {/* <Typography variant="h6" gutterBottom>
                        Your Calendar
                    </Typography> */}
                    <MyCalendar />
                </Box>
            </Box>
    
            {/* Modal for ToDoForm */}
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
        </Box>
    );
     
};

export default ToDoPage;
