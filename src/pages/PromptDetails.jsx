import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Stack,
  IconButton,
  Card,
  CardContent,
  Rating,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import BackIcon from "../icons/BackIcon";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

function PromptDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrompt = async () => {
      try {
        const promptDoc = doc(db, "prompts", id);
        const promptSnapshot = await getDoc(promptDoc);

        if (!promptSnapshot.exists()) {
          throw new Error("Prompt not found");
        }

        setPrompt({
          id: promptSnapshot.id,
          ...promptSnapshot.data(),
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
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Prompt Details
        </Typography>
        {/* <Button
    variant="contained"
    startIcon={<AddIcon />}
    onClick={() => setOpenDialog(true)}
  >
    Add Prompt
  </Button> */}
      </Box>
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
                <Typography fontWeight="bold">4.6</Typography>
              </Stack>
              <Typography color="#999" sx={{ mr: 1 }}>
                |
              </Typography>

              <Typography color="#999">16 Reviews</Typography>
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
    </>
  );
}

export default PromptDetail;
