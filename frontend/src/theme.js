// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2', // Customize primary color
        },
        secondary: {
            main: '#ff4081',
        },
    },
    typography: {
        fontFamily: 'Roboto, Arial, sans-serif', // Set Roboto as the default font
        h4: {
            fontSize: '1.5rem',
            fontWeight: 600,
        },
        body1: {
            fontSize: '1rem',
        },
    },
});

export default theme;
