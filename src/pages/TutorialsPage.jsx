import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Stack,
  TextField,
  InputAdornment,
  IconButton,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchIcon from "../icons/SearchIcon";
import { useTheme } from "@mui/material/styles";

const TutorialsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const theme = useTheme();

  const categories = ["ChatGPT", "MidJourney", "Claude", "Cursor"];

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
          <TextField
            fullWidth
            placeholder="Search learning resources..."
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
          onClick={() => setSelectedCategory(null)}
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
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </Stack>
    </Container>
  );
};

export default TutorialsPage;
