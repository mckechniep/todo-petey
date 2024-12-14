import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/authService';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors
        setLoading(true); // Set loading to true during login

        try {
            await login({ email, password });
            navigate('/todos'); // Navigate to the todos page upon successful login
        } catch (err) {
            setError(err.message || 'Login failed'); // Display error message
        } finally {
            setLoading(false); // Set loading to false after login attempt
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                gap: 2,
                padding: 3,
            }}
        >
            <Typography variant="h4" component="h1" textAlign="center">
                Login
            </Typography>

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    width: '300px',
                }}
            >
                <TextField
                    id="email"
                    label="Email"
                    type="email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    fullWidth
                />

                <TextField
                    id="password"
                    label="Password"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    fullWidth
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                    fullWidth
                    sx={{ height: '45px' }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                </Button>
            </Box>

            {error && (
                <Typography color="error" textAlign="center">
                    {error}
                </Typography>
            )}

            <Typography variant="body2" textAlign="center">
                Don't have an account?{' '}
                <Link to="/signup" style={{ textDecoration: 'none', color: '#1976d2' }}>
                    Sign up
                </Link>
            </Typography>
        </Box>
    );
};

export default LoginPage;
