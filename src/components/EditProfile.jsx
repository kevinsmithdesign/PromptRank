import React from "react";
import Grid from "@mui/material/Grid2";
import {
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  Rating,
  Button,
  Alert,
  Box,
  TextField,
} from "@mui/material";

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
            <TextField
              placeholder="First Name"
              fullWidth
              required
              // value={newPromptTitle}
              // onChange={(e) => setNewPromptTitle(e.target.value)}
              // error={!!addFormErrors.title}
              // helperText={addFormErrors.title}
              // FormHelperTextProps={{
              //   sx: { color: "error.main" },
              // }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography fontWeight="bold" mb={0.5}>
              Last Name
            </Typography>
            <TextField
              placeholder="Last Name"
              fullWidth
              required
              // value={newPromptTitle}
              // onChange={(e) => setNewPromptTitle(e.target.value)}
              // error={!!addFormErrors.title}
              // helperText={addFormErrors.title}
              // FormHelperTextProps={{
              //   sx: { color: "error.main" },
              // }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={4} mb={4}>
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography fontWeight="bold" mb={0.5}>
              Email
            </Typography>
            <TextField
              placeholder="Last Name"
              fullWidth
              required
              // value={newPromptTitle}
              // onChange={(e) => setNewPromptTitle(e.target.value)}
              // error={!!addFormErrors.title}
              // helperText={addFormErrors.title}
              // FormHelperTextProps={{
              //   sx: { color: "error.main" },
              // }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography fontWeight="bold" mb={0.5}>
              Phone
            </Typography>
            <TextField
              placeholder="Last Name"
              fullWidth
              required
              // value={newPromptTitle}
              // onChange={(e) => setNewPromptTitle(e.target.value)}
              // error={!!addFormErrors.title}
              // helperText={addFormErrors.title}
              // FormHelperTextProps={{
              //   sx: { color: "error.main" },
              // }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={4} mb={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography fontWeight="bold" mb={0.5}>
              Username
            </Typography>
            <TextField
              placeholder="Username"
              fullWidth
              required
              // value={newPromptTitle}
              // onChange={(e) => setNewPromptTitle(e.target.value)}
              // error={!!addFormErrors.title}
              // helperText={addFormErrors.title}
              // FormHelperTextProps={{
              //   sx: { color: "error.main" },
              // }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}></Grid>
        </Grid>
      </Card>
    </>
  );
};

export default EditProfile;
