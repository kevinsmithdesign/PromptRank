import { useState, useEffect } from "react";
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
  Snackbar,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { db } from "../../config/firebase";
import {
  addDoc,
  collection,
  doc,
  writeBatch,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

const RatingDialog = ({ open, onClose, onSubmit, promptId, userId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [existingRatingId, setExistingRatingId] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fetch existing rating when dialog opens
  useEffect(() => {
    const fetchExistingRating = async () => {
      if (!open || !userId || !promptId) return;

      try {
        const ratingsQuery = query(
          collection(db, "ratings"),
          where("userId", "==", userId),
          where("promptId", "==", promptId)
        );
        const snapshot = await getDocs(ratingsQuery);

        if (!snapshot.empty) {
          const existingRating = snapshot.docs[0];
          setRating(existingRating.data().rating);
          setComment(existingRating.data().comment);
          setExistingRatingId(existingRating.id);
        } else {
          // Reset form if no existing rating
          if (!isInitialLoad) {
            setRating(0);
            setComment("");
          }
          setExistingRatingId(null);
        }
        setIsInitialLoad(false);
      } catch (err) {
        console.error("Error fetching existing rating:", err);
        setError("Failed to load your previous rating");
      }
    };

    fetchExistingRating();
  }, [open, userId, promptId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const batch = writeBatch(db);

      // Handle the rating document
      let ratingRef;
      if (existingRatingId) {
        // Update existing rating
        ratingRef = doc(db, "ratings", existingRatingId);
        batch.update(ratingRef, {
          rating,
          comment,
          updatedAt: new Date().toISOString(),
        });
      } else {
        // Create new rating
        ratingRef = doc(collection(db, "ratings"));
        batch.set(ratingRef, {
          rating,
          comment,
          userId,
          promptId,
          createdAt: new Date().toISOString(),
        });
      }

      // Get all ratings for this prompt
      const ratingsQuery = query(
        collection(db, "ratings"),
        where("promptId", "==", promptId)
      );
      const ratingsSnapshot = await getDocs(ratingsQuery);
      const currentRatings = ratingsSnapshot.docs
        .filter((doc) => doc.id !== existingRatingId) // Exclude current rating if updating
        .map((doc) => doc.data().rating);

      // Add the new/updated rating
      currentRatings.push(rating);

      // Calculate new average
      const newAvgRating =
        currentRatings.reduce((sum, r) => sum + r, 0) / currentRatings.length;

      // Update prompt document
      const promptRef = doc(db, "prompts", promptId);
      batch.update(promptRef, {
        avgRating: newAvgRating,
        totalRatings: currentRatings.length,
      });

      // Commit all changes
      await batch.commit();

      // Show success message and close dialog
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
        setShowSuccess(false);
      }, 2000);
    } catch (err) {
      setError("Failed to submit rating. Please try again.");
      console.error("Error submitting rating:", err);
    } finally {
      setLoading(false);
    }
  };

  const dialogTitle = existingRatingId
    ? "Update Your Rating"
    : "Rate this Prompt";
  const submitButtonText = existingRatingId ? "Update Rating" : "Submit Rating";
  const successMessage = existingRatingId
    ? "Your rating has been updated! 🌟"
    : "Thanks for rating this prompt! 🌟";

  return (
    <>
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
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0.5rem",
                    background: "#222",
                    height: "auto",
                    minHeight: "120px",
                  },
                }}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </Stack>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Stack flexDirection="row" gap={2}>
                <Button variant="outlined" onClick={onClose} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading || rating === 0}
                >
                  {loading ? "Submitting..." : submitButtonText}
                </Button>
              </Stack>
            </Box>
          </DialogContent>
        </Box>
      </Dialog>

      <Snackbar
        open={showSuccess}
        autoHideDuration={2000}
        message={successMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          sx: {
            background: "#4CAF50",
            color: "white",
          },
        }}
      />
    </>
  );
};

export default RatingDialog;
