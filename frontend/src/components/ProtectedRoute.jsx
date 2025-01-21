import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth(); // Access user and loading from AuthContext

  if (loading) {
    return (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <CircularProgress />
        </Box>
      );      
}

  if (!user) {
    // If the user is not authenticated, redirect to the login page
    return <Navigate to="/signin" replace />;
  }

  // If authenticated, render the children (protected component)
  return children;
};

export default ProtectedRoute;
