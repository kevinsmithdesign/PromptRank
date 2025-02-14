// import { useState } from "react";
// import Grid from "@mui/material/Grid2";
// import {
//   Container,
//   Typography,
//   Stack,
//   Card,
//   CardContent,
//   Rating,
//   Button,
//   Alert,
//   Box,
//   TextField,
//   Dialog,
//   useTheme,
//   Tabs,
//   Tab,
// } from "@mui/material";
// import UserIcon from "../icons/UserIcon";
// import PromptCard from "../components/PromptCard";
// import { useCollections } from "../hooks/useCollections";
// import { useUserPrompts } from "../hooks/useUserPrompts";
// import { useUser } from "../hooks/useUser";
// import { auth } from "../../config/firebase";
// import { useNavigate } from "react-router-dom";

// const ProfilePage = () => {
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const navigate = useNavigate();
//   const userId = auth.currentUser?.uid;

//   const {
//     user,
//     isLoading: userLoading,
//     error: userError,
//     updateUser,
//   } = useUser(userId);

//   const {
//     collections,
//     isLoading: collectionsLoading,
//     error: collectionsError,
//   } = useCollections();

//   // const {
//   //   data: prompts,
//   //   isLoading: promptsLoading,
//   //   error: promptsError,
//   // } = useUserPrompts(userId);

//   const theme = useTheme();

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
//                 onClick={() => setIsEditDialogOpen(true)}
//               >
//                 Edit Profile
//               </Button>
//             </Box>
//           </Grid>
//         </Grid>
//       </Card>

//       <EditProfileDialog
//         open={isEditDialogOpen}
//         onClose={() => setIsEditDialogOpen(false)}
//         user={user}
//         updateUser={updateUser}
//       />

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
//         <Box sx={{ background: "#1976d2", py: 2, px: 4, borderRadius: "8px" }}>
//           Collections
//         </Box>
//         <Box sx={{ background: "", py: 2, px: 4, borderRadius: "8px" }}>
//           Prompts
//         </Box>
//       </Box>

//       <Typography variant="h4" fontWeight="bold" mb={2}>
//         Collections
//       </Typography>

//       <Grid container mb={4} spacing={3}>
//         {collections.map((collection) => (
//           <Grid key={collection.id} size={{ xs: 12, md: 6 }}>
//             <Card
//               onClick={() => navigate(`/collections/${collection.id}`)}
//               sx={{ cursor: "pointer" }}
//             >
//               <CardContent>
//                 <Typography variant="h6" color="#fff" fontWeight="bold">
//                   {collection.name}
//                 </Typography>
//                 <Typography>
//                   {collection.prompts?.length || 0} Prompts
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       <Typography variant="h4" fontWeight="bold" mb={2}>
//         Prompts
//       </Typography>

//       {promptsLoading ? (
//         <Typography>Loading prompts...</Typography>
//       ) : promptsError ? (
//         <Alert severity="error">
//           Error loading prompts: {promptsError.message}
//         </Alert>
//       ) : prompts?.length === 0 ? (
//         <Typography>No prompts created yet.</Typography>
//       ) : (
//         <PromptCard
//           loading={promptsLoading}
//           promptList={prompts || []}
//           filteredPrompts={[]}
//           searchQuery=""
//           selectedCategory=""
//           handleMenuOpen={() => {}}
//           handleMenuClose={() => {}}
//           menuAnchorEl={null}
//           selectedPromptId={null}
//           handleEditClick={() => {}}
//           handleDeleteClick={() => {}}
//           handleSavePrompt={() => {}}
//           auth={auth}
//           navigate={navigate}
//           theme={theme}
//         />
//       )}
//     </>
//   );
// };

// // EditProfileDialog component
// const EditProfileDialog = ({ open, onClose, user, updateUser }) => {
//   const [formData, setFormData] = useState({
//     displayName: user?.displayName || "",
//     email: user?.email || "",
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await updateUser.mutateAsync(formData);
//       onClose();
//     } catch (error) {
//       console.error("Error updating profile:", error);
//     }
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <Box sx={{ p: 3 }}>
//         <Typography variant="h6" mb={2}>
//           Edit Profile
//         </Typography>
//         <form onSubmit={handleSubmit}>
//           <Stack spacing={2}>
//             <TextField
//               label="Display Name"
//               value={formData.displayName}
//               onChange={(e) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   displayName: e.target.value,
//                 }))
//               }
//               fullWidth
//             />
//             <TextField
//               label="Email"
//               value={formData.email}
//               onChange={(e) =>
//                 setFormData((prev) => ({
//                   ...prev,
//                   email: e.target.value,
//                 }))
//               }
//               fullWidth
//             />
//             <Stack direction="row" spacing={2} justifyContent="flex-end">
//               <Button onClick={onClose}>Cancel</Button>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 disabled={updateUser.isLoading}
//               >
//                 {updateUser.isLoading ? "Saving..." : "Save"}
//               </Button>
//             </Stack>
//           </Stack>
//         </form>
//       </Box>
//     </Dialog>
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
  Dialog,
  useTheme,
} from "@mui/material";
import UserIcon from "../icons/UserIcon";
import PromptCard from "../components/PromptCard";
import { useCollections } from "../hooks/useCollections";
import { useUserPrompts } from "../hooks/useUserPrompts";
import { useUser } from "../hooks/useUser";
import { auth } from "../../config/firebase";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("collections");
  const navigate = useNavigate();
  const userId = auth.currentUser?.uid;
  const theme = useTheme();

  const {
    user,
    isLoading: userLoading,
    error: userError,
    updateUser,
  } = useUser(userId);

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
                onClick={() => setIsEditDialogOpen(true)}
              >
                Edit Profile
              </Button>
            </Box>
          </Grid>
        </Grid>
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
                  onClick={() => navigate(`/collections/${collection.id}`)}
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

      <EditProfileDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        user={user}
        updateUser={updateUser}
      />
    </>
  );
};

// EditProfileDialog component
const EditProfileDialog = ({ open, onClose, user, updateUser }) => {
  const [formData, setFormData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser.mutateAsync(formData);
      onClose();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          Edit Profile
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Display Name"
              value={formData.displayName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  displayName: e.target.value,
                }))
              }
              fullWidth
            />
            <TextField
              label="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              fullWidth
            />
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={onClose}>Cancel</Button>
              <Button
                type="submit"
                variant="contained"
                disabled={updateUser.isLoading}
              >
                {updateUser.isLoading ? "Saving..." : "Save"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Dialog>
  );
};

export default ProfilePage;
