import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Stack,
  Box,
  Alert,
  useTheme,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { Add as AddIcon } from "@mui/icons-material";
import SaveToCollectionDialog from "../components/SaveToCollectionDialog";

import SearchIcon from "../icons/SearchIcon";

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
import AddEditPromptDialog from "../components/AddEditPromptDialog";
import PromptCard from "../components/PromptCard";

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
      <AddEditPromptDialog
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        newPromptTitle={newPromptTitle}
        setNewPromptTitle={setNewPromptTitle}
        newPromptDescription={newPromptDescription}
        setNewPromptDescription={setNewPromptDescription}
        onSubmitAddPrompt={onSubmitAddPrompt}
        editDialogOpen={editDialogOpen}
        cancelEditing={cancelEditing}
        loading={loading}
        editError={editError}
        editForm={editForm}
        setEditForm={setEditForm}
        editLoading={editLoading}
        handleEditSubmit={handleEditSubmit}
        editingId={editingId}
      />
      {/* Prompts List */}
      <PromptCard
        filteredPrompts={filteredPrompts}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        promptList={promptList}
        handleMenuOpen={handleMenuOpen}
        handleMenuClose={handleMenuClose}
        menuAnchorEl={menuAnchorEl}
        selectedPromptId={selectedPromptId}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
        handleSavePrompt={handleSavePrompt}
        auth={auth}
        navigate={navigate}
        theme={theme}
      />
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
