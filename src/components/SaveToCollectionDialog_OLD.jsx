import React, { useState, useEffect } from "react";
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
  Checkbox,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { auth } from "../../config/firebase";
import { useCollections } from "../hooks/useCollections";
import BackIcon from "../icons/BackIcon";

const SaveToCollectionDialog = ({ open, onClose, promptId, promptTitle, onSave, onRemove }) => {
  const theme = useTheme();
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [isEditingCollection, setIsEditingCollection] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [activeCollectionId, setActiveCollectionId] = useState(null);

  // Collection form states
  const [collectionName, setCollectionName] = useState("");

  const { collections, loading, error, createCollection, updateCollection, deleteCollection, saveToCollection, removeFromCollection } = useCollections();

  // Initialize selected collections with collections that already contain this prompt
  useEffect(() => {
    if (collections && promptId) {
      const collectionsWithPrompt = collections.filter(collection => 
        collection.prompts?.some(p => p.id === promptId)
      );
      setSelectedCollections(new Set(collectionsWithPrompt.map(c => c.id)));
    }
  }, [collections, promptId]);

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

  const handleCollectionToggle = async (collectionId, isChecked) => {
    try {
      if (isChecked) {
        // Add prompt to collection using real Firebase function
        await saveToCollection(
          { collectionId, promptId },
          {
            onSuccess: () => {
              setSelectedCollections(prev => new Set([...prev, collectionId]));
              console.log(`Successfully added prompt ${promptId} to collection ${collectionId}`);
            },
            onError: (error) => {
              console.error("Error adding to collection:", error);
              setError("Failed to add to collection. Please try again.");
            }
          }
        );
      } else {
        // Remove prompt from collection using real Firebase function
        await removeFromCollection(
          { collectionId, promptId },
          {
            onSuccess: () => {
              setSelectedCollections(prev => {
                const newSet = new Set(prev);
                newSet.delete(collectionId);
                return newSet;
              });
              console.log(`Successfully removed prompt ${promptId} from collection ${collectionId}`);
            },
            onError: (error) => {
              console.error("Error removing from collection:", error);
              setError("Failed to remove from collection. Please try again.");
            }
          }
        );
      }
    } catch (error) {
      console.error("Error toggling collection:", error);
      setError("Failed to update collection. Please try again.");
    }
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
            // Collection created successfully
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



  const handleBackToList = () => {
    setIsCreatingCollection(false);
    setIsEditingCollection(false);
    setCollectionName("");
    setActiveCollectionId(null);
  };

  const handleClose = () => {
    setSelectedCollections(new Set());
    setIsCreatingCollection(false);
    setIsEditingCollection(false);
    setCollectionName("");
    setSearchTerm("");
    setActiveCollectionId(null);
    setMenuAnchorEl(null);

    onClose();
  };

  const getPromptCount = (collection) => {
    const baseCount = Array.isArray(collection.prompts) ? collection.prompts.length : 0;
    const isCurrentlySelected = selectedCollections.has(collection.id);
    const wasOriginallyInCollection = collection.prompts?.some(p => p.id === promptId);
    
    // If currently selected but wasn't originally in collection, add 1
    if (isCurrentlySelected && !wasOriginallyInCollection) {
      return baseCount + 1;
    }
    // If not currently selected but was originally in collection, subtract 1
    if (!isCurrentlySelected && wasOriginallyInCollection) {
      return baseCount - 1;
    }
    // Otherwise return the base count
    return baseCount;
  };

  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#111",
          color: "#fff",
          maxWidth: "600px",
          width: "100%",
          margin: "32px",
        },
      }}
    >
      <Box sx={{ width: "100%", mx: "auto", p: 2 }}>
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



          <Stack flexDirection="row" sx={{ mb: 4 }}>
            <Stack sx={{ flex: 1 }}>
              <Box>
                <IconButton
                  // onClick={() => navigate(-1)}
                  onClick={handleClose}
                  disabled={loading}
                  sx={{
                    background: "#444",
                    p: 2,
                    "&:hover": { background: "#333" },
                  }}
                >
                  <BackIcon />
                </IconButton>
              </Box>
            </Stack>

            <Stack>
              <Button
                variant="contained"
                onClick={() => setIsCreatingCollection(true)}
              >
                Add New Collection
              </Button>
            </Stack>
          </Stack>

          {!isCreatingCollection && !isEditingCollection && (
            <Stack flexDirection="row" mb={4}>
              <Stack flexGrow={1} mr={3}>
                <Typography variant="h5" fontWeight="bold" mb={1}>
                  Save to Collection
                </Typography>
                {promptTitle && (
                  <Box 
                    sx={{ 
                      backgroundColor: "#222", 
                      padding: "12px 16px", 
                      borderRadius: "8px", 
                      mb: 3,
                      border: "1px solid #444"
                    }}
                  >
                    <Typography variant="body2" color="#aaa" mb={0.5}>
                      Adding this prompt:
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {promptTitle}
                    </Typography>
                  </Box>
                )}

                <TextField
                  fullWidth
                  placeholder="Search collections..."
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{
                    backgroundColor: "#222",
                    borderRadius: 1,
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#333",
                      },
                      "&:hover fieldset": {
                        borderColor: "#444",
                      },
                    },
                  }}
                />
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
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : filteredCollections.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{ textAlign: "center", mb: 1 }}
                  >
                    {collections.length === 0
                      ? "No collections found. Create your first collection!"
                      : "No matching collections found."}
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1}>
                  <Typography fontWeight="bold">Prompt Collections</Typography>
                  {/* Scrollable container for collections */}
                  <Box
                    sx={{
                      maxHeight: "400px",
                      overflowY: "auto",
                      "&::-webkit-scrollbar": {
                        width: "8px",
                      },
                      "&::-webkit-scrollbar-track": {
                        background: "#333",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "#666",
                        borderRadius: "4px",
                      },
                      "&::-webkit-scrollbar-thumb:hover": {
                        background: "#666",
                      },
                    }}
                  >
                    <Stack spacing={1}>
                      {filteredCollections.map((collection) => (
                        <Card
                          key={collection.id}
                          sx={{
                            backgroundColor: "#222",
                            border: "1px solid #444",
                            "&:hover": {
                              borderColor: theme.palette.primary.main,
                            },
                          }}
                        >
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Checkbox
                              checked={selectedCollections.has(collection.id)}
                              onChange={(e) => handleCollectionToggle(collection.id, e.target.checked)}
                              sx={{
                                color: "#666",
                                "&.Mui-checked": {
                                  color: theme.palette.primary.main,
                                },
                              }}
                            />
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body1">
                                {collection.name}
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "rgba(255, 255, 255, 0.7)" }}
                              >
                                {getPromptCount(collection)} prompts
                              </Typography>
                            </Box>
                            <IconButton
                              onClick={(e) => handleMenuOpen(e, collection.id)}
                              sx={{ color: "white" }}
                            >
                              <MoreVertIcon />
                            </IconButton>
                          </Stack>
                        </Card>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              )}
            </Stack>
          )}

          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                background: "#222",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
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
              {isCreatingCollection ? (
                <Button
                  onClick={handleCreateCollection}
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Create Collection"}
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
                  onClick={handleClose}
                  variant="contained"
                  sx={{
                    backgroundColor: "#1a1a1a",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#333",
                    },
                  }}
                >
                  Done
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
