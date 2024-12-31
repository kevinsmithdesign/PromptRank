import React from "react";
import { Container, Box, Typography, Button, Stack, Card } from "@mui/material";

const SettingsPage = () => {
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
          Settings
        </Typography>
        {/* <Button
    variant="contained"
    startIcon={<AddIcon />}
    onClick={() => setOpenDialog(true)}
  >
    Add Prompt
  </Button> */}
      </Box>
    </>
  );
};

export default SettingsPage;
