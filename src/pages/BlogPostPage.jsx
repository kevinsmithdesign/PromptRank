import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Stack,
  Container,
  IconButton,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BackIcon from "../icons/BackIcon";
import { useGetBlogPost } from "../hooks/useBlogQueries";

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  // Fetch blog post data using React Query
  const { data: post, isLoading, error } = useGetBlogPost(id);

  // Handle loading and error states
  if (isLoading) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          Error loading blog post. Please try again later.
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/main/blog")}
        >
          Back to Blog
        </Button>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" color="white">
          Blog post not found
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/main/blog")}
          sx={{ mt: 2 }}
        >
          Back to Blog
        </Button>
      </Box>
    );
  }

  return (
    <>
      <IconButton
        onClick={() => navigate(-1)}
        sx={{
          background: "#222",
          p: 2,
          mb: 2,
          "&:hover": { background: "#333" },
        }}
      >
        <BackIcon />
      </IconButton>

      <article>
        {/* Header Image */}
        <Box
          sx={{
            position: "relative",
            height: "400px",
            mb: 6,
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={post.imageUrl}
            alt={post.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {/* Gradient Overlay */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "50%",
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.8))",
            }}
          />
        </Box>

        {/* Article Header */}
        <Container sx={{ mb: 8 }}>
          <Stack direction="row" spacing={1} mb={3}>
            <Chip
              label={post.category}
              size="small"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: "white",
                px: 2,
                height: "32px",
                fontSize: "0.9rem",
              }}
            />
            <Chip
              label={post.readTime || "5 min read"}
              size="small"
              sx={{
                backgroundColor: "#333",
                color: "white",
                px: 2,
                height: "32px",
                fontSize: "0.9rem",
              }}
            />
          </Stack>

          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: "bold",
              color: "white",
              mb: 4,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              lineHeight: 1.2,
            }}
          >
            {post.title}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center" mb={6}>
            <Avatar
              sx={{ width: 48, height: 48 }}
              alt={post.author}
              src={
                post.authorPhotoURL ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  post.author
                )}&background=random`
              }
            />
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}
              >
                {post.author}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.9rem" }}
              >
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Typography>
            </Box>
          </Stack>
        </Container>

        {/* Article Content */}
        <Container>
          <Box
            sx={{
              "& h2": {
                color: "white",
                fontWeight: "bold",
                fontSize: "2rem",
                mt: 6,
                mb: 3,
              },
              "& p": {
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 1.8,
                mb: 4,
                fontSize: "1.1rem",
                maxWidth: "100%",
                letterSpacing: "0.3px",
              },
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Container>
      </article>
    </>
  );
};

export default BlogPostPage;
