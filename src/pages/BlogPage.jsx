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
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useTheme } from "@mui/material/styles";
import SearchIcon from "../icons/SearchIcon";
import { useNavigate } from "react-router-dom";

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

  // Sample categories
  const categories = [
    "Prompt Engineering",
    "AI Tools",
    "ChatGPT",
    "AI News",
    "Tutorials",
    "Best Practices",
    "Industry Updates",
    "Tips & Tricks",
  ];

  // Sample blog posts data
  const blogPosts = [
    {
      id: 1,
      title: "10 Advanced Prompt Engineering Techniques for Better AI Results",
      excerpt:
        "Learn how to craft more effective prompts for AI models like ChatGPT, Claude, and GPT-4...",
      author: "Sarah Chen",
      date: "2024-02-20",
      category: "Prompt Engineering",
      readTime: "8 min read",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    },
    {
      id: 2,
      title: "The Future of AI Tools: Trends to Watch in 2024",
      excerpt:
        "Explore the emerging trends in AI tools and how they're shaping the future of work...",
      author: "Michael Rodriguez",
      date: "2024-02-18",
      category: "AI Tools",
      readTime: "6 min read",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    },
    {
      id: 3,
      title: "ChatGPT vs Claude: A Comprehensive Comparison",
      excerpt:
        "A detailed analysis of the strengths and weaknesses of two leading AI chatbots...",
      author: "Alex Thompson",
      date: "2024-02-15",
      category: "AI Tools",
      readTime: "10 min read",
      imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
    },
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

  // Filter posts based on search and category
  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory =
      !selectedCategory || post.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
          <Button variant="contained" color="primary">
            Create Blog Post
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

      {/* Blog Posts Grid */}
      <Grid container spacing={3}>
        {filteredPosts.map((post) => (
          <Grid key={post.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                border: "1px solid #222",
                backgroundColor: "transparent",
                transition: "transform 0.2s ease-in-out",
                "&:hover": {
                  //   transform: "translateY(-4px)",
                  cursor: "pointer",
                },
              }}
              onClick={() => navigate(`/main/blog/${post.id}`)}
            >
              <Box
                sx={{
                  position: "relative",
                  height: "190px",
                  //   paddingTop: "56.25%", // 16:9 aspect ratio
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
              {/* <CardContent sx={{ flexGrow: 1, p: 3 }}> */}
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
                  label={post.readTime}
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
                  src={`https://source.unsplash.com/random/100x100/?portrait,${post.id}`}
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
