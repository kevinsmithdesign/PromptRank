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

import { Add as AddIcon } from "@mui/icons-material";
import SaveToCollectionDialog from "../components/SaveToCollectionDialog";

import Grid from "@mui/material/Grid2";
import StarIcon from "@mui/icons-material/Star";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import EditIcon from "../icons/EditIcon";
import DeleteIcon from "../icons/DeleteIcon";
import SaveIcon from "../icons/SaveIcon";
import EyeIcon from "../icons/EyeIcon";
import SearchIcon from "../icons/SearchIcon";
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
  increment,
  query,
  orderBy,
} from "firebase/firestore";

const NoResultsMessage = ({ searchQuery, selectedCategory }) => {
  if (!searchQuery && !selectedCategory) return null;

  let message = "No prompts found";
  if (selectedCategory && searchQuery) {
    message += ` in category "${selectedCategory}" matching "${searchQuery}"`;
  } else if (selectedCategory) {
    message += ` in category "${selectedCategory}"`;
  } else if (searchQuery) {
    message += ` matching "${searchQuery}"`;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "200px",
        width: "100%",
        gap: 2,
      }}
    >
      <Typography variant="h6" color="white">
        {message}
      </Typography>
    </Box>
  );
};

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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredPrompts, setFilteredPrompts] = useState([]);

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
  const [saveToCollectionOpen, setSaveToCollectionOpen] = useState(false);

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

  useEffect(() => {
    let filtered = [...promptList];

    // Apply category filter if selected
    if (selectedCategory) {
      filtered = filtered.filter(
        (prompt) =>
          prompt.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply search filter if there's a search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (prompt) =>
          prompt.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          prompt.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          prompt.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPrompts(filtered);
  }, [searchQuery, promptList, selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory((prevCategory) =>
      prevCategory === category ? null : category
    );
  };

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
    setSelectedPromptId(promptId);
    setSaveToCollectionOpen(true);
    handleMenuClose();
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

  const handleCollectionSave = (collectionId) => {
    console.log(`Saved prompt to collection ${collectionId}`);
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSearchQuery("");
  };

  const popularCategories = [
    { text: "UI/UX Design", path: "/UIUXDesign" },
    { text: "Web Development", path: "/UIUXDesign" },
    { text: "Side Hustle", path: "/UIUXDesign" },
    { text: "Content Creation", path: "/UIUXDesign" },
    { text: "Trading Strategies", path: "/UIUXDesign" },
    { text: "Resume Builder", path: "/UIUXDesign" },
    { text: "Business", path: "/UIUXDesign" },
    { text: "Marketing Strategies", path: "/UIUXDesign" },
  ];

  return (
    <>
      <Box
        sx={{
          mb: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Prompts
        </Typography>
      </Box>
      <Typography variant="body1" mb={2}>
        Add prompts, rank prompts, and learn about AI tools.
      </Typography>
      <Grid container mb={3} spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            placeholder="Search Prompts and Prompt Categories"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton edge="start" disabled>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              ".MuiOutlinedInput-root input": {
                paddingLeft: 0,
              },
              "& .MuiInputBase-input": {
                paddingLeft: 0,
              },
              "& .MuiInputAdornment-positionStart": {
                marginRight: 0,
              },
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack flexDirection="row" justifyContent="flex-end">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              disabled={!auth.currentUser}
            >
              Add Prompt
            </Button>
          </Stack>
        </Grid>
      </Grid>
      {/* <Stack
        flexDirection="row"
        gap={1}
        mb={6}
        sx={{
          overflowX: "auto",
          scrollbarWidth: "none",
          cursor: "grab",
          "&:active": {
            cursor: "grabbing",
          },
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
        onMouseDown={(e) => {
          const ele = e.currentTarget;
          const startPos = {
            left: ele.scrollLeft,
            x: e.clientX,
          };

          const onMouseMove = (e) => {
            const dx = e.clientX - startPos.x;
            ele.scrollLeft = startPos.left - dx;
          };

          const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
          };

          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        }}
      >
        {popularCategories.map(({ text, path }) => (
          <Button
            key={path}
            sx={{
              background:
                selectedCategory === text ? theme.palette.primary.main : "#222",
              padding: "16px 24px",
              borderRadius: "32px",
              color: "white",
              fontWeight: "bold",
              flexShrink: 0,
              whiteSpace: "nowrap",
              "&:hover": {
                background:
                  selectedCategory === text
                    ? theme.palette.primary.dark
                    : "rgba(255, 255, 255, 0.1)",
              },
            }}
            onClick={() => handleCategoryClick(text)}
          >
            {text}
          </Button>
        ))}
      </Stack> */}

      <Stack
        flexDirection="row"
        gap={1}
        mb={6}
        sx={{
          overflowX: "auto",
          scrollbarWidth: "none",
          cursor: "grab",
          "&:active": {
            cursor: "grabbing",
          },
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}
        onMouseDown={(e) => {
          const ele = e.currentTarget;
          const startPos = {
            left: ele.scrollLeft,
            x: e.clientX,
          };

          const onMouseMove = (e) => {
            const dx = e.clientX - startPos.x;
            ele.scrollLeft = startPos.left - dx;
          };

          const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
          };

          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        }}
      >
        {/* View All button */}
        <Button
          sx={{
            background: !selectedCategory ? theme.palette.primary.main : "#222",
            padding: "16px 24px",
            borderRadius: "32px",
            color: "white",
            fontWeight: "bold",
            flexShrink: 0,
            whiteSpace: "nowrap",
            "&:hover": {
              background: !selectedCategory
                ? theme.palette.primary.dark
                : "rgba(255, 255, 255, 0.1)",
            },
          }}
          onClick={handleReset}
        >
          View All
        </Button>

        {popularCategories.map(({ text, path }) => (
          <Button
            key={path}
            sx={{
              background:
                selectedCategory === text ? theme.palette.primary.main : "#222",
              padding: "16px 24px",
              borderRadius: "32px",
              color: "white",
              fontWeight: "bold",
              flexShrink: 0,
              whiteSpace: "nowrap",
              "&:hover": {
                background:
                  selectedCategory === text
                    ? theme.palette.primary.dark
                    : "rgba(255, 255, 255, 0.1)",
              },
            }}
            onClick={() => handleCategoryClick(text)}
          >
            {text}
          </Button>
        ))}
      </Stack>

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

      {/* Prompts List */}
      <Grid container spacing={3}>
        {(filteredPrompts.length > 0
          ? filteredPrompts
          : !searchQuery && !selectedCategory
          ? promptList
          : []
        ).map((prompt) => (
          <Grid size={{ xs: 12, md: 6 }} key={prompt?.id || "fallback-key"}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                position: "relative",
                border: `1px solid #222`,
                overflow: "hidden",
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
                  opacity: 0,
                  transition: "opacity 0.3s ease",
                  zIndex: 0,
                },
                "&:hover::before": {
                  opacity: 0.2,
                },
                "& > *": {
                  position: "relative",
                  zIndex: 1,
                },
              }}
              onClick={() => navigate(`/main/prompts/${prompt.id}`)}
            >
              <CardContent sx={{ p: 1 }}>
                <Stack flexDirection="row" alignItems="center" mb={2}>
                  <StarIcon sx={{ color: "rgb(250, 175, 0)", mr: 1 }} />
                  <Stack sx={{ flex: 1 }}>
                    <Typography>
                      {prompt.avgRating?.toFixed(1) || "No ratings"}
                    </Typography>
                  </Stack>
                  {prompt.totalRatings > 0 && (
                    <Typography color="#999" fontSize="0.875rem">
                      ({prompt.totalRatings}{" "}
                      {prompt.totalRatings === 1 ? "review" : "reviews"})
                    </Typography>
                  )}
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

      {/* No Results Message */}
      {(searchQuery || selectedCategory) && filteredPrompts.length === 0 && (
        <NoResultsMessage
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
        />
      )}

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
              onClick={() => navigate(`/main/prompts/${selectedPromptId}`)}
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
      <SaveToCollectionDialog
        open={saveToCollectionOpen}
        onClose={() => setSaveToCollectionOpen(false)}
        promptId={selectedPromptId}
        onSave={handleCollectionSave}
      />
    </>
  );
}

export default PromptPage;
