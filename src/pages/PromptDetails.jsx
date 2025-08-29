import { useState, useMemo } from "react";
import { getAuth } from "firebase/auth";
import { formatDistanceToNow } from "date-fns";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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
  CircularProgress,
  Select,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  Star as StarIcon,
  Add as AddIcon,
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

// SEO Components and Utilities
const SEOHelmet = ({ prompt, loading, error }) => {
  const createMetaDescription = (prompt) => {
    if (!prompt) return "";
    const strippedDescription =
      prompt.description?.replace(/<[^>]*>/g, "") || "";
    return strippedDescription.length > 155
      ? `${strippedDescription.substring(0, 155)}...`
      : strippedDescription;
  };

  if (loading) {
    return (
      <Helmet>
        <title>Loading Prompt Details...</title>
        <meta name="robots" content="noindex" />
      </Helmet>
    );
  }

  if (error || !prompt) {
    return (
      <Helmet>
        <title>{error ? "Error - Prompt Not Found" : "Prompt Not Found"}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
    );
  }

  const metaDescription = createMetaDescription(prompt);

  return (
    <Helmet>
      <title>{`${prompt.title} | AI Prompt Details`}</title>
      <meta name="description" content={metaDescription} />
      <meta
        name="keywords"
        content={`AI prompts, ${
          prompt.category
        }, ${prompt.title.toLowerCase()}`}
      />

      {/* OpenGraph tags */}
      <meta property="og:title" content={prompt.title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={window.location.href} />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={prompt.title} />
      <meta name="twitter:description" content={metaDescription} />

      {/* Additional meta tags */}
      <meta name="author" content={prompt.authorName} />
      <meta name="rating" content={prompt.avgRating} />
      <meta name="date" content={prompt.updatedAt || prompt.createdAt} />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: prompt.title,
          author: {
            "@type": "Person",
            name: prompt.authorName,
          },
          description: metaDescription,
          datePublished: prompt.createdAt,
          dateModified: prompt.updatedAt || prompt.createdAt,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: prompt.avgRating,
            ratingCount: prompt.totalRatings,
            bestRating: "5",
            worstRating: "1",
          },
        })}
      </script>
    </Helmet>
  );
};

