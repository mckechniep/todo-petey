import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/authService.js';
import { useAuth } from '../services/AuthContext.jsx';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import MuiCard from '@mui/material/Card';
import GoogleIcon from './CustomIcons.jsx';

const Card = styled(MuiCard)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    [theme.breakpoints.up('sm')]: {
        width: '450px',
    },
}));

const SignUpContainer = styled(Box)(({ theme }) => ({
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage:
        'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
}));

const Signup = () => {
    const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
    const { setUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.password !== formData.confirmPassword) {
                alert('Passwords must match!');
                return;
            }

            await signup(formData, (user) => {
                setUser(user);
                alert('User signed up successfully');
                navigate('/todos');
            });
        } catch (error) {
            console.error('Error during signup:', error);
            alert('Signup failed');
        }
    };

    return (
        <SignUpContainer>
            <CssBaseline />
            <Card variant="outlined">
                <Typography component="h1" variant="h4" sx={{ textAlign: 'center' }}>
                    Sign Up
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                >
                    <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        required
                    />
                    <Button type="submit" variant="contained" fullWidth>
                        Sign Up
                    </Button>
                </Box>
                <Divider>
                    <Typography sx={{ color: 'text.secondary' }}>or</Typography>
                </Divider>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                fullWidth
                variant="outlined"
                onClick={() => alert('Sign up with Google')}
                startIcon={<GoogleIcon />}
                >
                Sign up with Google
                </Button>
                </Box>
                <Typography sx={{ textAlign: 'center' }}>
                <Link
              to="/signin"
              style={{ textDecoration: 'none', color: '#1976d2' }}
            >
              Login
            </Link>
                </Typography>
            </Card>
        </SignUpContainer>
    );
};

export default Signup;








// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { signup } from '../services/authService.js';
// import { useAuth } from '../services/AuthContext.jsx';
// // import { TextField, Button, Container, Typography, Box } from '@mui/material';


// const Signup = () => {
//     /*  useState hook is initializing a state variable called formData
//         formData is an object with 2 properties (username & password) 
//         setFormData is a function that will update the formData state */
//     const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: ''});
//     const { setUser } = useAuth();
//     const navigate = useNavigate(); // hook to programmatically navigate

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             if (formData.password !== formData.confirmPassword) {
//                 alert('Passwords must match!')
//                 return;
//             }

//             await signup(formData, (user) => {
//                 setUser(user);
//                 alert('User signed up successfully');
//                 navigate('/todos');
//             });
            
           
//         } catch (error) {
//             console.error('Error during signup:', error);
//             alert('Signup failed');
//         }
//     };

// return (
//     // onSubmit prop set to the handleSubmit function
//     <form onSubmit={handleSubmit}>
//         <input 
//             type="text" 
//             placeholder="Username" 
//             value={formData.username} 
//             onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
//         />
//         <input
//             type="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//         />
//          <input
//             type="password"
//             placeholder="Confirm Password"
//             value={formData.confirmPassword}
//             onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
//         />
//         <button type="submit">Sign Up</button>
//     </form>
//     );
// };

// export default Signup;