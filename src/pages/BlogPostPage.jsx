import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Chip,
  Avatar,
  Stack,
  Container,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  // This would normally come from your database/API
  const post = {
    id: 1,
    title: "10 Advanced Prompt Engineering Techniques for Better AI Results",
    content: `
      <h2>Introduction</h2>
      <p>Prompt engineering is becoming increasingly important as AI language models become more sophisticated. The ability to craft effective prompts can significantly improve the quality of AI-generated outputs. In this comprehensive guide, we'll explore advanced techniques that will help you get better results from AI models like ChatGPT, Claude, and GPT-4.</p>
      
      <h2>1. Use Clear and Specific Instructions</h2>
      <p>When crafting prompts, be as specific as possible about what you want the AI to do. Instead of saying "Write about dogs," try "Write a detailed guide about caring for a Golden Retriever puppy in its first year, including vaccination schedules, feeding recommendations, and training milestones."</p>
      
      <h2>2. Provide Context and Examples</h2>
      <p>Give the AI model relevant context and examples to help it understand the desired output format. For instance, if you're asking for a specific writing style, provide a sample paragraph that demonstrates that style. This helps the AI better understand and match your expectations.</p>
      
      <h2>3. Break Down Complex Tasks</h2>
      <p>For complex tasks, break them down into smaller, more manageable steps. Instead of asking for a complete business plan in one prompt, break it down into sections like market analysis, financial projections, and marketing strategy. This approach typically yields more detailed and focused results.</p>

      <h2>4. Implement Role-Based Prompting</h2>
      <p>Assign a specific role or perspective for the AI to adopt. For example, "As an experienced software architect, explain the benefits and drawbacks of microservices architecture." This technique helps frame the response within the appropriate context and expertise level.</p>

      <h2>5. Use Chain-of-Thought Prompting</h2>
      <p>Guide the AI through a logical sequence of steps to arrive at a conclusion. This is particularly effective for problem-solving tasks. Ask the AI to show its work and explain its reasoning at each step.</p>
    `,
    author: "Sarah Chen",
    date: "2024-02-20",
    category: "Prompt Engineering",
    readTime: "8 min read",
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995",
  };

  if (!post) {
    return (
      <Box sx={{ textAlign: "center", py: 8 }}>
        <Typography variant="h5" color="white">
          Blog post not found
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/main/blog")}
          sx={{ mt: 2 }}
        >
          Back to Blog
        </Button>
      </Box>
    );
  }

  return (
    <>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/main/blog")}
        sx={{ mb: 4 }}
      >
        Back to Blog
      </Button>

      <article>
        {/* Header Image */}
        <Box
          sx={{
            position: "relative",
            height: "400px",
            mb: 6,
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <Box
            component="img"
            src={post.imageUrl}
            alt={post.title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          {/* Gradient Overlay */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "50%",
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.8))",
            }}
          />
        </Box>

        {/* Article Header */}
        <Container maxWidth="md" sx={{ mb: 8 }}>
          <Stack direction="row" spacing={1} mb={3}>
            <Chip
              label={post.category}
              size="small"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: "white",
                px: 2,
                height: "32px",
                fontSize: "0.9rem",
              }}
            />
            <Chip
              label={post.readTime}
              size="small"
              sx={{
                backgroundColor: "#333",
                color: "white",
                px: 2,
                height: "32px",
                fontSize: "0.9rem",
              }}
            />
          </Stack>

          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: "bold",
              color: "white",
              mb: 4,
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              lineHeight: 1.2,
            }}
          >
            {post.title}
          </Typography>

          <Stack direction="row" spacing={2} alignItems="center" mb={6}>
            <Avatar
              sx={{ width: 48, height: 48 }}
              alt={post.author}
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                post.author
              )}&background=random`}
            />
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}
              >
                {post.author}
              </Typography>
              <Typography
                variant="caption"
                sx={{ color: "rgba(255, 255, 255, 0.5)", fontSize: "0.9rem" }}
              >
                {new Date(post.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.1)" }} />
        </Container>

        {/* Article Content */}
        <Container maxWidth="md">
          <Box
            sx={{
              "& h2": {
                color: "white",
                fontWeight: "bold",
                fontSize: "2rem",
                mt: 6,
                mb: 3,
              },
              "& p": {
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: 1.8,
                mb: 4,
                fontSize: "1.1rem",
                maxWidth: "100%",
                letterSpacing: "0.3px",
              },
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </Container>
      </article>
    </>
  );
};

export default BlogPostPage;
