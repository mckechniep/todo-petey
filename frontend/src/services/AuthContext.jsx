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
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser._id) { // Ensure _id exists
                    setUser(parsedUser);
                } else {
                    console.warn("User object from localStorage is missing _id");
                    localStorage.removeItem('user'); // Clear invalid data
                }
            } catch (error) {
                console.error("Error parsing user from localStorage:", error);
                localStorage.removeItem('user'); // Clear invalid data
            }
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user'); // Remove user from localStorage if null
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