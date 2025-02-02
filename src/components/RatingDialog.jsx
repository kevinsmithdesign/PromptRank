import { useState } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  Typography,
  Box,
  Stack,
  TextField,
  Alert,
  Rating,
  Tooltip,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { doc, collection, query, where, writeBatch } from "firebase/firestore";
import { db, auth } from "../../config/firebase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getDocs, getDoc, setDoc } from "firebase/firestore";

const MAX_COMMENT_LENGTH = 1000;

const RatingDialog = ({ open, onClose, onSubmit, promptId, userId }) => {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);

  // Fetch existing rating
  const { data: existingRating } = useQuery({
    queryKey: ["rating", userId, promptId],
    queryFn: async () => {
      if (!userId || !promptId) return null;

      const ratingsQuery = query(
        collection(db, "ratings"),
        where("userId", "==", userId),
        where("promptId", "==", promptId)
      );
      const snapshot = await getDocs(ratingsQuery);

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    },
    enabled: open && !!userId && !!promptId,
    onSuccess: (data) => {
      if (data) {
        setRating(data.rating);
        setComment(data.comment || "");
      } else {
        setRating(0);
        setComment("");
      }
    },
  });

  // Comment validation
  const validateComment = (text) => {
    if (text.length > MAX_COMMENT_LENGTH) {
      return `Comment must be ${MAX_COMMENT_LENGTH} characters or less`;
    }
    if (text.trim() && text.trim().length < 3) {
      return "Comment must be at least 3 characters long if provided";
    }
    return null;
  };

  // Handle comment change with validation
  const handleCommentChange = (e) => {
    const newComment = e.target.value;
    setComment(newComment);
    const validationError = validateComment(newComment);
    setError(validationError);
  };

  // Helper function to determine tooltip message
  const getTooltipMessage = () => {
    if (submitMutation.isLoading) {
      return "Please wait while your rating is being submitted";
    }
    if (rating === 0) {
      return "Please select a star rating to continue";
    }
    if (error) {
      return error;
    }
    return "";
  };

  // Submit rating mutation
  const submitMutation = useMutation({
    mutationFn: async () => {
      const batch = writeBatch(db);
      const user = auth.currentUser;

      let ratingRef;
      if (existingRating?.id) {
        ratingRef = doc(db, "ratings", existingRating.id);
        batch.update(ratingRef, {
          rating,
          comment,
          updatedAt: new Date().toISOString(),
        });
      } else {
        ratingRef = doc(collection(db, "ratings"));
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          await setDoc(userRef, {
            email: user.email,
            displayName: user.displayName,
            createdAt: new Date().toISOString(),
          });
        }

        batch.set(ratingRef, {
          rating,
          comment,
          userId: user.uid,
          userDisplayName: user.displayName,
          promptId,
          createdAt: new Date().toISOString(),
        });
      }

      // Update prompt average rating
      const ratingsQuery = query(
        collection(db, "ratings"),
        where("promptId", "==", promptId)
      );
      const ratingsSnapshot = await getDocs(ratingsQuery);
      const currentRatings = ratingsSnapshot.docs
        .filter((doc) => doc.id !== existingRating?.id)
        .map((doc) => doc.data().rating);

      currentRatings.push(rating);
      const newAvgRating =
        currentRatings.reduce((sum, r) => sum + r, 0) / currentRatings.length;

      const promptRef = doc(db, "prompts", promptId);
      batch.update(promptRef, {
        avgRating: newAvgRating,
        totalRatings: currentRatings.length,
      });

      await batch.commit();
      return existingRating?.id ? "updated" : "created";
    },
    onSuccess: (result) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries(["rating", userId, promptId]);
      queryClient.invalidateQueries(["prompt", promptId]);

      onSubmit({
        success: true,
        message:
          result === "updated"
            ? "Your rating has been updated! 🌟"
            : "Thanks for rating this prompt! 🌟",
      });
      onClose();
    },
    onError: (err) => {
      console.error("Error submitting rating:", err);
      setError("Failed to submit rating. Please try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validateComment(comment);
    if (validationError) {
      setError(validationError);
      return;
    }

    submitMutation.mutate();
  };

  const dialogTitle = existingRating
    ? "Update Your Rating"
    : "Rate this Prompt";
  const submitButtonText = existingRating ? "Update Rating" : "Submit Rating";

  return (
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
            {dialogTitle}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box>
              <Typography variant="body1" mb={1}>
                Rating
              </Typography>
              <Rating
                value={rating}
                onChange={(_, newValue) => setRating(newValue)}
                precision={1}
                icon={<StarIcon sx={{ color: "rgb(250, 175, 0)" }} />}
                emptyIcon={<StarIcon />}
                size="large"
              />
            </Box>

            <TextField
              placeholder="Share your thoughts about this prompt... (optional)"
              fullWidth
              multiline
              rows={8}
              error={!!error}
              // helperText={
              //   error || `${comment.length}/${MAX_COMMENT_LENGTH} characters`
              // }
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "0.5rem",
                  background: "#222",
                  height: "auto",
                  minHeight: "120px",
                },
              }}
              value={comment}
              onChange={handleCommentChange}
            />
          </Stack>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
            <Stack flexDirection="row" gap={2}>
              <Button
                variant="outlined"
                onClick={onClose}
                disabled={submitMutation.isLoading}
              >
                Cancel
              </Button>
              <Tooltip
                title={getTooltipMessage()}
                placement="bottom"
                disableHoverListener={
                  !(submitMutation.isLoading || rating === 0 || error)
                }
                // open={!!(submitMutation.isLoading || rating === 0 || error)}
                PopperProps={{
                  sx: {
                    "& .MuiTooltip-tooltip": {
                      bgcolor: "rgba(0, 0, 0, 0.9)",
                      color: "#fff",
                      fontSize: "0.875rem",
                      maxWidth: "300px",
                      padding: "8px 12px",
                      margin: "8px 0",
                    },
                  },
                }}
              >
                <span>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={
                      submitMutation.isLoading || rating === 0 || !!error
                    }
                  >
                    {submitMutation.isLoading
                      ? "Submitting..."
                      : submitButtonText}
                  </Button>
                </span>
              </Tooltip>
            </Stack>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default RatingDialog;
