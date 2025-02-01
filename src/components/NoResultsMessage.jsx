import { Typography, Box } from "@mui/material";

const NoResultsMessage = ({ searchQuery, selectedCategory }) => {
  if (!searchQuery && !selectedCategory) return null;

  let message = "No prompts found";
  if (selectedCategory && searchQuery) {
    message += ` in category "${selectedCategory}" matching "${searchQuery}"`;
  } else if (selectedCategory) {
    message += ` in category "${selectedCategory}"`;
  } else if (searchQuery) {
    message += ` matching "${searchQuery}"`;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "200px",
        width: "100%",
        gap: 2,
      }}
    >
      <Typography variant="h6" color="white">
        {message}
      </Typography>
    </Box>
  );
};

export default NoResultsMessage;
