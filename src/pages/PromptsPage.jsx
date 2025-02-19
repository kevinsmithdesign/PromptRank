import React, { useState } from "react";
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
  Pagination,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Add as AddIcon } from "@mui/icons-material";
import { auth } from "../../config/firebase";
import { usePrompts } from "../hooks/usePrompts";
import AddEditPromptDialog from "../components/AddEditPromptDialog";
import PromptCard from "../components/PromptCard";
import SaveToCollectionDialog from "../components/SaveToCollectionDialog";
import SearchIcon from "../icons/SearchIcon";
import SettingsIcon from "../icons/SettingsIcon";
import FilterIcon from "../icons/FilterIcon";
import FilterCategoriesDialog from "../components/FilterCategoriesDialog";
import { useCategories } from "../hooks/useCategories";

function PromptsPage() {
  const navigate = useNavigate();
  const theme = useTheme();

  // Pagination state
  const [page, setPage] = useState(1);
  const promptsPerPage = 10;

  // React Query hooks
  const {
    prompts = [],
    isLoading,
    error: queryError,
    createPrompt,
    updatePrompt,
    deletePrompt,
    createPromptLoading,
    updatePromptLoading,
    deletePromptLoading,
  } = usePrompts();

  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedPromptId, setSelectedPromptId] = useState(null);

  // Dialog States
  const [openDialog, setOpenDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [saveToCollectionOpen, setSaveToCollectionOpen] = useState(false);
  const [openCategoriesFilter, setOpenCategoriesFilter] = useState(false);

  // Form States
  const [newPromptData, setNewPromptData] = useState({
    title: "",
    description: "",
    category: "",
    isVisible: false,
  });

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    isVisible: false,
  });

  // Filter prompts based on search and category
  const filteredPrompts = prompts.filter((prompt) => {
    const matchesCategory =
      !selectedCategory ||
      prompt.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch =
      !searchQuery.trim() ||
      prompt.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.category?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const {
    categories: popularCategories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategories();

  // Pagination calculations
  const totalPages = Math.ceil(filteredPrompts.length / promptsPerPage);
  const startIndex = (page - 1) * promptsPerPage;
  const endIndex = startIndex + promptsPerPage;
  const paginatedPrompts = filteredPrompts.slice(startIndex, endIndex);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset pagination when filters change
  React.useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory]);

  // Dialog Handlers
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewPromptData({
      title: "",
      description: "",
      category: "",
      isVisible: false,
    });
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

  // CRUD Operations
  const handleCreatePrompt = async () => {
    if (!newPromptData.title || !newPromptData.description) {
      return;
    }

    try {
      await createPrompt(newPromptData);
      handleCloseDialog();
    } catch (err) {
      console.error("Error creating prompt:", err);
    }
  };

  const handleEditPrompt = async (id) => {
    if (!id || !editForm.title || !editForm.description) {
      console.error("Missing required fields for edit");
      return;
    }

    try {
      await updatePrompt({
        id,
        title: editForm.title,
        description: editForm.description,
        category: editForm.category,
        isVisible: editForm.isVisible,
      });
      setEditDialogOpen(false);
      setSelectedPromptId(null);
      setEditForm({
        title: "",
        description: "",
        category: "",
        isVisible: false,
      });
    } catch (err) {
      console.error("Error updating prompt:", err);
    }
  };

  const handleDeletePrompt = async (id) => {
    try {
      await deletePrompt(id);
      handleMenuClose();
    } catch (err) {
      console.error("Error deleting prompt:", err);
    }
  };

  const startEditing = (prompt) => {
    setEditForm({
      title: prompt.title,
      description: prompt.description,
      category: prompt.category || "",
      isVisible: prompt.isVisible || false,
    });
    setSelectedPromptId(prompt.id);
    setEditDialogOpen(true);
  };

  const handleEditClick = (prompt) => {
    handleMenuClose();
    startEditing(prompt);
  };

  const handleSavePrompt = (promptId) => {
    setSelectedPromptId(promptId);
    setSaveToCollectionOpen(true);
    handleMenuClose();
  };

  const cancelEditing = () => {
    setEditDialogOpen(false);
    setSelectedPromptId(null);
    setEditForm({
      title: "",
      description: "",
      category: "",
      isVisible: false,
    });
  };

  // const popularCategories = [
  //   { text: "SEO", path: "/SEO" },
  //   { text: "Content Creation", path: "/ContentCreation" },
  //   { text: "Marketing Strategies", path: "/MarketingStrategies" },
  //   { text: "Web Development", path: "/WebDevelopment" },
  //   { text: "E-commerce", path: "/Ecommerce" },
  //   { text: "Social Media Management", path: "/SocialMediaManagement" },
  //   { text: "Business Planning", path: "/BusinessPlanning" },
  //   { text: "Financial Planning", path: "/FinancialPlanning" },
  //   { text: "Resume Builder", path: "/ResumeBuilder" },
  //   { text: "Side Hustle", path: "/SideHustle" },
  // ];

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
        Add prompts, rank prompts, create collections, and learn about AI tools.
      </Typography>

      {/* Search and Add Section */}
      <Grid container mb={3} spacing={4}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack flexDirection="row">
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
                mr: 2,
              }}
            />
            <Button
              variant="contained"
              onClick={() => setOpenCategoriesFilter(true)}
            >
              <FilterIcon />
            </Button>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack
            flexDirection="row"
            justifyContent={{ sm: "flex-start", md: "flex-end" }}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpenDialog(true)}
              disabled={!auth.currentUser}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              Add Prompt
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Categories Scroll */}
      <Stack
        flexDirection="row"
        gap={1}
        mb={6}
        sx={{
          overflowX: "auto",
          scrollbarWidth: "none",
          cursor: "grab",
          "&:active": { cursor: "grabbing" },
          "&::-webkit-scrollbar": { display: "none" },
        }}
        onMouseDown={(e) => {
          const ele = e.currentTarget;
          const startPos = { left: ele.scrollLeft, x: e.clientX };

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
          onClick={() => setSelectedCategory(null)}
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
            onClick={() => setSelectedCategory(text)}
          >
            {text}
          </Button>
        ))}
      </Stack>

      {/* Error Handling */}
      {queryError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {queryError.message}
        </Alert>
      )}

      {/* Dialogs */}
      <AddEditPromptDialog
        openDialog={openDialog}
        handleCloseDialog={handleCloseDialog}
        newCategory={newPromptData.category}
        setNewCategory={(category) =>
          setNewPromptData((prev) => ({ ...prev, category }))
        }
        newPromptTitle={newPromptData.title}
        setNewPromptTitle={(title) =>
          setNewPromptData((prev) => ({ ...prev, title }))
        }
        newPromptDescription={newPromptData.description}
        setNewPromptDescription={(description) =>
          setNewPromptData((prev) => ({ ...prev, description }))
        }
        onSubmitAddPrompt={handleCreatePrompt}
        editDialogOpen={editDialogOpen}
        cancelEditing={cancelEditing}
        loading={createPromptLoading}
        editError={null}
        editForm={editForm}
        setEditForm={setEditForm}
        editLoading={updatePromptLoading}
        handleEditSubmit={handleEditPrompt}
        editingId={selectedPromptId}
      />

      {/* Prompts List */}
      <PromptCard
        loading={isLoading}
        filteredPrompts={paginatedPrompts}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        promptList={prompts}
        handleMenuOpen={handleMenuOpen}
        handleMenuClose={handleMenuClose}
        menuAnchorEl={menuAnchorEl}
        selectedPromptId={selectedPromptId}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeletePrompt}
        handleSavePrompt={handleSavePrompt}
        auth={auth}
        navigate={navigate}
        theme={theme}
      />

      {/* Pagination */}
      {filteredPrompts.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            variant="outlined"
            shape="rounded"
            color="primary"
            sx={{
              "& .MuiPaginationItem-root": {
                color: "white", // Makes the numbers white
                borderColor: "rgba(255, 255, 255, 0.3)", // Lighter border for inactive buttons
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)", // Subtle hover effect
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
                "&.Mui-selected": {
                  borderColor: theme.palette.primary.main, // Keeps the active state border color
                },
              },
              "& .MuiPaginationItem-icon": {
                // Styles for next/previous arrows
                color: "white",
              },
            }}
          />
        </Box>
      )}

      <SaveToCollectionDialog
        open={saveToCollectionOpen}
        onClose={() => setSaveToCollectionOpen(false)}
        promptId={selectedPromptId}
        onSave={(collectionId) => {
          console.log(
            `Saved prompt ${selectedPromptId} to collection ${collectionId}`
          );
          setSaveToCollectionOpen(false);
        }}
      />
      <FilterCategoriesDialog
        open={openCategoriesFilter}
        onClose={() => setOpenCategoriesFilter(false)}
      />
    </>
  );
}

export default PromptsPage;
