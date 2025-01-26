import React from "react";
import { Container, Box, Typography, Button, Stack, Card } from "@mui/material";
import Grid from "@mui/material/Grid2";

const AiToolsPage = () => {
  const apps = [
    {
      title: "ChatGPT",
      subTitle: "Conversational AI Assistant",
      description:
        "OpenAI's widely-used language model that excels at natural conversations, writing assistance, coding help, and creative tasks. Available in free and Plus versions with GPT-3.5 and GPT-4 capabilities.",
    },
    {
      title: "Claude",
      subTitle: "Advanced AI Analysis & Writing",
      description:
        "Anthropic's AI assistant known for nuanced analysis, research synthesis, and technical writing. Offers strong capabilities in coding, math, and handling complex professional tasks.",
    },
    {
      title: "Gemini",
      subTitle: "Multimodal AI Platform",
      description:
        "Google's AI system that combines text, image, and code understanding. Offers different versions for various needs, from quick responses to complex problem-solving.",
    },
    {
      title: "You.com",
      subTitle: "AI-Powered Search Engine",
      description:
        "Search platform that integrates AI to provide summarized results, coding assistance, and creative tools. Features a chat interface and specialized modes for different tasks.",
    },
    {
      title: "Bolt",
      subTitle: "AI Development Assistant",
      description:
        "Specialized tool for software developers that helps with code generation, debugging, and technical documentation. Integrates with popular IDEs and development workflows.",
    },
    {
      title: "Glide",
      subTitle: "No-Code App Builder with AI",
      description:
        "Platform that combines AI capabilities with no-code development tools to help users create web and mobile applications without programming experience.",
    },
    {
      title: "MidJourney",
      subTitle: "AI Image Generation",
      description:
        "Advanced text-to-image generation tool known for creating highly artistic and detailed visuals. Popular among designers and artists for conceptual art and illustrations.",
    },
    {
      title: "Lovable",
      subTitle: "AI Customer Service Platform",
      description:
        "AI-powered platform for customer support automation, featuring natural language understanding, ticket routing, and personalized response generation.",
    },
    {
      title: "DALL-E 3",
      subTitle: "Advanced Image Generation",
      description:
        "OpenAI's latest image generation model known for photorealistic outputs and accurate interpretation of complex prompts. Excels at following detailed artistic direction.",
    },
    {
      title: "Stable Diffusion",
      subTitle: "Open Source Image Generation",
      description:
        "Powerful open-source image generation model with a strong community. Offers flexibility through custom models, workflows, and local deployment options.",
    },
    {
      title: "Copilot",
      subTitle: "AI Programming Assistant",
      description:
        "GitHub's coding assistant that provides contextual code suggestions, documentation help, and bug detection across multiple programming languages.",
    },
    {
      title: "Claude in Slack",
      subTitle: "Team AI Assistant",
      description:
        "Anthropic's AI integrated into Slack for team collaboration, offering document analysis, writing assistance, and project support within your workspace.",
    },
    {
      title: "Perplexity AI",
      subTitle: "AI Research Assistant",
      description:
        "Research-focused AI that provides real-time information synthesis with cited sources. Excellent for academic research and fact-checking.",
    },
    {
      title: "AutoGPT",
      subTitle: "Autonomous AI Agent",
      description:
        "Experimental AI system that can execute complex tasks autonomously by breaking them into subtasks. Useful for automation and process optimization.",
    },
    {
      title: "Whisper",
      subTitle: "Speech Recognition",
      description:
        "OpenAI's speech recognition system that accurately transcribes and translates audio in multiple languages. Popular for content creation and accessibility.",
    },
    {
      title: "Jasper",
      subTitle: "AI Content Creation",
      description:
        "Marketing-focused AI platform for creating blog posts, social media content, and ad copy. Includes templates and frameworks for various content types.",
    },
    {
      title: "Cursor",
      subTitle: "AI-First Code Editor",
      description:
        "Modern code editor built around AI capabilities, offering intelligent code completion, refactoring, and explanation features for developers.",
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
      <Box sx={{ flexGrow: 1, mb: 8 }}>
        <Grid container spacing={3}>
          {apps.map(({ title, subTitle, description }) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box sx={{ px: 2 }}>
                  <Stack
                    flexDirection="row"
                    alignItems="center"
                    mb={2.5}
                    mt={1}
                    // sx={{ background: "red" }}
                  >
                    <Stack>
                      {/* <Box
                        sx={{
                          background: "#333",
                          height: "54px",
                          width: "54px",
                          mr: "16px",
                          borderRadius: "8px",
                        }}
                      ></Box> */}
                    </Stack>
                    <Stack>
                      <Typography color="#fff" variant="h6" fontWeight="bold">
                        {title}
                      </Typography>
                      <Typography color="#fff" variant="body2">
                        {subTitle}
                      </Typography>
                    </Stack>
                  </Stack>
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
