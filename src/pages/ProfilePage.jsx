// import { useState } from "react";
// import Grid from "@mui/material/Grid2";
// import {
//   Typography,
//   Stack,
//   Card,
//   CardContent,
//   Button,
//   Alert,
//   Box,
//   TextField,
//   useTheme,
// } from "@mui/material";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import UserIcon from "../icons/UserIcon";
// import PromptCard from "../components/PromptCard";
// import { useCollections } from "../hooks/useCollections";
// import { useUserPrompts } from "../hooks/useUserPrompts";
// import { useUser } from "../hooks/useUser";
// import { auth, db } from "../../config/firebase";
// import { doc, updateDoc } from "firebase/firestore";
// import { updateProfile } from "firebase/auth";
// import { useNavigate } from "react-router-dom";

// const ProfilePage = () => {
//   const [isEditing, setIsEditing] = useState(false);
//   const [activeTab, setActiveTab] = useState("collections");
//   const navigate = useNavigate();
//   const userId = auth.currentUser?.uid;
//   const theme = useTheme();

//   const { user, isLoading: userLoading, error: userError } = useUser(userId);

//   const {
//     collections,
//     isLoading: collectionsLoading,
//     error: collectionsError,
//   } = useCollections();

//   const {
//     data: prompts,
//     isLoading: promptsLoading,
//     error: promptsError,
//   } = useUserPrompts(userId);

//   if (!userId) {
//     return (
//       <Alert severity="warning">Please log in to view your profile.</Alert>
//     );
//   }

//   if (userLoading || collectionsLoading || promptsLoading) {
//     return <Typography>Loading...</Typography>;
//   }

//   if (userError || collectionsError || promptsError) {
//     return <Alert severity="error">Error loading profile data</Alert>;
//   }

//   return (
//     <>
//       <Typography variant="h4" fontWeight="bold" mb={2}>
//         Profile
//       </Typography>

//       <Card sx={{ mb: 4 }}>
//         <Grid container spacing={3}>
//           <Grid size={{ xs: 12, md: 6 }}>
//             <Box sx={{ display: "flex", alignItems: "center" }}>
//               <Box
//                 sx={{
//                   height: "100px",
//                   width: "100px",
//                   borderRadius: "50%",
//                   background: "#999",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   mr: 2,
//                 }}
//               >
//                 <UserIcon />
//               </Box>
//               <Box sx={{ flexGrow: 1 }}>
//                 <Typography variant="h5" color="#fff" fontWeight="bold">
//                   {user?.displayName || "Username"}
//                 </Typography>
//                 <Typography variant="h6" color="white">
//                   {user?.email || "email@gmail.com"}
//                 </Typography>
//               </Box>
//             </Box>
//           </Grid>
//           <Grid
//             size={{ xs: 12, md: 6 }}
//             sx={{
//               display: "flex",
//               justifyContent: "flex-end",
//               alignItems: "center",
//             }}
//           >
//             <Box>
//               <Button
//                 variant="contained"
//                 onClick={() => setIsEditing(!isEditing)}
//               >
//                 {isEditing ? "Cancel Edit" : "Edit Profile"}
//               </Button>
//             </Box>
//           </Grid>
//         </Grid>

//         {isEditing && (
//           <EditProfile user={user} onCancel={() => setIsEditing(false)} />
//         )}
//       </Card>

//       <Box
//         sx={{
//           background: "#222",
//           display: "flex",
//           width: "300px",
//           p: 2,
//           borderRadius: "12px",
//           mb: 2,
//         }}
//       >
//         <Box
//           sx={{
//             background: activeTab === "collections" ? "#1976d2" : "transparent",
//             py: 2,
//             px: 4,
//             borderRadius: "8px",
//             cursor: "pointer",
//           }}
//           onClick={() => setActiveTab("collections")}
//         >
//           Collections
//         </Box>
//         <Box
//           sx={{
//             background: activeTab === "prompts" ? "#1976d2" : "transparent",
//             py: 2,
//             px: 4,
//             borderRadius: "8px",
//             cursor: "pointer",
//           }}
//           onClick={() => setActiveTab("prompts")}
//         >
//           Prompts
//         </Box>
//       </Box>

//       {activeTab === "collections" && (
//         <>
//           <Typography variant="h4" fontWeight="bold" mb={2}>
//             Collections
//           </Typography>
//           <Grid container mb={4} spacing={3}>
//             {collections.map((collection) => (
//               <Grid key={collection.id} size={{ xs: 12, md: 6 }}>
//                 <Card
//                   onClick={() => navigate(`/main/collections/${collection.id}`)}
//                   sx={{ cursor: "pointer" }}
//                 >
//                   <CardContent>
//                     <Typography variant="h6" color="#fff" fontWeight="bold">
//                       {collection.name}
//                     </Typography>
//                     <Typography>
//                       {collection.prompts?.length || 0} Prompts
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </>
//       )}

