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
  FormControlLabel,
  Checkbox,
  Link,
  Tooltip,
  Dialog,
  DialogContent,
  FormHelperText,
  useTheme,
} from "@mui/material";
import { Google as GoogleIcon } from "@mui/icons-material";
import EyeIcon from "../icons/EyeIcon";
import HidePasswordIcon from "../icons/HidePasswordIcon";
import TermsAndConditions from "./TermsAndConditions";

export function SignUp() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { signup, signInWithGoogle, loading, error: authError } = useAuth();

  // Form states
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  // Validation states
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
    firstName: false,
    lastName: false,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  // Validation rules
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "email":
        if (!value) {
          error = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 6) {
          error = "Password must be at least 6 characters long";
        }
        break;
      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;
      case "firstName":
        if (!value) {
          error = "First name is required";
        }
        break;
      case "lastName":
        if (!value) {
          error = "Last name is required";
        }
        break;
      default:
        break;
    }
    return error;
  };

  // Handle blur events
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }

    setFormError("");
  };

  const validateForm = () => {
    // Mark all fields as touched first
    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
      firstName: true,
      lastName: true,
    });

    const newErrors = {};
    let isValid = true;

    // Required fields check
    if (!formData.email) {
      newErrors.email = "Email is required";
      isValid = false;
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
      isValid = false;
    }
    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }
    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    // If we have required fields, do additional validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    if (
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // Check terms acceptance
    if (!termsAccepted) {
      setFormError("You must accept the Terms and Conditions to continue");
      isValid = false;
    }

    setErrors(newErrors);

    // If we have any errors, set a general form error
    if (!isValid) {
      setFormError("Please fill in all required fields correctly");
    }

    return isValid;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setFormError("");
    setErrors({}); // Clear previous errors

    // Run validation
    if (!validateForm()) {
      // Scroll to the top where the error message is displayed
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    try {
      await signup({
        email: formData.email,
        password: formData.password,
        displayName: `${formData.firstName} ${formData.lastName}`,
      });
    } catch (error) {
      setFormError(error.message);
      console.error("Signup error:", error);
      // Scroll to the error message
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleGoogleSignIn = async () => {
    setFormError("");
    if (!termsAccepted) {
      setFormError("You must accept the Terms and Conditions to continue");
      return;
    }
    try {
      await signInWithGoogle();
    } catch (error) {
      setFormError(error.message);
      console.error("Google sign-in error:", error);
    }
  };

  const handleTermsClick = (e) => {
    e.preventDefault();
    setTermsModalOpen(true);
  };

  const handleCloseTermsModal = () => {
    setTermsModalOpen(false);
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
        <Tooltip
          title={
            !termsAccepted
              ? "Please accept the Terms and Conditions to continue"
              : ""
          }
          arrow
        >
          <span>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleGoogleSignIn}
              fullWidth
              disabled={loading || !termsAccepted}
              startIcon={<GoogleIcon />}
            >
              Sign Up with Google
            </Button>
          </span>
        </Tooltip>
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
            First Name*
          </Typography>
          <TextField
            name="firstName"
            variant="outlined"
            placeholder="Enter your first name"
            fullWidth
            required
            value={formData.firstName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={touched.firstName && !!errors.firstName}
            helperText={touched.firstName && errors.firstName}
            disabled={loading}
          />
        </Stack>
        <Stack mb={3}>
          <Typography fontWeight="bold" mb={0.5}>
            Last Name*
          </Typography>
          <TextField
            name="lastName"
            variant="outlined"
            placeholder="Enter your last name"
            fullWidth
            required
            value={formData.lastName}
            onChange={handleInputChange}
            onBlur={handleBlur}
            error={touched.lastName && !!errors.lastName}
            helperText={touched.lastName && errors.lastName}
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
            onBlur={handleBlur}
            error={touched.email && !!errors.email}
            helperText={touched.email && errors.email}
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
            onBlur={handleBlur}
            error={touched.password && !!errors.password}
            helperText={touched.password && errors.password}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    disabled={loading}
                  >
                    {showPassword ? <EyeIcon /> : <HidePasswordIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {!errors.password && (
            <FormHelperText>
              Password must be at least 6 characters long
            </FormHelperText>
          )}
        </Stack>
        <Stack mb={3}>
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
            onBlur={handleBlur}
            error={touched.confirmPassword && !!errors.confirmPassword}
            helperText={touched.confirmPassword && errors.confirmPassword}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    disabled={loading}
                  >
                    {showConfirmPassword ? <EyeIcon /> : <HidePasswordIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        {/* Terms and Conditions Checkbox */}
        <Stack mb={1}>
          <FormControlLabel
            control={
              <Checkbox
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                color="primary"
                disabled={loading}
              />
            }
            label={
              <Typography variant="body2">
                I agree to the{" "}
                <Link
                  href="#"
                  onClick={handleTermsClick}
                  sx={{ textDecoration: "underline" }}
                >
                  Terms and Conditions
                </Link>
              </Typography>
            }
          />
        </Stack>

        <Tooltip
          title={
            !termsAccepted
              ? "Please accept the Terms and Conditions to continue"
              : ""
          }
          arrow
        >
          <span>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              disabled={loading || !termsAccepted}
            >
              Sign Up
            </Button>
          </span>
        </Tooltip>
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
              color: theme.palette.primary.main,
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

      {/* Terms and Conditions Dialog */}
      <TermsAndConditions
        termsModalOpen={termsModalOpen}
        handleCloseTermsModal={handleCloseTermsModal}
      />
    </Box>
  );
}
