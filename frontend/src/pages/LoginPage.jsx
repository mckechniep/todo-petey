// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { useAuth } from '../services/AuthContext'; // Import AuthContext
// import { login } from '../services/authService';
// import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';

// const LoginPage = () => {
//     const navigate = useNavigate();
//     const { setUser } = useAuth(); //access setUser function
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [loading, setLoading] = useState(false);

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError(''); // Clear any previous errors
//         setLoading(true); // Set loading to true during login

//         try {
//             const res = await login({ username, password });
//             setUser(res.user);
//             navigate('/todos'); // Navigate to the todos page upon successful login
//         } catch (err) {
//             setError(err.message || 'Login failed'); // Display error message
//         } finally {
//             setLoading(false); // Set loading to false after login attempt
//         }
//     };

//     return (
//         <Box
//             sx={{
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 height: '100vh',
//                 gap: 2,
//                 padding: 3,
//             }}
//         >
//             <Typography variant="h4" component="h1" textAlign="center">
//                 Login
//             </Typography>

//             <Box
//                 component="form"
//                 onSubmit={handleSubmit}
//                 sx={{
//                     display: 'flex',
//                     flexDirection: 'column',
//                     gap: 2,
//                     width: '300px',
//                 }}
//             >
//                 <TextField
//                     id="username"
//                     label="Username"
//                     type="username"
//                     variant="outlined"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                     required
//                     fullWidth
//                 />

//                 <TextField
//                     id="password"
//                     label="Password"
//                     type="password"
//                     variant="outlined"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     required
//                     fullWidth
//                 />

//                 <Button
//                     type="submit"
//                     variant="contained"
//                     color="primary"
//                     disabled={loading}
//                     fullWidth
//                     sx={{ height: '45px' }}
//                 >
//                     {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
//                 </Button>
//             </Box>

//             {error && (
//                 <Typography color="error" textAlign="center">
//                     {error}
//                 </Typography>
//             )}

//             <Typography variant="body2" textAlign="center">
//                 Don't have an account?{' '}
//                 <Link to="/signup" style={{ textDecoration: 'none', color: '#1976d2' }}>
//                     Sign up
//                 </Link>
//             </Typography>
//         </Box>
//     );
// };

// export default LoginPage;
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../services/AuthContext'; // Import AuthContext
import { login } from '../services/authService';
import {
  Box,
  Button,
  Card as MuiCard,
  CssBaseline,
  Divider,
  FormControl,
  FormLabel,
  TextField,
  Typography,
  styled,
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import GoogleIcon from './CustomIcons';

// Styled components
const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const LoginContainer = styled(Box)(({ theme }) => ({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
}));

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth(); // Access setUser function
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    setLoading(true); // Set loading to true during login

    try {
      const res = await login({ username, password });
      setUser(res.user);
      navigate('/todos'); // Navigate to the todos page upon successful login
    } catch (err) {
      setError(err.message || 'Login failed'); // Display error message
    } finally {
      setLoading(false); // Set loading to false after login attempt
    }
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <LoginContainer>
        <Card>
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Login
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              width: '100%',
            }}
          >
            <FormControl>
              <FormLabel htmlFor="username">Username</FormLabel>
              <TextField
                id="username"
                
                type="text"
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                id="password"
                type="password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
              />
            </FormControl>
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
          <MuiLink
            component="button"
            type="button"
            onClick={() => alert('Forgot Password Modal')}
            variant="body2"
            sx={{ alignSelf: 'center' }}
          >
            Forgot your password?
          </MuiLink>
          <Divider>or</Divider>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => alert('Sign in with Google')}
              startIcon={<GoogleIcon />}
            >
              Sign in with Google
            </Button>
            </Box>
          <Typography sx={{ textAlign: 'center' }}>
            Don&apos;t have an account?{' '}
            <Link
              to="/signup"
              style={{ textDecoration: 'none', color: '#1976d2' }}
            >
              Sign up
            </Link>
          </Typography>
        </Card>
      </LoginContainer>
    </>
  );
};

export default LoginPage;
