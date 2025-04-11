import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "../icons/SearchIcon";
import { useTheme } from "@mui/material/styles";
import { useQuery } from "@tanstack/react-query";

// Log all available environment variables (only in development)
console.log("Available env variables:", import.meta.env);

const fetchYouTubeVideos = async ({ queryKey }) => {
  const [_, category, searchQuery] = queryKey;

  // Debug logging for API key
  console.log("Environment check:", {
    hasKey: !!import.meta.env.VITE_YOUTUBE_API_KEY,
    keyLength: import.meta.env.VITE_YOUTUBE_API_KEY?.length,
    allEnvKeys: Object.keys(import.meta.env),
  });

  const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

  if (!API_KEY) {
    console.error("API Key missing. Environment state:", {
      mode: import.meta.env.MODE,
      isDev: import.meta.env.DEV,
      envKeys: Object.keys(import.meta.env),
    });
    throw new Error(
      "YouTube API key is missing. Please check your .env file and ensure VITE_YOUTUBE_API_KEY is set correctly."
    );
  }

  let searchTerm = searchQuery || category || "AI tutorials";
  if (category && !searchQuery) {
    searchTerm = `${category} tutorial`;
  }

  console.log("Fetching videos for:", searchTerm);

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=12&type=video&q=${encodeURIComponent(
    searchTerm
  )}&key=${API_KEY}`;

  const response = await fetch(url);
  const data = await response.json();

  if (data.error) {
    console.error("YouTube API Error:", data.error);
    throw new Error(data.error.message);
  }

  return data.items;
};

const TutorialsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const theme = useTheme();

  const categories = [
    "Prompt Engineering",
    "Writing Prompts",
    "ChatGPT",
    "MidJourney",
    "Claude",
    "Cursor",
  ];

  const {
    data: videos = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["youtube-videos", selectedCategory, searchQuery],
    queryFn: fetchYouTubeVideos,
    enabled: true,
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    cacheTime: 30 * 60 * 1000, // Keep data in cache for 30 minutes
  });

  const handleCategoryClick = (category) => {
    console.log("Category clicked:", category);
    setSelectedCategory(category);
    setSearchQuery(""); // Clear search when changing category
  };

  const handleViewAllClick = () => {
    console.log("View All clicked");
    setSelectedCategory(null);
    setSearchQuery("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search submitted:", searchQuery);
    // The query will automatically run due to queryKey changes
  };

  return (
    <Container>
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
          Tutorials
        </Typography>
        <Typography component="p" variant="subtitle1" color="white">
          Explore resources and tutorials to enhance your AI skills.
        </Typography>
      </Box>

      {/* Search Section */}
      <Grid container mb={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <form onSubmit={handleSearch}>
            <TextField
              fullWidth
              placeholder="Search learning resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton type="submit">
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
          </form>
        </Grid>
      </Grid>

      {/* Category Buttons */}
      <Stack
        flexDirection="row"
        gap={1}
        mb={6}
        sx={{
          overflowX: "auto",
          scrollbarWidth: "none",
          cursor: "grab",
          "&:active": { cursor: "grabbing" },
          "&::-webkit-scrollbar": { display: "none" },
        }}
        role="tablist"
        aria-label="Learning categories"
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
          onClick={handleViewAllClick}
        >
          View All
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
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </Button>
        ))}
      </Stack>

      {/* Videos Grid */}
      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error.message}</Typography>
      ) : videos.length > 0 ? (
        <Grid container spacing={3}>
          {videos.map((video) => (
            <Grid item xs={12} sm={6} md={4} key={video.id.videoId}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    transition: "transform 0.2s ease-in-out",
                  },
                }}
                onClick={() =>
                  window.open(
                    `https://www.youtube.com/watch?v=${video.id.videoId}`,
                    "_blank"
                  )
                }
                style={{ cursor: "pointer" }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={video.snippet.thumbnails.medium.url}
                  alt={video.snippet.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="h2"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {video.snippet.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {video.snippet.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary" textAlign="center">
          {selectedCategory
            ? `No videos found for ${selectedCategory}. Try a different category or search term.`
            : "Select a category or search for tutorials."}
        </Typography>
      )}
    </Container>
  );
};

export default TutorialsPage;
