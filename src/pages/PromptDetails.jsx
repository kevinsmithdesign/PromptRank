// import { useState } from "react";
// import { getAuth } from "firebase/auth";
// import { formatDistanceToNow } from "date-fns";
// import { useParams, useNavigate } from "react-router-dom";
// import AddEditPromptDialog from "../components/AddEditPromptDialog";
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
//   Dialog,
//   DialogContent,
//   IconButton,
//   Menu,
//   MenuItem,
// } from "@mui/material";
// import {
//   MoreVert as MoreVertIcon,
//   Star as StarIcon,
// } from "@mui/icons-material";

// import {
//   doc,
//   getDoc,
//   collection,
//   query,
//   where,
//   orderBy,
//   getDocs,
//   deleteDoc,
//   updateDoc,
// } from "firebase/firestore";
// import { db } from "../../config/firebase";
// import RatingDialog from "../components/RatingDialog";
// import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
// import PromptDetailCard from "../components/PromptDetailCard";
// import CommentThread from "../components/CommentThread";

// function PromptDetail() {
//   const auth = getAuth();
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   // Dialog states
//   const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
//   const [selectedRating, setSelectedRating] = useState(null);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [editDialogOpen, setEditDialogOpen] = useState(false);

//   // Success message state
//   const [successMessage, setSuccessMessage] = useState(null);

//   // Edit form states aligned with AddEditPromptDialog
//   const [newCategory, setNewCategory] = useState("");
//   const [newPromptTitle, setNewPromptTitle] = useState("");
//   const [newPromptDescription, setNewPromptDescription] = useState("");
//   const [editLoading, setEditLoading] = useState(false);

//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   // Fetch prompt details
//   const {
//     data: prompt,
//     error: promptError,
//     isLoading: promptLoading,
//   } = useQuery({
//     queryKey: ["prompt", id],
//     queryFn: async () => {
//       const promptDoc = doc(db, "prompts", id);
//       const promptSnapshot = await getDoc(promptDoc);

//       if (!promptSnapshot.exists()) {
//         throw new Error("Prompt not found");
//       }

//       const data = promptSnapshot.data();
//       const authorRef = doc(db, "users", data.authorId);
//       const authorDoc = await getDoc(authorRef);
//       const authorData = authorDoc.exists() ? authorDoc.data() : null;

//       return {
//         id: promptSnapshot.id,
//         ...data,
//         avgRating: data.avgRating || 0,
//         totalRatings: data.totalRatings || 0,
//         authorName: authorData?.displayName || authorData?.email || "Anonymous",
//       };
//     },
//   });

//   // Fetch ratings
//   const { data: ratings = [], isLoading: ratingsLoading } = useQuery({
//     queryKey: ["ratings", id],
//     queryFn: async () => {
//       const ratingsQuery = query(
//         collection(db, "ratings"),
//         where("promptId", "==", id),
//         orderBy("createdAt", "desc")
//       );
//       const snapshot = await getDocs(ratingsQuery);

//       return Promise.all(
//         snapshot.docs.map(async (docSnapshot) => {
//           const ratingData = docSnapshot.data();
//           const userDisplayName = ratingData.userDisplayName;
//           let finalDisplayName = userDisplayName;

//           if (!finalDisplayName) {
//             const userRef = doc(db, "users", ratingData.userId);
//             const userDoc = await getDoc(userRef);
//             if (userDoc.exists()) {
//               const userData = userDoc.data();
//               finalDisplayName = userData.displayName;
//             }
//           }

//           return {
//             id: docSnapshot.id,
//             ...ratingData,
//             user: {
//               name: finalDisplayName || "Anonymous User",
//               avatar: null,
//               userName: null,
//             },
//             timeAgo: formatDistanceToNow(new Date(ratingData.createdAt), {
//               addSuffix: true,
//             }),
//           };
//         })
//       );
//     },
//   });

