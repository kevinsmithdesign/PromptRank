import React from "react";
import { Container, Box } from "@mui/material";
import { Login } from "../components/Login";
import Grid from "@mui/material/Grid2";

export default function LoginPage() {
  return (
    <Container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mx: "auto",
        height: "100vh",
        width: "100%",
      }}
    >
      <Login />
    </Container>
  );
}
