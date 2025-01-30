import React from "react";
import { Container, Box, Typography, Button, Stack, Card } from "@mui/material";
import Grid from "@mui/material/Grid2";

const AiToolsPage = () => {
  const apps = [
    {
      title: "ChatGPT",
      subTitle: "Conversational AI Assistant",
      description:
        "OpenAI's widely-used language model that excels at natural conversations, writing assistance, coding help, and creative tasks.",
      url: "https://chat.openai.com",
    },
    {
      title: "Claude",
      subTitle: "Advanced AI Analysis & Writing",
      description:
        "Anthropic's AI assistant known for nuanced analysis, research synthesis, and technical writing.",
      url: "https://www.anthropic.com",
    },
    {
      title: "Gemini",
      subTitle: "Multimodal AI Platform",
      description:
        "Google's AI system that combines text, image, and code understanding.",
      url: "https://gemini.google.com",
    },
    {
      title: "You.com",
      subTitle: "AI-Powered Search Engine",
      description:
        "Search platform that integrates AI to provide summarized results and creative tools.",
      url: "https://you.com",
    },
    {
      title: "Bolt",
      subTitle: "AI Development Assistant",
      description:
        "Specialized tool for software developers that helps with code generation, debugging, and technical documentation.",
      url: "https://boltai.com", // Placeholder, verify actual site
    },
    {
      title: "Glide",
      subTitle: "No-Code App Builder with AI",
      description:
        "Platform that combines AI capabilities with no-code development tools to help users create web and mobile applications.",
      url: "https://www.glideapps.com",
    },
    {
      title: "MidJourney",
      subTitle: "AI Image Generation",
      description:
        "Advanced text-to-image generation tool known for creating highly artistic and detailed visuals.",
      url: "https://www.midjourney.com",
    },
    {
      title: "Lovable",
      subTitle: "AI Customer Service Platform",
      description:
        "AI-powered platform for customer support automation, featuring natural language understanding and personalized response generation.",
      url: "https://www.lovable.dev",
    },
    {
      title: "DALL-E 3",
      subTitle: "Advanced Image Generation",
      description:
        "OpenAI's latest image generation model known for photorealistic outputs and accurate interpretation of complex prompts.",
      url: "https://openai.com/dall-e",
    },
    {
      title: "Stable Diffusion",
      subTitle: "Open Source Image Generation",
      description:
        "Powerful open-source image generation model with a strong community and flexible custom models.",
      url: "https://stablediffusionweb.com",
    },
    {
      title: "Copilot",
      subTitle: "AI Programming Assistant",
      description:
        "GitHub's coding assistant that provides contextual code suggestions, documentation help, and bug detection.",
      url: "https://github.com/features/copilot",
    },
    {
      title: "Claude in Slack",
      subTitle: "Team AI Assistant",
      description:
        "Anthropic's AI integrated into Slack for team collaboration, document analysis, and writing assistance.",
      url: "https://www.anthropic.com/index/slack",
    },
    {
      title: "Perplexity AI",
      subTitle: "AI Research Assistant",
      description:
        "Research-focused AI that provides real-time information synthesis with cited sources.",
      url: "https://www.perplexity.ai",
    },
    {
      title: "AutoGPT",
      subTitle: "Autonomous AI Agent",
      description:
        "Experimental AI system that can execute complex tasks autonomously by breaking them into subtasks.",
      url: "https://github.com/Torantulino/Auto-GPT",
    },
    {
      title: "Whisper",
      subTitle: "Speech Recognition",
      description:
        "OpenAI's speech recognition system that accurately transcribes and translates audio in multiple languages.",
      url: "https://openai.com/research/whisper",
    },
    {
      title: "Jasper",
      subTitle: "AI Content Creation",
      description:
        "Marketing-focused AI platform for creating blog posts, social media content, and ad copy.",
      url: "https://www.jasper.ai",
    },
    {
      title: "Cursor",
      subTitle: "AI-First Code Editor",
      description:
        "Modern code editor built around AI capabilities, offering intelligent code completion and refactoring.",
      url: "https://www.cursor.so",
    },
    {
      title: "DeepSeek",
      subTitle: "AI-Powered Search & Research",
      description:
        "DeepSeek is an advanced AI research assistant that helps users find and summarize complex topics efficiently.",
      url: "https://deepseek.com",
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
      </Box>
      <Box sx={{ flexGrow: 1, mb: 8 }}>
        <Grid container spacing={3}>
          {apps.map(({ title, subTitle, description, url }) => (
            <Grid size={{ xs: 12, md: 6, lg: 4 }}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  p: 5,
                }}
              >
                {/* Content Box: Ensures description takes up available space */}
                <Box sx={{ flexGrow: 1 }}>
                  <Stack
                    flexDirection="row"
                    alignItems="center"
                    mb={2.5}
                    mt={1}
                  >
                    <Stack>
                      <Typography color="#fff" variant="h6" fontWeight="bold">
                        {title}
                      </Typography>
                      <Typography color="#fff" variant="body2">
                        {subTitle}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Typography color="#fff" variant="body2" pb={4}>
                    {description}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  color="primary"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ mt: "auto" }}
                >
                  Visit
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default AiToolsPage;
