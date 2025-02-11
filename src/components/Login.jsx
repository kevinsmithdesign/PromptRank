import { Button } from "@mui/material";

export function LoadingButton({ loading, children, ...props }) {
  return (
    <Button disabled={loading} {...props}>
      {loading ? (
        // <CircularProgress size={24} color="inherit" sx={{ mx: 1 }} />
        <>Loading...</>
      ) : (
        children
      )}
    </Button>
  );
}

// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Box,
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
  CircularProgress,
} from "@mui/material";

import { Google as GoogleIcon } from "@mui/icons-material";
import EyeIcon from "../icons/EyeIcon";
import HidePasswordIcon from "../icons/HidePasswordIcon";

export function Login() {
  const navigate = useNavigate();
  const {
    login,
    signInWithGoogle,
    resetPassword,
    loading,
    error: authError,
  } = useAuth();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState("");

  // Reset password dialog states
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const validateForm = () => {
    if (!email || !password) {
      setFormError("Please fill in all required fields");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setFormError("Please enter a valid email address");
      return false;
    }
    if (password.length < 6) {
      setFormError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!validateForm()) return;

    try {
      await login({ email, password });
    } catch (error) {
      setFormError(error.message);
      console.error("Login error:", error);
    }
  };

  const handleGoogleSignIn = async () => {
    setFormError("");
    try {
      await signInWithGoogle();
    } catch (error) {
      setFormError(error.message);
      console.error("Google sign-in error:", error);
    }
  };

  const handleResetPassword = async () => {
    if (!resetEmail) {
      setResetError("Please enter your email address");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      setResetError("Please enter a valid email address");
      return;
    }

    try {
      setResetError("");
      setResetLoading(true);
      await resetPassword(resetEmail);
      setResetSuccess(true);
    } catch (error) {
      setResetError(error.message);
      console.error("Password reset error:", error);
    } finally {
      setResetLoading(false);
    }
  };

  const handleCloseResetDialog = () => {
    setResetDialogOpen(false);
    setResetEmail("");
    setResetSuccess(false);
    setResetError("");
  };

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{ maxWidth: "400px", width: "100%" }}
    >
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Log In
      </Typography>

      {/* Error Alerts */}
      {(formError || authError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError || authError}
        </Alert>
      )}

      {/* Google Sign-in Button */}
      <Stack mb={3}>
        <LoadingButton
          variant="outlined"
          color="secondary"
          onClick={handleGoogleSignIn}
          fullWidth
          loading={loading}
          startIcon={<GoogleIcon />}
        >
          Log In with Google
        </LoadingButton>
      </Stack>

      {/* Divider */}
      <Stack display="flex" flexDirection="row" alignItems="center" mb={3}>
        <Stack
          flexGrow={1}
          sx={{
            width: "100%",
            background: "rgba(255, 255, 255, 0.12)",
            height: "1px",
            mr: 2,
          }}
        />
        <Typography>OR</Typography>
        <Stack
          flexGrow={1}
          sx={{
            width: "100%",
            background: "rgba(255, 255, 255, 0.12)",
            height: "1px",
            ml: 2,
          }}
        />
      </Stack>

      {/* Email/Password Form */}
      <Stack>
        <Stack mb={3}>
          <Typography fontWeight="bold" mb={0.5}>
            Email*
          </Typography>
          <TextField
            variant="outlined"
            placeholder="Enter your email"
            fullWidth
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setFormError("");
            }}
            type="email"
            error={!!formError && formError.includes("email")}
            disabled={loading}
          />
        </Stack>

        <Stack mb={4}>
          <Typography fontWeight="bold" mb={0.5}>
            Password*
          </Typography>
          <TextField
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            fullWidth
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setFormError("");
            }}
            error={!!formError && formError.includes("password")}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleTogglePassword}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword ? <EyeIcon /> : <HidePasswordIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Box
            variant="link"
            onClick={() => setResetDialogOpen(true)}
            sx={{
              color: "#1976d2",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: "14px",
              mt: 1,
            }}
            disabled={loading}
          >
            Forgot Password?
          </Box>
        </Stack>

        <LoadingButton
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          loading={loading}
        >
          Log In
        </LoadingButton>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Typography variant="body2" sx={{ mr: 0.5 }}>
            Don't have an account?
          </Typography>
          <Box
            variant="text"
            onClick={() => navigate("/signup")}
            sx={{
              color: "#1976d2",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: "14px",
            }}
            disabled={loading}
          >
            Sign Up
          </Box>
        </Box>
      </Stack>

      {/* Password Reset Dialog */}
      <Dialog
        open={resetDialogOpen}
        onClose={handleCloseResetDialog}
        maxWidth="sm"
        fullWidth
      >
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
              {resetError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {resetError}
                </Alert>
              )}
              <TextField
                autoFocus
                margin="dense"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                value={resetEmail}
                onChange={(e) => {
                  setResetEmail(e.target.value);
                  setResetError("");
                }}
                error={!!resetError}
                disabled={resetLoading}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          {resetSuccess ? (
            <LoadingButton onClick={handleCloseResetDialog}>
              Close
            </LoadingButton>
          ) : (
            <>
              <LoadingButton
                onClick={handleCloseResetDialog}
                disabled={resetLoading}
              >
                Cancel
              </LoadingButton>
              <LoadingButton
                onClick={handleResetPassword}
                loading={resetLoading}
                variant="contained"
              >
                Send Reset Link
              </LoadingButton>
            </>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
