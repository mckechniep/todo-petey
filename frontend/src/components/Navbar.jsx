import React from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api"; // Import API instance
import { useAuth } from "../services/AuthContext";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const Navbar = () => {
  const { setUser } = useAuth(); // Access the setUser function from context
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await api.post("/users/signout"); // Call the backend signout endpoint
      localStorage.removeItem("token"); // Clear the token from localStorage
      setUser(null); // Clear the user context
      navigate("/signin"); // Redirect to the sign-in page
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Failed to sign out. Please try again.");
    }
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          ABC Planner
        </Typography>
        <Button color="inherit" component={Link} to="/todos">
          Dashboard
        </Button>
        <Button color="inherit" onClick={handleSignOut}>
          Sign Out
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
