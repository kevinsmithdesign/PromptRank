import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Stack,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
  Skeleton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "../icons/SearchIcon";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import {
  useGetBlogPosts,
  useSearchBlogPosts,
  useGetBlogPostsByCategory,
} from "../hooks/useBlogQueries";

const BlogPage = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  // Add scroll state for categories
  const scrollRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // React Query hooks
  const {
    data: allBlogPosts = [],
    isLoading: isLoadingAll,
    error: allError,
  } = useGetBlogPosts();

  const { data: searchResults = [], isLoading: isSearching } =
    useSearchBlogPosts(searchQuery);

  const { data: categoryResults = [], isLoading: isLoadingCategory } =
    useGetBlogPostsByCategory(selectedCategory);

  // Sample categories - in a production app, these might come from the database
  const categories = [
    "Prompt Engineering",
    "AI Agents",
    "ChatGPT",
    "Claude",
    "Tutorials",
    "Best Practices",
    "Industry Updates",
    "Tips & Tricks",
  ];

  // Scroll handlers
  const handleMouseDown = (e) => {
    setIsScrolling(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsScrolling(false);
  };

  const handleMouseUp = () => {
    setIsScrolling(false);
  };

  const handleMouseMove = (e) => {
    if (!isScrolling) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  // Determine which posts to display based on selected filters
  let displayPosts = allBlogPosts;
  let isLoading = isLoadingAll;

  if (searchQuery && searchQuery.length > 2) {
    displayPosts = searchResults;
    isLoading = isSearching;
  } else if (selectedCategory) {
    displayPosts = categoryResults;
    isLoading = isLoadingCategory;
  }

  return (
    <>
      <Box
        component="header"
        sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 0.5 }}
      >
        <Typography
          component="h1"
          variant="h4"
          fontWeight="bold"
          sx={{ fontSize: { xs: "2rem", sm: "2.5rem" } }}
        >
          Blog
        </Typography>
        <Typography component="p" variant="subtitle1" color="white">
          Insights, tutorials, and updates from the AI community.
        </Typography>
      </Box>

      {/* Search Section */}
      <Grid container mb={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton edge="start" disabled>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: isSearching && (
                <InputAdornment position="end">
                  <CircularProgress size={20} />
                </InputAdornment>
              ),
            }}
            sx={{
              ".MuiOutlinedInput-root input": {
                paddingLeft: 0,
              },
              "& .MuiInputBase-input": {
                paddingLeft: 0,
              },
              "& .MuiInputAdornment-positionStart": {
                marginRight: 0,
              },
              mr: 2,
            }}
          />
        </Grid>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            variant="contained"
            onClick={() => navigate("/main/blog/create")}
            disabled={!auth.currentUser}
          >
            Add Blog Post
          </Button>
        </Grid>
      </Grid>

      {/* Categories */}
      <Stack
        ref={scrollRef}
        flexDirection="row"
        gap={1}
        mb={6}
        sx={{
          overflowX: "auto",
          scrollbarWidth: "none",
          cursor: isScrolling ? "grabbing" : "grab",
          "&:active": { cursor: "grabbing" },
          "&::-webkit-scrollbar": { display: "none" },
          userSelect: "none",
        }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        role="tablist"
        aria-label="Blog categories"
      >
        <Button
          role="tab"
          aria-selected={!selectedCategory}
          sx={{
            background: !selectedCategory ? theme.palette.primary.main : "#222",
            padding: "16px 24px",
            borderRadius: "32px",
            color: "white",
            fontWeight: "bold",
            flexShrink: 0,
            whiteSpace: "nowrap",
            "&:hover": {
              background: !selectedCategory
                ? theme.palette.primary.dark
                : "rgba(255, 255, 255, 0.1)",
            },
          }}
          onClick={() => setSelectedCategory(null)}
        >
          All Posts
        </Button>

        {categories.map((category) => (
          <Button
            key={category}
            role="tab"
            aria-selected={selectedCategory === category}
            sx={{
              background:
                selectedCategory === category
                  ? theme.palette.primary.main
                  : "#111",
              padding: "16px 24px",
              borderRadius: "32px",
              color: "white",
              fontWeight: "bold",
              flexShrink: 0,
              whiteSpace: "nowrap",
              "&:hover": {
                background:
                  selectedCategory === category
                    ? theme.palette.primary.dark
                    : "rgba(255, 255, 255, 0.1)",
              },
            }}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </Stack>

      {/* Loading and Error States */}
      {isLoading && (
        <Grid container spacing={3}>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  border: "1px solid #222",
                  backgroundColor: "#111",
                  transition: "transform 0.2s ease-in-out",
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    height: "160px",
                    overflow: "hidden",
                    borderRadius: "8px",
                    mb: 3,
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    width="100%"
                    height={160}
                    sx={{ borderRadius: "8px" }}
                  />
                </Box>
                <Stack direction="row" spacing={1} mb={2}>
                  <Chip
                    size="small"
                    sx={{
                      backgroundColor: "#333",

                      width: "80px",
                    }}
                  />
                  <Chip
                    size="small"
                    sx={{ backgroundColor: "#333", width: "80px" }}
                  />
                </Stack>
                <Skeleton
                  variant="text"
                  width="90%"
                  sx={{ mb: 2, borderRadius: "10px" }}
                />
                <Skeleton
                  variant="text"
                  width="90%"
                  sx={{ borderRadius: "10px", mb: 0.5 }}
                />
                <Skeleton
                  variant="text"
                  width="90%"
                  sx={{ borderRadius: "10px", mb: 0.5 }}
                />
                <Skeleton
                  variant="text"
                  width="90%"
                  sx={{ borderRadius: "10px", mb: 2 }}
                />
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mt: "auto" }}
                >
                  <Box>
                    <Skeleton variant="circular" width={48} height={48} />
                  </Box>
                  <Box sx={{ width: "100%" }}>
                    <Skeleton
                      variant="text"
                      width="90%"
                      sx={{ borderRadius: "10px", mb: 0.5 }}
                    />
                    <Skeleton
                      variant="text"
                      width="90%"
                      sx={{ borderRadius: "10px", mb: 0.5 }}
                    />
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {allError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading blog posts. Please try again later.
        </Alert>
      )}

      {/* No Results Message */}
      {!isLoading && displayPosts.length === 0 && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {searchQuery
            ? "No posts found matching your search criteria."
            : selectedCategory
            ? `No posts found in the "${selectedCategory}" category.`
            : "No blog posts available yet. Be the first to create one!"}
        </Alert>
      )}

      {/* Blog Posts Grid */}
      <Grid container spacing={3}>
        {!isLoading &&
          displayPosts.map((post) => (
            <Grid key={post.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",

                  border: "1px solid #222",
                  backgroundColor: "#111",
                  transition: "transform 0.2s ease-in-out",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                onClick={() => navigate(`/main/blog/${post.id}`)}
              >
                <Box
                  sx={{
                    position: "relative",
                    height: "160px",
                    overflow: "hidden",
                    borderRadius: "8px",
                    mb: 3,
                  }}
                >
                  <Box
                    component="img"
                    src={post.imageUrl}
                    alt={post.title}
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Stack direction="row" spacing={1} mb={2}>
                  <Chip
                    label={post.category}
                    size="small"
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      color: "white",
                    }}
                  />
                  <Chip
                    label={post.readTime || "5 min read"}
                    size="small"
                    sx={{ backgroundColor: "#333", color: "white" }}
                  />
                </Stack>
                <Typography
                  gutterBottom
                  variant="h6"
                  component="h2"
                  sx={{
                    fontWeight: "bold",
                    color: "white",
                    mb: 2,
                  }}
                >
                  {post.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 3, color: "rgba(255, 255, 255, 0.7)" }}
                >
                  {post.excerpt}
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mt: "auto" }}
                >
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
                      variant="body1"
                      sx={{ color: "white", fontWeight: "bold", mb: 0.3 }}
                    >
                      {post.author}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "rgba(255, 255, 255, 0.5)" }}
                    >
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            </Grid>
          ))}
      </Grid>
    </>
  );
};

export default BlogPage;
