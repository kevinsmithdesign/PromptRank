import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import Grid from "@mui/material/Grid2";
import StarIcon from "@mui/icons-material/Star";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import EditIcon from "../icons/EditIcon";
import DeleteIcon from "../icons/DeleteIcon";
import SaveIcon from "../icons/SaveIcon";
import EyeIcon from "../icons/EyeIcon";
// import StarIcon from "../icons/StarIcon";
import StarBorderIcon from "@mui/icons-material/StarBorder";

import { db, auth } from "../../config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

function PromptPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [promptList, setPromptList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState({});
  const [deleteError, setDeleteError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedPromptId, setSelectedPromptId] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState({});
  const [saveError, setSaveError] = useState(null);

  // Edit states
  const [editingId, setEditingId] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    isVisible: false,
  });

  // New Prompts State
  const [newPromptTitle, setNewPromptTitle] = useState("");
  const [newPromptDescription, setNewPromptDescription] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newVisibilityModel, setNewVisibilityModel] = useState(false);

  // Create a reference to the prompts collection at component level
  const promptsCollectionRef = collection(db, "prompts");

  useEffect(() => {
    const getPromptsList = async () => {
      try {
        const data = await getDocs(promptsCollectionRef);
        if (!data.docs) return;

        const filteredData = data.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        setPromptList(filteredData);
      } catch (err) {
        console.error("Error in getPromptsList:", err);
        setError("Failed to fetch prompts");
      }
    };

    getPromptsList();
  }, []);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    // Reset form fields
    setNewPromptTitle("");
    setNewPromptDescription("");
    setNewCategory("");
    setNewVisibilityModel(false);
  };

  const handleMenuOpen = (event, promptId) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedPromptId(promptId);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedPromptId(null);
  };

  const handleEditClick = (prompt) => {
    handleMenuClose();
    startEditing(prompt);
  };

  const handleDeleteClick = (promptId) => {
    handleMenuClose();
    deletePrompt(promptId);
  };

  const handleSavePrompt = async (promptId) => {
    try {
      setSaveLoading((prev) => ({ ...prev, [promptId]: true }));
      setSaveError(null);

      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("You must be logged in to save prompts");
      }

      // Add a reference to this prompt in user's saved prompts collection
      const savedPromptsRef = collection(
        db,
        "users",
        currentUser.uid,
        "savedPrompts"
      );
      await addDoc(savedPromptsRef, {
        promptId: promptId,
        savedAt: new Date().toISOString(),
      });

      handleMenuClose();
    } catch (err) {
      console.error("Error saving prompt:", err);
      setSaveError(err.message || "Failed to save prompt");
    } finally {
      setSaveLoading((prev) => ({ ...prev, [promptId]: false }));
    }
  };

  const onSubmitAddPrompt = async () => {
    if (!newPromptTitle || !newPromptDescription) {
      setError("Please fill in title and description");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const currentUser = auth.currentUser;

      if (!currentUser) {
        throw new Error("Must be logged in to create prompts");
      }

      await addDoc(promptsCollectionRef, {
        title: newPromptTitle,
        description: newPromptDescription,
        category: newCategory,
        isVisible: newVisibilityModel,
        authorId: currentUser.uid,
        createdAt: new Date().toISOString(),
      });

      // Refresh the list
      const newData = await getDocs(promptsCollectionRef);
      const newFilteredData = newData.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setPromptList(newFilteredData);
      handleCloseDialog();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to add prompt");
    } finally {
      setLoading(false);
    }
  };

  const deletePrompt = async (id) => {
    try {
      setDeleteLoading((prev) => ({ ...prev, [id]: true }));
      setDeleteError(null);

      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("You must be logged in to delete prompts");
      }

      const promptDoc = doc(db, "prompts", id);
      const promptSnapshot = await getDoc(promptDoc);

      if (
        promptSnapshot.exists() &&
        promptSnapshot.data().authorId !== currentUser.uid
      ) {
        throw new Error("You can only delete your own prompts");
      }

      await deleteDoc(promptDoc);
      setPromptList((prevList) =>
        prevList.filter((prompt) => prompt.id !== id)
      );
    } catch (err) {
      console.error("Error deleting prompt:", err);
      setDeleteError(err.message || "Failed to delete prompt");
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const startEditing = (prompt) => {
    setEditingId(prompt.id);
    setEditForm({
      title: prompt.title,
      description: prompt.description,
      category: prompt.category || "",
      isVisible: prompt.isVisible || false,
    });
    setEditError(null);
    setEditDialogOpen(true);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({
      title: "",
      description: "",
      category: "",
      isVisible: false,
    });
    setEditError(null);
    setEditDialogOpen(false);
  };

  const handleEditSubmit = async (id) => {
    if (!editForm.title || !editForm.description) {
      setEditError("Title and description are required");
      return;
    }

    try {
      setEditLoading(true);
      setEditError(null);

      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("Must be logged in to edit prompts");
      }

      const promptDoc = doc(db, "prompts", id);
      const promptSnapshot = await getDoc(promptDoc);

      if (!promptSnapshot.exists()) {
        throw new Error("Prompt not found");
      }

      if (promptSnapshot.data().authorId !== currentUser.uid) {
        throw new Error("You can only edit your own prompts");
      }

      await updateDoc(promptDoc, {
        title: editForm.title,
        description: editForm.description,
        category: editForm.category,
        isVisible: editForm.isVisible,
        updatedAt: new Date().toISOString(),
      });

      setPromptList((prevList) =>
        prevList.map((prompt) =>
          prompt.id === id
            ? {
                ...prompt,
                ...editForm,
                updatedAt: new Date().toISOString(),
              }
            : prompt
        )
      );

      cancelEditing();
    } catch (err) {
      console.error("Error editing prompt:", err);
      setEditError(err.message || "Failed to edit prompt");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Prompts
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Prompt
        </Button>
      </Box>

      {/* Error Alerts */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {deleteError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {deleteError}
        </Alert>
      )}
      {editError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {editError}
        </Alert>
      )}
      {saveError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {saveError}
        </Alert>
      )}

      {/* Add Prompt Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#111",
            color: "#fff",
            padding: "20px",
            borderRadius: "16px",
          },
        }}
        fullWidth
      >
        <DialogTitle>Add New Prompt</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Box>
              <Typography variant="body2" sx={{ mb: 1 }}>
                Select a category or enter your own:
              </Typography>
              <TextField
                select
                label="Category"
                fullWidth
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                {[
                  "Side Hustle",
                  "App Development",
                  "Web Design",
                  "Marketing",
                  "Freelancing",
                  "Content Creation",
                  "Personal Finance",
                  "Fitness",
                  "E-commerce",
                  "Productivity",
                ].map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    sx={{ background: "#222" }}
                  >
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <Typography
                variant="body1"
                sx={{ textAlign: "center", mt: 1, mb: 1 }}
              >
                OR
              </Typography>
              <TextField
                label="Custom Category"
                fullWidth
                placeholder="Enter your own category"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </Box>
            <TextField
              label="Prompt Title"
              fullWidth
              required
              value={newPromptTitle}
              onChange={(e) => setNewPromptTitle(e.target.value)}
            />
            <TextField
              label="Prompt Description"
              fullWidth
              required
              multiline
              rows={4}
              value={newPromptDescription}
              onChange={(e) => setNewPromptDescription(e.target.value)}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={newVisibilityModel}
                  onChange={(e) => setNewVisibilityModel(e.target.checked)}
                />
              }
              label="Public"
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            onClick={onSubmitAddPrompt}
            disabled={loading}
            variant="contained"
          >
            {loading ? "Adding..." : "Add Prompt"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Prompt Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={cancelEditing}
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#111",
            color: "#fff",
            padding: "20px",
            borderRadius: "16px",
          },
        }}
        fullWidth
      >
        <DialogTitle>Edit Prompt</DialogTitle>
        <DialogContent>
          {editError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {editError}
            </Alert>
          )}
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Category"
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
              label="Title"
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
              label="Description"
              fullWidth
              required
              multiline
              rows={4}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelEditing} disabled={editLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={() => handleEditSubmit(editingId)}
            disabled={editLoading}
          >
            {editLoading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Prompts List */}
      <Grid container spacing={3}>
        {promptList?.map((prompt) => (
          <Grid size={{ xs: 12, md: 6 }} key={prompt?.id || "fallback-key"}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                position: "relative", // Required for pseudo-element positioning
                border: `1px solid #222`,
                overflow: "hidden", // Ensures the pseudo-element doesn't overflow the card
                "&:hover": {
                  border: `1px solid ${theme.palette.primary.main}`,
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: theme.palette.primary.main,
                  opacity: 0, // Initial opacity
                  transition: "opacity 0.3s ease",
                  zIndex: 0, // Ensure the overlay is behind the content
                },
                "&:hover::before": {
                  opacity: 0.2, // Adjust the overlay opacity on hover
                },
                "& > *": {
                  position: "relative", // Keeps the content above the pseudo-element
                  zIndex: 1,
                },
              }}
              onClick={() => navigate(`/main/prompts/${prompt.id}`)}
            >
              <CardContent sx={{ p: 1 }}>
                <Stack flexDirection="row" alignItems="center" mb={2}>
                  <StarIcon sx={{ color: "rgb(250, 175, 0)", mr: 1 }} />
                  <Stack sx={{ flex: 1 }}>
                    <Typography>4.6</Typography>
                  </Stack>
                  <Stack>
                    <Box
                      onClick={(e) => handleMenuOpen(e, prompt.id)}
                      sx={{
                        display: "inline-flex",
                        cursor: "pointer",
                        alignItems: "center",
                        justifyContent: "center",
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        transition: "background-color 0.3s ease",
                        backgroundColor: "transparent",
                        "&:hover": {
                          backgroundColor: "rgba(255, 255, 255, 0.1)",
                        },
                      }}
                    >
                      <MoreVertIcon sx={{ color: "white" }} />
                    </Box>
                  </Stack>
                </Stack>
                {prompt.category && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      textTransform: "uppercase",
                      fontWeight: "bold",
                      color: "#999",
                      mb: 0.5,
                    }}
                  >
                    {prompt.category}
                  </Typography>
                )}
                <Typography variant="h5" fontWeight="bold" color="#fff" mb={2}>
                  {prompt?.title}
                </Typography>
                <Box sx={{ position: "relative" }}>
                  <Typography
                    variant="body1"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      mb: 1,
                      lineHeight: 1.5,
                      color: "rgba(255, 255, 255, 0.8)",
                      position: "relative",
                    }}
                  >
                    {prompt?.description}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Menu */}
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            backgroundColor: "#222",
            color: "white",
            minWidth: "120px",
          },
        }}
      >
        {selectedPromptId &&
        promptList.find((p) => p.id === selectedPromptId)?.authorId ===
          auth.currentUser?.uid ? (
          // Show edit and delete options for prompts created by the current user
          <>
            <MenuItem
              onClick={() =>
                handleEditClick(
                  promptList.find((p) => p.id === selectedPromptId)
                )
              }
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <EditIcon />
              Edit
            </MenuItem>
            <MenuItem
              onClick={() => handleDeleteClick(selectedPromptId)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "#ff4444",
                "&:hover": {
                  backgroundColor: "rgba(255, 0, 0, 0.1)",
                },
              }}
            >
              <DeleteIcon />
              Delete
            </MenuItem>
          </>
        ) : (
          // Show save option for prompts created by other users
          <>
            <MenuItem
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <EyeIcon />
              Copy Prompt
            </MenuItem>
            <MenuItem
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <EyeIcon />
              View Prompt
            </MenuItem>
            <MenuItem
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <StarBorderIcon />
              Rank Prompt
            </MenuItem>
            <MenuItem
              onClick={() => handleSavePrompt(selectedPromptId)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <SaveIcon />
              Save Prompt
            </MenuItem>
          </>
        )}
      </Menu>
    </>
  );
}

export default PromptPage;
