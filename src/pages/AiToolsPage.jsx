// import React from "react";
// import { Container, Box, Typography, Button, Stack, Card } from "@mui/material";
// import Grid from "@mui/material/Grid2";

// const AiToolsPage = () => {
//   const apps = [
//     {
//       title: "ChatGPT",
//       subTitle: "Conversational AI Assistant",
//       description:
//         "OpenAI's widely-used language model that excels at natural conversations, writing assistance, coding help, and creative tasks.",
//       url: "https://chat.openai.com",
//     },
//     {
//       title: "Claude",
//       subTitle: "Advanced AI Analysis & Writing",
//       description:
//         "Anthropic's AI assistant known for nuanced analysis, research synthesis, and technical writing.",
//       url: "https://www.anthropic.com",
//     },
//     {
//       title: "DeepSeek",
//       subTitle: "AI-Powered Search & Research",
//       description:
//         "DeepSeek is an advanced AI research assistant that helps users find and summarize complex topics efficiently.",
//       url: "https://deepseek.com",
//     },
//     {
//       title: "Gemini",
//       subTitle: "Multimodal AI Platform",
//       description:
//         "Google's AI system that combines text, image, and code understanding.",
//       url: "https://gemini.google.com",
//     },
//     {
//       title: "You.com",
//       subTitle: "AI-Powered Search Engine",
//       description:
//         "Search platform that integrates AI to provide summarized results and creative tools.",
//       url: "https://you.com",
//     },
//     {
//       title: "Bolt",
//       subTitle: "AI Development Assistant",
//       description:
//         "Specialized tool for software developers that helps with code generation, debugging, and technical documentation.",
//       url: "https://boltai.com", // Placeholder, verify actual site
//     },
//     {
//       title: "Glide",
//       subTitle: "No-Code App Builder with AI",
//       description:
//         "Platform that combines AI capabilities with no-code development tools to help users create web and mobile applications.",
//       url: "https://www.glideapps.com",
//     },
//     {
//       title: "MidJourney",
//       subTitle: "AI Image Generation",
//       description:
//         "Advanced text-to-image generation tool known for creating highly artistic and detailed visuals.",
//       url: "https://www.midjourney.com",
//     },
//     {
//       title: "Lovable",
//       subTitle: "AI Customer Service Platform",
//       description:
//         "AI-powered platform for customer support automation, featuring natural language understanding and personalized response generation.",
//       url: "https://www.lovable.dev",
//     },
//     {
//       title: "DALL-E 3",
//       subTitle: "Advanced Image Generation",
//       description:
//         "OpenAI's latest image generation model known for photorealistic outputs and accurate interpretation of complex prompts.",
//       url: "https://openai.com/dall-e",
//     },
//     {
//       title: "Stable Diffusion",
//       subTitle: "Open Source Image Generation",
//       description:
//         "Powerful open-source image generation model with a strong community and flexible custom models.",
//       url: "https://stablediffusionweb.com",
//     },
//     {
//       title: "Copilot",
//       subTitle: "AI Programming Assistant",
//       description:
//         "GitHub's coding assistant that provides contextual code suggestions, documentation help, and bug detection.",
//       url: "https://github.com/features/copilot",
//     },
//     {
//       title: "Claude in Slack",
//       subTitle: "Team AI Assistant",
//       description:
//         "Anthropic's AI integrated into Slack for team collaboration, document analysis, and writing assistance.",
//       url: "https://www.anthropic.com/index/slack",
//     },
//     {
//       title: "Perplexity AI",
//       subTitle: "AI Research Assistant",
//       description:
//         "Research-focused AI that provides real-time information synthesis with cited sources.",
//       url: "https://www.perplexity.ai",
//     },
//     {
//       title: "AutoGPT",
//       subTitle: "Autonomous AI Agent",
//       description:
//         "Experimental AI system that can execute complex tasks autonomously by breaking them into subtasks.",
//       url: "https://github.com/Torantulino/Auto-GPT",
//     },
//     {
//       title: "Whisper",
//       subTitle: "Speech Recognition",
//       description:
//         "OpenAI's speech recognition system that accurately transcribes and translates audio in multiple languages.",
//       url: "https://openai.com/research/whisper",
//     },
//     {
//       title: "Jasper",
//       subTitle: "AI Content Creation",
//       description:
//         "Marketing-focused AI platform for creating blog posts, social media content, and ad copy.",
//       url: "https://www.jasper.ai",
//     },
//     {
//       title: "Cursor",
//       subTitle: "AI-First Code Editor",
//       description:
//         "Modern code editor built around AI capabilities, offering intelligent code completion and refactoring.",
//       url: "https://www.cursor.so",
//     },
//     {
//       title: "Readdy",
//       subTitle: "AI Design Generator",
//       description:
//         "AI-powered platform that transforms ideas into beautiful design with code in seconds, helping users create designs through advanced AI technology.",
//       url: "https://readdy.ai",
//     },
//   ];