function PromptDetail() {
  const auth = getAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State Management
  const [dialogState, setDialogState] = useState({
    rating: false,
    delete: false,
    edit: false,
  });
  const [selectedRating, setSelectedRating] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [editFormState, setEditFormState] = useState({
    category: "",
    title: "",
    description: "",
    loading: false,
  });

  // Queries
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

  // Mutations
  const deletePromptMutation = useMutation({
    mutationFn: async () => {
      const promptRef = doc(db, "prompts", id);
      await deleteDoc(promptRef);
    },
    onSuccess: () => {
      setSuccessMessage("Prompt deleted successfully");
      setTimeout(() => navigate("/main/prompts"), 1500);
    },
    onError: (error) => {
      setSuccessMessage("Error deleting prompt: " + error.message);
    },
  });

  // Handlers
  const handleEdit = () => {
    setEditFormState({
      ...editFormState,
      category: prompt.category || "",
      title: prompt.title || "",
      description: prompt.description || "",
    });
    setDialogState({ ...dialogState, edit: true });
  };

  const handleUpdatePrompt = async () => {
    setEditFormState({ ...editFormState, loading: true });
    try {
      const promptRef = doc(db, "prompts", id);
      await updateDoc(promptRef, {
        category: editFormState.category,
        title: editFormState.title,
        description: editFormState.description,
        updatedAt: new Date().toISOString(),
      });

      setSuccessMessage("Prompt updated successfully");
      setDialogState({ ...dialogState, edit: false });
      queryClient.invalidateQueries(["prompt", id]);
    } catch (error) {
      setSuccessMessage("Error updating prompt: " + error.message);
    } finally {
      setEditFormState({ ...editFormState, loading: false });
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

  // Computed values
  const isAuthor = useMemo(
    () => prompt?.authorId === auth.currentUser?.uid,
    [prompt?.authorId, auth.currentUser?.uid]
  );

  const userExistingRating = useMemo(
    () => ratings.find((rating) => rating.userId === auth.currentUser?.uid),
    [ratings, auth.currentUser?.uid]
  );

  // Loading, Error and Not Found states
  if (promptLoading || promptError || !prompt) {
    return (
      <>
        <SEOHelmet
          prompt={prompt}
          loading={promptLoading}
          error={promptError}
        />
        <Container sx={{ mt: 8 }}>
          <Stack spacing={4}>
            {promptLoading ? (
              "Loading..."
            ) : promptError ? (
              <Typography color="error">{promptError.message}</Typography>
            ) : (
              <Typography>Prompt not found</Typography>
            )}
          </Stack>
        </Container>
      </>
    );
  }

  return (
    <>
      <SEOHelmet prompt={prompt} />

      {/* Success Message */}
      {successMessage && (
        <Alert
          severity="success"
          sx={{
            mb: 2,
            backgroundColor: "rgba(76, 175, 80, 0.1)",
            color: "#4CAF50",
            "& .MuiAlert-icon": { color: "#4CAF50" },
          }}
        >
          {successMessage}
        </Alert>
      )}

      {/* Header Section */}
      <Grid container alignItems="flex-end" mb={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack>
            <Typography
              component="h1"
              variant="h4"
              fontWeight="bold"
              sx={{
                fontSize: { xs: "2rem", sm: "2.5rem" },
                mb: { xs: 2, md: 0 },
              }}
            >
              Prompt Details
            </Typography>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack
            flexDirection="row"
            justifyContent={{ sm: "flex-start", md: "flex-end" }}
            gap={2}
          >
            {isAuthor ? (
              <>
                <Button variant="outlined" onClick={handleEdit}>
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() =>
                    setDialogState({ ...dialogState, delete: true })
                  }
                >
                  Delete
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                onClick={() => {
                  if (auth.currentUser) {
                    setDialogState({ ...dialogState, rating: true });
                  } else {
                    // Prompt user to log in or sign up
                    navigate("/login");
                  }
                }}
                sx={{ width: { xs: "100%", sm: "auto" } }}
              >
                {userExistingRating ? "Update Review" : "Leave Review"}
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
          Reviews {!ratingsLoading && `(${ratings.length})`}
        </Typography>

        {ratings.map((rating) => (
          <Card key={rating.id}>
            {/* <CardContent> */}
            <RatingCard
              rating={rating}
              isCurrentUser={rating.userId === auth.currentUser?.uid}
              onEdit={(rating) => {
                setSelectedRating(rating);
                setDialogState({ ...dialogState, rating: true });
              }}
              onDelete={handleDeleteRating}
              promptId={id}
              currentUser={auth.currentUser}
            />
            {/* </CardContent> */}
          </Card>
        ))}
      </Stack>

      {/* Dialogs */}
      <AddEditPromptDialog
        openDialog={dialogState.edit}
        handleCloseDialog={() =>
          setDialogState({ ...dialogState, edit: false })
        }
        newCategory={editFormState.category}
        setNewCategory={(category) =>
          setEditFormState({ ...editFormState, category })
        }
        newPromptTitle={editFormState.title}
        setNewPromptTitle={(title) =>
          setEditFormState({ ...editFormState, title })
        }
        newPromptDescription={editFormState.description}
        setNewPromptDescription={(description) =>
          setEditFormState({ ...editFormState, description })
        }
        onSubmitAddPrompt={handleUpdatePrompt}
        loading={editFormState.loading}
      />

      <DeletePromptDialog
        open={dialogState.delete}
        onClose={() => setDialogState({ ...dialogState, delete: false })}
        onConfirm={() => {
          deletePromptMutation.mutate();
          setDialogState({ ...dialogState, delete: false });
        }}
      />

      <RatingDialog
        open={dialogState.rating}
        onClose={() => {
          setDialogState({ ...dialogState, rating: false });
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

// RatingCard Component
const RatingCard = ({
  rating,
  isCurrentUser,
  onEdit,
  onDelete,
  promptId,
  currentUser,
}) => (
  <>
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
          {isCurrentUser && (
            <RatingMenu rating={rating} onEdit={onEdit} onDelete={onDelete} />
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
      />
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
          <Typography
            variant="body2"
            sx={{ color: "rgba(255, 255, 255, 0.8)" }}
          >
            {rating.comment}
          </Typography>
        )}

        <CommentThread
          promptId={promptId}
          ratingId={rating.id}
          currentUser={currentUser}
        />
      </Stack>
    </Stack>
  </>
);

// RatingMenu Component
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

// DeletePromptDialog Component
const DeletePromptDialog = ({ open, onClose, onConfirm }) => (
  <Dialog
    fullScreen
    open={open}
    onClose={onClose}
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
            Are you sure you want to delete this prompt? This action cannot be
            undone.
          </Typography>
        </Stack>

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Stack flexDirection="row" gap={2}>
            <Button variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onConfirm} color="error" variant="contained">
              Delete
            </Button>
          </Stack>
        </Box>
      </DialogContent>
    </Box>
  </Dialog>
);

export default PromptDetail;
