import React, { useState, useRef } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  Typography,
  Stack,
  Box,
  Autocomplete,
  Chip,
  IconButton,
  Paper,
  Divider,
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

const CreateBlogPostModal = ({
  open,
  handleClose,
  loading = false,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState(null);
  const [readTime, setReadTime] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [tags, setTags] = useState([]);
  const [wordCount, setWordCount] = useState(0);
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
    onSubmit({
      title,
      subtitle,
      content,
      excerpt,
      category,
      readTime,
      featuredImage,
      tags,
    });
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#000",
          color: "#fff",
        },
      }}
      PaperProps={{
        sx: {
          "& .MuiAutocomplete-popper .MuiPaper-root": {
            backgroundColor: "#222",
            color: "#fff",
          },
          "& .MuiAutocomplete-option": {
            backgroundColor: "#222",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#333",
            },
          },
          "& .MuiAutocomplete-listbox": {
            backgroundColor: "#222",
          },
        },
      }}
    >
      <Box sx={{ maxWidth: "600px", width: "100%", mx: "auto", p: 2 }}>
        <DialogContent>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Create New Blog Post
          </Typography>
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
                  <Typography variant="body2" color="rgba(255, 255, 255, 0.7)">
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

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}
          >
            <Button variant="outlined" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              variant="contained"
            >
              {loading ? "Publishing..." : "Publish Post"}
            </Button>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default CreateBlogPostModal;
