// import React, { useState, useEffect } from "react";
// import { auth, googleProvider } from "../../config/firebase";
// import {
//   createUserWithEmailAndPassword,
//   signInWithPopup,
//   signOut,
//   onAuthStateChanged,
// } from "firebase/auth";

// export const Auth = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       // Only log when auth state changes
//       console.log("Current user email:", currentUser?.email);
//     });

//     // Cleanup subscription
//     return () => unsubscribe();
//   }, []);

//   const signIn = async () => {
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const signInWithGoogle = async () => {
//     try {
//       await signInWithPopup(auth, googleProvider);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const logout = async () => {
//     try {
//       await signOut(auth);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div>
//       <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
//       <input
//         placeholder="Password"
//         type="password"
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button onClick={signIn}>Sign In</button>
//       <button onClick={signInWithGoogle}>Sign In with Google</button>
//       <button onClick={logout}>Logout</button>
//       {user && <p>Currently logged in as: {user.email}</p>}
//     </div>
//   );
// };

import React, { useState, useEffect } from "react";
import { auth, googleProvider } from "../../config/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { Box, Button, TextField, Typography, Stack } from "@mui/material";

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      console.log("Current user email:", currentUser?.email);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error(err);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Log In
      </Typography>
      <Stack spacing={2}>
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={signIn} fullWidth>
          Sign In
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={signInWithGoogle}
          fullWidth
        >
          Sign In with Google
        </Button>
        {/* <Button variant="text" color="error" onClick={logout} fullWidth>
          Logout
        </Button> */}
        {user && (
          <Typography variant="body1" textAlign="center" color="textSecondary">
            Currently logged in as: {user.email}
          </Typography>
        )}
      </Stack>
    </Box>
  );
};
