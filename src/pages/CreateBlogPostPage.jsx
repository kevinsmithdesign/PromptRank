import React, { useState, useRef } from "react";
import {
  Button,
  TextField,
  Typography,
  Stack,
  Box,
  Autocomplete,
  Chip,
  IconButton,
  Paper,
  Divider,
  Grid,
  Container,
  AppBar,
  Toolbar,
} from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CodeIcon from "@mui/icons-material/Code";
import ImageIcon from "@mui/icons-material/Image";
import LinkIcon from "@mui/icons-material/Link";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const CreateBlogPostPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState(null);
  const [readTime, setReadTime] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [tags, setTags] = useState([]);
  const [wordCount, setWordCount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const contentRef = useRef(null);

  // Sample categories matching the ones in the blog page
  const categoryOptions = [
    "Prompt Engineering",
    "AI Tools",
    "ChatGPT",
    "AI News",
    "Tutorials",
    "Best Practices",
    "Industry Updates",
    "Tips & Tricks",
  ];

  // Sample tags for the blog
  const tagOptions = [
    "promptengineering",
    "ai",
    "chatgpt",
    "llm",
    "tutorials",
    "machinelearning",
    "aitools",
    "development",
    "technology",
    "future",
  ];

  // Update word count when content changes
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    setWordCount(
      newContent.trim() === "" ? 0 : newContent.trim().split(/\s+/).length
    );
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Simulate API call with timeout
    setTimeout(() => {
      console.log("Blog post data submitted:", {
        title,
        subtitle,
        content,
        excerpt,
        category,
        readTime,
        featuredImage,
        tags,
      });

      setIsSubmitting(false);
      navigate("/main/blog"); // Navigate back to blog page after submission
    }, 1500);
  };

  return (
    <>
      {/* Header with back button */}
      <AppBar
        position="static"
        color="transparent"
        elevation={0}
        sx={{
          borderBottom: "1px solid #333",
          marginBottom: 3,
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => navigate("/main/blog")}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Create New Blog Post
          </Typography>
          <Box>
            <Button
              variant="outlined"
              sx={{ mr: 2 }}
              onClick={() => navigate("/main/blog")}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Publishing..." : "Publish Post"}
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Left column */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Box>
                <Typography fontWeight="bold" mb={0.5} color="white">
                  Title*
                </Typography>
                <TextField
                  placeholder="Enter your blog post title here"
                  fullWidth
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  sx={{
                    backgroundColor: "#222",
                    borderRadius: 1,
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#444",
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography fontWeight="bold" mb={0.5} color="white">
                  Subtitle
                </Typography>
                <TextField
                  placeholder="Enter a subtitle or brief description"
                  fullWidth
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  sx={{
                    backgroundColor: "#222",
                    borderRadius: 1,
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#444",
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography fontWeight="bold" mb={0.5} color="white">
                  Category*
                </Typography>
                <Autocomplete
                  freeSolo
                  options={categoryOptions}
                  value={category}
                  onChange={(event, newValue) => {
                    setCategory(newValue);
                  }}
                  PopperProps={{
                    sx: {
                      "& .MuiPaper-root": {
                        backgroundColor: "#222",
                      },
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="Select Category"
                      required
                      sx={{
                        backgroundColor: "#222",
                        borderRadius: 1,
                        "& .MuiOutlinedInput-root": {
                          color: "#fff",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#444",
                        },
                      }}
                    />
                  )}
                />
              </Box>

              {/* Tags Input */}
              <Box>
                <Typography fontWeight="bold" mb={0.5} color="white">
                  Tags (separated by commas)
                </Typography>
                <Autocomplete
                  multiple
                  freeSolo
                  options={tagOptions}
                  value={tags}
                  onChange={(event, newValue) => {
                    setTags(newValue.slice(0, 5)); // Limit to 5 tags
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option}
                        label={option}
                        sx={{
                          backgroundColor: "#333",
                          color: "#fff",
                          margin: "2px",
                          "& .MuiChip-deleteIcon": {
                            color: "#fff",
                            "&:hover": {
                              color: "#ff4444",
                            },
                          },
                        }}
                      />
                    ))
                  }
                  PopperProps={{
                    sx: {
                      "& .MuiPaper-root": {
                        backgroundColor: "#222",
                      },
                    },
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="promptengineering, ai, chatgpt, llm, tutorials"
                      sx={{
                        backgroundColor: "#222",
                        borderRadius: 1,
                        "& .MuiOutlinedInput-root": {
                          color: "#fff",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#444",
                        },
                      }}
                    />
                  )}
                />
                <Typography
                  variant="caption"
                  color="rgba(255, 255, 255, 0.5)"
                  sx={{ mt: 0.5, display: "block" }}
                >
                  Add up to 5 tags to help readers discover your post
                </Typography>
              </Box>

              <Box>
                <Typography fontWeight="bold" mb={0.5} color="white">
                  Excerpt*
                </Typography>
                <TextField
                  placeholder="A brief summary that will appear in blog previews"
                  fullWidth
                  required
                  multiline
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  sx={{
                    backgroundColor: "#222",
                    borderRadius: 1,
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#444",
                    },
                  }}
                />
              </Box>

              <Box>
                <Typography fontWeight="bold" mb={0.5} color="white">
                  Read Time
                </Typography>
                <TextField
                  placeholder="E.g., 8 min read"
                  fullWidth
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  sx={{
                    backgroundColor: "#222",
                    borderRadius: 1,
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#444",
                    },
                  }}
                />
              </Box>
            </Stack>
          </Grid>

          {/* Right column */}
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              {/* Rich Text Editor */}
              <Box>
                <Typography fontWeight="bold" mb={0.5} color="white">
                  Content*
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    backgroundColor: "#222",
                    borderColor: "#444",
                    color: "white",
                  }}
                >
                  {/* Toolbar */}
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                      padding: 1,
                      borderBottom: "1px solid #444",
                    }}
                  >
                    <IconButton size="small" sx={{ color: "white" }}>
                      <FormatBoldIcon />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "white" }}>
                      <FormatItalicIcon />
                    </IconButton>
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{ mx: 1, backgroundColor: "#444" }}
                    />
                    <IconButton size="small" sx={{ color: "white" }}>
                      <TextFieldsIcon />
                    </IconButton>
                    <Typography
                      variant="button"
                      sx={{
                        borderRadius: 1,
                        px: 1,
                        display: "flex",
                        alignItems: "center",
                        color: "white",
                      }}
                    >
                      H1
                    </Typography>
                    <Typography
                      variant="button"
                      sx={{
                        borderRadius: 1,
                        px: 1,
                        display: "flex",
                        alignItems: "center",
                        color: "white",
                      }}
                    >
                      H2
                    </Typography>
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{ mx: 1, backgroundColor: "#444" }}
                    />
                    <IconButton size="small" sx={{ color: "white" }}>
                      <FormatListBulletedIcon />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "white" }}>
                      <FormatListNumberedIcon />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "white" }}>
                      <FormatQuoteIcon />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "white" }}>
                      <CodeIcon />
                    </IconButton>
                    <Divider
                      orientation="vertical"
                      flexItem
                      sx={{ mx: 1, backgroundColor: "#444" }}
                    />
                    <IconButton size="small" sx={{ color: "white" }}>
                      <ImageIcon />
                    </IconButton>
                    <IconButton size="small" sx={{ color: "white" }}>
                      <LinkIcon />
                    </IconButton>
                  </Box>

                  {/* Editor Area */}
                  <TextField
                    multiline
                    rows={12}
                    fullWidth
                    placeholder="Start writing your blog post here..."
                    value={content}
                    onChange={handleContentChange}
                    inputRef={contentRef}
                    variant="standard"
                    InputProps={{
                      disableUnderline: true,
                    }}
                    sx={{
                      "& .MuiInputBase-input": {
                        color: "white",
                        padding: 2,
                        overflow: "auto",
                        "&::-webkit-scrollbar": {
                          width: "8px",
                        },
                        "&::-webkit-scrollbar-track": {
                          background: "#333",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          background: "#555",
                          borderRadius: "4px",
                        },
                      },
                    }}
                  />

                  {/* Word Count and Preview */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTop: "1px solid #444",
                      padding: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                      color="rgba(255, 255, 255, 0.7)"
                    >
                      {wordCount} words
                    </Typography>
                    <Button
                      variant="text"
                      sx={{
                        color: "#2196f3",
                      }}
                    >
                      Preview
                    </Button>
                  </Box>
                </Paper>
              </Box>

              {/* Featured Image Drop Area */}
              <Box>
                <Typography fontWeight="bold" mb={0.5} color="white">
                  Featured Image
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    backgroundColor: "transparent",
                    borderColor: "#444",
                    borderStyle: "dashed",
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "160px",
                  }}
                >
                  <ImageIcon sx={{ fontSize: 48, color: "#666", mb: 2 }} />
                  <Typography
                    color="rgba(255, 255, 255, 0.7)"
                    textAlign="center"
                    mb={2}
                  >
                    Drag and drop a featured image here
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{
                      backgroundColor: "#444",
                      "&:hover": { backgroundColor: "#555" },
                    }}
                  >
                    Upload Image
                  </Button>
                </Paper>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default CreateBlogPostPage;
