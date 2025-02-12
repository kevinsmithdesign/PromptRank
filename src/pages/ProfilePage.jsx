// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Typography,
//   Card,
//   CardContent,
//   Stack,
//   CircularProgress,
//   Button,
// } from "@mui/material";
// import Grid from "@mui/material/Grid2";
// import FolderIcon from "@mui/icons-material/Folder";
// import AddIcon from "@mui/icons-material/Add";
// import { db, auth } from "../../config/firebase";
// import { getDocs, collection, query, orderBy } from "firebase/firestore";

// const ProfilePage = () => {
//   const [collections, setCollections] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchCollections();
//   }, []);

//   const fetchCollections = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const currentUser = auth.currentUser;
//       if (!currentUser) {
//         throw new Error("You must be logged in to view collections");
//       }

//       const collectionsRef = collection(
//         db,
//         "users",
//         currentUser.uid,
//         "collections"
//       );
//       const q = query(collectionsRef, orderBy("createdAt", "desc"));
//       const snapshot = await getDocs(q);

//       const collectionsData = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       setCollections(collectionsData);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateCollection = () => {
//     // Implement collection creation logic or navigation
//   };

//   return (
//     <>
//       <Box
//         sx={{
//           mb: 2,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "flex-end",
//         }}
//       >
//         <Typography variant="h4" fontWeight="bold">
//           Profile
//         </Typography>
//       </Box>

//       <Card sx={{ mb: 3, p: 3 }}>
//         <Box>Profile Img</Box>
//         <Box>Profile Name</Box>
//         <Box>Profile Username</Box>
//         <Box>How many you've Rated</Box>
//         <Box>Ratings Overview</Box>
//         <Box>Reviews</Box>
//         <Box>Followers</Box>
//         <Box>Following</Box>
//         <Box>Edit Profile Button</Box>
//       </Card>

//       <Box
//         sx={{
//           mb: 3,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <Typography variant="h4" fontWeight="bold">
//           Prompt Collections
//         </Typography>
//       </Box>

//       {loading ? (
//         <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) : error ? (
//         <Typography color="error" sx={{ textAlign: "center", py: 4 }}>
//           {error}
//         </Typography>
//       ) : collections.length === 0 ? (
//         <Card sx={{ textAlign: "center", py: 6 }}>
//           <Typography sx={{ mb: 2 }}>
//             You haven't created any collections yet
//           </Typography>
//           <Button
//             variant="contained"
//             startIcon={<AddIcon />}
//             onClick={handleCreateCollection}
//           >
//             Create Your First Collection
//           </Button>
//         </Card>
//       ) : (
//         <Grid container spacing={3}>
//           {collections.map((collection) => (
//             <Grid size={{ xs: 6 }} key={collection.id}>
//               <Card
//                 sx={{
//                   height: "100%",
//                   cursor: "pointer",
//                   transition: "transform 0.2s, box-shadow 0.2s",
//                   "&:hover": {
//                     transform: "translateY(-4px)",
//                     boxShadow: (theme) => theme.shadows[4],
//                   },
//                 }}
//               >
//                 <CardContent>
//                   <Stack spacing={2}>
//                     <Stack direction="row" spacing={2} alignItems="center">
//                       <FolderIcon
//                         sx={{ color: "primary.main", fontSize: 40 }}
//                       />
//                       <Box>
//                         <Typography variant="h6" sx={{ mb: 0.5 }}>
//                           {collection.name}
//                         </Typography>
//                         <Typography variant="body2" color="text.secondary">
//                           {collection.promptCount} prompts
//                         </Typography>
//                       </Box>
//                     </Stack>
//                     {collection.description && (
//                       <Typography variant="body2" color="text.secondary">
//                         {collection.description}
//                       </Typography>
//                     )}
//                   </Stack>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       )}
//     </>
//   );
// };

// export default ProfilePage;

import Grid from "@mui/material/Grid2";
import {
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  Rating,
  Button,
  Alert,
  Box,
  TextField,
} from "@mui/material";
import UserIcon from "../icons/UserIcon";
import PromptCard from "../components/PromptCard";

