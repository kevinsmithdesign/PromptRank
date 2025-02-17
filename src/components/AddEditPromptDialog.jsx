import React from "react";
import { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  Typography,
  FormControlLabel,
  Switch,
  Stack,
  Box,
  Alert,
} from "@mui/material";

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
  editDialogOpen,
  cancelEditing,
  loading,
  editError,
  editForm,
  setEditForm,
  editLoading,
  handleEditSubmit,
  editingId,
}) => {
  // Validation state for Add form
  const [addFormErrors, setAddFormErrors] = useState({
    category: "",
    title: "",
    description: "",
  });

  // Validation state for Edit form
  const [editFormErrors, setEditFormErrors] = useState({
    category: "",
    title: "",
    description: "",
  });

  // Reset errors when dialogs close
  useEffect(() => {
    if (!openDialog) {
      setAddFormErrors({ category: "", title: "", description: "" });
    }
    if (!editDialogOpen) {
      setEditFormErrors({ category: "", title: "", description: "" });
    }
  }, [openDialog, editDialogOpen]);

  // Validate Add form
  const validateAddForm = () => {
    const errors = {
      category: "",
      title: "",
      description: "",
    };
    let isValid = true;

    if (!newCategory.trim()) {
      errors.category = "Category is required";
      isValid = false;
    } else if (newCategory.length > 50) {
      errors.category = "Category must be less than 50 characters";
      isValid = false;
    }

    if (!newPromptTitle.trim()) {
      errors.title = "Title is required";
      isValid = false;
    } else if (newPromptTitle.length > 100) {
      errors.title = "Title must be less than 100 characters";
      isValid = false;
    }

    if (!newPromptDescription.trim()) {
      errors.description = "Description is required";
      isValid = false;
    } else if (newPromptDescription.length > 1000) {
      errors.description = "Description must be less than 1000 characters";
      isValid = false;
    }

    setAddFormErrors(errors);
    return isValid;
  };

  // Validate Edit form
  const validateEditForm = () => {
    const errors = {
      title: "",
      description: "",
    };
    let isValid = true;

    if (!editForm.category.trim()) {
      errors.category = "Category is required";
      isValid = false;
    } else if (editForm.category.length > 50) {
      errors.category = "Category must be less than 50 characters";
      isValid = false;
    }

    if (!editForm.title.trim()) {
      errors.title = "Title is required";
      isValid = false;
    } else if (editForm.title.length > 100) {
      errors.title = "Title must be less than 100 characters";
      isValid = false;
    }

    if (!editForm.description.trim()) {
      errors.description = "Description is required";
      isValid = false;
    } else if (editForm.description.length > 1000) {
      errors.description = "Description must be less than 1000 characters";
      isValid = false;
    }

    setEditFormErrors(errors);
    return isValid;
  };

  // Modified submit handlers
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (validateAddForm()) {
      onSubmitAddPrompt();
    }
  };

  const handleModifiedEditSubmit = (id) => {
    if (validateEditForm()) {
      handleEditSubmit(id);
    }
  };

  return (
    <>
      <Dialog
        fullScreen
        open={openDialog}
        onClose={handleCloseDialog}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#111",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <Box sx={{ maxWidth: "600px", width: "100%", mx: "auto" }}>
          <DialogContent>
            <Typography variant="h5" fontWeight="bold" mb={1}>
              Add New Prompt
            </Typography>
            <Stack spacing={2} mb={4}>
              <Box>
                <TextField
                  fullWidth
                  placeholder="Enter Category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  required
                  error={!!addFormErrors.category}
                  helperText={addFormErrors.category}
                  FormHelperTextProps={{
                    sx: { color: "error.main" },
                  }}
                />
              </Box>
              <TextField
                placeholder="Add Prompt Title"
                fullWidth
                required
                value={newPromptTitle}
                onChange={(e) => setNewPromptTitle(e.target.value)}
                error={!!addFormErrors.title}
                helperText={addFormErrors.title}
                FormHelperTextProps={{
                  sx: { color: "error.main" },
                }}
              />
              <TextField
                placeholder="Add Prompt Description"
                label=""
                fullWidth
                required
                multiline
                rows={8}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0.5rem",
                    background: "#222",
                    height: "auto",
                    minHeight: "120px",
                  },
                }}
                value={newPromptDescription}
                onChange={(e) => setNewPromptDescription(e.target.value)}
                error={!!addFormErrors.description}
                helperText={addFormErrors.description}
                FormHelperTextProps={{
                  sx: { color: "error.main" },
                }}
              />
            </Stack>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Stack flexDirection="row" gap={2}>
                <Button variant="outlined" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddSubmit}
                  disabled={loading}
                  variant="contained"
                >
                  {loading ? "Adding..." : "Add Prompt"}
                </Button>
              </Stack>
            </Box>
          </DialogContent>
        </Box>
      </Dialog>

      {/* Edit Prompt Dialog */}
      <Dialog
        fullScreen
        open={editDialogOpen}
        onClose={cancelEditing}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#111",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
        }}
      >
        <Box sx={{ maxWidth: "600px", width: "100%", mx: "auto" }}>
          <DialogContent>
            <Typography variant="h5" fontWeight="bold" mb={1}>
              Edit Prompt
            </Typography>

            {editError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {editError}
              </Alert>
            )}
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                placeholder="Enter Category"
                fullWidth
                value={editForm.category}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    category: e.target.value,
                  }))
                }
                required
                error={!!editFormErrors.category}
                helperText={editFormErrors.category}
                FormHelperTextProps={{
                  sx: { color: "error.main" },
                }}
              />
              <TextField
                placeholder="Prompt Title"
                fullWidth
                required
                value={editForm.title}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                error={!!editFormErrors.title}
                helperText={editFormErrors.title}
                FormHelperTextProps={{
                  sx: { color: "error.main" },
                }}
              />
              <TextField
                placeholder="Prompt Description"
                fullWidth
                required
                multiline
                rows={8}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "0.5rem",
                    background: "#222",
                    height: "auto",
                    minHeight: "120px",
                    mb: 4,
                  },
                }}
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                error={!!editFormErrors.description}
                helperText={editFormErrors.description}
                FormHelperTextProps={{
                  sx: { color: "error.main" },
                }}
              />
              {/* <FormControlLabel
                control={
                  <Switch
                    checked={editForm.isVisible}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        isVisible: e.target.checked,
                      }))
                    }
                  />
                }
                label="Public"
              /> */}
            </Stack>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Stack flexDirection="row" gap={2}>
                <Button
                  variant="outlined"
                  onClick={cancelEditing}
                  disabled={editLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={() => handleModifiedEditSubmit(editingId)}
                  disabled={editLoading}
                >
                  {editLoading ? "Saving..." : "Save Changes"}
                </Button>
              </Stack>
            </Box>
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
};

export default AddEditPromptDialog;
