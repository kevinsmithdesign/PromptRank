import * as React from "react";
import { Container, Box, Typography, Button, Stack } from "@mui/material";

import Grid from "@mui/material/Grid2";

export default function SignUpPage() {
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
          Sign Up Form
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
