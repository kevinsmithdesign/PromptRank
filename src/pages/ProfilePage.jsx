import { useState } from "react";
import Grid from "@mui/material/Grid2";
import {
  Typography,
  Stack,
  Card,
  CardContent,
  Button,
  Alert,
  Box,
  TextField,
  useTheme,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import UserIcon from "../icons/UserIcon";
import PromptCard from "../components/PromptCard";
import { useCollections } from "../hooks/useCollections";
import { useUserPrompts } from "../hooks/useUserPrompts";
import { useUser } from "../hooks/useUser";
import { auth, db } from "../../config/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("collections");
  const navigate = useNavigate();
  const userId = auth.currentUser?.uid;
  const theme = useTheme();

  const { user, isLoading: userLoading, error: userError } = useUser(userId);

  const {
    collections,
    isLoading: collectionsLoading,
    error: collectionsError,
  } = useCollections();

  const {
    data: prompts,
    isLoading: promptsLoading,
    error: promptsError,
  } = useUserPrompts(userId);

  if (!userId) {
    return (
      <Alert severity="warning">Please log in to view your profile.</Alert>
    );
  }

  if (userLoading || collectionsLoading || promptsLoading) {
    return <Typography>Loading...</Typography>;
  }

  if (userError || collectionsError || promptsError) {
    return <Alert severity="error">Error loading profile data</Alert>;
  }

  return (
    <>
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Profile
      </Typography>

      <Card sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box
                sx={{
                  height: "100px",
                  width: "100px",
                  borderRadius: "50%",
                  background: "#999",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                }}
              >
                <UserIcon />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h5" color="#fff" fontWeight="bold">
                  {user?.displayName || "Username"}
                </Typography>
                <Typography variant="h6" color="white">
                  {user?.email || "email@gmail.com"}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid
            size={{ xs: 12, md: 6 }}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <Box>
              <Button
                variant="contained"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? "Cancel Edit" : "Edit Profile"}
              </Button>
            </Box>
          </Grid>
        </Grid>

        {isEditing && (
          <EditProfile user={user} onCancel={() => setIsEditing(false)} />
        )}
      </Card>

      <Box
        sx={{
          background: "#222",
          display: "flex",
          width: "300px",
          p: 2,
          borderRadius: "12px",
          mb: 2,
        }}
      >
        <Box
          sx={{
            background: activeTab === "collections" ? "#1976d2" : "transparent",
            py: 2,
            px: 4,
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={() => setActiveTab("collections")}
        >
          Collections
        </Box>
        <Box
          sx={{
            background: activeTab === "prompts" ? "#1976d2" : "transparent",
            py: 2,
            px: 4,
            borderRadius: "8px",
            cursor: "pointer",
          }}
          onClick={() => setActiveTab("prompts")}
        >
          Prompts
        </Box>
      </Box>

      {activeTab === "collections" && (
        <>
          <Typography variant="h4" fontWeight="bold" mb={2}>
            Collections
          </Typography>
          <Grid container mb={4} spacing={3}>
            {collections.map((collection) => (
              <Grid key={collection.id} size={{ xs: 12, md: 6 }}>
                <Card
                  onClick={() => navigate(`/main/collections/${collection.id}`)}
                  sx={{ cursor: "pointer" }}
                >
                  <CardContent>
                    <Typography variant="h6" color="#fff" fontWeight="bold">
                      {collection.name}
                    </Typography>
                    <Typography>
                      {collection.prompts?.length || 0} Prompts
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {activeTab === "prompts" && (
        <>
          <Typography variant="h4" fontWeight="bold" mb={2}>
            Prompts
          </Typography>
          {promptsLoading ? (
            <Typography>Loading prompts...</Typography>
          ) : promptsError ? (
            <Alert severity="error">
              Error loading prompts: {promptsError.message}
            </Alert>
          ) : prompts?.length === 0 ? (
            <Typography>No prompts created yet.</Typography>
          ) : (
            <PromptCard
              loading={promptsLoading}
              promptList={prompts || []}
              filteredPrompts={[]}
              searchQuery=""
              selectedCategory=""
              handleMenuOpen={() => {}}
              handleMenuClose={() => {}}
              menuAnchorEl={null}
              selectedPromptId={null}
              handleEditClick={() => {}}
              handleDeleteClick={() => {}}
              handleSavePrompt={() => {}}
              auth={auth}
              navigate={navigate}
              theme={theme}
            />
          )}
        </>
      )}
    </>
  );
};

// EditProfile component
const EditProfile = ({ user, onCancel }) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    userName: user?.userName || "",
    newPassword: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  // Update profile in Firestore
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData) => {
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, profileData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user", auth.currentUser.uid],
      });
    },
  });

  // Update Firebase Auth profile
  const updateAuthProfileMutation = useMutation({
    mutationFn: async ({ displayName, email }) => {
      if (displayName) {
        await updateProfile(auth.currentUser, {
          displayName: displayName,
        });
      }
      if (email && email !== auth.currentUser.email) {
        await auth.currentUser.updateEmail(email);
      }
    },
  });

  // Update password
  const updatePasswordMutation = useMutation({
    mutationFn: async (newPassword) => {
      await auth.currentUser.updatePassword(newPassword);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear any errors
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { confirmPassword, newPassword, ...profileData } = formData;

      // Check if passwords match if attempting to change password
      if (newPassword || confirmPassword) {
        if (newPassword !== confirmPassword) {
          setErrors({ confirmPassword: "Passwords do not match" });
          return;
        }
        await updatePasswordMutation.mutateAsync(newPassword);
      }

      // Update displayName in Firebase Auth if username changed
      if (profileData.username !== user?.username) {
        await updateProfile(auth.currentUser, {
          displayName: profileData.username,
        });
      }

      // Only update Firestore with fields that have values
      const updatedFields = Object.entries(profileData).reduce(
        (acc, [key, value]) => {
          if (value !== "") {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );

      if (Object.keys(updatedFields).length > 0) {
        await updateProfileMutation.mutateAsync(updatedFields);
      }

      onCancel();
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors((prev) => ({
        ...prev,
        submit: error.message,
      }));
    }
  };

  const isLoading =
    updateProfileMutation.isPending ||
    updateAuthProfileMutation.isPending ||
    updatePasswordMutation.isPending;

  const submitError =
    updateProfileMutation.error?.message ||
    updateAuthProfileMutation.error?.message ||
    updatePasswordMutation.error?.message;

  return (
    <Card>
      <Box sx={{ p: 3 }}>
        <Typography color="#fff" mb={3} variant="h5" fontWeight="bold">
          Personal Information
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={4} mb={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography fontWeight="bold" mb={0.5}>
                First Name
              </Typography>
              <TextField
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                fullWidth
                error={!!errors.firstName}
                helperText={errors.firstName}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography fontWeight="bold" mb={0.5}>
                Last Name
              </Typography>
              <TextField
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                fullWidth
                error={!!errors.lastName}
                helperText={errors.lastName}
              />
            </Grid>
          </Grid>

          <Grid container spacing={4} mb={4}>
            <Grid size={{ xs: 12, md: 7 }}>
              <Typography fontWeight="bold" mb={0.5}>
                Email
              </Typography>
              <TextField
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                fullWidth
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography fontWeight="bold" mb={0.5}>
                Phone
              </Typography>
              <TextField
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone"
                fullWidth
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
          </Grid>

          <Grid container spacing={4} mb={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography fontWeight="bold" mb={0.5}>
                Username
              </Typography>
              <TextField
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                placeholder="Username"
                fullWidth
                error={!!errors.userName}
                helperText={errors.userName}
              />
            </Grid>
          </Grid>

          {/* <Typography color="#fff" mb={3} variant="h5" fontWeight="bold">
            Change Password
          </Typography>
          <Grid container spacing={4} mb={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography fontWeight="bold" mb={0.5}>
                New Password
              </Typography>
              <TextField
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="New Password"
                fullWidth
                error={!!errors.newPassword}
                helperText={errors.newPassword}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography fontWeight="bold" mb={0.5}>
                Confirm New Password
              </Typography>
              <TextField
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm New Password"
                fullWidth
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
              />
            </Grid>
          </Grid> */}

          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Button onClick={onCancel} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </form>
      </Box>
    </Card>
  );
};

export default ProfilePage;
