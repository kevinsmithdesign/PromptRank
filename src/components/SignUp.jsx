import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Box,
  TextField,
  Typography,
  Stack,
  Alert,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
// import { LoadingButton } from "../components/LoadingButton";
import {
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
} from "@mui/icons-material";

export function SignUp() {
  const navigate = useNavigate();
  const { signup, signInWithGoogle, loading, error: authError } = useAuth();

  // Form states
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    userName: "",
  });
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormError("");
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setFormError("Please fill in all required fields");
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setFormError("Please enter a valid email address");
      return false;
    }

    if (formData.password.length < 6) {
      setFormError("Password must be at least 6 characters long");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!validateForm()) return;

    try {
      await signup({
        email: formData.email,
        password: formData.password,
        displayName: formData.userName || formData.email.split("@")[0],
      });
    } catch (error) {
      setFormError(error.message);
      console.error("Signup error:", error);
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

  return (
    <Box
      component="form"
      onSubmit={handleSignUp}
      sx={{ maxWidth: "400px", width: "100%" }}
    >
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Sign Up
      </Typography>

      {/* Error Alerts */}
      {(formError || authError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {formError || authError}
        </Alert>
      )}

      {/* Google Sign-up Button */}
      <Stack mb={3}>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleGoogleSignIn}
          fullWidth
          loading={loading}
          startIcon={<GoogleIcon />}
        >
          Sign Up with Google
        </Button>
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

      {/* Sign-up Form */}
      <Stack>
        <Stack mb={3}>
          <Typography fontWeight="bold" mb={0.5}>
            Username
          </Typography>
          <TextField
            name="userName"
            variant="outlined"
            placeholder="Enter your username"
            fullWidth
            value={formData.userName}
            onChange={handleInputChange}
            disabled={loading}
          />
        </Stack>
        <Stack mb={3}>
          <Typography fontWeight="bold" mb={0.5}>
            Email*
          </Typography>
          <TextField
            name="email"
            variant="outlined"
            placeholder="Enter your email"
            fullWidth
            required
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            error={!!formError && formError.includes("email")}
            disabled={loading}
          />
        </Stack>
        <Stack mb={3}>
          <Typography fontWeight="bold" mb={0.5}>
            Password*
          </Typography>
          <TextField
            name="password"
            type={showPassword ? "text" : "password"}
            variant="outlined"
            placeholder="Enter your password"
            fullWidth
            required
            value={formData.password}
            onChange={handleInputChange}
            error={!!formError && formError.includes("password")}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Stack mb={4}>
          <Typography fontWeight="bold" mb={0.5}>
            Confirm Password*
          </Typography>
          <TextField
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            variant="outlined"
            placeholder="Confirm your password"
            fullWidth
            required
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={!!formError && formError.includes("match")}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          loading={loading}
        >
          Sign Up
        </Button>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mt: 2,
          }}
        >
          <Typography variant="body2" textAlign="center" sx={{ mr: 0.5 }}>
            Already have an account?
          </Typography>
          <Box
            variant="text"
            onClick={() => navigate("/login")}
            sx={{
              color: "#1976d2",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: "14px",
            }}
            disabled={loading}
          >
            Log In
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
