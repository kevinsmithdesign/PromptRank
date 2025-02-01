// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../hooks/useAuth";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Stack,
//   Alert,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   InputAdornment,
//   IconButton,
// } from "@mui/material";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";

// export function Login() {
//   const navigate = useNavigate();
//   const {
//     login,
//     signInWithGoogle,
//     resetPassword,
//     loginError,
//     googleSignInError,
//     isLoading,
//   } = useAuth();

//   // Form states
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   // Reset password dialog states
//   const [resetDialogOpen, setResetDialogOpen] = useState(false);
//   const [resetEmail, setResetEmail] = useState("");
//   const [resetSuccess, setResetSuccess] = useState(false);
//   const [resetError, setResetError] = useState("");

//   const handleTogglePassword = () => {
//     setShowPassword((prev) => !prev);
//   };

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       await login({ email, password });
//     } catch (error) {
//       // Error will be handled by useAuth hook
//       console.error("Login error:", error);
//     }
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       await signInWithGoogle();
//     } catch (error) {
//       // Error will be handled by useAuth hook
//       console.error("Google sign-in error:", error);
//     }
//   };

//   const handleResetPassword = async () => {
//     if (!resetEmail) {
//       setResetError("Please enter your email address");
//       return;
//     }

//     try {
//       setResetError("");
//       await resetPassword(resetEmail);
//       setResetSuccess(true);
//     } catch (error) {
//       setResetError(error.message);
//       console.error("Password reset error:", error);
//     }
//   };

//   const handleCloseResetDialog = () => {
//     setResetDialogOpen(false);
//     setResetEmail("");
//     setResetSuccess(false);
//     setResetError("");
//   };

//   return (
//     <Box component="form" onSubmit={handleLogin}>
//       <Typography variant="h4" fontWeight="bold" mb={4}>
//         Log In
//       </Typography>

//       {/* Error Alerts */}
//       {(loginError || googleSignInError) && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {loginError || googleSignInError}
//         </Alert>
//       )}

//       {/* Google Sign-in Button */}
//       <Stack mb={3}>
//         <Button
//           variant="outlined"
//           color="secondary"
//           onClick={handleGoogleSignIn}
//           fullWidth
//           disabled={isLoading}
//         >
//           Log In with Google
//         </Button>
//       </Stack>

//       {/* Divider */}
//       <Stack display="flex" flexDirection="row" alignItems="center" mb={3}>
//         <Stack
//           flexGrow={1}
//           sx={{ width: "100%", background: "#fff", height: "1px", mr: 2 }}
//         />
//         <Stack>OR</Stack>
//         <Stack
//           flexGrow={1}
//           sx={{ width: "100%", background: "#fff", height: "1px", ml: 2 }}
//         />
//       </Stack>

//       {/* Email/Password Form */}
//       <Stack>
//         <Stack mb={3}>
//           <Typography fontWeight="bold" mb={1}>
//             Email*
//           </Typography>
//           <TextField
//             variant="outlined"
//             placeholder="Email*"
//             fullWidth
//             required
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             type="email"
//           />
//         </Stack>

//         <Stack mb={2}>
//           <Typography fontWeight="bold" mb={1}>
//             Password*
//           </Typography>
//           <TextField
//             placeholder="Password*"
//             type={showPassword ? "text" : "password"}
//             variant="outlined"
//             fullWidth
//             required
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     aria-label="toggle password visibility"
//                     onClick={handleTogglePassword}
//                     edge="end"
//                   >
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
//         </Stack>

//         <Button
//           variant="text"
//           onClick={() => setResetDialogOpen(true)}
//           sx={{ mb: 4, alignSelf: "flex-start" }}
//         >
//           Forgot Password?
//         </Button>

//         <Stack spacing={2}>
//           <Button
//             variant="contained"
//             color="primary"
//             type="submit"
//             fullWidth
//             disabled={isLoading}
//           >
//             Log In
//           </Button>
//         </Stack>

//         <Typography variant="body2" textAlign="center" mt={2}>
//           Don't have an account?
//           <Button
//             variant="text"
//             onClick={() => navigate("/signup")}
//             sx={{ ml: 1 }}
//           >
//             Sign Up
//           </Button>
//         </Typography>
//       </Stack>

//       {/* Password Reset Dialog */}
//       <Dialog open={resetDialogOpen} onClose={handleCloseResetDialog}>
//         <DialogTitle>
//           {resetSuccess ? "Password Reset Email Sent" : "Reset Password"}
//         </DialogTitle>
//         <DialogContent>
//           {resetSuccess ? (
//             <Typography>
//               Please check your email for instructions to reset your password.
//             </Typography>
//           ) : (
//             <>
//               <Typography mb={2}>
//                 Enter your email address and we'll send you instructions to
//                 reset your password.
//               </Typography>
//               {resetError && (
//                 <Alert severity="error" sx={{ mb: 2 }}>
//                   {resetError}
//                 </Alert>
//               )}
//               <TextField
//                 autoFocus
//                 margin="dense"
//                 label="Email Address"
//                 type="email"
//                 fullWidth
//                 variant="outlined"
//                 value={resetEmail}
//                 onChange={(e) => setResetEmail(e.target.value)}
//               />
//             </>
//           )}
//         </DialogContent>
//         <DialogActions>
//           {resetSuccess ? (
//             <Button onClick={handleCloseResetDialog}>Close</Button>
//           ) : (
//             <>
//               <Button onClick={handleCloseResetDialog}>Cancel</Button>
//               <Button onClick={handleResetPassword} disabled={isLoading}>
//                 Send Reset Link
//               </Button>
//             </>
//           )}
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// }

// src/components/LoadingButton.jsx
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

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Google as GoogleIcon } from "@mui/icons-material";

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
      sx={{ maxWidth: "400px", mx: "auto" }}
    >
      <Typography variant="h4" fontWeight="bold" mb={4}>
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
        <Typography color="text.secondary">OR</Typography>
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
      <Stack spacing={3}>
        <Stack>
          <Typography fontWeight="bold" mb={1}>
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

        <Stack>
          <Typography fontWeight="bold" mb={1}>
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
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <LoadingButton
          variant="text"
          onClick={() => setResetDialogOpen(true)}
          sx={{ alignSelf: "flex-start" }}
          disabled={loading}
        >
          Forgot Password?
        </LoadingButton>

        <LoadingButton
          variant="contained"
          color="primary"
          type="submit"
          fullWidth
          loading={loading}
        >
          Log In
        </LoadingButton>

        <Typography variant="body2" textAlign="center">
          Don't have an account?
          <LoadingButton
            variant="text"
            onClick={() => navigate("/signup")}
            sx={{ ml: 1 }}
            disabled={loading}
          >
            Sign Up
          </LoadingButton>
        </Typography>
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