//   // Delete prompt mutation
//   const deletePromptMutation = useMutation({
//     mutationFn: async () => {
//       const promptRef = doc(db, "prompts", id);
//       await deleteDoc(promptRef);
//     },
//     onSuccess: () => {
//       setSuccessMessage("Prompt deleted successfully");
//       setTimeout(() => {
//         navigate("/main/prompts");
//       }, 1500);
//     },
//     onError: (error) => {
//       setSuccessMessage("Error deleting prompt: " + error.message);
//     },
//   });

//   // Handlers
//   const handleEdit = () => {
//     setNewCategory(prompt.category || "");
//     setNewPromptTitle(prompt.title || "");
//     setNewPromptDescription(prompt.description || "");
//     setEditDialogOpen(true);
//   };

//   const handleCloseDialog = () => {
//     setEditDialogOpen(false);
//   };

//   const onSubmitAddPrompt = async () => {
//     setEditLoading(true);
//     try {
//       const promptRef = doc(db, "prompts", id);
//       await updateDoc(promptRef, {
//         category: newCategory,
//         title: newPromptTitle,
//         description: newPromptDescription,
//         updatedAt: new Date().toISOString(),
//       });

//       setSuccessMessage("Prompt updated successfully");
//       setEditDialogOpen(false);
//       queryClient.invalidateQueries(["prompt", id]);
//     } catch (error) {
//       setSuccessMessage("Error updating prompt: " + error.message);
//     } finally {
//       setEditLoading(false);
//     }
//   };

//   const handleRatingSubmit = async (data) => {
//     if (data.success) {
//       setSuccessMessage(data.message);
//       setTimeout(() => setSuccessMessage(null), 5000);
//       queryClient.invalidateQueries(["ratings", id]);
//       queryClient.invalidateQueries(["prompt", id]);
//       setSelectedRating(null);
//     }
//   };

//   const handleDeleteRating = async (ratingId) => {
//     try {
//       await deleteDoc(doc(db, "ratings", ratingId));
//       setSuccessMessage("Rating deleted successfully");
//       setTimeout(() => setSuccessMessage(null), 5000);
//       queryClient.invalidateQueries(["ratings", id]);
//       queryClient.invalidateQueries(["prompt", id]);
//     } catch (error) {
//       console.error("Error deleting rating:", error);
//       setSuccessMessage("Error deleting rating");
//     }
//   };

//   const confirmDelete = async () => {
//     try {
//       await deletePromptMutation.mutateAsync();
//       setDeleteDialogOpen(false);
//       queryClient.invalidateQueries(["prompts"]);
//       queryClient.invalidateQueries(["prompt", id]);
//     } catch (error) {
//       console.error("Error deleting prompt:", error);
//       setSuccessMessage("Error deleting prompt: " + error.message);
//     }
//   };

//   // Loading state
//   if (promptLoading) {
//     return (
//       <Container sx={{ mt: 8 }}>
//         <Stack spacing={4}>Loading...</Stack>
//       </Container>
//     );
//   }

//   // Error state
//   if (promptError) {
//     return (
//       <Container sx={{ mt: 8 }}>
//         <Typography color="error">{promptError.message}</Typography>
//       </Container>
//     );
//   }

//   // Not found state
//   if (!prompt) {
//     return (
//       <Container sx={{ mt: 8 }}>
//         <Typography>Prompt not found</Typography>
//       </Container>
//     );
//   }

//   const isAuthor = prompt.authorId === auth.currentUser?.uid;
//   const userExistingRating = ratings.find(
//     (rating) => rating.userId === auth.currentUser?.uid
//   );

//   return (
//     <>
//       {/* Success Message Alert */}
//       {successMessage && (
//         <Alert
//           severity="success"
//           sx={{
//             mb: 2,
//             backgroundColor: "rgba(76, 175, 80, 0.1)",
//             color: "#4CAF50",
//             "& .MuiAlert-icon": {
//               color: "#4CAF50",
//             },
//           }}
//         >
//           {successMessage}
//         </Alert>
//       )}

