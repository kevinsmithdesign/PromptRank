import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@mui/material";

const CompareToolsPage = () => {
  return (
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
        Compare AI Tools
      </Typography>
      <Typography component="p" variant="subtitle1" color="red">
        Update Description
      </Typography>
    </Box>
  );
};

export default CompareToolsPage;
