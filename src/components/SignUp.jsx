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
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";

// export const SignUp = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [userName, setUserName] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const saveUserToFirestore = async (user, additionalData = {}) => {
//     try {
//       const userRef = doc(db, "users", user.uid);
//       await setDoc(userRef, {
//         email: user.email,
//         // Use userName directly if provided, otherwise use Google displayName or email prefix
//         displayName:
//           additionalData.userName ||
//           user.displayName ||
//           user.email?.split("@")[0],
//         photoURL: user.photoURL || null,
//         createdAt: new Date().toISOString(),
//         // Save userName as a separate field as well
//         userName:
//           additionalData.userName ||
//           user.displayName ||
//           user.email?.split("@")[0],
//       });
//     } catch (err) {
//       console.error("Error saving user data:", err);
//       // Don't throw error here to prevent blocking auth flow
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

//       // Save user data to Firestore
//       await saveUserToFirestore(userCredential.user, { userName });

//       navigate("/main");
//     } catch (err) {
//       setError("Failed to create an account.");
//       console.error(err);
//     }
//     setLoading(false);
//   };

//   const handleGoogleSignIn = async () => {
//     try {
//       setError("");
//       setLoading(true);
//       const result = await signInWithPopup(auth, googleProvider);

//       // For Google sign-in, use the full Google display name
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
//             Username*
//           </Typography>
//           <TextField
//             variant="outlined"
//             placeholder="Username*"
//             fullWidth
//             // required
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
//             type="password"
//             variant="outlined"
//             placeholder="Password*"
//             fullWidth
//             required
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//         </Stack>
//         <Stack mb={6}>
//           <Typography fontWeight="bold" mb={1}>
//             Confirm Password*
//           </Typography>
//           <TextField
//             placeholder="Confirm Password*"
//             type="password"
//             variant="outlined"
//             fullWidth
//             required
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
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

import React, { useState } from "react";
import { auth, googleProvider, db } from "../../config/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const saveUserToFirestore = async (user, additionalData = {}) => {
    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, {
        email: user.email,
        displayName:
          additionalData.userName ||
          user.displayName ||
          user.email?.split("@")[0],
        photoURL: user.photoURL || null,
        createdAt: new Date().toISOString(),
        userName:
          additionalData.userName ||
          user.displayName ||
          user.email?.split("@")[0],
      });
    } catch (err) {
      console.error("Error saving user data:", err);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setError("");
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await saveUserToFirestore(userCredential.user, { userName });
      navigate("/main/prompts");
    } catch (err) {
      const errorMessage = err.message
        .replace("Firebase: Error (auth/", "")
        .replace(").", "")
        .replace(/-/g, " ");
      setError(errorMessage);
      console.error(err);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);

      await saveUserToFirestore(result.user, {
        userName: result.user.displayName || result.user.email?.split("@")[0],
      });

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
            Username
          </Typography>
          <TextField
            variant="outlined"
            placeholder="Username"
            fullWidth
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </Stack>
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
            type={showPassword ? "text" : "password"}
            variant="outlined"
            placeholder="Password*"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Stack mb={6}>
          <Typography fontWeight="bold" mb={1}>
            Confirm Password*
          </Typography>
          <TextField
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password*"
            variant="outlined"
            fullWidth
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
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