//   return (
//     <>
//       <Box
//         sx={{
//           mb: 2,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "flex-end",
//         }}
//       >
//         <Typography variant="h4" fontWeight="bold">
//           AI Tools
//         </Typography>
//       </Box>
//       <Box sx={{ flexGrow: 1, mb: 8 }}>
//         <Grid container spacing={3}>
//           {apps.map(({ title, subTitle, description, url }) => (
//             <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
//               <Card
//                 sx={{
//                   height: "100%",
//                   display: "flex",
//                   flexDirection: "column",
//                   justifyContent: "space-between",
//                   p: 5,
//                 }}
//               >
//                 {/* Content Box: Ensures description takes up available space */}
//                 <Box sx={{ flexGrow: 1 }}>
//                   <Stack
//                     flexDirection="row"
//                     alignItems="center"
//                     mb={2.5}
//                     mt={1}
//                   >
//                     <Stack>
//                       <Typography color="#fff" variant="h6" fontWeight="bold">
//                         {title}
//                       </Typography>
//                       <Typography color="#fff" variant="body2">
//                         {subTitle}
//                       </Typography>
//                     </Stack>
//                   </Stack>
//                   <Typography color="#fff" variant="body2" pb={4}>
//                     {description}
//                   </Typography>
//                 </Box>

//                 <Button
//                   variant="contained"
//                   fullWidth
//                   color="primary"
//                   href={url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   sx={{ mt: "auto" }}
//                 >
//                   Visit
//                 </Button>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>
//     </>
//   );
// };

// export default AiToolsPage;

import React from "react";
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
} from "@mui/material";
import Grid from "@mui/material/Grid2";

