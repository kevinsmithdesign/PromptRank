import React from "react";
import { Outlet } from "react-router-dom";
import { Container, Box, Typography, Button, Stack } from "@mui/material";
import Navbar from "../components/Navbar";
import PromptsPage from "./PromptsPage";

const MainPage = ({ children }) => {
  return (
    <Box>
      <Navbar />
      <Container>
        <Outlet />
      </Container>
    </Box>
  );
};

export default MainPage;
