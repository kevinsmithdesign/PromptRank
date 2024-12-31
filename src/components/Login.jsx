// src/components/Login.js
import React, { useState } from "react";
import { auth, googleProvider } from "../../config/firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/main");
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
      console.error(err);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      await signInWithPopup(auth, googleProvider);
      navigate("/main/prompts");
    } catch (err) {
      setError("Failed to sign in with Google.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <Box component="form" onSubmit={handleLogin}>
      <Typography variant="h5" gutterBottom>
        Log In
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Stack spacing={3}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          disabled={loading}
        >
          Log In
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleGoogleSignIn}
          fullWidth
          disabled={loading}
        >
          Sign In with Google
        </Button>
        <Typography variant="body2" textAlign="center">
          Don't have an account?
          <Button
            variant="text"
            onClick={() => navigate("/signup")}
            sx={{ ml: 1 }}
          >
            Sign Up
          </Button>
        </Typography>
      </Stack>
    </Box>
  );
};
