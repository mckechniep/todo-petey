import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx'; // Import routing components
import ToDoPage from './pages/ToDoPage.jsx'; // Import your ToDoPage
import LoginPage from './pages/LoginPage.jsx'; // Import a LoginPage (you'll need to create this)
import SignupPage from './pages/SignupPage.jsx'; // Import a SignupPage (you'll need to create this)
import ToDoDetails from './components/ToDoDetails.jsx'; // Import ToDoDetails
import MyCalendar from './components/MyCalendar.jsx';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
    <Router> {/* Wrap your app with the Router */}
    <Navbar />
      <Routes> {/* Use Routes to define your routes */}
        <Route path="/" element={<Navigate to="/signin" />} />
        <Route path="/signin" element={<LoginPage />} /> {/* Route for the login page */}
        <Route path="/signup" element={<SignupPage />} /> {/* Route for the signup page */}
        <Route path="/todos" element={<ToDoPage />} /> {/* Route for the ToDoPage */}
        <Route path="/todos/:id" element={<ToDoDetails />} /> {/* Route for ToDo details */}
        <Route path="/calendar" element={<MyCalendar />} />
      </Routes>
    </Router>
    </DndProvider>
  );
}

export default App;