//       {/* Header Section */}
//       <Grid container alignItems="flex-end" mb={2}>
//         <Grid size={{ xs: 12, md: 6 }}>
//           <Stack>
//             <Typography variant="h4" fontWeight="bold" mb={{ xs: 2, md: 0 }}>
//               Prompt Details
//             </Typography>
//           </Stack>
//         </Grid>
//         <Grid size={{ xs: 12, md: 6 }}>
//           <Stack
//             flexDirection="row"
//             justifyContent={{ sm: "flex-start", md: "flex-end" }}
//           >
//             {isAuthor ? (
//               <>
//                 <Button variant="outlined" onClick={handleEdit} sx={{ mr: 2 }}>
//                   Edit
//                 </Button>
//                 <Button
//                   variant="outlined"
//                   color="error"
//                   onClick={() => setDeleteDialogOpen(true)}
//                 >
//                   Delete
//                 </Button>
//               </>
//             ) : (
//               <Button
//                 variant="contained"
//                 onClick={() => setRatingDialogOpen(true)}
//                 sx={{
//                   width: { xs: "100%", sm: "auto" },
//                 }}
//               >
//                 {userExistingRating ? "Update Rating" : "Rank Prompt"}
//               </Button>
//             )}
//           </Stack>
//         </Grid>
//       </Grid>

//       {/* Prompt Detail Card */}
//       <PromptDetailCard prompt={prompt} />

//       {/* Ratings Section */}
//       <Stack spacing={2} sx={{ mt: 4 }}>
//         <Typography variant="h5" fontWeight="bold">
//           Ratings {!ratingsLoading && `(${ratings.length})`}
//         </Typography>

//         {ratings.map((rating) => (
//           <Card key={rating.id}>
//             <CardContent>
//               <Stack spacing={2}>
//                 <Stack direction="row" spacing={2} sx={{}}>
//                   <Box
//                     sx={{
//                       width: 50,
//                       height: 50,
//                       borderRadius: "50%",
//                       backgroundColor: "primary.main",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       color: "white",
//                       fontWeight: "bold",
//                     }}
//                   >
//                     {rating.user.name.charAt(0)}
//                   </Box>
//                   <Stack sx={{ flex: 1 }}>
//                     <Typography
//                       variant="subtitle1"
//                       fontWeight="bold"
//                       sx={{ color: "white" }}
//                     >
//                       {rating.user.name}
//                     </Typography>
//                     <Typography variant="caption" color="#999" mb={3}>
//                       {rating.timeAgo}
//                     </Typography>
//                     {rating.comment && (
//                       <Typography variant="body1">{rating.comment}</Typography>
//                     )}
//                   </Stack>
//                   <Stack direction="row">
//                     <Rating
//                       value={rating.rating}
//                       readOnly
//                       icon={<StarIcon sx={{ color: "rgb(250, 175, 0)" }} />}
//                       emptyIcon={<StarIcon />}
//                     />
//                     {rating.userId === auth.currentUser?.uid && (
//                       <Box sx={{ position: "relative" }}>
//                         <IconButton
//                           aria-label="more"
//                           aria-controls={open ? "rating-menu" : undefined}
//                           aria-haspopup="true"
//                           aria-expanded={open ? "true" : undefined}
//                           onClick={handleClick}
//                         >
//                           <MoreVertIcon />
//                         </IconButton>
//                         <Menu
//                           id="rating-menu"
//                           anchorEl={anchorEl}
//                           open={open}
//                           onClose={handleClose}
//                           MenuListProps={{
//                             "aria-labelledby": "basic-button",
//                           }}
//                         >
//                           <MenuItem
//                             onClick={() => {
//                               setSelectedRating(rating);
//                               setRatingDialogOpen(true);
//                             }}
//                           >
//                             Edit Rating
//                           </MenuItem>
//                           <MenuItem
//                             onClick={() => handleDeleteRating(rating.id)}
//                             sx={{ color: "error.main" }}
//                           >
//                             Delete Rating
//                           </MenuItem>
//                         </Menu>
//                       </Box>
//                     )}
//                   </Stack>
//                 </Stack>

