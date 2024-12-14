// createContext - creats a context object to provide and consume valeus across components
// useContext - a hook to access values provided by a context
import React, { createContext, useContext, useState, useEffect } from 'react';

// create a new context object called AuthContext
// AuthContext will hold and share the authentication state (user and setUser) across your app.
const AuthContext = createContext(null);

// AuthProvider is a functional component that wraps the application to provide the authentication state
// props passed to AuthProvider include children -> all the nested components that will be able to access AuthContext (such as <App /> in our main.jsx)
export const AuthProvider = ({ children }) => {
    // user - holds current authenticated users info (id/username)
    // setUser - updates user state (for when user logs in, out, etc.)
    const [user, setUser] = useState(null); // set to null b/c no user logged in at first
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {  // Add a try-catch block
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Error parsing user from localStorage:", error);
                // Handle the error.  Options include:
                localStorage.removeItem('user'); // Remove the invalid data
                // Show an error message to the user (if appropriate)
                // Or simply ignore and continue with user = null
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user'); // Remove user from localStorage if null
            localStorage.removeItem('token'); // Remove token as well for consistency
        }
    }, [user]);


    return (
        // wraps children components and gives access to user state and setUser function
        <AuthContext.Provider value={{ user, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

//Instead of using useContext(AuthContext) in every component, you can just call useAuth()
export const useAuth = () => {
    return useContext(AuthContext);
};