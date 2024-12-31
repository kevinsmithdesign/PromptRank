import React from "react";
import { Container, Box, Typography, Button, Stack, Card } from "@mui/material";
import Grid from "@mui/material/Grid2";

const AiToolsPage = () => {
  const apps = [
    {
      title: "ChatGPT",
      subTitle: "Sub Title",
      description:
        "This is a prompt description. This is a prompt description with a longer sentence. Make it one more line. This is a prompt description. This is a prompt description with a longer sentence. Make it one more line.",
    },
    {
      title: "Claud",
      subTitle: "Sub Title",
      description:
        "This is a prompt description. This is a prompt description with a longer sentence. Make it one more line. This is a prompt description. This is a prompt description with a longer sentence. Make it one more line.",
    },
    {
      title: "Gemeni",
      subTitle: "Sub Title",
      description:
        "This is a prompt description. This is a prompt description with a longer sentence. Make it one more line. This is a prompt description. This is a prompt description with a longer sentence. Make it one more line.",
    },
    {
      title: "You.com",
      subTitle: "Sub Title",
      description:
        "This is a prompt description. This is a prompt description with a longer sentence. Make it one more line. This is a prompt description. This is a prompt description with a longer sentence. Make it one more line.",
    },
    {
      title: "Bolt",
      subTitle: "Sub Title",
      description:
        "This is a prompt description. This is a prompt description with a longer sentence. Make it one more line. This is a prompt description. This is a prompt description with a longer sentence. Make it one more line.",
    },
    {
      title: "Glide",
      subTitle: "Sub Title",
      description:
        "This is a prompt description. This is a prompt description with a longer sentence. Make it one more line. This is a prompt description. This is a prompt description with a longer sentence. Make it one more line.",
    },
    {
      title: "MidJourney",
      subTitle: "Sub Title",
      description:
        "This is a prompt description. This is a prompt description with a longer sentence. Make it one more line. This is a prompt description. This is a prompt description with a longer sentence. Make it one more line.",
    },
    {
      title: "Lovable",
      subTitle: "Sub Title",
      description:
        "This is a prompt description. This is a prompt description with a longer sentence. Make it one more line. This is a prompt description. This is a prompt description with a longer sentence. Make it one more line.",
    },
  ];

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
          AI Tools
        </Typography>
        {/* <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => setOpenDialog(true)}
      >
        Add Prompt
      </Button> */}
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {apps.map(({ title, subTitle, description }) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <Card>
                <Box sx={{ px: 2 }}>
                  <Typography color="#fff" variant="h6" fontWeight="bold">
                    {title}
                  </Typography>
                  <Typography color="#fff" variant="body2" mb={2}>
                    {subTitle}
                  </Typography>
                  <Typography color="#fff" variant="body2" pb={3}>
                    {description}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default AiToolsPage;
