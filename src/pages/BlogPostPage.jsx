import React, { useState } from "react";
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BackIcon from "../icons/BackIcon";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useGetBlogPost, useDeleteBlogPost } from "../hooks/useBlogQueries";
import { auth } from "../config/firebase";

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Fetch blog post data using React Query
  const { data: post, isLoading, error } = useGetBlogPost(id);

  // Delete mutation
  const {
    mutate: deleteBlogPost,
    isLoading: isDeleting,
    isSuccess: isDeleteSuccess,
    error: deleteError,
  } = useDeleteBlogPost();

  // Check if current user is the author
  const isAuthor =
    post && auth.currentUser && post.authorId === auth.currentUser.uid;

  // Handle edit click
  const handleEditClick = () => {
    navigate(`/main/blog/edit/${id}`);
  };

  // Handle delete click
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  // Handle delete confirmation
  const handleConfirmDelete = () => {
    deleteBlogPost(id, {
      onSuccess: () => {
        navigate("/main/blog");
      },
    });
    setDeleteDialogOpen(false);
  };

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            background: "#222",
            p: 2,
            "&:hover": { background: "#333" },
          }}
        >
          <BackIcon />
        </IconButton>

        {isAuthor && (
          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              color="primary"
              onClick={handleEditClick}
              sx={{
                background: "#222",
                "&:hover": { background: "#333" },
              }}
            >
              Edit
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              variant="outlined"
              color="error"
              onClick={handleDeleteClick}
              sx={{
                background: "#222",
                "&:hover": { background: "#333" },
              }}
            >
              Delete
            </Button>
          </Stack>
        )}
      </Box>

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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete Blog Post</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this blog post? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            disabled={isDeleting}
            startIcon={isDeleting && <CircularProgress size={16} />}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BlogPostPage;
