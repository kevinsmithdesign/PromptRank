// import React, { useState } from "react";
// import { auth, googleProvider, db } from "../../config/firebase";
// import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Stack,
//   Alert,
//   IconButton,
//   InputAdornment,
// } from "@mui/material";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
// import { useNavigate } from "react-router-dom";

// export const SignUp = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [userName, setUserName] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const navigate = useNavigate();

//   const saveUserToFirestore = async (user, additionalData = {}) => {
//     try {
//       const userRef = doc(db, "users", user.uid);
//       await setDoc(userRef, {
//         email: user.email,
//         displayName:
//           additionalData.userName ||
//           user.displayName ||
//           user.email?.split("@")[0],
//         photoURL: user.photoURL || null,
//         createdAt: new Date().toISOString(),
//         userName:
//           additionalData.userName ||
//           user.displayName ||
//           user.email?.split("@")[0],
//       });
//     } catch (err) {
//       console.error("Error saving user data:", err);
//     }
//   };

//   const handleSignUp = async (e) => {
//     e.preventDefault();

//     if (password !== confirmPassword) {
//       return setError("Passwords do not match");
//     }

//     try {
//       setError("");
//       setLoading(true);
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );

//       await saveUserToFirestore(userCredential.user, { userName });
//       navigate("/main/prompts");
//     } catch (err) {
//       const errorMessage = err.message
//         .replace("Firebase: Error (auth/", "")
//         .replace(").", "")
//         .replace(/-/g, " ");
//       setError(errorMessage);
//       console.error(err);
//     }
//     setLoading(false);
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       setError("");
//       setLoading(true);
//       const result = await signInWithPopup(auth, googleProvider);

//       await saveUserToFirestore(result.user, {
//         userName: result.user.displayName || result.user.email?.split("@")[0],
//       });

//       navigate("/main/prompts");
//     } catch (err) {
//       setError("Failed to sign in with Google.");
//       console.error(err);
//     }
//     setLoading(false);
//   };

//   return (
//     <Box component="form" onSubmit={handleSignUp}>
//       <Typography variant="h4" fontWeight="bold" mb={4}>
//         Sign Up
//       </Typography>
//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}

//       <Stack mb={3}>
//         <Button
//           variant="outlined"
//           color="secondary"
//           onClick={handleGoogleSignIn}
//           fullWidth
//           disabled={loading}
//         >
//           Sign Up with Google
//         </Button>
//       </Stack>
//       <Stack display="flex" flexDirection="row" alignItems="center" mb={3}>
//         <Stack
//           flexGrow={1}
//           sx={{ width: "100&", background: "#fff", height: "1px", mr: 2 }}
//         ></Stack>
//         <Stack>OR</Stack>
//         <Stack
//           flexGrow={1}
//           sx={{ width: "100&", background: "#fff", height: "1px", ml: 2 }}
//         ></Stack>
//       </Stack>
//       <Stack>
//         <Stack mb={3}>
//           <Typography fontWeight="bold" mb={1}>
//             Username
//           </Typography>
//           <TextField
//             variant="outlined"
//             placeholder="Username"
//             fullWidth
//             value={userName}
//             onChange={(e) => setUserName(e.target.value)}
//           />
//         </Stack>
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
//           />
//         </Stack>
//         <Stack mb={3}>
//           <Typography fontWeight="bold" mb={1}>
//             Password*
//           </Typography>
//           <TextField
//             type={showPassword ? "text" : "password"}
//             variant="outlined"
//             placeholder="Password*"
//             fullWidth
//             required
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     onClick={() => setShowPassword(!showPassword)}
//                     edge="end"
//                   >
//                     {showPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
//         </Stack>
//         <Stack mb={6}>
//           <Typography fontWeight="bold" mb={1}>
//             Confirm Password*
//           </Typography>
//           <TextField
//             type={showConfirmPassword ? "text" : "password"}
//             placeholder="Confirm Password*"
//             variant="outlined"
//             fullWidth
//             required
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//             InputProps={{
//               endAdornment: (
//                 <InputAdornment position="end">
//                   <IconButton
//                     onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                     edge="end"
//                   >
//                     {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
//                   </IconButton>
//                 </InputAdornment>
//               ),
//             }}
//           />
//         </Stack>

//         <Button
//           variant="contained"
//           color="primary"
//           type="submit"
//           fullWidth
//           disabled={loading}
//         >
//           Sign Up
//         </Button>

//         <Typography variant="body2" textAlign="center">
//           Already have an account?
//           <Button
//             variant="text"
//             onClick={() => navigate("/login")}
//             sx={{ ml: 1 }}
//           >
//             Log In
//           </Button>
//         </Typography>
//       </Stack>
//     </Box>
//   );
// };

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
      sx={{ maxWidth: "400px", mx: "auto" }}
    >
      <Typography variant="h4" fontWeight="bold" mb={4}>
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

      {/* Sign-up Form */}
      <Stack spacing={3}>
        <Stack>
          <Typography fontWeight="bold" mb={1}>
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

        <Stack>
          <Typography fontWeight="bold" mb={1}>
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

        <Stack>
          <Typography fontWeight="bold" mb={1}>
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
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Stack>
          <Typography fontWeight="bold" mb={1}>
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
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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

        <Typography variant="body2" textAlign="center">
          Already have an account?
          <Button
            variant="text"
            onClick={() => navigate("/login")}
            sx={{ ml: 1 }}
            disabled={loading}
          >
            Log In
          </Button>
        </Typography>
      </Stack>
    </Box>
  );
}
