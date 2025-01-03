import * as React from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid2";
import Navbar from "../components/Navbar";

export default function LandingPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <>
      <Navbar />
      <Container>
        <Grid container spacing={8} mb={12}>
          <Grid
            size={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h2" fontWeight="bold" mb={4}>
              Elevate Your Prompt Game
            </Typography>
            <Typography variant="h6" mb={6} color="#999">
              {/* Master the art of prompt engineering with Prompt Rank. */}
              Master the art of prompt engineering with Prompt Rank. Explore and
              test prompts across diverse categories, rank your favorites, and
              add your own. Build collections, share results across LLMs, and
              connect with a community of enthusiasts dedicated to perfecting
              their skills.
            </Typography>
            <Stack flexDirection="row" gap={3} mb={2}>
              <Button
                variant="contained"
                onClick={() => handleNavigation("/signup")}
                sx={{ px: 6 }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleNavigation("/main/prompts")}
                sx={{ px: 6 }}
              >
                Try As Guest
              </Button>
            </Stack>
            <Stack flexDirection="row" gap={0.5}>
              <Typography variant="body2">Already have an account?</Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#9a9a9a",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/login")}
              >
                login
              </Typography>
            </Stack>
          </Grid>
          <Grid size={6}>
            <Box
              sx={{
                background: "#333",
                height: "600px",
                width: "100%",
                borderRadius: 3,
              }}
            ></Box>
          </Grid>
        </Grid>

        <Grid container spacing={8} mb={12}>
          <Grid
            size={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h2" fontWeight="bold" mb={4}>
              Test & Discover Unique Prompts
            </Typography>
            <Typography variant="h6" color="#999">
              Unlock a world of creativity by exploring a wide range of prompts
              designed to challenge your skills. Test prompts across various
              categories to see how they perform, refine them, and discover new
              ways to optimize your approach.
            </Typography>
          </Grid>
          <Grid size={6}>
            <Box
              sx={{
                background: "#333",
                height: "600px",
                width: "100%",
                borderRadius: 3,
              }}
            ></Box>
          </Grid>
        </Grid>

        <Grid container spacing={8} mb={12}>
          <Grid
            size={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h2" fontWeight="bold" mb={4}>
              Create & Contribute
            </Typography>
            <Typography variant="h6" color="#999">
              Unleash your creativity by crafting and sharing your own prompts.
              Contribute to the growing library of ideas, gather feedback from
              the community, and watch your prompts spark inspiration in others.
              Every contribution helps shape the future of prompt engineering.
            </Typography>
          </Grid>
          <Grid size={6}>
            <Box
              sx={{
                background: "#333",
                height: "600px",
                width: "100%",
                borderRadius: 3,
              }}
            ></Box>
          </Grid>
        </Grid>

        <Grid container spacing={8} mb={12}>
          <Grid
            size={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h2" fontWeight="bold" mb={4}>
              Rank & Share Prompts
            </Typography>
            <Typography variant="h6" color="#999">
              Help identify the best prompts by ranking them and sharing your
              insights with the community. Explore what others are rating
              highly, discover trends, and contribute to a growing library of
              top-performing prompts.
            </Typography>
          </Grid>
          <Grid size={6}>
            <Box
              sx={{
                background: "#333",
                height: "600px",
                width: "100%",
                borderRadius: 3,
              }}
            ></Box>
          </Grid>
        </Grid>

        <Grid container spacing={8} mb={12}>
          <Grid
            size={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h2" fontWeight="bold" mb={4}>
              Organize Collections
            </Typography>
            <Typography variant="h6" color="#999">
              Easily create and organize collections of your favorite prompts.
              Save the prompts that work best for you, group them by category or
              purpose, and share your collections with the community to inspire
              others. Keep everything you need at your fingertips for quick
              access.
            </Typography>
          </Grid>
          <Grid size={6}>
            <Box
              sx={{
                background: "#333",
                height: "600px",
                width: "100%",
                borderRadius: 3,
              }}
            ></Box>
          </Grid>
        </Grid>

        <Grid container spacing={8} mb={12}>
          <Grid
            size={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h2" fontWeight="bold" mb={4}>
              Master AI Tools
              <br /> & Techniques
            </Typography>
            <Typography variant="h6" color="#999">
              Gain deeper insights into how prompts perform across advanced AI
              models. With Prompt Rank, you can explore results from different
              LLMs, analyze patterns, and refine your techniques to master
              AI-driven tools. Bridge the gap between creativity and precision
              as you sharpen your expertise in prompt engineering.
            </Typography>
          </Grid>
          <Grid size={6}>
            <Box
              sx={{
                background: "#333",
                height: "600px",
                width: "100%",
                borderRadius: 3,
              }}
            ></Box>
          </Grid>
        </Grid>

        <Grid container spacing={8} mb={12}>
          <Grid
            size={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Typography variant="h2" fontWeight="bold" mb={4}>
              Community and Collaboration
            </Typography>
            <Typography variant="h6" color="#999">
              Join a thriving community of prompt engineering enthusiasts who
              are eager to share ideas, offer feedback, and collaborate. Whether
              you’re refining your skills or discovering new techniques, the
              community is here to inspire and support your journey. Build
              connections, exchange tips, and grow alongside others passionate
              about mastering AI tools and prompt engineering.
            </Typography>
          </Grid>
          <Grid size={6}>
            <Box
              sx={{
                background: "#333",
                height: "600px",
                width: "100%",
                borderRadius: 3,
              }}
            ></Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