//                 <CommentThread
//                   promptId={id}
//                   ratingId={rating.id}
//                   currentUser={auth.currentUser}
//                 />
//               </Stack>
//             </CardContent>
//           </Card>
//         ))}
//       </Stack>

//       {/* Dialogs */}
//       <AddEditPromptDialog
//         openDialog={editDialogOpen}
//         handleCloseDialog={handleCloseDialog}
//         newCategory={newCategory}
//         setNewCategory={setNewCategory}
//         newPromptTitle={newPromptTitle}
//         setNewPromptTitle={setNewPromptTitle}
//         newPromptDescription={newPromptDescription}
//         setNewPromptDescription={setNewPromptDescription}
//         onSubmitAddPrompt={onSubmitAddPrompt}
//         loading={editLoading}
//       />

//       {/* Delete Confirmation Dialog */}
//       <Dialog
//         fullScreen
//         open={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//         sx={{
//           "& .MuiDialog-paper": {
//             backgroundColor: "#111",
//             color: "#fff",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//           },
//         }}
//       >
//         <Box sx={{ maxWidth: "600px", width: "100%", mx: "auto" }}>
//           <DialogContent>
//             <Typography variant="h5" fontWeight="bold" mb={1}>
//               Delete Prompt
//             </Typography>
//             <Stack spacing={2} mb={4}>
//               <Typography variant="body1">
//                 Are you sure you want to delete this prompt? This action cannot
//                 be undone.
//               </Typography>
//             </Stack>

//             <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
//               <Stack flexDirection="row" gap={2}>
//                 <Button
//                   variant="outlined"
//                   onClick={() => setDeleteDialogOpen(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button
//                   onClick={confirmDelete}
//                   color="error"
//                   variant="contained"
//                 >
//                   Delete
//                 </Button>
//               </Stack>
//             </Box>
//           </DialogContent>
//         </Box>
//       </Dialog>

//       {/* Rating Dialog */}
//       <RatingDialog
//         open={ratingDialogOpen}
//         onClose={() => {
//           setRatingDialogOpen(false);
//           setSelectedRating(null);
//         }}
//         onSubmit={handleRatingSubmit}
//         promptId={id}
//         userId={auth.currentUser?.uid}
//         existingRating={selectedRating || userExistingRating}
//       />
//     </>
//   );
// }

// export default PromptDetail;

import { useState } from "react";
import { getAuth } from "firebase/auth";
import { formatDistanceToNow } from "date-fns";
import { useParams, useNavigate } from "react-router-dom";
import AddEditPromptDialog from "../components/AddEditPromptDialog";
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
  Dialog,
  DialogContent,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Star as StarIcon,
} from "@mui/icons-material";

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import RatingDialog from "../components/RatingDialog";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import PromptDetailCard from "../components/PromptDetailCard";
import CommentThread from "../components/CommentThread";

// RatingMenu component
const RatingMenu = ({ rating, onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ position: "relative" }}>
      <IconButton
        aria-label="more"
        aria-controls={open ? `rating-menu-${rating.id}` : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ background: "#333" }}
      >
        <MoreVertIcon sx={{ color: "white" }} />
      </IconButton>
      <Menu
        id={`rating-menu-${rating.id}`}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            onEdit(rating);
            handleClose();
          }}
        >
          Edit Rating
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete(rating.id);
            handleClose();
          }}
          sx={{ color: "error.main" }}
        >
          Delete Rating
        </MenuItem>
      </Menu>
    </Box>
  );
};

