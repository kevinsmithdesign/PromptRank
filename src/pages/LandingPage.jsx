import * as React from "react";
import { Container, Box, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid2";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Container>
      <Grid container spacing={2} mt={4}>
        <Grid
          size={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4" fontWeight="bold" mb={1}>
            Main Value proposition title
          </Typography>
          <Typography variant="body1" mb={4}>
            Subtitle description explaining app and services
          </Typography>
          <Stack flexDirection="row" gap={2}>
            <Button
              variant="contained"
              onClick={() => handleNavigation("/login")}
            >
              Log In
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleNavigation("/main/prompts")}
            >
              Try Now
            </Button>
          </Stack>
        </Grid>
        <Grid size={6}>
          <Box
            sx={{
              background: "#eee",
              height: "400px",
              width: "100%",
              borderRadius: 4,
            }}
          ></Box>
        </Grid>
      </Grid>
      <Grid container spacing={2} mt={4}>
        <Grid
          size={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4" fontWeight="bold" mb={4}>
            Maybe?!?
          </Typography>
          <Typography variant="body1" mb={4}>
            Add Prompts
          </Typography>
          <Typography variant="body1" mb={4}>
            Rank Prompts
          </Typography>
          <Typography variant="body1" mb={4}>
            Learn AI Tools
          </Typography>
        </Grid>
        <Grid size={6}>
          <Box
            sx={{
              background: "#eee",
              height: "400px",
              width: "100%",
              borderRadius: 4,
            }}
          ></Box>
        </Grid>
      </Grid>
    </Container>
  );
}
