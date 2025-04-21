import React, { useState } from "react";
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
  Container,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";

const CreateBlogPostPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TipTap editor setup
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
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
      const text = editor.state.doc.textContent;
      setWordCount(text.trim() === "" ? 0 : text.trim().split(/\s+/).length);
    },
  });

  const [wordCount, setWordCount] = useState(0);

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
    setIsSubmitting(true);
    const content = editor.getHTML();

    setTimeout(() => {
      console.log("Blog post data submitted:", {
        title,
        content,
        tags,
      });
      setIsSubmitting(false);
      navigate("/main/blog");
    }, 1500);
  };

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <Container maxWidth="md">
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 4, pt: 2 }}>
        {/* <IconButton onClick={() => navigate("/main/blog")} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton> */}
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
          disabled={isSubmitting || !title || editor.isEmpty}
        >
          {isSubmitting ? "Publishing..." : "Publish"}
        </Button>
      </Box>

      {/* Title */}
      <TextField
        placeholder="Enter your blog post title here"
        fullWidth
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
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
              color: editor.isActive("heading", { level: 1 })
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
              color: editor.isActive("heading", { level: 2 })
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
              color: editor.isActive("heading", { level: 3 })
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
            sx={{ color: editor.isActive("bold") ? "#2196f3" : "white" }}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <FormatBoldIcon />
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: editor.isActive("italic") ? "#2196f3" : "white" }}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <FormatItalicIcon />
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: editor.isActive("bulletList") ? "#2196f3" : "white" }}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <FormatListBulletedIcon />
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: editor.isActive("orderedList") ? "#2196f3" : "white" }}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <FormatListNumberedIcon />
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: editor.isActive("blockquote") ? "#2196f3" : "white" }}
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <FormatQuoteIcon />
          </IconButton>
          <IconButton
            size="small"
            sx={{ color: editor.isActive("codeBlock") ? "#2196f3" : "white" }}
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
            sx={{ color: editor.isActive("link") ? "#2196f3" : "white" }}
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
              placeholder="Add tags..."
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
        <Button variant="outlined" onClick={() => navigate("/main/blog")}>
          Cancel
        </Button>
      </Box>
    </Container>
  );
};

export default CreateBlogPostPage;
