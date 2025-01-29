import React, { useState } from "react";
import { auth, googleProvider } from "../../config/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError("");
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/main/prompts");
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

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setError("Please enter your email address");
      return;
    }

    try {
      setError("");
      setLoading(true);
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSuccess(true);
    } catch (err) {
      setError(
        "Failed to send password reset email. Please check your email address."
      );
      console.error(err);
    }
    setLoading(false);
  };

  const handleCloseResetDialog = () => {
    setResetDialogOpen(false);
    setResetEmail("");
    setResetSuccess(false);
    setError("");
  };

  return (
    <Box component="form" onSubmit={handleLogin}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Log In
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
          Log In with Google
        </Button>
      </Stack>
      <Stack display="flex" flexDirection="row" alignItems="center" mb={3}>
        <Stack
          flexGrow={1}
          sx={{ width: "100%", background: "#fff", height: "1px", mr: 2 }}
        ></Stack>
        <Stack>OR</Stack>
        <Stack
          flexGrow={1}
          sx={{ width: "100%", background: "#fff", height: "1px", ml: 2 }}
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
        <Stack mb={2}>
          <Typography fontWeight="bold" mb={1}>
            Password*
          </Typography>
          <TextField
            placeholder="Password*"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Button
          variant="text"
          onClick={() => setResetDialogOpen(true)}
          sx={{ mb: 4, alignSelf: "flex-start" }}
        >
          Forgot Password?
        </Button>

        <Stack spacing={2}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={loading}
          >
            Log In
          </Button>
        </Stack>
        <Typography variant="body2" textAlign="center" mt={2}>
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

      {/* Password Reset Dialog */}
      <Dialog open={resetDialogOpen} onClose={handleCloseResetDialog}>
        <DialogTitle>
          {resetSuccess ? "Password Reset Email Sent" : "Reset Password"}
        </DialogTitle>
        <DialogContent>
          {resetSuccess ? (
            <Typography>
              Please check your email for instructions to reset your password.
            </Typography>
          ) : (
            <>
              <Typography mb={2}>
                Enter your email address and we'll send you instructions to
                reset your password.
              </Typography>
              <TextField
                autoFocus
                margin="dense"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          {resetSuccess ? (
            <Button onClick={handleCloseResetDialog}>Close</Button>
          ) : (
            <>
              <Button onClick={handleCloseResetDialog}>Cancel</Button>
              <Button onClick={handleResetPassword} disabled={loading}>
                Send Reset Link
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};
