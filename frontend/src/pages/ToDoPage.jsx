import React, { useState } from 'react';
import ToDoList from '../components/ToDoList.jsx';
import ToDoForm from '../components/ToDoForm.jsx';
import { useAuth } from '../services/AuthContext.jsx';

const ToDoPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [newToDo, setNewToDo] = useState(null); 
    // newToDo will store the newly created todo before passing it to ToDoList

    const { user, loading: authLoading } = useAuth();

    const handleCreateToDo = (createdToDo) => {
        setNewToDo(createdToDo);
        setShowForm(false);
    };

    if (authLoading) {
        return <p>Loading authentication...</p>;
    }

    if (!user) {
        return <p>Please log in to view your ToDos.</p>;
    }

    return (
        <div>
            <h1>My ToDos</h1>

            <button onClick={() => setShowForm(!showForm)}>
                {showForm ? 'Hide Add ToDo Form' : 'Add ToDo'}
            </button>

            {/* ToDoForm only handles creating a todo and returns it to handleCreateToDo */}
            {showForm && <ToDoForm onSubmit={handleCreateToDo} />}

            {/* Pass the newly created todo down to ToDoList so it can update its state */}
            <ToDoList newToDo={newToDo} />
        </div>
    );
};

export default ToDoPage;
