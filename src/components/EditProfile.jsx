import React from "react";
import Grid from "@mui/material/Grid2";
import { Typography, Card, TextField } from "@mui/material";

const EditProfile = () => {
  return (
    <>
      <Card>
        <Typography color="#fff" mb={3} variant="h5" fontWeight="bold">
          Personal Information
        </Typography>
        <Grid container spacing={4} mb={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography fontWeight="bold" mb={0.5}>
              First Name
            </Typography>
            <TextField placeholder="First Name" fullWidth required />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography fontWeight="bold" mb={0.5}>
              Last Name
            </Typography>
            <TextField placeholder="Last Name" fullWidth required />
          </Grid>
        </Grid>
        <Grid container spacing={4} mb={4}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography fontWeight="bold" mb={0.5}>
              Email
            </Typography>
            <TextField placeholder="Last Name" fullWidth required />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography fontWeight="bold" mb={0.5}>
              Phone
            </Typography>
            <TextField placeholder="Last Name" fullWidth required />
          </Grid>
        </Grid>
        <Grid container spacing={4} mb={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography fontWeight="bold" mb={0.5}>
              Username
            </Typography>
            <TextField placeholder="Username" fullWidth required />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}></Grid>
        </Grid>
      </Card>
    </>
  );
};

export default EditProfile;
