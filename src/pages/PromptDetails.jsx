import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { formatDistanceToNow } from "date-fns";
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
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import BackIcon from "../icons/BackIcon";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import RatingDialog from "../components/RatingDialog";

function PromptDetail() {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const { id } = useParams();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const fetchPrompt = async () => {
    try {
      const promptDoc = doc(db, "prompts", id);
      const promptSnapshot = await getDoc(promptDoc);

      if (!promptSnapshot.exists()) {
        throw new Error("Prompt not found");
      }

      const data = promptSnapshot.data();

      setPrompt({
        id: promptSnapshot.id,
        ...data,
        avgRating: data.avgRating || 0,
        totalRatings: data.totalRatings || 0,
      });
    } catch (err) {
      console.error("Error fetching prompt:", err);
      setError(err.message);
      throw err;
    }
  };

  const fetchRatings = async () => {
    try {
      const ratingsQuery = query(
        collection(db, "ratings"),
        where("promptId", "==", id),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(ratingsQuery);

      const ratingsWithUserData = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const ratingData = docSnapshot.data();

          // Get the auth user directly
          const user = auth.currentUser;

          // If this rating is from the current user, use their display name
          const displayName =
            ratingData.userId === user?.uid
              ? user.displayName
              : "Anonymous User";

          return {
            id: docSnapshot.id,
            ...ratingData,
            user: {
              name: displayName,
              avatar: null,
              userName: null,
            },
            timeAgo: formatDistanceToNow(new Date(ratingData.createdAt), {
              addSuffix: true,
            }),
          };
        })
      );

      setRatings(ratingsWithUserData);
    } catch (err) {
      console.error("Error fetching ratings:", err);
      throw err;
    }
  };

  const handleRatingSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (data.success) {
        setSuccessMessage(data.message);
        setTimeout(() => setSuccessMessage(null), 5000);
        await fetchRatings();
      }
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchPrompt();
        await fetchRatings();
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
            {prompt.authorId !== userId && (
              <Button
                variant="contained"
                onClick={() => setRatingDialogOpen(true)}
              >
                Rank Prompt
              </Button>
            )}
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
                <Typography fontWeight="bold">
                  {prompt.avgRating.toFixed(1)}
                </Typography>
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
          </Stack>
        </CardContent>
      </Card>

      <Stack spacing={2} sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight="bold">
          Reviews ({ratings.length})
        </Typography>

        {ratings.map((rating) => (
          <Card key={rating.id} sx={{ background: "#1A1A1A" }}>
            <CardContent>
              <Stack spacing={2}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  {rating.user.avatar ? (
                    <Box
                      component="img"
                      src={rating.user.avatar}
                      alt={rating.user.name}
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
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
                  )}
                  <Stack sx={{ flex: 1 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight="bold"
                      color="white"
                    >
                      {rating.user.name}
                    </Typography>
                    <Typography variant="caption" color="#999">
                      {rating.timeAgo}
                    </Typography>
                  </Stack>
                  <Rating
                    value={rating.rating}
                    readOnly
                    icon={<StarIcon sx={{ color: "rgb(250, 175, 0)" }} />}
                    emptyIcon={<StarIcon />}
                  />
                </Stack>
                {rating.comment && (
                  <Typography
                    variant="body1"
                    sx={{
                      color: "rgba(255, 255, 255, 0.8)",
                      lineHeight: 1.6,
                    }}
                  >
                    {rating.comment}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <RatingDialog
        open={ratingDialogOpen}
        onClose={() => setRatingDialogOpen(false)}
        onSubmit={handleRatingSubmit}
        loading={isSubmitting}
        error={submitError}
        promptId={id}
        userId={auth.currentUser?.uid}
      />
    </>
  );
}

export default PromptDetail;
