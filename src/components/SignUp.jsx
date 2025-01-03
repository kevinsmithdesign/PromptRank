// src/components/SignUp.js
import React, { useState } from "react";
import { auth, googleProvider } from "../../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/main");
    } catch (err) {
      setError("Failed to create an account.");
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
    <Box component="form" onSubmit={handleSignUp}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Sign Up
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Stack mb={3}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleGoogleSignIn}
          fullWidth
          disabled={loading}
        >
          Sign Up with Google
        </Button>
      </Stack>
      <Stack display="flex" flexDirection="row" alignItems="center" mb={3}>
        <Stack
          flexGrow={1}
          sx={{ width: "100&", background: "#fff", height: "1px", mr: 2 }}
        ></Stack>
        <Stack>OR</Stack>
        <Stack
          flexGrow={1}
          sx={{ width: "100&", background: "#fff", height: "1px", ml: 2 }}
        ></Stack>
      </Stack>
      <Stack>
        <Stack mb={3}>
          <Typography fontWeight="bold" mb={1}>
            Email*
          </Typography>
          <TextField
            variant="outlined"
            placeholder="Email*"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Stack>
        <Stack mb={3}>
          <Typography fontWeight="bold" mb={1}>
            Password*
          </Typography>
          <TextField
            type="password"
            variant="outlined"
            placeholder="Password*"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Stack>
        <Stack mb={6}>
          <Typography fontWeight="bold" mb={1}>
            Confirm Password*
          </Typography>
          <TextField
            placeholder="Confirm Password*"
            type="password"
            variant="outlined"
            fullWidth
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Stack>

        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          disabled={loading}
        >
          Sign Up
        </Button>

        <Typography variant="body2" textAlign="center">
          Already have an account?
          <Button
            variant="text"
            onClick={() => navigate("/login")}
            sx={{ ml: 1 }}
          >
            Log In
          </Button>
        </Typography>
      </Stack>
    </Box>
  );
};
