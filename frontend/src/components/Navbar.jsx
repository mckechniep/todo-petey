import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/AuthContext";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { signOut } from "../services/authService";

const Navbar = () => {
  const { user, setUser, loading } = useAuth(); // Include loading state
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      setUser(null);
      navigate("/signin");
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Failed to sign out. Please try again.");
    }
  };

  if (loading) {
    return null; // Avoid rendering the navbar while loading
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          ABC Planner
        </Typography>
        {user ? (
          <>
            <Button color="inherit" component={Link} to="/todos">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/journal">
              Journals
            </Button>
            <Button color="inherit" onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
        ) : (
          <Button color="inherit" component={Link} to="/signin">
            Sign In
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