const ProfilePage = () => {
  return (
    <>
      <Grid container alignItems="flex-end" mb={2} spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack>
            <Typography variant="h4" fontWeight="bold">
              Prompts
            </Typography>
            <Typography variant="body1">Prompts you created</Typography>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {/* <Stack flexDirection="row" justifyContent="flex-end" spacing={2}>
            <Button
              variant="contained"
              onClick={() => setRatingDialogOpen(true)}
            >
              asdf
            </Button>
          </Stack> */}
        </Grid>
      </Grid>
      <PromptCard />
      <Grid container alignItems="flex-end" mb={2} spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack>
            <Typography variant="h4" fontWeight="bold" mb={1}>
              Collections
            </Typography>
            <Typography variant="body1" mb={0.5}>
              Collections you've created
            </Typography>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          {/* <Stack flexDirection="row" justifyContent="flex-end" spacing={2}>
            <Button
              variant="contained"
              onClick={() => setRatingDialogOpen(true)}
            >
              asdf
            </Button>
          </Stack> */}
        </Grid>
      </Grid>
      <Grid container mb={3} spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <Typography variant="h6" color="#fff" fontWeight="bold">
              Collection Title
            </Typography>
            <Typography>Prompt #</Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <Typography variant="h6" color="#fff" fontWeight="bold">
              Collection Title
            </Typography>
            <Typography>Prompt #</Typography>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <Typography variant="h6" color="#fff" fontWeight="bold">
              Collection Title
            </Typography>
            <Typography>Prompt #</Typography>
          </Card>
        </Grid>
      </Grid>
      <Grid container alignItems="flex-end" mb={2} spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack>
            <Typography variant="h4" fontWeight="bold">
              Edit Profile
            </Typography>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}></Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>
            <Box
              sx={{
                height: "100px",
                width: "100px",
                borderRadius: "50%",
                background: "#999",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 1,
              }}
            >
              <UserIcon />
            </Box>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography variant="h6" color="#fff" fontWeight="bold">
                Username
              </Typography>
              <Typography>email@gmail.com</Typography>
            </Box>
            <Stack>
              <Button variant="contained">Update Profile Picture</Button>
            </Stack>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>
            <Typography color="#fff" mb={3} variant="h5" fontWeight="bold">
              Personal Information
            </Typography>
            <Grid container spacing={4} mb={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography fontWeight="bold" mb={0.5}>
                  First Name
                </Typography>
                <TextField
                  placeholder="First Name"
                  fullWidth
                  required
                  // value={newPromptTitle}
                  // onChange={(e) => setNewPromptTitle(e.target.value)}
                  // error={!!addFormErrors.title}
                  // helperText={addFormErrors.title}
                  // FormHelperTextProps={{
                  //   sx: { color: "error.main" },
                  // }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography fontWeight="bold" mb={0.5}>
                  Last Name
                </Typography>
                <TextField
                  placeholder="Last Name"
                  fullWidth
                  required
                  // value={newPromptTitle}
                  // onChange={(e) => setNewPromptTitle(e.target.value)}
                  // error={!!addFormErrors.title}
                  // helperText={addFormErrors.title}
                  // FormHelperTextProps={{
                  //   sx: { color: "error.main" },
                  // }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={4} mb={4}>
              <Grid size={{ xs: 12, md: 7 }}>
                <Typography fontWeight="bold" mb={0.5}>
                  Email
                </Typography>
                <TextField
                  placeholder="Last Name"
                  fullWidth
                  required
                  // value={newPromptTitle}
                  // onChange={(e) => setNewPromptTitle(e.target.value)}
                  // error={!!addFormErrors.title}
                  // helperText={addFormErrors.title}
                  // FormHelperTextProps={{
                  //   sx: { color: "error.main" },
                  // }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <Typography fontWeight="bold" mb={0.5}>
                  Phone
                </Typography>
                <TextField
                  placeholder="Last Name"
                  fullWidth
                  required
                  // value={newPromptTitle}
                  // onChange={(e) => setNewPromptTitle(e.target.value)}
                  // error={!!addFormErrors.title}
                  // helperText={addFormErrors.title}
                  // FormHelperTextProps={{
                  //   sx: { color: "error.main" },
                  // }}
                />
              </Grid>
            </Grid>
            <Grid container spacing={4} mb={4}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography fontWeight="bold" mb={0.5}>
                  Username
                </Typography>
                <TextField
                  placeholder="Username"
                  fullWidth
                  required
                  // value={newPromptTitle}
                  // onChange={(e) => setNewPromptTitle(e.target.value)}
                  // error={!!addFormErrors.title}
                  // helperText={addFormErrors.title}
                  // FormHelperTextProps={{
                  //   sx: { color: "error.main" },
                  // }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}></Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default ProfilePage;