// PromptMenu component
const PromptMenu = ({ onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ position: "relative" }}>
      <IconButton
        aria-label="prompt-actions"
        aria-controls={open ? "prompt-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="prompt-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
          onClick={() => {
            onEdit();
            handleClose();
          }}
        >
          Edit Prompt
        </MenuItem>
        <MenuItem
          onClick={() => {
            onDelete();
            handleClose();
          }}
          sx={{ color: "error.main" }}
        >
          Delete Prompt
        </MenuItem>
      </Menu>
    </Box>
  );
};

function PromptDetail() {
  const auth = getAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Dialog states
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Success message state
  const [successMessage, setSuccessMessage] = useState(null);

  // Edit form states aligned with AddEditPromptDialog
  const [newCategory, setNewCategory] = useState("");
  const [newPromptTitle, setNewPromptTitle] = useState("");
  const [newPromptDescription, setNewPromptDescription] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  // Fetch prompt details
  const {
    data: prompt,
    error: promptError,
    isLoading: promptLoading,
  } = useQuery({
    queryKey: ["prompt", id],
    queryFn: async () => {
      const promptDoc = doc(db, "prompts", id);
      const promptSnapshot = await getDoc(promptDoc);

      if (!promptSnapshot.exists()) {
        throw new Error("Prompt not found");
      }

      const data = promptSnapshot.data();
      const authorRef = doc(db, "users", data.authorId);
      const authorDoc = await getDoc(authorRef);
      const authorData = authorDoc.exists() ? authorDoc.data() : null;

      return {
        id: promptSnapshot.id,
        ...data,
        avgRating: data.avgRating || 0,
        totalRatings: data.totalRatings || 0,
        authorName: authorData?.displayName || authorData?.email || "Anonymous",
      };
    },
  });

  // Fetch ratings
  const { data: ratings = [], isLoading: ratingsLoading } = useQuery({
    queryKey: ["ratings", id],
    queryFn: async () => {
      const ratingsQuery = query(
        collection(db, "ratings"),
        where("promptId", "==", id),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(ratingsQuery);

      return Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const ratingData = docSnapshot.data();
          const userDisplayName = ratingData.userDisplayName;
          let finalDisplayName = userDisplayName;

          if (!finalDisplayName) {
            const userRef = doc(db, "users", ratingData.userId);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              finalDisplayName = userData.displayName;
            }
          }

          return {
            id: docSnapshot.id,
            ...ratingData,
            user: {
              name: finalDisplayName || "Anonymous User",
              avatar: null,
              userName: null,
            },
            timeAgo: formatDistanceToNow(new Date(ratingData.createdAt), {
              addSuffix: true,
            }),
          };
        })
      );
    },
  });

  // Delete prompt mutation
  const deletePromptMutation = useMutation({
    mutationFn: async () => {
      const promptRef = doc(db, "prompts", id);
      await deleteDoc(promptRef);
    },
    onSuccess: () => {
      setSuccessMessage("Prompt deleted successfully");
      setTimeout(() => {
        navigate("/main/prompts");
      }, 1500);
    },
    onError: (error) => {
      setSuccessMessage("Error deleting prompt: " + error.message);
    },
  });

  // Handlers
  const handleEdit = () => {
    setNewCategory(prompt.category || "");
    setNewPromptTitle(prompt.title || "");
    setNewPromptDescription(prompt.description || "");
    setEditDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditDialogOpen(false);
  };

  const onSubmitAddPrompt = async () => {
    setEditLoading(true);
    try {
      const promptRef = doc(db, "prompts", id);
      await updateDoc(promptRef, {
        category: newCategory,
        title: newPromptTitle,
        description: newPromptDescription,
        updatedAt: new Date().toISOString(),
      });

      setSuccessMessage("Prompt updated successfully");
      setEditDialogOpen(false);
      queryClient.invalidateQueries(["prompt", id]);
    } catch (error) {
      setSuccessMessage("Error updating prompt: " + error.message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleRatingSubmit = async (data) => {
    if (data.success) {
      setSuccessMessage(data.message);
      setTimeout(() => setSuccessMessage(null), 5000);
      queryClient.invalidateQueries(["ratings", id]);
      queryClient.invalidateQueries(["prompt", id]);
      setSelectedRating(null);
    }
  };

  const handleDeleteRating = async (ratingId) => {
    try {
      await deleteDoc(doc(db, "ratings", ratingId));
      setSuccessMessage("Rating deleted successfully");
      setTimeout(() => setSuccessMessage(null), 5000);
      queryClient.invalidateQueries(["ratings", id]);
      queryClient.invalidateQueries(["prompt", id]);
    } catch (error) {
      console.error("Error deleting rating:", error);
      setSuccessMessage("Error deleting rating");
    }
  };

  const confirmDelete = async () => {
    try {
      await deletePromptMutation.mutateAsync();
      setDeleteDialogOpen(false);
      queryClient.invalidateQueries(["prompts"]);
      queryClient.invalidateQueries(["prompt", id]);
    } catch (error) {
      console.error("Error deleting prompt:", error);
      setSuccessMessage("Error deleting prompt: " + error.message);
    }
  };

  // Loading state
  if (promptLoading) {
    return (
      <Container sx={{ mt: 8 }}>
        <Stack spacing={4}>Loading...</Stack>
      </Container>
    );
  }

  // Error state
  if (promptError) {
    return (
      <Container sx={{ mt: 8 }}>
        <Typography color="error">{promptError.message}</Typography>
      </Container>
    );
  }

  // Not found state
  if (!prompt) {
    return (
      <Container sx={{ mt: 8 }}>
        <Typography>Prompt not found</Typography>
      </Container>
    );
  }

  const isAuthor = prompt.authorId === auth.currentUser?.uid;
  const userExistingRating = ratings.find(
    (rating) => rating.userId === auth.currentUser?.uid
  );

  return (
    <>
      {/* Success Message Alert */}
      {successMessage && (
        <Alert
          severity="success"
          sx={{
            mb: 2,
            backgroundColor: "rgba(76, 175, 80, 0.1)",
            color: "#4CAF50",
            "& .MuiAlert-icon": {
              color: "#4CAF50",
            },
          }}
        >
          {successMessage}
        </Alert>
      )}

      {/* Header Section */}
      <Grid container alignItems="flex-end" mb={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack>
            <Typography variant="h4" fontWeight="bold" mb={{ xs: 2, md: 0 }}>
              Prompt Details
            </Typography>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack
            flexDirection="row"
            justifyContent={{ sm: "flex-start", md: "flex-end" }}
          >
            {isAuthor ? (
              <PromptMenu
                onEdit={handleEdit}
                onDelete={() => setDeleteDialogOpen(true)}
              />
            ) : (
              <Button
                variant="contained"
                onClick={() => setRatingDialogOpen(true)}
                sx={{
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                {userExistingRating ? "Update Rating" : "Rank Prompt"}
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>

      {/* Prompt Detail Card */}
      <PromptDetailCard prompt={prompt} />

      {/* Ratings Section */}
      <Stack spacing={2} sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight="bold">
          Ratings {!ratingsLoading && `(${ratings.length})`}
        </Typography>

        {ratings.map((rating) => (
          <Card key={rating.id}>
            <CardContent>
              <Stack direction="row" spacing={2} sx={{ background: "" }}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    backgroundColor: "primary.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontWeight: "bold",
                  }}
                >
                  {rating.user.name.charAt(0)}
                </Box>
                <Stack sx={{ flex: 1, background: "" }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ color: "white" }}
                  >
                    {rating.user.name}
                  </Typography>
                  <Typography variant="caption" color="#999" mb={2}>
                    {rating.timeAgo}
                  </Typography>
                  {/* {rating.comment && (
                      <Typography variant="body1">{rating.comment}</Typography>
                    )} */}

                  {/* <Box sx={{ display: { xs: "flex", md: "none" }, mb: 2 }}>
                    <Rating
                      value={rating.rating}
                      readOnly
                      icon={<StarIcon sx={{ color: "rgb(250, 175, 0)" }} />}
                      emptyIcon={<StarIcon />}
                    />
                  </Box> */}
                </Stack>
                <Stack direction="row" sx={{ background: "" }}>
                  <Stack
                    direction="row"
                    sx={{
                      background: "",
                      height: "46px",
                      alignItems: "center",
                    }}
                  >
                    <Rating
                      value={rating.rating}
                      readOnly
                      icon={<StarIcon sx={{ color: "rgb(250, 175, 0)" }} />}
                      emptyIcon={<StarIcon />}
                      sx={{ display: { xs: "none", md: "flex" }, mr: 2 }}
                    />
                    {rating.userId === auth.currentUser?.uid && (
                      <RatingMenu
                        rating={rating}
                        onEdit={(rating) => {
                          setSelectedRating(rating);
                          setRatingDialogOpen(true);
                        }}
                        onDelete={handleDeleteRating}
                      />
                    )}
                  </Stack>
                </Stack>
              </Stack>
              <Stack direction="row" sx={{ background: "" }}>
                <Stack
                  sx={{
                    width: "66px",
                    background: "",
                    display: { xs: "none", md: "flex" },
                  }}
                ></Stack>
                <Stack sx={{ flex: 1 }}>
                  <Box sx={{ display: { xs: "flex", md: "none" }, mb: 2 }}>
                    <Rating
                      value={rating.rating}
                      readOnly
                      icon={<StarIcon sx={{ color: "rgb(250, 175, 0)" }} />}
                      emptyIcon={<StarIcon />}
                    />
                  </Box>

                  {rating.comment && (
                    <Typography variant="body1">{rating.comment}</Typography>
                  )}

                  <CommentThread
                    promptId={id}
                    ratingId={rating.id}
                    currentUser={auth.currentUser}
                  />
                </Stack>
              </Stack>

              {/* <CommentThread
                  promptId={id}
                  ratingId={rating.id}
                  currentUser={auth.currentUser}
                /> */}
            </CardContent>
          </Card>
        ))}
      </Stack>
      {/* Dialogs */}
      <AddEditPromptDialog
        openDialog={editDialogOpen}
        handleCloseDialog={handleCloseDialog}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        newPromptTitle={newPromptTitle}
        setNewPromptTitle={setNewPromptTitle}
        newPromptDescription={newPromptDescription}
        setNewPromptDescription={setNewPromptDescription}
        onSubmitAddPrompt={onSubmitAddPrompt}
        loading={editLoading}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        fullScreen
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#111",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <Box sx={{ maxWidth: "600px", width: "100%", mx: "auto" }}>
          <DialogContent>
            <Typography variant="h5" fontWeight="bold" mb={1}>
              Delete Prompt
            </Typography>
            <Stack spacing={2} mb={4}>
              <Typography variant="body1">
                Are you sure you want to delete this prompt? This action cannot
                be undone.
              </Typography>
            </Stack>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Stack flexDirection="row" gap={2}>
                <Button
                  variant="outlined"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmDelete}
                  color="error"
                  variant="contained"
                >
                  Delete
                </Button>
              </Stack>
            </Box>
          </DialogContent>
        </Box>
      </Dialog>

      {/* Rating Dialog */}
      <RatingDialog
        open={ratingDialogOpen}
        onClose={() => {
          setRatingDialogOpen(false);
          setSelectedRating(null);
        }}
        onSubmit={handleRatingSubmit}
        promptId={id}
        userId={auth.currentUser?.uid}
        existingRating={selectedRating || userExistingRating}
      />
    </>
  );
}

export default PromptDetail;
