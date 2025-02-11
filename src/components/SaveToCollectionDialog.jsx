import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  Button,
  TextField,
  Card,
  CardContent,
  Typography,
  Stack,
  Alert,
  Box,
  CircularProgress,
  IconButton,
  useTheme,
  Menu,
  MenuItem,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { auth } from "../../config/firebase";
import { useCollections } from "../hooks/useCollections";

const SaveToCollectionDialog = ({ open, onClose, promptId, onSave }) => {
  const theme = useTheme();
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [isEditingCollection, setIsEditingCollection] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [duplicateError, setDuplicateError] = useState("");
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [activeCollectionId, setActiveCollectionId] = useState(null);

  // Collection form states
  const [collectionName, setCollectionName] = useState("");

  const {
    collections,
    isLoading,
    error,
    createCollection,
    createCollectionLoading,
    saveToCollection,
    saveToCollectionLoading,
    updateCollection,
    deleteCollection,
    updateCollectionLoading,
    deleteCollectionLoading,
  } = useCollections();

  const handleMenuOpen = (event, collectionId) => {
    event.stopPropagation();
    setActiveCollectionId(collectionId);
    setMenuAnchorEl(event.currentTarget);
    console.log("Menu opened for collection:", collectionId);
  };

  const handleMenuClose = (event) => {
    if (event) {
      event.stopPropagation();
    }
    setMenuAnchorEl(null);
  };

  const handleCollectionSelect = (collectionId) => {
    setSelectedCollection(collectionId);
  };

  const handleEditCollection = (event) => {
    event.stopPropagation();
    const collection = collections.find((c) => c.id === activeCollectionId);
    if (collection) {
      setCollectionName(collection.name || "");
      setIsEditingCollection(true);
      setActiveCollectionId(collection.id);
    }
    handleMenuClose();
    console.log("Editing collection:", collection);
  };

  const handleDeleteCollection = async (event) => {
    event.stopPropagation();
    if (!activeCollectionId) {
      console.log("No collection selected for deletion");
      return;
    }

    if (window.confirm("Are you sure you want to delete this collection?")) {
      try {
        console.log("Deleting collection:", activeCollectionId);

        await deleteCollection(
          { id: activeCollectionId },
          {
            onSuccess: () => {
              console.log("Delete successful");
              if (selectedCollection === activeCollectionId) {
                setSelectedCollection(null);
              }
              handleMenuClose();
            },
            onError: (error) => {
              console.error("Error deleting collection:", error);
            },
          }
        );
      } catch (error) {
        console.error("Delete failed:", error);
      } finally {
        handleMenuClose();
      }
    } else {
      handleMenuClose();
    }
  };

  const handleCreateCollection = async () => {
    if (!collectionName.trim()) {
      return;
    }

    try {
      await createCollection(
        {
          name: collectionName,
        },
        {
          onSuccess: (newCollection) => {
            setSelectedCollection(newCollection.id);
            handleBackToList();
          },
        }
      );
    } catch (error) {
      console.error("Error creating collection:", error);
    }
  };

  const handleUpdateCollection = async () => {
    if (!collectionName.trim()) {
      console.log("Collection name is required");
      return;
    }

    if (!activeCollectionId) {
      console.log("No collection selected for update");
      return;
    }

    try {
      console.log("Updating collection:", {
        id: activeCollectionId,
        name: collectionName,
      });

      await updateCollection(
        {
          id: activeCollectionId,
          name: collectionName.trim(),
        },
        {
          onSuccess: () => {
            console.log("Update successful");
            handleBackToList();
          },
          onError: (error) => {
            console.error("Error updating collection:", error);
          },
        }
      );
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleSave = async () => {
    if (!selectedCollection) {
      return;
    }

    // Find the selected collection
    const selectedCollectionData = collections.find(
      (c) => c.id === selectedCollection
    );

    // Check if prompt already exists in collection
    const isDuplicate = selectedCollectionData?.prompts?.some(
      (p) => p.id === promptId
    );

    if (isDuplicate) {
      setDuplicateError("This prompt is already in the selected collection");
      setTimeout(() => {
        setDuplicateError("");
      }, 3000);
      return;
    }

    saveToCollection(
      {
        collectionId: selectedCollection,
        promptId,
      },
      {
        onSuccess: () => {
          onSave(selectedCollection);
          handleClose();
        },
        onError: (error) => {
          console.error("Error saving to collection:", error);
          setDuplicateError("Error saving prompt to collection");
          setTimeout(() => {
            setDuplicateError("");
          }, 3000);
        },
      }
    );
  };

  const handleBackToList = () => {
    setIsCreatingCollection(false);
    setIsEditingCollection(false);
    setCollectionName("");
    setActiveCollectionId(null);
  };

  const handleClose = () => {
    setSelectedCollection(null);
    setIsCreatingCollection(false);
    setIsEditingCollection(false);
    setCollectionName("");
    setSearchTerm("");
    setActiveCollectionId(null);
    setMenuAnchorEl(null);
    onClose();
  };

  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
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
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.message === "not-logged-in" ? (
                <span>
                  You must be{" "}
                  <Link
                    to="/login"
                    style={{ color: "#d32f2f", textDecoration: "underline" }}
                  >
                    logged in
                  </Link>{" "}
                  to view collections
                </span>
              ) : (
                error.message
              )}
            </Alert>
          )}

          {duplicateError && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {duplicateError}
            </Alert>
          )}

          <Stack direction="row" alignItems="center" spacing={2} mb={1}>
            {(isCreatingCollection || isEditingCollection) && (
              <IconButton
                onClick={handleBackToList}
                size="small"
                sx={{ color: "white", ml: -1 }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
          </Stack>

          {!isCreatingCollection && !isEditingCollection && (
            <Stack flexDirection="row" mb={2}>
              <Stack flexGrow={1} mr={3}></Stack>
              <Stack>
                <Button
                  variant="contained"
                  onClick={() => setIsCreatingCollection(true)}
                >
                  Add New Collection
                </Button>
              </Stack>
            </Stack>
          )}

          {isCreatingCollection || isEditingCollection ? (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Collection Name"
                fullWidth
                required
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                autoFocus
              />
            </Stack>
          ) : (
            <Stack spacing={2} sx={{ mt: 1 }}>
              {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : filteredCollections.length === 0 ? (
                <Typography variant="body1" sx={{ textAlign: "center", py: 4 }}>
                  {collections.length === 0
                    ? "No collections found. Create your first collection!"
                    : "No matching collections found."}
                </Typography>
              ) : (
                <Stack spacing={1}>
                  <Typography fontWeight="bold">Prompt Collections</Typography>
                  {filteredCollections.map((collection) => (
                    <Card
                      key={collection.id}
                      onClick={() => handleCollectionSelect(collection.id)}
                      sx={{
                        height: "100%",
                        padding: 2,
                        borderRadius: "16px",

                        display: "flex",
                        flexDirection: "column",
                        cursor: "pointer",
                        position: "relative",
                        border:
                          selectedCollection === collection.id
                            ? `1px solid ${theme.palette.primary.main}`
                            : `1px solid #222`,
                        overflow: "hidden",
                        backgroundColor:
                          selectedCollection === collection.id
                            ? "rgba(25, 118, 210, 0.08)"
                            : "#222",
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
                          opacity: 0.1,
                        },
                        "& > *": {
                          position: "relative",
                          zIndex: 1,
                        },
                      }}
                    >
                      <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1">
                              {collection.name}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                            >
                              {Array.isArray(collection.prompts)
                                ? collection.prompts.length
                                : 0}{" "}
                              prompts
                            </Typography>
                          </Box>
                          <IconButton
                            onClick={(e) => handleMenuOpen(e, collection.id)}
                            sx={{ color: "white" }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </Stack>
          )}

          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleEditCollection}>Edit</MenuItem>
            <MenuItem
              onClick={handleDeleteCollection}
              sx={{ color: "error.main" }}
            >
              Delete
            </MenuItem>
          </Menu>

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Stack flexDirection="row" gap={2}>
              <Button
                variant="outlined"
                onClick={handleClose}
                disabled={createCollectionLoading || saveToCollectionLoading}
              >
                Cancel
              </Button>
              {isCreatingCollection ? (
                <Button
                  onClick={handleCreateCollection}
                  variant="contained"
                  disabled={createCollectionLoading}
                >
                  {createCollectionLoading ? "Loading..." : "Create Collection"}
                </Button>
              ) : isEditingCollection ? (
                <Button
                  onClick={handleUpdateCollection}
                  variant="contained"
                  disabled={updateCollectionLoading}
                >
                  {updateCollectionLoading
                    ? "Updating..."
                    : "Update Collection"}
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  variant="contained"
                  disabled={
                    saveToCollectionLoading || isLoading || !selectedCollection
                  }
                >
                  {saveToCollectionLoading
                    ? "Loading..."
                    : "Save to Collection"}
                </Button>
              )}
            </Stack>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default SaveToCollectionDialog;
