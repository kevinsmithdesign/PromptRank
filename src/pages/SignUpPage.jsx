// import React from "react";

// const SignUpPage = () => {
//   return <>Sign Up Page</>;
// };

// export default SignUpPage;

// src/pages/SignUpPage.js
import React from "react";
import { Container, Box } from "@mui/material";
import { SignUp } from "../components/SignUp";
import Grid from "@mui/material/Grid2";

export default function SignUpPage() {
  return (
    <Container>
      <Grid container spacing={12} mt={4}>
        <Grid
          size={5}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <SignUp />
        </Grid>
        <Grid size={7}>
          <Box
            sx={{
              background: "#eee",
              height: "400px",
              width: "100%",
              borderRadius: 4,
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
