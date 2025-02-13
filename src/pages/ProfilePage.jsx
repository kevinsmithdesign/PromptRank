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
import EditProfile from "../components/EditProfile";

const ProfilePage = () => {
  const collections = [
    { name: "Collection Title", promptCount: 3 },
    { name: "Collection Title", promptCount: 2 },
    { name: "Collection Title", promptCount: 6 },
    { name: "Collection Title", promptCount: 3 },
    { name: "Collection Title", promptCount: 2 },
    { name: "Collection Title", promptCount: 6 },
  ];

  return (
    <>
      <Typography variant="h4" fontWeight="bold" mb={1}>
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
                  Username
                </Typography>
                <Typography variant="h6" color="white">
                  email@gmail.com
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
              <Button variant="contained">Edit Profile</Button>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* <EditProfile />  */}

      <Typography variant="h4" fontWeight="bold" mb={1}>
        Collections
      </Typography>

      <Grid container mb={4} spacing={3}>
        {collections.map(({ name, promptCount }) => (
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <Typography variant="h6" color="#fff" fontWeight="bold">
                Collection Title
              </Typography>
              <Typography>Prompt #</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h4" fontWeight="bold" mb={1}>
        Prompts
      </Typography>

      <PromptCard />
    </>
  );
};

export default ProfilePage;
