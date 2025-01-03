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
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { db } from "../../config/firebase";
import { addDoc, collection } from "firebase/firestore";

const RatingDialog = ({ open, onClose, onSubmit, promptId, userId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await addDoc(collection(db, "ratings"), {
        rating,
        comment,
        userId,
        promptId,
        createdAt: new Date().toISOString(),
      });
      onClose();
    } catch (err) {
      setError("Failed to submit rating. Please try again.");
      console.error("Error submitting rating:", err);
    } finally {
      setLoading(false);
    }
  };

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
            Rate this Prompt
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
              placeholder="Share your thoughts about this prompt..."
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
                {loading ? "Submitting..." : "Submit Rating"}
              </Button>
            </Stack>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default RatingDialog;
