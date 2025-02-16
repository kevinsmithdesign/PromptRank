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
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

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

function PromptDetail() {
  const auth = getAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    category: "",
    title: "",
    description: "",
    isVisible: true,
  });
  const [editError, setEditError] = useState(null);
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
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
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

  // Handle rating submission
  const handleRatingSubmit = async (data) => {
    if (data.success) {
      setSuccessMessage(data.message);
      setTimeout(() => setSuccessMessage(null), 5000);
      queryClient.invalidateQueries(["ratings", id]);
      queryClient.invalidateQueries(["prompt", id]);
      setSelectedRating(null);
    }
  };

  // Handle rating deletion
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

  // Navigation and dialog handlers
  const handleEdit = () => {
    // Set the edit form data from the current prompt
    setEditForm({
      category: prompt.category || "",
      title: prompt.title || "",
      description: prompt.description || "",
      isVisible: prompt.isVisible !== false, // default to true if not set
    });
    setEditDialogOpen(true);
  };

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleEditSubmit = async (id) => {
    setEditLoading(true);
    setEditError(null);
    try {
      const promptRef = doc(db, "prompts", id);
      await updateDoc(promptRef, {
        ...editForm,
        updatedAt: new Date().toISOString(),
      });

      setSuccessMessage("Prompt updated successfully");
      setEditDialogOpen(false);
      queryClient.invalidateQueries(["prompt", id]);
    } catch (error) {
      setEditError(error.message);
    } finally {
      setEditLoading(false);
    }
  };

  const cancelEditing = () => {
    setEditDialogOpen(false);
    setEditError(null);
  };

  const confirmDelete = async () => {
    try {
      await deletePromptMutation.mutateAsync();
      setDeleteDialogOpen(false);
      // Invalidate and refetch all prompts queries
      queryClient.invalidateQueries(["prompts"]);
      queryClient.invalidateQueries(["prompt", id]);
      // navigate("/main/prompts");
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
            <Typography variant="h4" fontWeight="bold">
              Prompt Details
            </Typography>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack flexDirection="row" justifyContent="flex-end">
            {isAuthor ? (
              <>
                <Button variant="outlined" onClick={handleEdit} sx={{ mr: 2 }}>
                  Edit
                </Button>
                <Button variant="outlined" color="error" onClick={handleDelete}>
                  Delete
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={() => setRatingDialogOpen(true)}
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
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
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
                  <Stack sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      sx={{ color: "white" }}
                    >
                      {rating.user.name}
                    </Typography>
                    <Typography variant="caption" color="#999">
                      {rating.timeAgo}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Rating
                      value={rating.rating}
                      readOnly
                      icon={<StarIcon sx={{ color: "rgb(250, 175, 0)" }} />}
                      emptyIcon={<StarIcon />}
                    />
                    {rating.userId === auth.currentUser?.uid && (
                      <>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            console.log("Opening dialog with rating:", rating);
                            setSelectedRating(rating);
                            setRatingDialogOpen(true);
                          }}
                        >
                          Update Rating
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteRating(rating.id)}
                        >
                          Delete Rating
                        </Button>
                      </>
                    )}
                  </Stack>
                </Stack>
                {rating.comment && (
                  <Typography variant="body1">{rating.comment}</Typography>
                )}

                <CommentThread
                  promptId={id}
                  ratingId={rating.id}
                  currentUser={auth.currentUser}
                />
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

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

      {/* Edit Dialog */}
      <AddEditPromptDialog
        editDialogOpen={editDialogOpen}
        cancelEditing={cancelEditing}
        editError={editError}
        editForm={editForm}
        setEditForm={setEditForm}
        editLoading={editLoading}
        handleEditSubmit={handleEditSubmit}
        editingId={id}
        // Props needed by the component but not used for editing
        openDialog={false}
        handleCloseDialog={() => {}}
        newCategory=""
        setNewCategory={() => {}}
        newPromptTitle=""
        setNewPromptTitle={() => {}}
        newPromptDescription=""
        setNewPromptDescription={() => {}}
        onSubmitAddPrompt={() => {}}
        loading={false}
      />
    </>
  );
}

export default PromptDetail;
