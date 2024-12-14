import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/authService.js';

const Signup = () => {
    /*  useState hook is initializing a state variable called formData
        formData is an object with 2 properties (username & password) 
        setFormData is a function that will update the formData state */
    const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: ''});
    const navigate = useNavigate(); // hook to programmatically navigate

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await signup(formData);
            console.log('User signed up:', response);
            alert('User signed up successfully');
            navigate('/todos');
        } catch (error) {
            console.error('Error during signup:', error);
            alert('Signup failed');
        }
    };

return (
    // onSubmit prop set to the handleSubmit function
    <form onSubmit={handleSubmit}>
        <input 
            type="text" 
            placeholder="Username" 
            value={formData.username} 
            onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
        />
        <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
         <input
            type="password"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
        />
        <button type="submit">Sign Up</button>
    </form>
    );
};

export default Signup;