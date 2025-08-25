import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Box,
  Skeleton,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useTheme } from "@mui/material/styles";

import NoResultsMessage from "./NoResultsMessage";

const PromptCard = ({
  loading = false, // New loading prop
  filteredPrompts = [],
  searchQuery,
  selectedCategory,
  promptList = [],
  handleMenuOpen,
  handleMenuClose,
  menuAnchorEl,
  selectedPromptId,
  handleEditClick,
  handleDeleteClick,
  handleSavePrompt,
  auth,
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <>
      <Grid container spacing={3} mb={6}>
        {loading
          ? Array.from(new Array(4)).map((_, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    border: `1px solid #222`,
                    overflow: "hidden",
                  }}
                >
                  <CardContent sx={{ p: 1 }}>
                    <Stack flexDirection="row" alignItems="center" mb={2}>
                      <Skeleton variant="circular" width={24} height={24} />
                      <Skeleton variant="text" width="40%" sx={{ ml: 1 }} />
                    </Stack>
                    <Skeleton variant="text" width="30%" sx={{ mb: 1 }} />
                    <Skeleton variant="text" width="80%" />
                    <Skeleton variant="text" width="100%" />
                    <Skeleton variant="text" width="90%" sx={{ mb: 2 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : (filteredPrompts.length > 0
              ? filteredPrompts
              : !searchQuery && !selectedCategory
              ? promptList
              : []
            ).map((prompt) => (
              <Grid item xs={12} md={6} key={prompt?.id || "fallback-key"}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    cursor: "pointer",
                    position: "relative",
                    border: `1px solid #222`,
                    overflow: "hidden",
                    "&:hover": {
                      border: `1px solid ${theme.palette.primary.main}`,
                    },
                    "&::before": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      backgroundColor: theme.palette.primary.main,
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                      zIndex: 0,
                    },
                    "&:hover::before": {
                      opacity: 0.2,
                    },
                    "& > *": {
                      position: "relative",
                      zIndex: 1,
                    },
                  }}
                  onClick={() => navigate(`/main/prompts/${prompt.id}`)}
                >
                  {/* <CardContent sx={{ p: 1 }}> */}
                  <Stack flexDirection="row" alignItems="center" mb={2}>
                    <StarIcon sx={{ color: "rgb(250, 175, 0)", mr: 1 }} />
                    <Stack sx={{ flex: 1 }}>
                      <Typography>
                        {prompt.totalRatings > 0
                          ? prompt.avgRating.toFixed(1)
                          : "No ratings"}
                      </Typography>
                    </Stack>
                    {prompt.totalRatings > 0 && (
                      <Typography color="#999" fontSize="0.875rem">
                        ({prompt.totalRatings}{" "}
                        {prompt.totalRatings === 1 ? "review" : "reviews"})
                      </Typography>
                    )}
                    <Stack></Stack>
                  </Stack>
                  {prompt.category && (
                    <Typography
                      variant="body2"
                      sx={{
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        color: "#999",
                        mb: 0.5,
                      }}
                    >
                      {prompt.category}
                    </Typography>
                  )}
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="#fff"
                    mb={2}
                  >
                    {prompt?.title}
                  </Typography>
                  <Box sx={{ position: "relative" }}>
                    <Typography
                      variant="body1"
                      sx={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        mb: 1,
                        lineHeight: 1.5,
                        color: "rgba(255, 255, 255, 0.8)",
                        position: "relative",
                      }}
                    >
                      {prompt?.description}
                    </Typography>
                  </Box>
                  {/* </CardContent> */}
                </Card>
              </Grid>
            ))}
      </Grid>
      {/* No Results Message */}
      {(searchQuery || selectedCategory) && filteredPrompts.length === 0 && (
        <NoResultsMessage
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
        />
      )}
    </>
  );
};

export default PromptCard;
