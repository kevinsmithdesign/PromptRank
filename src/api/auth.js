// src/api/auth.js
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";

export const authApi = {
  // Sign in with email and password
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      throw new Error(getAuthErrorMessage(error.code));
    }
  },

  // Create new user
  signup: async ({ email, password, displayName }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update profile with display name
      if (displayName) {
        await updateProfile(user, { displayName });
      }

      // Create user document in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        displayName: displayName || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return user;
    } catch (error) {
      throw new Error(getAuthErrorMessage(error.code));
    }
  },

  // Sign out
  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error("Failed to sign out");
    }
  },

  // Update user profile
  updateUserProfile: async (updates) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");

      // Update Firebase Auth profile
      await updateProfile(user, updates);

      // Update Firestore user document
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        ...updates,
        updatedAt: new Date().toISOString(),
      });

      return user;
    } catch (error) {
      throw new Error("Failed to update profile");
    }
  },

  // Update email
  updateEmail: async (newEmail) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");

      await updateEmail(user, newEmail);

      // Update Firestore user document
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        email: newEmail,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      throw new Error(getAuthErrorMessage(error.code));
    }
  },

  // Update password
  updatePassword: async (newPassword) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("No user logged in");

      await updatePassword(user, newPassword);
    } catch (error) {
      throw new Error(getAuthErrorMessage(error.code));
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw new Error(getAuthErrorMessage(error.code));
    }
  },

  // Get user profile data
  getUserProfile: async (userId) => {
    try {
      const userDoc = await getDoc(doc(db, "users", userId));
      if (!userDoc.exists()) {
        throw new Error("User not found");
      }
      return userDoc.data();
    } catch (error) {
      throw new Error("Failed to fetch user profile");
    }
  },
};

// Helper function to convert Firebase auth error codes to user-friendly messages
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
    case "auth/requires-recent-login":
      return "Please log in again to complete this action";
    default:
      return "An error occurred. Please try again";
  }
}

// src/hooks/useAuth.js
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { authApi } from "../api/auth";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Get user profile data
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["userProfile", user?.uid],
    queryFn: () => authApi.getUserProfile(user?.uid),
    enabled: !!user?.uid,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: () => {
      navigate("/main/prompts");
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: () => {
      navigate("/main/prompts");
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: authApi.updateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfile", user?.uid]);
    },
  });

  // Update email mutation
  const updateEmailMutation = useMutation({
    mutationFn: authApi.updateEmail,
    onSuccess: () => {
      queryClient.invalidateQueries(["userProfile", user?.uid]);
    },
  });

  // Update password mutation
  const updatePasswordMutation = useMutation({
    mutationFn: authApi.updatePassword,
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: authApi.resetPassword,
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.clear(); // Clear all queries on logout
      navigate("/login");
    },
  });

  const authState = useMemo(
    () => ({
      user,
      profile,
      isLoading: loading || profileLoading,
      isAuthenticated: !!user,
      login: loginMutation.mutate,
      signup: signupMutation.mutate,
      logout: logoutMutation.mutate,
      updateProfile: updateProfileMutation.mutate,
      updateEmail: updateEmailMutation.mutate,
      updatePassword: updatePasswordMutation.mutate,
      resetPassword: resetPasswordMutation.mutate,
      loginError: loginMutation.error?.message,
      signupError: signupMutation.error?.message,
      updateProfileError: updateProfileMutation.error?.message,
      updateEmailError: updateEmailMutation.error?.message,
      updatePasswordError: updatePasswordMutation.error?.message,
      resetPasswordError: resetPasswordMutation.error?.message,
      logoutError: logoutMutation.error?.message,
    }),
    [
      user,
      profile,
      loading,
      profileLoading,
      loginMutation,
      signupMutation,
      updateProfileMutation,
      updateEmailMutation,
      updatePasswordMutation,
      resetPasswordMutation,
      logoutMutation,
    ]
  );

  return authState;
}
