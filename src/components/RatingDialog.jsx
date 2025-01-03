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
  const [existingRatingId, setExistingRatingId] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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

      // Debug the user ID being saved
      console.log("Saving rating with userId:", userId);

      let ratingRef;
      if (existingRatingId) {
        ratingRef = doc(db, "ratings", existingRatingId);
        batch.update(ratingRef, {
          rating,
          comment,
          updatedAt: new Date().toISOString(),
        });
      } else {
        ratingRef = doc(collection(db, "ratings"));
        // Verify the user document exists before saving
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        console.log("User document exists:", userDoc.exists());
        console.log("User data:", userDoc.data());

        batch.set(ratingRef, {
          rating,
          comment,
          userId,
          promptId,
          createdAt: new Date().toISOString(),
        });
      }

      // Rest of the code remains the same...
      const ratingsQuery = query(
        collection(db, "ratings"),
        where("promptId", "==", promptId)
      );
      const ratingsSnapshot = await getDocs(ratingsQuery);
      const currentRatings = ratingsSnapshot.docs
        .filter((doc) => doc.id !== existingRatingId)
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

      onSubmit({
        success: true,
        message: existingRatingId
          ? "Your rating has been updated! 🌟"
          : "Thanks for rating this prompt! 🌟",
      });
      onClose();
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
  );
};

export default RatingDialog;