//       {activeTab === "prompts" && (
//         <>
//           <Typography variant="h4" fontWeight="bold" mb={2}>
//             Prompts
//           </Typography>
//           {promptsLoading ? (
//             <Typography>Loading prompts...</Typography>
//           ) : promptsError ? (
//             <Alert severity="error">
//               Error loading prompts: {promptsError.message}
//             </Alert>
//           ) : prompts?.length === 0 ? (
//             <Typography>No prompts created yet.</Typography>
//           ) : (
//             <PromptCard
//               loading={promptsLoading}
//               promptList={prompts || []}
//               filteredPrompts={[]}
//               searchQuery=""
//               selectedCategory=""
//               handleMenuOpen={() => {}}
//               handleMenuClose={() => {}}
//               menuAnchorEl={null}
//               selectedPromptId={null}
//               handleEditClick={() => {}}
//               handleDeleteClick={() => {}}
//               handleSavePrompt={() => {}}
//               auth={auth}
//               navigate={navigate}
//               theme={theme}
//             />
//           )}
//         </>
//       )}
//     </>
//   );
// };

// // EditProfile component
// const EditProfile = ({ user, onCancel }) => {
//   const queryClient = useQueryClient();
//   const [formData, setFormData] = useState({
//     firstName: user?.firstName || "",
//     lastName: user?.lastName || "",
//     email: user?.email || "",
//     phone: user?.phone || "",
//     userName: user?.userName || "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [errors, setErrors] = useState({});

//   // Update profile in Firestore
//   const updateProfileMutation = useMutation({
//     mutationFn: async (profileData) => {
//       const userRef = doc(db, "users", auth.currentUser.uid);
//       await updateDoc(userRef, profileData);
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["user", auth.currentUser.uid],
//       });
//     },
//   });

//   // Update Firebase Auth profile
//   const updateAuthProfileMutation = useMutation({
//     mutationFn: async ({ displayName, email }) => {
//       if (displayName) {
//         await updateProfile(auth.currentUser, {
//           displayName: displayName,
//         });
//       }
//       if (email && email !== auth.currentUser.email) {
//         await auth.currentUser.updateEmail(email);
//       }
//     },
//   });

//   // Update password
//   const updatePasswordMutation = useMutation({
//     mutationFn: async (newPassword) => {
//       await auth.currentUser.updatePassword(newPassword);
//     },
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));

//     // Clear any errors
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const { confirmPassword, newPassword, ...profileData } = formData;

//       // Check if passwords match if attempting to change password
//       if (newPassword || confirmPassword) {
//         if (newPassword !== confirmPassword) {
//           setErrors({ confirmPassword: "Passwords do not match" });
//           return;
//         }
//         await updatePasswordMutation.mutateAsync(newPassword);
//       }

//       // Update displayName in Firebase Auth if username changed
//       if (profileData.username !== user?.username) {
//         await updateProfile(auth.currentUser, {
//           displayName: profileData.username,
//         });
//       }

//       // Only update Firestore with fields that have values
//       const updatedFields = Object.entries(profileData).reduce(
//         (acc, [key, value]) => {
//           if (value !== "") {
//             acc[key] = value;
//           }
//           return acc;
//         },
//         {}
//       );

//       if (Object.keys(updatedFields).length > 0) {
//         await updateProfileMutation.mutateAsync(updatedFields);
//       }

