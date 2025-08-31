import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  Chip,
  Autocomplete,
  MenuItem,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ChevronDown from "../icons/ChevronDown";

// Comprehensive category options
const categoryOptions = [
  "Content Creation",
  "Marketing & Sales",
  "Business & Strategy",
  "Development & Tech",
  "Design & Creative",
  "Data & Analytics",
  "Education & Learning",
  "Personal Productivity",
  "Customer Support",
  "Research & Writing",
  "AI & Automation",
  "Other",
];

const AddEditPromptDialog = ({
  openDialog,
  handleCloseDialog,
  newCategory,
  setNewCategory,
  newPromptTitle,
  setNewPromptTitle,
  newPromptDescription,
  setNewPromptDescription,
  onSubmitAddPrompt,
  loading,
}) => {
  const theme = useTheme();
  const [tags, setTags] = useState([]);
  const [useCase, setUseCase] = useState("");
  const [expectedOutput, setExpectedOutput] = useState("");

  const handleTagsChange = (event, value) => {
    if (value.length <= 5) {
      setTags(value);
    }
  };

  const handleSubmit = () => {
    // Pass all the new fields to the parent component
    const promptData = {
      category: newCategory,
      title: newPromptTitle,
      description: newPromptDescription,
      tags,
      useCase,
      expectedOutput,
    };
    onSubmitAddPrompt(promptData);
  };

  return (
    <Dialog
      // fullScreen
      open={openDialog}
      onClose={handleCloseDialog}
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
          <Typography variant="h5" fontWeight="bold" mb={1}>
            Add New Prompt
          </Typography>
          <Typography variant="body2" color="#aaa" mb={3}>
            Share a useful prompt with the community. Fill out the details below
            to help others understand and use your prompt effectively.
          </Typography>

          <Stack spacing={3}>
            {/* Basic Information Section */}
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Basic Information
              </Typography>

              <Stack spacing={2}>
                <Stack>
                  <Typography fontWeight="bold" mb={0.5}>
                    Prompt Title*
                  </Typography>
                  <TextField
                    placeholder="Give your prompt a clear, descriptive title"
                    fullWidth
                    required
                    value={newPromptTitle}
                    onChange={(e) => setNewPromptTitle(e.target.value)}
                    sx={{
                      backgroundColor: "#222",
                      borderRadius: 1,
                      "& .MuiOutlinedInput-root": {
                        color: "#fff",
                        caretColor: "#fff",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#444",
                      },
                    }}
                  />
                </Stack>

                <Stack>
                  <Typography fontWeight="bold" mb={0.5}>
                    Category*
                  </Typography>
                  <Autocomplete
                    freeSolo
                    options={categoryOptions}
                    value={newCategory}
                    onChange={(event, value) => {
                      setNewCategory(value || "");
                    }}
                    onInputChange={(event, value) => {
                      setNewCategory(value);
                    }}
                    PopperProps={{
                      sx: {
                        "& .MuiPaper-root": {
                          backgroundColor: "#222",
                        },
                      },
                    }}
                    ListboxProps={{
                      style: { backgroundColor: "#222" },
                      sx: {
                        "& .MuiAutocomplete-option": {
                          color: "#fff",
                          "&:hover": {
                            backgroundColor: "#333",
                          },
                        },
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Type a category name or select from suggestions"
                        required
                        sx={{
                          backgroundColor: "#222",
                          borderRadius: 1,
                          "& .MuiOutlinedInput-root": {
                            color: "#fff",
                            caretColor: "#fff",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#444",
                          },
                          "& .MuiAutocomplete-clearIndicator": {
                            color: "#ff4444",
                            "&:hover": {
                              color: "#ff6666",
                              backgroundColor: "rgba(255, 68, 68, 0.1)",
                            },
                          },
                        }}
                      />
                    )}
                  />
                </Stack>

                <Stack spacing={1}>
                  <Typography fontWeight="bold">Use Case & Purpose*</Typography>
                  <TextField
                    placeholder="What problem does this prompt solve? What's the main use case?"
                    fullWidth
                    required
                    value={useCase}
                    onChange={(e) => setUseCase(e.target.value)}
                    sx={{
                      backgroundColor: "#222",
                      borderRadius: 1,
                      "& .MuiOutlinedInput-root": {
                        color: "#fff",
                        caretColor: "#fff",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#444",
                      },
                    }}
                  />
                </Stack>
              </Stack>
            </Box>

            <Divider sx={{ borderColor: "#444" }} />

            {/* The Actual Prompt Section */}
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                The Prompt
              </Typography>

              <Stack mb={2}>
                <Typography fontWeight="bold" mb={0.5}>
                  Prompt Content*
                </Typography>
                <TextField
                  placeholder="Paste your actual prompt here. Be specific and include any variables in [brackets] like [topic] or [audience]."
                  fullWidth
                  required
                  multiline
                  rows={8}
                  value={newPromptDescription}
                  onChange={(e) => setNewPromptDescription(e.target.value)}
                  sx={{
                    backgroundColor: "#222",
                    borderRadius: 1,
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      caretColor: "#fff",
                      minHeight: "200px",
                      padding: "16px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#444",
                    },
                    "& .MuiInputBase-inputMultiline": {
                      padding: "0",
                    },
                  }}
                />
              </Stack>

              <Stack spacing={1}>
                <Typography fontWeight="bold">Expected Output</Typography>
                <TextField
                  placeholder="What should users expect to get from this prompt? Describe the typical output or result."
                  fullWidth
                  value={expectedOutput}
                  onChange={(e) => setExpectedOutput(e.target.value)}
                  sx={{
                    backgroundColor: "#222",
                    borderRadius: 1,
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      caretColor: "#fff",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#444",
                    },
                  }}
                />
              </Stack>
            </Box>

            <Divider sx={{ borderColor: "#444" }} />

            {/* Tags Section */}
            <Box>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Tags (Optional)
              </Typography>

              <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={tags}
                onChange={handleTagsChange}
                renderTags={(value, getTagProps) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {value.map((option, index) => (
                      <Chip
                        {...getTagProps({ index })}
                        key={option}
                        label={option}
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: "#fff",
                          "& .MuiChip-deleteIcon": {
                            color: "#fff",
                            "&:hover": {
                              color: "#ff4444",
                            },
                          },
                        }}
                      />
                    ))}
                  </Box>
                )}
                renderInput={(params) => (
                  <Stack>
                    <Typography fontWeight="bold" mb={0.5}>
                      Tags
                    </Typography>
                    <TextField
                      {...params}
                      placeholder="Add up to 5 tags to help people find your prompt (press Enter to add)"
                      helperText={`${tags.length}/5 tags`}
                      FormHelperTextProps={{
                        sx: { color: "#aaa" },
                      }}
                      sx={{
                        backgroundColor: "#222",
                        borderRadius: 1,
                        "& .MuiOutlinedInput-root": {
                          color: "#fff",
                          caretColor: "#fff",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#444",
                        },
                      }}
                    />
                  </Stack>
                )}
              />
            </Box>
          </Stack>

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}
          >
            <Button variant="outlined" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              variant="contained"
            >
              {loading ? "Adding..." : "Add Prompt"}
            </Button>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default AddEditPromptDialog;
