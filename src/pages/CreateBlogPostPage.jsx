import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  Autocomplete,
  Chip,
  IconButton,
  Paper,
  Divider,
  Container,
  Alert,
  CircularProgress,
  Snackbar,
  Switch,
  FormControlLabel,
} from "@mui/material";
import BackIcon from "../icons/BackIcon";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CodeIcon from "@mui/icons-material/Code";
import ImageIcon from "@mui/icons-material/Image";
import LinkIcon from "@mui/icons-material/Link";
import { useNavigate } from "react-router-dom";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useCreateBlogPost } from "../hooks/useBlogQueries";
import { auth } from "../config/firebase";

const CreateBlogPostPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [imageUploadStatus, setImageUploadStatus] = useState('idle'); // Track upload status: 'idle', 'uploading', 'success', 'failed'
  const fileInputRef = useRef(null);
  const [wordCount, setWordCount] = useState(0);
  const [isEditorEmpty, setIsEditorEmpty] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [showError, setShowError] = useState(false);

  // React Query mutation hook
  const {
    mutate: createBlogPost,
    isLoading: isSubmitting,
    isSuccess,
    isError,
    error,
  } = useCreateBlogPost();

  // Check auth status
  useEffect(() => {
    const checkAuth = () => {
      if (!auth.currentUser) {
        console.warn("User not authenticated");
      } else {
        console.log("User authenticated:", auth.currentUser.uid);
      }
    };

    checkAuth();
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        console.warn("User signed out");
      } else {
        console.log("User signed in:", user.uid);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle successful post creation
  useEffect(() => {
    if (isSuccess) {
      console.log("Post creation successful, navigating to blog page");
      setImageUploadStatus('success');
      navigate("/main/blog");
    }
  }, [isSuccess, navigate]);

  // Handle error display
  useEffect(() => {
    if (isError && error) {
      console.error("Error creating post:", error);
      setErrorMsg(error.message || "Failed to publish post. Please try again.");
      setShowError(true);
      // Reset image upload status on error
      if (imageUploadStatus === 'uploading') {
        setImageUploadStatus('failed');
      }
    }
  }, [isError, error, imageUploadStatus]);

  // TipTap editor setup
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: false,
      }),
      ImageExtension.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing your story...",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const text = editor.getText();
      setWordCount(text.trim() === "" ? 0 : text.trim().split(/\s+/).length);
      setIsEditorEmpty(editor.isEmpty);
    },
  });

  // Available categories - matching the ones in the BlogPage
  const categoryOptions = [
    "Prompt Engineering",
    "AI Agents",
    "ChatGPT",
    "Claude",
    "Tutorials",
    "Best Practices",
    "Industry Updates",
    "Tips & Tricks",
  ];

  const tagOptions = [
    "promptengineering",
    "ai",
    "chatgpt",
    "tutorials",
    "machinelearning",
    "development",
    "technology",
  ];

  const handleSubmit = () => {
    console.log("Submit button clicked");

    if (!auth.currentUser) {
      console.error("Not authenticated");
      setErrorMsg("You must be logged in to create a blog post");
      setShowError(true);
      return;
    }

    if (!title.trim()) {
      console.error("Title is required");
      setErrorMsg("Please enter a title for your blog post");
      setShowError(true);
      return;
    }

    if (!editor || editor.isEmpty) {
      console.error("Content is required");
      setErrorMsg("Please add some content to your blog post");
      setShowError(true);
      return;
    }

    try {
      // Get content from editor
      const content = editor.getHTML();
      console.log("Content:", content.substring(0, 100) + "...");

      // Extract first paragraph for excerpt (limit to 150 chars)
      const textContent = editor.getText();
      const excerpt =
        textContent.substring(0, 150) + (textContent.length > 150 ? "..." : "");

      // Calculate read time (average reading speed: 200 words per minute)
      const readTime = Math.max(1, Math.ceil(wordCount / 200)) + " min read";

      // Prepare blog data
      const blogData = {
        title: title.trim(),
        content,
        excerpt,
        category: category || categoryOptions[0], // Default to first category if none selected
        tags: tags.length > 0 ? tags : ["uncategorized"],
        readTime,
        author: auth.currentUser.displayName || "Anonymous",
        authorId: auth.currentUser.uid,
        authorPhotoURL: auth.currentUser.photoURL || null,
      };

      console.log("Submitting blog post:", {
        ...blogData,
        content: blogData.content.substring(0, 100) + "...",
      });

      // Submit the blog post using React Query mutation
      // Set uploading status if there's an image
      if (imageFile) {
        setImageUploadStatus('uploading');
      }
      
      createBlogPost({
        blogData,
        imageFile: imageFile,
      });
    } catch (err) {
      console.error("Exception during submit:", err);
      setErrorMsg(err.message || "An unexpected error occurred");
      setShowError(true);
    }
  };

  const addLink = () => {
    if (!editor) return;

    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    if (!editor) return;

    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Only accept image files
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Please upload an image file");
      setShowError(true);
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Image file must be smaller than 5MB");
      setShowError(true);
      return;
    }

    console.log("Image file selected:", file.name);
    setImageFile(file);
    setImageUploadStatus('idle');

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  if (!editor) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, pt: 2 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            background: "#222",
            p: 2,
            mr: 2,
            "&:hover": { background: "#333" },
          }}
        >
          <BackIcon />
        </IconButton>
        <Typography variant="h4" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          Create Blog Post
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={isSubmitting || !title.trim() || isEditorEmpty}
        >
          {isSubmitting ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Publishing...
            </>
          ) : (
            "Publish"
          )}
        </Button>
      </Box>

      {/* Error alert */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMsg}
        </Alert>
      </Snackbar>

      {/* Error display */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Error creating blog post: {error.message || "Please try again"}
        </Alert>
      )}

      {/* Loading indicator */}
      {isSubmitting && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <CircularProgress size={24} sx={{ mr: 1 }} />
          <Typography>Publishing your blog post...</Typography>
        </Box>
      )}

      {/* Auth status warning */}
      {!auth.currentUser && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You need to be logged in to publish a post.
        </Alert>
      )}

      {/* Featured Image Upload */}
      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 1,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
            Featured Image
          </Typography>

          {/* Image Upload Status */}
          {imageUploadStatus === 'uploading' && (
            <Typography variant="body2" color="primary" sx={{ mb: 1 }}>
              Uploading image...
            </Typography>
          )}
          {imageUploadStatus === 'failed' && (
            <Typography variant="body2" color="warning.main" sx={{ mb: 1 }}>
              Image upload failed. Using default image instead.
            </Typography>
          )}
        </Box>

        {imagePreview ? (
          <Box sx={{ position: "relative", mb: 2 }}>
            <Box
              component="img"
              src={imagePreview}
              alt="Featured image preview"
              sx={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                backgroundColor: "rgba(0,0,0,0.7)",
              }}
              onClick={openFileDialog}
            >
              Change Image
            </Button>
          </Box>
        ) : (
          <Button
            variant="outlined"
            startIcon={<ImageIcon />}
            onClick={openFileDialog}
            sx={{ mb: 2, p: 2, borderStyle: "dashed" }}
            fullWidth
            disabled={imageUploadStatus === 'uploading'}
          >
            {imageUploadStatus === 'uploading' ? 'Uploading...' : 'Upload Featured Image'}
          </Button>
        )}

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImageUpload}
        />
      </Box>

      {/* Title */}
      <TextField
        placeholder="Enter your blog post title here"
        fullWidth
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={!title.trim() && showError}
        helperText={!title.trim() && showError ? "Title is required" : ""}
        sx={{
          mb: 3,
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

      {/* Category Selection */}
      <Autocomplete
        options={categoryOptions}
        value={category}
        onChange={(_, newValue) => setCategory(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="Select a category"
            variant="outlined"
            fullWidth
            sx={{
              mb: 3,
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

      {/* Editor Toolbar */}
      <Paper
        variant="outlined"
        sx={{
          backgroundColor: "transparent",
          borderColor: "#333",
          borderRadius: "8px",
          mb: 2,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5,
            padding: "8px",
            backgroundColor: "#222",
            borderBottom: "1px solid #333",
          }}
        >
          <Button
            size="small"
            variant="text"
            sx={{
              color:
                editor.isActive && editor.isActive("heading", { level: 1 })
                  ? "#2196f3"
                  : "white",
              minWidth: "36px",
              fontSize: "1rem",
              fontWeight: "bold",
              px: 1,
            }}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
          >
            H1
          </Button>
          <Button
            size="small"
            variant="text"
            sx={{
              color:
                editor.isActive && editor.isActive("heading", { level: 2 })
                  ? "#2196f3"
                  : "white",
              minWidth: "36px",
              fontSize: "0.9rem",
              fontWeight: "bold",
              px: 1,
            }}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
          >
            H2
          </Button>
          <Button
            size="small"
            variant="text"
            sx={{
              color:
                editor.isActive && editor.isActive("heading", { level: 3 })
                  ? "#2196f3"
                  : "white",
              minWidth: "36px",
              fontSize: "0.8rem",
              fontWeight: "bold",
              px: 1,
            }}
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
          >
            H3
          </Button>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <IconButton
            size="small"
            sx={{
              color:
                editor.isActive && editor.isActive("bold")
                  ? "#2196f3"
                  : "white",
            }}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <FormatBoldIcon />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              color:
                editor.isActive && editor.isActive("italic")
                  ? "#2196f3"
                  : "white",
            }}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <FormatItalicIcon />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              color:
                editor.isActive && editor.isActive("bulletList")
                  ? "#2196f3"
                  : "white",
            }}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <FormatListBulletedIcon />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              color:
                editor.isActive && editor.isActive("orderedList")
                  ? "#2196f3"
                  : "white",
            }}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <FormatListNumberedIcon />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              color:
                editor.isActive && editor.isActive("blockquote")
                  ? "#2196f3"
                  : "white",
            }}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <FormatQuoteIcon />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              color:
                editor.isActive && editor.isActive("codeBlock")
                  ? "#2196f3"
                  : "white",
            }}
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <CodeIcon />
          </IconButton>
          <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
          <IconButton size="small" sx={{ color: "white" }} onClick={addImage}>
            <ImageIcon />
          </IconButton>
          <IconButton
            size="small"
            sx={{
              color:
                editor.isActive && editor.isActive("link")
                  ? "#2196f3"
                  : "white",
            }}
            onClick={addLink}
          >
            <LinkIcon />
          </IconButton>
        </Box>
      </Paper>

      {/* Editor Content */}
      <Box
        sx={{
          mb: 4,
          border: isEditorEmpty && showError ? "1px solid red" : "none",
          borderRadius: "4px",
          "& .ProseMirror": {
            minHeight: "400px",
            outline: "none",
            "& p.is-editor-empty:first-child::before": {
              color: "#666",
              content: "attr(data-placeholder)",
              float: "left",
              height: 0,
              pointerEvents: "none",
            },
            "& h1": {
              fontSize: "2.5rem",
              fontWeight: "bold",
              marginTop: "2rem",
              marginBottom: "1rem",
              color: "#fff",
            },
            "& h2": {
              fontSize: "2rem",
              fontWeight: "bold",
              marginTop: "1.5rem",
              marginBottom: "0.8rem",
              color: "#fff",
            },
            "& h3": {
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginTop: "1.2rem",
              marginBottom: "0.6rem",
              color: "#fff",
            },
            "& p": {
              fontSize: "1.1rem",
              lineHeight: "1.8",
              marginBottom: "1.2rem",
            },
            "& ul, & ol": {
              paddingLeft: "1.5rem",
              marginBottom: "1.2rem",
            },
            "& blockquote": {
              borderLeft: "3px solid #444",
              marginLeft: 0,
              paddingLeft: "1rem",
              fontStyle: "italic",
              color: "#aaa",
            },
            "& pre": {
              backgroundColor: "#111",
              padding: "1rem",
              borderRadius: "8px",
              marginBottom: "1rem",
              overflow: "auto",
              "& code": {
                color: "#fff",
                background: "none",
                padding: 0,
              },
            },
            "& code": {
              backgroundColor: "#333",
              padding: "0.2rem 0.4rem",
              borderRadius: "3px",
              color: "#e86e75",
            },
            "& img": {
              maxWidth: "100%",
              height: "auto",
              borderRadius: "8px",
              marginBottom: "1rem",
            },
            "& a": {
              color: "#2196f3",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            },
          },
        }}
      >
        <EditorContent editor={editor} />
        {isEditorEmpty && showError && (
          <Typography color="error" sx={{ mt: 1, ml: 1 }}>
            Content is required
          </Typography>
        )}
      </Box>

      {/* Tags */}
      <Box sx={{ mb: 4 }}>
        <Autocomplete
          multiple
          freeSolo
          options={tagOptions}
          value={tags}
          onChange={(event, newValue) => {
            setTags(newValue.slice(0, 5));
          }}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                size="small"
                sx={{
                  backgroundColor: "#333",
                  color: "#fff",
                  mr: 0.5,
                  mb: 0.5,
                }}
              />
            ))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Add tags... (max 5)"
              size="small"
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

      {/* Footer */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 2,
          borderTop: "1px solid #333",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {wordCount} words
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate("/main/blog")}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </Box>
    </Container>
  );
};

export default CreateBlogPostPage;
