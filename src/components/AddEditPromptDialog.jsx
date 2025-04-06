import React, { useState } from "react";
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
} from "@mui/material";

const categoryOptions = [
  "Development",
  "Design",
  "Debugging",
  "UI Design",
  "Web Design",
];

const subcategoryOptions = [
  "UI Design",
  "UX Design",
  "Frontend",
  "Backend",
  "Database",
  "Performance",
  "Security",
  "Testing",
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
  const [subcategories, setSubcategories] = useState([]);

  const handleCategoryChange = (event, value, reason) => {
    // Handle both selected options and manual input
    if (
      reason === "createOption" ||
      reason === "selectOption" ||
      reason === "clear"
    ) {
      setNewCategory(value);
    } else if (event?.target?.value !== undefined) {
      // Handle manual input when user types
      setNewCategory(event.target.value);
    }
  };

  const handleSubcategoryChange = (event, value) => {
    if (value.length <= 10) {
      setSubcategories(value);
    }
  };

  const [subCategoryError, setSubCategoryError] = useState("");

  const handleBeforeSubcategoryChange = (event, value) => {
    if (value.length > 10) {
      setSubCategoryError(
        "You've reached the maximum limit of 10 subcategories. Please remove one before adding another."
      );
      return;
    }
    setSubCategoryError("");
    handleSubcategoryChange(event, value);
  };

  return (
    <Dialog
      fullScreen
      open={openDialog}
      onClose={handleCloseDialog}
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#111",
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
            Add New Prompt
          </Typography>
          <Stack spacing={3}>
            <Autocomplete
              freeSolo
              options={categoryOptions}
              value={newCategory}
              onChange={handleCategoryChange}
              onInputChange={(event, value, reason) => {
                if (reason === "input") {
                  setNewCategory(value);
                }
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

            <Autocomplete
              multiple
              options={subcategoryOptions}
              value={subcategories}
              onChange={handleBeforeSubcategoryChange}
              PopperProps={{
                sx: {
                  "& .MuiPaper-root": {
                    backgroundColor: "#222",
                  },
                },
              }}
              ListboxProps={{
                style: { backgroundColor: "#222" },
              }}
              renderTags={(value, getTagProps) => (
                <Box
                  sx={{
                    width: "100%",
                    minHeight: 45,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    overflowY: "auto",
                    maxHeight: "120px",
                    padding: "8px 0",
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
                  }}
                >
                  {value.map((option, index) => (
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
                  ))}
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select Subcategories"
                  required
                  error={!!subCategoryError}
                  helperText={subCategoryError}
                  FormHelperTextProps={{
                    sx: { color: "#ff4444" },
                  }}
                  sx={{
                    backgroundColor: "#222",
                    borderRadius: 1,
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      height: "auto",
                      minHeight: "45px",
                      alignItems: "flex-start",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#444",
                    },
                  }}
                />
              )}
            />

            <TextField
              placeholder="Add Prompt Title"
              fullWidth
              required
              value={newPromptTitle}
              onChange={(e) => setNewPromptTitle(e.target.value)}
              sx={{
                backgroundColor: "#222",
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                },
              }}
            />

            <TextField
              placeholder="Add Prompt Description"
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
                  minHeight: "200px",
                },
              }}
            />
          </Stack>

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}
          >
            <Button variant="outlined" onClick={handleCloseDialog}>
              Cancel
            </Button>
            <Button
              onClick={onSubmitAddPrompt}
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