const AiToolsPage = () => {
  const apps = [
    {
      title: "ChatGPT",
      subTitle: "Conversational AI Assistant",
      description:
        "OpenAI's widely-used language model that excels at natural conversations, writing assistance, coding help, and creative tasks.",
      url: "https://chat.openai.com",
      provider: "OpenAI",
      category: "Language Models",
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
    },
    {
      title: "Claude",
      subTitle: "Advanced AI Analysis & Writing",
      description:
        "Anthropic's AI assistant known for nuanced analysis, research synthesis, and technical writing.",
      url: "https://www.anthropic.com",
      provider: "Anthropic",
      category: "Language Models",
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
    },
    {
      title: "DeepSeek",
      subTitle: "AI-Powered Search & Research",
      description:
        "DeepSeek is an advanced AI research assistant that helps users find and summarize complex topics efficiently.",
      url: "https://deepseek.com",
      provider: "DeepSeek",
      category: "Research Tools",
      features: [
        "Information Synthesis",
        "Topic Research",
        "Content Summarization",
      ],
      pricing: "Free",
      rating: 4.5,
      releaseDate: "2023-09-01",
      operatingSystem: "Web-based",
    },
    {
      title: "Gemini",
      subTitle: "Multimodal AI Platform",
      description:
        "Google's AI system that combines text, image, and code understanding.",
      url: "https://gemini.google.com",
      provider: "Google",
      category: "Multimodal AI",
      features: ["Text Analysis", "Image Understanding", "Code Generation"],
      pricing: "Freemium",
      rating: 4.6,
      releaseDate: "2023-12-06",
      operatingSystem: "Cross-platform",
    },
    {
      title: "Llama",
      subTitle: "Open Source Language Model",
      description:
        "Meta's open-source language model for researchers and developers, optimized for efficient deployment and customization.",
      url: "https://ai.meta.com/llama/",
      provider: "Meta",
      category: "Language Models",
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
    },
    {
      title: "Grok",
      subTitle: "Real-time AI Assistant",
      description:
        "xAI's conversational model trained on X platform data, known for real-time knowledge and witty interactions.",
      url: "https://grok.x.ai",
      provider: "xAI",
      category: "Language Models",
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
    },
    {
      title: "You.com",
      subTitle: "AI-Powered Search Engine",
      description:
        "Search platform that integrates AI to provide summarized results and creative tools.",
      url: "https://you.com",
      provider: "You.com",
      category: "Search Engines",
      features: ["AI Search", "Content Generation", "Web Analysis"],
      pricing: "Free",
      rating: 4.4,
      releaseDate: "2023-01-15",
      operatingSystem: "Web-based",
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
    },
    {
      title: "Stable Diffusion",
      subTitle: "Open Source Image Generation",
      description:
        "Powerful open-source image generation model with a strong community and flexible custom models.",
      url: "https://stablediffusionweb.com",
      provider: "Stability AI",
      category: "Image Generation",
      features: ["Open Source", "Custom Models", "Community Support"],
      pricing: "Free",
      rating: 4.7,
      releaseDate: "2022-08-22",
      operatingSystem: "Cross-platform",
    },
    {
      title: "Copilot",
      subTitle: "AI Programming Assistant",
      description:
        "GitHub's coding assistant that provides contextual code suggestions, documentation help, and bug detection.",
      url: "https://github.com/features/copilot",
      provider: "GitHub",
      category: "Development Tools",
      features: ["Code Completion", "Documentation", "Bug Detection"],
      pricing: "Paid",
      rating: 4.8,
      releaseDate: "2023-06-21",
      operatingSystem: "Cross-platform",
    },
    {
      title: "Claude in Slack",
      subTitle: "Team AI Assistant",
      description:
        "Anthropic's AI integrated into Slack for team collaboration, document analysis, and writing assistance.",
      url: "https://www.anthropic.com/index/slack",
      provider: "Anthropic",
      category: "Collaboration Tools",
      features: ["Team Integration", "Document Analysis", "Writing Assistance"],
      pricing: "Paid",
      rating: 4.6,
      releaseDate: "2023-07-11",
      operatingSystem: "Web-based",
    },
    {
      title: "Perplexity AI",
      subTitle: "AI Research Assistant",
      description:
        "Research-focused AI that provides real-time information synthesis with cited sources.",
      url: "https://www.perplexity.ai",
      provider: "Perplexity AI",
      category: "Research Tools",
      features: [
        "Real-time Research",
        "Citation Support",
        "Information Synthesis",
      ],
      pricing: "Freemium",
      rating: 4.5,
      releaseDate: "2023-04-18",
      operatingSystem: "Web-based",
    },
    {
      title: "AutoGPT",
      subTitle: "Autonomous AI Agent",
      description:
        "Experimental AI system that can execute complex tasks autonomously by breaking them into subtasks.",
      url: "https://github.com/Torantulino/Auto-GPT",
      provider: "Open Source",
      category: "Automation Tools",
      features: [
        "Task Automation",
        "Autonomous Operation",
        "Complex Problem Solving",
      ],
      pricing: "Free",
      rating: 4.3,
      releaseDate: "2023-04-07",
      operatingSystem: "Cross-platform",
    },
    {
      title: "Whisper",
      subTitle: "Speech Recognition",
      description:
        "OpenAI's speech recognition system that accurately transcribes and translates audio in multiple languages.",
      url: "https://openai.com/research/whisper",
      provider: "OpenAI",
      category: "Speech Recognition",
      features: ["Transcription", "Translation", "Multi-language Support"],
      pricing: "Open Source",
      rating: 4.7,
      releaseDate: "2022-09-21",
      operatingSystem: "Cross-platform",
    },
    {
      title: "Jasper",
      subTitle: "AI Content Creation",
      description:
        "Marketing-focused AI platform for creating blog posts, social media content, and ad copy.",
      url: "https://www.jasper.ai",
      provider: "Jasper AI",
      category: "Content Creation",
      features: ["Marketing Copy", "Blog Writing", "Social Media Content"],
      pricing: "Paid",
      rating: 4.6,
      releaseDate: "2021-01-01",
      operatingSystem: "Web-based",
    },
    {
      title: "Cursor",
      subTitle: "AI-First Code Editor",
      description:
        "Modern code editor built around AI capabilities, offering intelligent code completion and refactoring.",
      url: "https://www.cursor.so",
      provider: "Cursor",
      category: "Development Tools",
      features: ["Code Completion", "Refactoring", "AI Assistance"],
      pricing: "Free",
      rating: 4.5,
      releaseDate: "2023-02-07",
      operatingSystem: "Desktop",
    },
    {
      title: "Readdy",
      subTitle: "AI Design Generator",
      description:
        "AI-powered platform that transforms ideas into beautiful design with code in seconds, helping users create designs through advanced AI technology.",
      url: "https://readdy.ai",
      provider: "Readdy",
      category: "Design Tools",
      features: ["Design Generation", "Code Export", "AI Design Assistant"],
      pricing: "Freemium",
      rating: 4.4,
      releaseDate: "2023-08-15",
      operatingSystem: "Web-based",
    },
  ];

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
          {/* Main Content */}
          <Box component="main">
            <Box
              component="header"
              sx={{
                mb: 2,
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              <Typography
                component="h1"
                variant="h4"
                fontWeight="bold"
                sx={{
                  fontSize: { xs: "2rem", sm: "2.5rem" },
                }}
              >
                AI Tools Directory
              </Typography>

              <Typography component="p" variant="subtitle1" color="white">
                Discover and compare the latest artificial intelligence tools
                and applications. Our curated collection includes leading
                language models, image generators, and development assistants to
                enhance your workflow.
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1, mb: 8 }}>
              <Grid
                container
                spacing={3}
                component="section"
                aria-label="AI Tools Grid"
              >
                {apps.map(({ title, subTitle, description, url }) => (
                  // <Grid key={title} xs={12} sm={6} md={6} lg={4}>
                  <Grid key={title} size={{ xs: 12, sm: 6, md: 6, lg: 4 }}>
                    <Card
                      component="article"
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        p: 5,
                      }}
                    >
                      <Box sx={{ flexGrow: 1 }}>
                        <Stack
                          flexDirection="row"
                          alignItems="center"
                          mb={2.5}
                          mt={1}
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
                ))}
              </Grid>
            </Box>
          </Box>
        </>
      </>
    </HelmetProvider>
  );
};

export default AiToolsPage;
