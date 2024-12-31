import React from "react";
import { Container, Box, Typography, Button, Stack, Card } from "@mui/material";
import Grid from "@mui/material/Grid2";

const ProfilePage = () => {
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
          Profile
        </Typography>
        {/* <Button
    variant="contained"
    startIcon={<AddIcon />}
    onClick={() => setOpenDialog(true)}
  >
    Add Prompt
  </Button> */}
      </Box>
      {/* <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card>test</Card>{" "}
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card>test</Card>{" "}
        </Grid>
      </Grid> */}
      <Card sx={{ mb: 3 }}>
        <Box>Profile Img</Box>
        <Box>Profile Name</Box>
        <Box>Profile Username</Box>
        <Box>How many you've Rated</Box>
        <Box>Ratings Overview</Box>
        <Box>Reviews</Box>
        <Box>Followers</Box>
        <Box>Following</Box>
        <Box>Edit Profile Button</Box>
      </Card>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Prompt Collection
        </Typography>
      </Box>
    </>
  );
};

export default ProfilePage;
