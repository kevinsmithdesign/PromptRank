// src/hooks/useAuth.js
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../../config/firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async ({ email, password }) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      navigate("/main/prompts");
      return result.user;
    } catch (error) {
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      navigate("/main/prompts");
      return result.user;
    } catch (error) {
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const signup = async ({ email, password, displayName }) => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      navigate("/main/prompts");
      return result.user;
    } catch (error) {
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      throw new Error("Failed to logout");
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(getAuthErrorMessage(error.code));
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    signInWithGoogle,
    signup,
    logout,
    resetPassword,
  };
}

// Helper function for error messages
function getAuthErrorMessage(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return "This email is already registered";
    case "auth/invalid-email":
      return "Invalid email address";
    case "auth/operation-not-allowed":
      return "Operation not allowed";
    case "auth/weak-password":
      return "Password is too weak";
    case "auth/user-disabled":
      return "This account has been disabled";
    case "auth/user-not-found":
      return "No account found with this email";
    case "auth/wrong-password":
      return "Incorrect password";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again later";
    default:
      return "An error occurred. Please try again";
  }
}
