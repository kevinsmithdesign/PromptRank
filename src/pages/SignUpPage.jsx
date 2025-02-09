import React from "react";
import { Container, Box } from "@mui/material";
import { SignUp } from "../components/SignUp";
import Grid from "@mui/material/Grid2";

export default function SignUpPage() {
  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mx: "auto",
        height: "100vh",
      }}
    >
      <SignUp />
    </Container>
  );
}