//       onCancel();
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       setErrors((prev) => ({
//         ...prev,
//         submit: error.message,
//       }));
//     }
//   };

//   const isLoading =
//     updateProfileMutation.isPending ||
//     updateAuthProfileMutation.isPending ||
//     updatePasswordMutation.isPending;

//   const submitError =
//     updateProfileMutation.error?.message ||
//     updateAuthProfileMutation.error?.message ||
//     updatePasswordMutation.error?.message;

//   return (
//     <Card>
//       <Box sx={{ p: 3 }}>
//         <Typography color="#fff" mb={3} variant="h5" fontWeight="bold">
//           Personal Information
//         </Typography>
//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={4} mb={4}>
//             <Grid size={{ xs: 12, md: 6 }}>
//               <Typography fontWeight="bold" mb={0.5}>
//                 First Name
//               </Typography>
//               <TextField
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 placeholder="First Name"
//                 fullWidth
//                 error={!!errors.firstName}
//                 helperText={errors.firstName}
//               />
//             </Grid>
//             <Grid size={{ xs: 12, md: 6 }}>
//               <Typography fontWeight="bold" mb={0.5}>
//                 Last Name
//               </Typography>
//               <TextField
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 placeholder="Last Name"
//                 fullWidth
//                 error={!!errors.lastName}
//                 helperText={errors.lastName}
//               />
//             </Grid>
//           </Grid>

//           <Grid container spacing={4} mb={4}>
//             <Grid size={{ xs: 12, md: 7 }}>
//               <Typography fontWeight="bold" mb={0.5}>
//                 Email
//               </Typography>
//               <TextField
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Email"
//                 fullWidth
//                 error={!!errors.email}
//                 helperText={errors.email}
//               />
//             </Grid>
//             <Grid size={{ xs: 12, md: 5 }}>
//               <Typography fontWeight="bold" mb={0.5}>
//                 Phone
//               </Typography>
//               <TextField
//                 name="phone"
//                 value={formData.phone}
//                 onChange={handleChange}
//                 placeholder="Phone"
//                 fullWidth
//                 error={!!errors.phone}
//                 helperText={errors.phone}
//               />
//             </Grid>
//           </Grid>

//           <Grid container spacing={4} mb={4}>
//             <Grid size={{ xs: 12, md: 6 }}>
//               <Typography fontWeight="bold" mb={0.5}>
//                 Username
//               </Typography>
//               <TextField
//                 name="userName"
//                 value={formData.userName}
//                 onChange={handleChange}
//                 placeholder="Username"
//                 fullWidth
//                 error={!!errors.userName}
//                 helperText={errors.userName}
//               />
//             </Grid>
//           </Grid>

//           {/* <Typography color="#fff" mb={3} variant="h5" fontWeight="bold">
//             Change Password
//           </Typography>
//           <Grid container spacing={4} mb={4}>
//             <Grid size={{ xs: 12, md: 6 }}>
//               <Typography fontWeight="bold" mb={0.5}>
//                 New Password
//               </Typography>
//               <TextField
//                 name="newPassword"
//                 type="password"
//                 value={formData.newPassword}
//                 onChange={handleChange}
//                 placeholder="New Password"
//                 fullWidth
//                 error={!!errors.newPassword}
//                 helperText={errors.newPassword}
//               />
//             </Grid>
//             <Grid size={{ xs: 12, md: 6 }}>
//               <Typography fontWeight="bold" mb={0.5}>
//                 Confirm New Password
//               </Typography>
//               <TextField
//                 name="confirmPassword"
//                 type="password"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 placeholder="Confirm New Password"
//                 fullWidth
//                 error={!!errors.confirmPassword}
//                 helperText={errors.confirmPassword}
//               />
//             </Grid>
//           </Grid> */}

//           {submitError && (
//             <Alert severity="error" sx={{ mb: 2 }}>
//               {submitError}
//             </Alert>
//           )}

//           <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
//             <Button onClick={onCancel} sx={{ mr: 2 }}>
//               Cancel
//             </Button>
//             <Button type="submit" variant="contained" disabled={isLoading}>
//               {isLoading ? "Saving..." : "Save Changes"}
//             </Button>
//           </Box>
//         </form>
//       </Box>
//     </Card>
//   );
// };

// export default ProfilePage;

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
  Pagination,
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

const ITEMS_PER_PAGE = 6;

const ProfilePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const userId = auth.currentUser?.uid;

  // UI States
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("collections");

  // Pagination states
  const [collectionsPage, setCollectionsPage] = useState(1);
  const [promptsPage, setPromptsPage] = useState(1);

  // Data fetching hooks
  const { user, isLoading: userLoading, error: userError } = useUser(userId);
  const {
    collections = [],
    isLoading: collectionsLoading,
    error: collectionsError,
  } = useCollections();
  const {
    data: prompts = [],
    isLoading: promptsLoading,
    error: promptsError,
  } = useUserPrompts(userId);

  // Pagination calculations
  const collectionsStartIndex = (collectionsPage - 1) * ITEMS_PER_PAGE;
  const collectionsEndIndex = collectionsStartIndex + ITEMS_PER_PAGE;
  const paginatedCollections = collections.slice(
    collectionsStartIndex,
    collectionsEndIndex
  );
  const totalCollectionsPages = Math.ceil(collections.length / ITEMS_PER_PAGE);

  const promptsStartIndex = (promptsPage - 1) * ITEMS_PER_PAGE;
  const promptsEndIndex = promptsStartIndex + ITEMS_PER_PAGE;
  const paginatedPrompts = prompts.slice(promptsStartIndex, promptsEndIndex);
  const totalPromptsPages = Math.ceil(prompts.length / ITEMS_PER_PAGE);

  // Event handlers
  const handleCollectionsPageChange = (event, newPage) => {
    setCollectionsPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePromptsPageChange = (event, newPage) => {
    setPromptsPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "collections") {
      setCollectionsPage(1);
    } else {
      setPromptsPage(1);
    }
  };

  if (userLoading || collectionsLoading || promptsLoading) {
    return <Typography>Loading...</Typography>;
  }

  // Loading and error states
  if (!auth.currentUser) {
    return (
      <Alert severity="warning">Please log in to view your profile.</Alert>
    );
  }

  if (userError || collectionsError || promptsError) {
    return <Alert severity="error">Error loading profile data</Alert>;
  }

  // Pagination styles
  const paginationStyles = {
    "& .MuiPaginationItem-root": {
      color: "white",
      borderColor: "rgba(255, 255, 255, 0.3)",
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderColor: "rgba(255, 255, 255, 0.5)",
      },
      "&.Mui-selected": {
        borderColor: theme.palette.primary.main,
      },
    },
    "& .MuiPaginationItem-icon": {
      color: "white",
    },
  };

  return (
    <>
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Profile
      </Typography>

      {/* Profile Card */}
      <Card sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {/* <Box
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
              </Box> */}
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

      {/* Tabs */}
      <Box
        sx={{
          // background: "#222",
          display: "flex",
          width: "267px",

          // p: 2,
          borderRadius: "32px",
          mb: 2,
        }}
      >
        <Box
          sx={{
            color: activeTab === "collections" ? "white" : "#444",
            // fontWeight: activeTab === "collections" ? "bold" : "normal",
            fontWeight: "bold",
            background:
              activeTab === "collections"
                ? theme.palette.primary.main
                : "transparent",
            py: 2,
            px: 3,
            borderRadius: "32px",
            cursor: "pointer",
          }}
          onClick={() => handleTabChange("collections")}
        >
          Collections
        </Box>
        <Box
          sx={{
            color: activeTab === "prompts" ? "white" : "#444",
            // fontWeight: activeTab === "prompts" ? "bold" : "normal",
            fontWeight: "bold",
            background:
              activeTab === "prompts"
                ? theme.palette.primary.main
                : "transparent",
            py: 2,
            px: 3,
            borderRadius: "32px",
            cursor: "pointer",
          }}
          onClick={() => handleTabChange("prompts")}
        >
          Prompts
        </Box>
      </Box>

      {/* Collections Tab Content */}
      {activeTab === "collections" && (
        <>
          <Typography variant="h4" fontWeight="bold" mb={2}>
            Collections
          </Typography>
          <Grid container mb={3} spacing={3}>
            {paginatedCollections.map((collection) => (
              <Grid key={collection.id} size={{ xs: 12, md: 6 }}>
                <Card
                  onClick={() => navigate(`/main/collections/${collection.id}`)}
                  sx={{ cursor: "pointer", border: `1px solid #222` }}
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
          {collections.length > 0 && (
            <Box
              sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 4 }}
            >
              <Pagination
                count={totalCollectionsPages}
                page={collectionsPage}
                onChange={handleCollectionsPageChange}
                variant="outlined"
                shape="rounded"
                color="primary"
                sx={paginationStyles}
              />
            </Box>
          )}
        </>
      )}

      {/* Prompts Tab Content */}
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
            <>
              <PromptCard
                loading={promptsLoading}
                promptList={prompts}
                filteredPrompts={paginatedPrompts}
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
              />
              {prompts.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: 4,
                    mb: 4,
                  }}
                >
                  <Pagination
                    count={totalPromptsPages}
                    page={promptsPage}
                    onChange={handlePromptsPageChange}
                    variant="outlined"
                    shape="rounded"
                    color="primary"
                    sx={paginationStyles}
                  />
                </Box>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

// EditProfile Component
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

  // Mutations
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

      if (newPassword || confirmPassword) {
        if (newPassword !== confirmPassword) {
          setErrors({ confirmPassword: "Passwords do not match" });
          return;
        }
        await updatePasswordMutation.mutateAsync(newPassword);
      }

      if (profileData.username !== user?.username) {
        await updateProfile(auth.currentUser, {
          displayName: profileData.username,
        });
      }

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
