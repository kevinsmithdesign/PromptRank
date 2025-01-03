import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useParams, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import {
  Container,
  Typography,
  Box,
  Stack,
  IconButton,
  Card,
  CardContent,
  Rating,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import BackIcon from "../icons/BackIcon";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import RatingDialog from "../components/RatingDialog";

function PromptDetail() {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const { id, promptId } = useParams();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleRatingSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Add submission logic here
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    // const fetchPrompt = async () => {
    //   try {
    //     const promptDoc = doc(db, "prompts", id);
    //     const promptSnapshot = await getDoc(promptDoc);

    //     if (!promptSnapshot.exists()) {
    //       throw new Error("Prompt not found");
    //     }

    //     setPrompt({
    //       id: promptSnapshot.id,
    //       ...promptSnapshot.data(),
    //     });
    //   } catch (err) {
    //     console.error("Error fetching prompt:", err);
    //     setError(err.message);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    const fetchPrompt = async () => {
      try {
        const promptDoc = doc(db, "prompts", id);
        const promptSnapshot = await getDoc(promptDoc);

        if (!promptSnapshot.exists()) {
          throw new Error("Prompt not found");
        }

        const data = promptSnapshot.data();
        const ratings = data.ratings || [];
        const avgRating =
          ratings.length > 0
            ? (
                ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
              ).toFixed(1)
            : 0;

        setPrompt({
          id: promptSnapshot.id,
          ...data,
          avgRating,
          totalRatings: ratings.length,
        });
      } catch (err) {
        console.error("Error fetching prompt:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompt();
  }, [id]);

  if (loading)
    return (
      <Container sx={{ mt: 8 }}>
        <Typography>Loading...</Typography>
      </Container>
    );

  if (error)
    return (
      <Container sx={{ mt: 8 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );

  if (!prompt)
    return (
      <Container sx={{ mt: 8 }}>
        <Typography>Prompt not found</Typography>
      </Container>
    );

  return (
    <>
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
            <Button
              variant="contained"
              onClick={() => setRatingDialogOpen(true)}
            >
              Rank Prompt
            </Button>
          </Stack>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <IconButton onClick={() => navigate(-1)}>
              <BackIcon />
            </IconButton>
          </Box>
          <Stack>
            <Stack direction="row" alignItems="center" mb={4}>
              <StarIcon sx={{ color: "rgb(250, 175, 0)" }} />
              <Stack sx={{ ml: 1, mr: 1 }}>
                <Typography fontWeight="bold">{prompt.avgRating}</Typography>
              </Stack>{" "}
              <Typography color="#999">
                {prompt.totalRatings}{" "}
                {prompt.totalRatings === 1 ? "Review" : "Reviews"}
              </Typography>
            </Stack>

            {prompt.category && (
              <Typography
                variant="body2"
                sx={{
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  color: "#999",
                }}
              >
                {prompt.category}
              </Typography>
            )}

            <Typography variant="h4" fontWeight="bold" mb={2} color="white">
              {prompt.title}
            </Typography>

            {/* <Stack direction="row" alignItems="center" spacing={1}>
              <StarIcon sx={{ color: "rgb(250, 175, 0)" }} />
              <Typography>4.6</Typography>
            </Stack> */}

            <Typography
              variant="body1"
              sx={{
                color: "rgba(255, 255, 255, 0.8)",
                lineHeight: 1.7,
                mb: 4,
              }}
            >
              {prompt.description}
            </Typography>

            <Typography variant="caption" sx={{ color: "#999" }}>
              Created: {new Date(prompt.createdAt).toLocaleDateString()}
            </Typography>

            <Typography variant="caption" sx={{ color: "#999" }}>
              Author: Bobo
            </Typography>

            {/* <Rating name="half-rating" defaultValue={2.5} precision={0.5} /> */}
          </Stack>
        </CardContent>
      </Card>
      <RatingDialog
        open={ratingDialogOpen}
        onClose={() => setRatingDialogOpen(false)}
        onSubmit={handleRatingSubmit}
        loading={isSubmitting}
        error={submitError}
        promptId={promptId}
        userId={auth.currentUser?.uid}
      />
    </>
  );
}

export default PromptDetail;
