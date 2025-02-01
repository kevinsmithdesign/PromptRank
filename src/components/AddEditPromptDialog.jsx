import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  Card,
  CardContent,
  Typography,
  FormControlLabel,
  Switch,
  Stack,
  Box,
  Alert,
  Menu,
  MenuItem,
  useTheme,
  IconButton,
  InputAdornment,
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
                />
              </Box>
              <TextField
                placeholder="Add Prompt Title"
                fullWidth
                required
                value={newPromptTitle}
                onChange={(e) => setNewPromptTitle(e.target.value)}
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
              />
            </Stack>

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Stack flexDirection="row" gap={2}>
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
                  },
                }}
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
              <FormControlLabel
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
              />
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
                  onClick={() => handleEditSubmit(editingId)}
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
