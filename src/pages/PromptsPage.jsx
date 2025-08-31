import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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
  Breadcrumbs,
  Link,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Add as AddIcon } from "@mui/icons-material";

import { auth } from "../../config/firebase";
import { usePrompts } from "../hooks/usePrompts";
import AddEditPromptDialog from "../components/AddEditPromptDialog";
import PromptCard from "../components/PromptCard";
import SaveToCollectionDialog from "../components/SaveToCollectionDialog";
import SearchIcon from "../icons/SearchIcon";
import FilterIcon from "../icons/FilterIcon";
import FilterCategoriesDialog from "../components/FilterCategoriesDialog";
import { useCategories } from "../hooks/useCategories";

function PromptsPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const SITE_NAME = "AI Prompts Library"; // Consider moving to config

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

  // Scroll Categories
  const scrollRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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

  // SEO metadata
  const pageTitle = selectedCategory
    ? `${selectedCategory} Prompts - ${SITE_NAME}`
    : searchQuery
    ? `Search Results for "${searchQuery}" - ${SITE_NAME}`
    : `Browse AI Prompts - ${SITE_NAME}`;

  const pageDescription = selectedCategory
    ? `Explore our curated collection of ${selectedCategory} AI prompts. Find and save the best prompts for your needs.`
    : "Discover and manage AI prompts, create collections, and learn about AI tools. Browse our extensive library of AI prompts for various use cases.";

  const canonicalUrl = new URL(
    `/prompts${selectedCategory ? `/${selectedCategory.toLowerCase()}` : ""}`,
    window.location.origin
  ).toString();

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

  const { categories: popularCategories = [], isLoading: categoriesLoading } =
    useCategories();

  // Pagination calculations
  const totalPages = Math.ceil(filteredPrompts.length / promptsPerPage);
  const startIndex = (page - 1) * promptsPerPage;
  const endIndex = startIndex + promptsPerPage;
  const paginatedPrompts = filteredPrompts.slice(startIndex, endIndex);

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory]);

  // Event Handlers
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    if (!newPromptData.title || !newPromptData.description) return;

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
        ...editForm,
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

  // Add these handlers in your component
  const handleMouseDown = (e) => {
    setIsScrolling(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsScrolling(false);
  };

  const handleMouseUp = () => {
    setIsScrolling(false);
  };

  const handleMouseMove = (e) => {
    if (!isScrolling) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = x - startX; // Adjust multiplier for faster/slower scroll
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />

        {/* Open Graph tags */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />

        <link rel="canonical" href={canonicalUrl} />

        {/* Prevent indexing of search/paginated results */}
        {(searchQuery || page > 1) && (
          <meta name="robots" content="noindex, follow" />
        )}

        {/* Structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: pageTitle,
            description: pageDescription,
            numberOfItems: filteredPrompts.length,
            url: canonicalUrl,
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: window.location.origin,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Prompts",
                  item: `${window.location.origin}/prompts`,
                },
                ...(selectedCategory
                  ? [
                      {
                        "@type": "ListItem",
                        position: 3,
                        name: selectedCategory,
                        item: canonicalUrl,
                      },
                    ]
                  : []),
              ],
            },
          })}
        </script>
      </Helmet>

      {/* <Box
        sx={{
          mb: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <Typography variant="h1" fontSize="2rem" fontWeight="bold">
          Prompts
        </Typography>
      </Box>

      <Typography variant="body1" mb={2} component="p">
        Add prompts, rank prompts, create collections, and learn about AI tools.
      </Typography> */}

      <Box
        component="header"
        sx={{
          mb: 2,
          display: "flex",
          flexDirection: "column",
          gap: 0.5,
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          fontWeight="bold"
          sx={{
            fontSize: { xs: "2rem", sm: "2.5rem" },
          }}
        >
          Prompts
        </Typography>
        <Typography component="p" variant="subtitle1" color="white">
          Add prompts, rank prompts, create collections, and learn about AI
          tools.
        </Typography>
      </Box>

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
              aria-label="Filter categories"
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
              onClick={() => {
                if (auth.currentUser) {
                  setOpenDialog(true);
                } else {
                  // Prompt user to log in or sign up
                  navigate("/login");
                }
              }}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              Add Prompt
            </Button>
          </Stack>
        </Grid>
      </Grid>

      {/* Categories Section */}
      {/* <Stack
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
        role="tablist"
        aria-label="Prompt categories"
      > */}
      <Stack
        ref={scrollRef}
        flexDirection="row"
        gap={1}
        mb={6}
        sx={{
          overflowX: "auto",
          scrollbarWidth: "none",
          cursor: isScrolling ? "grabbing" : "grab",
          "&:active": { cursor: "grabbing" },
          "&::-webkit-scrollbar": { display: "none" },
          userSelect: "none", // Prevent text selection while dragging
        }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        role="tablist"
        aria-label="Prompt categories"
      >
        <Button
          role="tab"
          aria-selected={!selectedCategory}
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
            role="tab"
            aria-selected={selectedCategory === text}
            sx={{
              background:
                selectedCategory === text ? theme.palette.primary.main : "#111",
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
        handleEditClick={startEditing}
        handleDeleteClick={handleDeletePrompt}
        handleSavePrompt={(promptId) => {
          setSelectedPromptId(promptId);
          setSaveToCollectionOpen(true);
          handleMenuClose();
        }}
        auth={auth}
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
                color: "white",
                borderColor: "rgba(255, 255, 255, 0.3)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderColor: "rgba(255, 255, 255, 0.5)",
                },
                "&.Mui-selected": {
                  borderColor: theme.palette.primary.main,
                },
              },
              "& .MuiPaginationItem-icon": {
                color: "white",
              },
            }}
            aria-label="Prompts pagination"
          />
        </Box>
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
        cancelEditing={() => {
          setEditDialogOpen(false);
          setSelectedPromptId(null);
          setEditForm({
            title: "",
            description: "",
            category: "",
            isVisible: false,
          });
        }}
        loading={createPromptLoading}
        editError={null}
        editForm={editForm}
        setEditForm={setEditForm}
        editLoading={updatePromptLoading}
        handleEditSubmit={handleEditPrompt}
        editingId={selectedPromptId}
      />

      <SaveToCollectionDialog
        open={saveToCollectionOpen}
        onClose={() => setSaveToCollectionOpen(false)}
        promptId={selectedPromptId}
        onSave={(collectionId) => {
          console.log(
            `Saved prompt ${selectedPromptId} to collection ${collectionId}`
          );
          // Dialog stays open for multi-select - user closes with Done button
        }}
        onRemove={(collectionId) => {
          console.log(
            `Removed prompt ${selectedPromptId} from collection ${collectionId}`
          );
          // Dialog stays open for multi-select - user closes with Done button
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
