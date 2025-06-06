import React, { useState } from "react";
import { HelmetProvider, Helmet } from "react-helmet-async";
import {
  Container,
  Box,
  Typography,
  Button,
  Stack,
  Card,
  Breadcrumbs,
  Link,
  TextField,
  InputAdornment,
  IconButton,
  Alert,
  AlertTitle,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import SearchIcon from "../icons/SearchIcon";
import FilterIcon from "../icons/FilterIcon";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import ChatGptIcon from "../icons/AiToolIcons/ChatGptIcon";
import ClaudeIcon from "../icons/AiToolIcons/ClaudeIcon";
import DeepSeekIcon from "../icons/AiToolIcons/DeepSeek";
import GemeniIcon from "../icons/AiToolIcons/GemeniIcon";
import LlamaIcon from "../icons/AiToolIcons/LlamaIcon";
import GrokIcon from "../icons/AiToolIcons/GrokIcon";
import MidJourneyIcon from "../icons/AiToolIcons/MidJourneyIcon";
import CopilotIcon from "../icons/AiToolIcons/CopilotIcon";
import BoltIcon from "../icons/AiToolIcons/BlotIcon";
import WindsurfIcon from "../icons/AiToolIcons/WindsurfIcon";
import PreplexityIcon from "../icons/AiToolIcons/PreplexityIcon";
import JasperIcon from "../icons/AiToolIcons/JasperIcon";
import CursorIcon from "../icons/AiToolIcons/CursorIcon";
import ReaddyIcon from "../icons/AiToolIcons/ReaddyIcon";
import LovableIcon from "../icons/AiToolIcons/LovableIcon";

const AiToolsPage = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeTab, setActiveTab] = useState("view tools");

  const categories = [
    "Text Generation",
    "Image Generation",
    "Video Generation",
    "Code Assistant",
    "Research",
    "Productivity",
  ];

  const apps = [
    {
      title: "ChatGPT",
      subTitle: "Conversational AI Assistant",
      description:
        "OpenAI's widely-used language model that excels at natural conversations, writing assistance, coding help, and creative tasks.",
      url: "https://chat.openai.com",
      provider: "OpenAI",
      category: "Text Generation",
      features: [
        "Natural Language Processing",
        "Code Generation",
        "Content Creation",
        "Task Automation",
      ],
      pricing: "Freemium",
      rating: 4.8,
      releaseDate: "2022-11-30",
      operatingSystem: "Web-based",
      // bgColor: "#10A37F",
      logo: <ChatGptIcon />,
    },
    {
      title: "Claude",
      subTitle: "Advanced AI Analysis & Writing",
      description:
        "Anthropic's AI assistant known for nuanced analysis, research synthesis, and technical writing.",
      url: "https://www.anthropic.com",
      provider: "Anthropic",
      category: "Text Generation",
      features: [
        "Analysis",
        "Research",
        "Technical Writing",
        "Code Understanding",
      ],
      pricing: "Freemium",
      rating: 4.7,
      releaseDate: "2023-03-14",
      operatingSystem: "Web-based",
      logo: <ClaudeIcon />,
    },
    {
      title: "DeepSeek",
      subTitle: "AI-Powered Search & Research",
      description:
        "DeepSeek is an advanced AI research assistant that helps users find and summarize complex topics efficiently.",
      url: "https://deepseek.com",
      provider: "DeepSeek",
      category: "Research",
      features: [
        "Information Synthesis",
        "Topic Research",
        "Content Summarization",
      ],
      pricing: "Free",
      rating: 4.5,
      releaseDate: "2023-09-01",
      operatingSystem: "Web-based",
      logo: <DeepSeekIcon />,
    },
    {
      title: "Gemini",
      subTitle: "Multimodal AI Platform",
      description:
        "Google's AI system that combines text, image, and code understanding.",
      url: "https://gemini.google.com",
      provider: "Google",
      category: "Image Generation",
      features: ["Text Analysis", "Image Understanding", "Code Generation"],
      pricing: "Freemium",
      rating: 4.6,
      releaseDate: "2023-12-06",
      operatingSystem: "Cross-platform",
      logo: <GemeniIcon />,
    },
    {
      title: "Llama",
      subTitle: "Open Source Language Model",
      description:
        "Meta's open-source language model for researchers and developers, optimized for efficient deployment and customization.",
      url: "https://ai.meta.com/llama/",
      provider: "Meta",
      category: "Text Generation",
      features: [
        "Open Source Development",
        "Research Applications",
        "Multiple Model Sizes",
        "Multi-language Support",
      ],
      pricing: "Free",
      rating: 4.6,
      releaseDate: "2023-07-18",
      operatingSystem: "Cross-platform",
      logo: <LlamaIcon />,
    },
    {
      title: "Grok",
      subTitle: "Real-time AI Assistant",
      description:
        "xAI's conversational model trained on X platform data, known for real-time knowledge and witty interactions.",
      url: "https://grok.x.ai",
      provider: "xAI",
      category: "Text Generation",
      features: [
        "Real-time Knowledge",
        "Conversational AI",
        "Current Events Analysis",
        "Personality-driven Responses",
      ],
      pricing: "Paid",
      rating: 4.4,
      releaseDate: "2023-11-04",
      operatingSystem: "Web-based",
      logo: <GrokIcon />,
    },
    {
      title: "MidJourney",
      subTitle: "AI Image Generation",
      description:
        "Advanced text-to-image generation tool known for creating highly artistic and detailed visuals.",
      url: "https://www.midjourney.com",
      provider: "Midjourney",
      category: "Image Generation",
      features: ["Text-to-Image", "Art Generation", "Visual Design"],
      pricing: "Paid",
      rating: 4.9,
      releaseDate: "2022-07-12",
      operatingSystem: "Web-based",
      logo: <MidJourneyIcon />,
    },
    {
      title: "DALL-E 3",
      subTitle: "Advanced Image Generation",
      description:
        "OpenAI's latest image generation model known for photorealistic outputs and accurate interpretation of complex prompts.",
      url: "https://openai.com/dall-e",
      provider: "OpenAI",
      category: "Image Generation",
      features: ["Photorealistic Images", "Art Generation", "Design Creation"],
      pricing: "Paid",
      rating: 4.8,
      releaseDate: "2023-10-03",
      operatingSystem: "Web-based",
      logo: <ChatGptIcon />,
    },
    // {
    //   title: "Stable Diffusion",
    //   subTitle: "Open Source Image Generation",
    //   description:
    //     "Powerful open-source image generation model with a strong community and flexible custom models.",
    //   url: "https://stablediffusionweb.com",
    //   provider: "Stability AI",
    //   category: "Image Generation",
    //   features: ["Open Source", "Custom Models", "Community Support"],
    //   pricing: "Free",
    //   rating: 4.7,
    //   releaseDate: "2022-08-22",
    //   operatingSystem: "Cross-platform",
    // },
    {
      title: "Copilot",
      subTitle: "AI Programming Assistant",
      description:
        "GitHub's coding assistant that provides contextual code suggestions, documentation help, and bug detection.",
      url: "https://github.com/features/copilot",
      provider: "GitHub",
      category: "Code Assistant",
      features: ["Code Completion", "Documentation", "Bug Detection"],
      pricing: "Paid",
      rating: 4.8,
      releaseDate: "2023-06-21",
      operatingSystem: "Cross-platform",
      logo: <CopilotIcon />,
    },
    {
      title: "Lovable",
      subTitle: "AI-Powered Full-Stack App Builder",
      description:
        "Lovable helps users turn natural language prompts into full-stack apps, including UI, logic, and integrations, all in one place.",
      url: "https://lovable.dev",
      provider: "Lovable",
      category: "App Builder",
      features: [
        "Natural Language to App",
        "Full-Stack Development",
        "Figma Integration",
        "Built-in Authentication",
        "Stripe Payments Integration",
      ],
      pricing: "Freemium",
      rating: 4.6,
      releaseDate: "2024-02-01",
      operatingSystem: "Web-based",
      // bgColor: "#222",
      logo: <LovableIcon />,
    },
    {
      title: "Bolt.new",
      subTitle: "AI-Powered Web App Builder",
      description:
        "Bolt lets users create full-stack apps fast using simple prompts, handling setup, code generation, and deployment with ease.",
      url: "https://bolt.new",
      provider: "Bolt",
      category: "App Builder",
      features: [
        "Prompt-Based App Generation",
        "Full-Stack Code Generation",
        "Web and Mobile App Support",
        "Rapid Prototyping",
      ],
      pricing: "Freemium",
      rating: 4.5,
      releaseDate: "2024-03-15",
      operatingSystem: "Web-based",
      logo: <BoltIcon />,
    },
    {
      title: "Windsurf",
      subTitle: "AI-Powered Code Editor",
      description:
        "Windsurf is a modern IDE with built-in AI that assists with coding, understands large codebases, and boosts dev productivity.",
      url: "https://windsurf.com",
      provider: "Windsurf",
      category: "Code Assistant",
      features: [
        "AI Agentic IDE",
        "Real-Time Code Suggestions",
        "Deep Codebase Understanding",
        "Cross-Platform Support",
      ],
      pricing: "Free",
      rating: 4.7,
      releaseDate: "2023-11-20",
      operatingSystem: "Cross-platform",
      logo: <WindsurfIcon />,
    },
    // {
    //   title: "Claude in Slack",
    //   subTitle: "Team AI Assistant",
    //   description:
    //     "Anthropic's AI integrated into Slack for team collaboration, document analysis, and writing assistance.",
    //   url: "https://www.anthropic.com/index/slack",
    //   provider: "Anthropic",
    //   category: "Text Generation",
    //   features: ["Team Integration", "Document Analysis", "Writing Assistance"],
    //   pricing: "Paid",
    //   rating: 4.6,
    //   releaseDate: "2023-07-11",
    //   operatingSystem: "Web-based",
    // },
    {
      title: "Perplexity",
      subTitle: "AI Research Assistant",
      description:
        "Research-focused AI that provides real-time information synthesis with cited sources.",
      url: "https://www.perplexity.ai",
      provider: "Perplexity AI",
      category: "Research",
      features: [
        "Real-time Research",
        "Citation Support",
        "Information Synthesis",
      ],
      pricing: "Freemium",
      rating: 4.5,
      releaseDate: "2023-04-18",
      operatingSystem: "Web-based",
      logo: <PreplexityIcon />,
    },
    // {
    //   title: "AutoGPT",
    //   subTitle: "Autonomous AI Agent",
    //   description:
    //     "Experimental AI system that can execute complex tasks autonomously by breaking them into subtasks.",
    //   url: "https://github.com/Torantulino/Auto-GPT",
    //   provider: "Open Source",
    //   category: "Text Generation",
    //   features: [
    //     "Task Automation",
    //     "Autonomous Operation",
    //     "Complex Problem Solving",
    //   ],
    //   pricing: "Free",
    //   rating: 4.3,
    //   releaseDate: "2023-04-07",
    //   operatingSystem: "Cross-platform",
    // },
    // {
    //   title: "Whisper",
    //   subTitle: "Speech Recognition",
    //   description:
    //     "OpenAI's speech recognition system that accurately transcribes and translates audio in multiple languages.",
    //   url: "https://openai.com/research/whisper",
    //   provider: "OpenAI",
    //   category: "Text Generation",
    //   features: ["Transcription", "Translation", "Multi-language Support"],
    //   pricing: "Open Source",
    //   rating: 4.7,
    //   releaseDate: "2022-09-21",
    //   operatingSystem: "Cross-platform",
    // },
    {
      title: "Jasper",
      subTitle: "AI Content Creation",
      description:
        "Marketing-focused AI platform for creating blog posts, social media content, and ad copy.",
      url: "https://www.jasper.ai",
      provider: "Jasper AI",
      category: "Text Generation",
      features: ["Marketing Copy", "Blog Writing", "Social Media Content"],
      pricing: "Paid",
      rating: 4.6,
      releaseDate: "2021-01-01",
      operatingSystem: "Web-based",
      logo: <JasperIcon />,
    },
    {
      title: "Cursor",
      subTitle: "AI-First Code Editor",
      description:
        "Modern code editor built around AI capabilities, offering intelligent code completion and refactoring.",
      url: "https://www.cursor.so",
      provider: "Cursor",
      category: "Code Assistant",
      features: ["Code Completion", "Refactoring", "AI Assistance"],
      pricing: "Free",
      rating: 4.5,
      releaseDate: "2023-02-07",
      operatingSystem: "Desktop",
      logo: <CursorIcon />,
    },
    {
      title: "Readdy",
      subTitle: "AI Design Generator",
      description:
        "AI-powered platform that transforms ideas into beautiful design with code in seconds, helping users create designs through advanced AI technology.",
      url: "https://readdy.ai",
      provider: "Readdy",
      category: "Image Generation",
      features: ["Design Generation", "Code Export", "AI Design Assistant"],
      pricing: "Freemium",
      rating: 4.4,
      releaseDate: "2023-08-15",
      operatingSystem: "Web-based",
      logo: <ReaddyIcon />,
    },
    {
      title: "Aura",
      subTitle: "AI Design Generator",
      description:
        "AI-powered design platform that creates beautiful designs in seconds and exports to HTML or Figma. Generate professional UI designs, layouts, and components through simple prompts.",
      url: "https://aurachat.io",
      provider: "Aura",
      category: "Design Generation",
      features: [
        "Design Generation",
        "HTML Export",
        "Figma Export",
        "Prompt Builder",
        "UI Components",
      ],
      pricing: "Freemium",
      rating: 4.3,
      releaseDate: "2024-01-20",
      operatingSystem: "Web-based",
      logo: "", // find logo
    },
  ];

  const filteredApps = apps.filter(
    (app) =>
      (selectedCategory ? app.category === selectedCategory : true) &&
      app.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // SEO Configuration
  const seoConfig = {
    title: "Top AI Tools & Applications Directory 2024 | Comprehensive Guide",
    description:
      "Explore our curated directory of cutting-edge AI tools including ChatGPT, Claude, Gemini, and more. Compare features, capabilities, and find the perfect AI solution for your needs.",
    siteUrl: "https://yoursite.com",
    imageUrl: "https://yoursite.com/ai-tools-directory.jpg",
  };

  // Structured data for rich results
  // Update the structuredData to include more available fields:
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: apps.map((app, index) => ({
      "@type": "SoftwareApplication",
      position: index + 1,
      name: app.title,
      description: app.description,
      applicationCategory: app.category,
      url: app.url,
      provider: {
        "@type": "Organization",
        name: app.provider,
      },
      offers: {
        "@type": "Offer",
        price: app.pricing === "Free" ? "0" : null,
        priceCurrency: "USD",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: app.rating,
        bestRating: "5",
        worstRating: "1",
        ratingCount: "100", // You might want to track actual ratings
      },
      operatingSystem: app.operatingSystem,
      datePublished: app.releaseDate,
    })),
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Your Company Name",
    url: seoConfig.siteUrl,
    logo: seoConfig.imageUrl,
    sameAs: [
      "https://twitter.com/yourcompany",
      "https://linkedin.com/company/yourcompany",
    ],
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: seoConfig.siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "AI Tools Directory",
        item: `${seoConfig.siteUrl}/ai-tools`,
      },
    ],
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "collections") {
      setCollectionsPage(1);
    } else {
      setPromptsPage(1);
    }
  };

  return (
    <HelmetProvider>
      <>
        <Helmet>
          {/* Primary Meta Tags */}
          <title>{seoConfig.title}</title>
          <meta name="description" content={seoConfig.description} />
          <meta
            name="keywords"
            content="AI tools, artificial intelligence, ChatGPT, Claude, Gemini, machine learning, AI applications, image generation, coding assistant"
          />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content={`${seoConfig.siteUrl}/ai-tools`} />
          <meta property="og:title" content={seoConfig.title} />
          <meta property="og:description" content={seoConfig.description} />
          <meta property="og:image" content={seoConfig.imageUrl} />
          <meta property="og:site_name" content="Your Site Name" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content={`${seoConfig.siteUrl}/ai-tools`} />
          <meta name="twitter:title" content={seoConfig.title} />
          <meta name="twitter:description" content={seoConfig.description} />
          <meta name="twitter:image" content={seoConfig.imageUrl} />

          {/* Additional SEO tags */}
          <meta
            name="robots"
            content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
          />
          <meta name="googlebot" content="index, follow" />
          <link rel="canonical" href={`${seoConfig.siteUrl}/ai-tools`} />

          {/* Language and Locale */}
          <meta property="og:locale" content="en_US" />
          <link
            rel="alternate"
            href={`${seoConfig.siteUrl}/ai-tools`}
            hrefLang="x-default"
          />
          <link
            rel="alternate"
            href={`${seoConfig.siteUrl}/ai-tools`}
            hrefLang="en"
          />

          {/* Structured Data */}
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(organizationSchema)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbSchema)}
          </script>
        </Helmet>

        <>
          {/* <Container> */}
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
              AI Tools Directory
            </Typography>
            <Typography component="p" variant="subtitle1" color="white">
              Discover and compare the latest artificial intelligence tools and
              applications.
            </Typography>
          </Box>

          {/* Search Section */}
          {/* <Stack flexDirection="row" mb={3}> */}
          <Grid container mb={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                placeholder="Search AI tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton edge="start" disabled>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  ".MuiOutlinedInput-root input": {
                    paddingLeft: 0,
                  },
                  "& .MuiInputBase-input": {
                    paddingLeft: 0,
                  },
                  "& .MuiInputAdornment-positionStart": {
                    marginRight: 0,
                  },
                  mr: 2,
                }}
              />
            </Grid>
            <Grid
              display="flex"
              justifyContent={{ md: "flex-end" }}
              size={{ xs: 12, md: 6 }}
            >
              {/* <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/main/compare-tools")}
              >
                Compare Tools
              </Button> */}

              {/* Tabs */}
              <Box
                sx={{
                  // background: "#222",
                  display: "flex",
                  // width: "267px",

                  // p: 2,
                  borderRadius: "32px",
                  mt: { xs: 2, mt: 0 },
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    color: activeTab === "view tools" ? "white" : "#444",
                    fontWeight: "bold",
                    // fontWeight: activeTab === "view tools" ? "bold" : "normal",
                    background:
                      activeTab === "view tools"
                        ? theme.palette.primary.main
                        : "transparent",
                    py: 2,
                    px: 3,
                    borderRadius: "32px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleTabChange("view tools")}
                >
                  View Tools
                </Box>
                <Box
                  sx={{
                    color: activeTab === "compare tools" ? "white" : "#444",
                    fontWeight: "bold",
                    // fontWeight:
                    //   activeTab === "compare tools" ? "bold" : "normal",
                    background:
                      activeTab === "compare tools"
                        ? theme.palette.primary.main
                        : "transparent",
                    py: 2,
                    px: 3,
                    borderRadius: "32px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleTabChange("compare tools")}
                >
                  Compare Tools
                </Box>
              </Box>
            </Grid>
          </Grid>
          {/* </Stack> */}

          {/* Category Buttons */}
          <Stack
            flexDirection="row"
            gap={1}
            mb={6}
            sx={{
              overflowX: "auto",
              scrollbarWidth: "none",
              cursor: "grab",
              "&:active": { cursor: "grabbing" },
              "&::-webkit-scrollbar": { display: "none" },
            }}
            role="tablist"
            aria-label="AI tool categories"
          >
            <Button
              role="tab"
              aria-selected={!selectedCategory}
              sx={{
                background: !selectedCategory
                  ? theme.palette.primary.main
                  : "#222",
                padding: "16px 24px",
                borderRadius: "32px",
                color: "white",
                fontWeight: "bold",
                flexShrink: 0,
                whiteSpace: "nowrap",
                "&:hover": {
                  background: !selectedCategory
                    ? theme.palette.primary.dark
                    : "rgba(255, 255, 255, 0.1)",
                },
              }}
              onClick={() => setSelectedCategory(null)}
            >
              View All
            </Button>

            {categories.map((category) => (
              <Button
                key={category}
                role="tab"
                aria-selected={selectedCategory === category}
                sx={{
                  background:
                    selectedCategory === category
                      ? theme.palette.primary.main
                      : "#111",
                  padding: "16px 24px",
                  borderRadius: "32px",
                  color: "white",
                  fontWeight: "bold",
                  flexShrink: 0,
                  whiteSpace: "nowrap",
                  "&:hover": {
                    background:
                      selectedCategory === category
                        ? theme.palette.primary.dark
                        : "rgba(255, 255, 255, 0.1)",
                  },
                }}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </Stack>

          {activeTab === "view tools" && (
            <Box sx={{ flexGrow: 1, mb: 8 }}>
              <Grid
                container
                spacing={3}
                component="section"
                aria-label="AI Tools Grid"
              >
                {filteredApps.map(
                  ({ title, subTitle, description, url, bgColor, logo }) => (
                    <Grid key={title} size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                      <Card
                        component="article"
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          p: 5,
                          border: `1px solid #222`,
                        }}
                      >
                        <Box sx={{ flexGrow: 1 }}>
                          <Stack flexDirection="row">
                            <Box
                              sx={{
                                background: bgColor,
                                height: "52px",
                                width: "52px",
                                borderRadius: "8px",
                                mr: 2,
                              }}
                            >
                              {logo}
                            </Box>
                            <Stack
                              flexDirection="row"
                              alignItems="center"
                              mb={2}
                            >
                              <Stack>
                                <Typography
                                  component="h2"
                                  color="#fff"
                                  variant="h6"
                                  fontWeight="bold"
                                >
                                  {title}
                                </Typography>
                                <Typography color="#fff" variant="body2">
                                  {subTitle}
                                </Typography>
                              </Stack>
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
                          sx={{
                            mt: "auto",
                          }}
                          aria-label={`Visit ${title} website`}
                        >
                          Visit Website
                        </Button>
                      </Card>
                    </Grid>
                  )
                )}
              </Grid>
            </Box>
          )}
          {activeTab === "compare tools" && (
            <Box sx={{ mt: 4, mb: 8 }}>
              <Alert
                severity="info"
                variant="outlined"
                sx={{
                  borderColor: theme.palette.primary.main,
                  p: 4,
                  "& .MuiAlert-icon": {
                    color: theme.palette.primary.main,
                  },
                  backgroundColor: "rgba(0, 127, 255, 0.05)",
                  "& .MuiAlert-message": {
                    color: "rgba(255, 255, 255, 0.9)",
                  },
                  "& ul": {
                    color: "rgba(255, 255, 255, 0.7)",
                    "& li": {
                      marginBottom: "4px",
                    },
                  },
                }}
              >
                <AlertTitle sx={{ fontWeight: "bold", color: "#fff" }}>
                  Coming Soon: AI Tools Comparison
                </AlertTitle>
                We're working on an advanced comparison feature that will allow
                you to:
                <ul>
                  <li>Compare AI tools side by side</li>
                  <li>Analyze features, pricing, and capabilities</li>
                  <li>Get personalized recommendations based on your needs</li>
                  <li>View detailed performance metrics and user reviews</li>
                </ul>
                Stay tuned for this exciting update!
              </Alert>
            </Box>
          )}
          {/* </Container> */}
        </>
      </>
    </HelmetProvider>
  );
};

export default AiToolsPage;
