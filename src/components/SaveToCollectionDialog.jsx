import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  Button,
  TextField,
  Card,
  Typography,
  Stack,
  Alert,
  Box,
  CircularProgress,
  Checkbox,
  useTheme,
} from "@mui/material";
import { useCollections } from "../hooks/useCollections";

const SaveToCollectionDialog = ({ open, onClose, promptId, promptTitle }) => {
  const theme = useTheme();
  const [selectedCollections, setSelectedCollections] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [collectionName, setCollectionName] = useState("");

  const { 
    collections, 
    loading, 
    error, 
    createCollection, 
    saveToCollection, 
    removeFromCollection 
  } = useCollections();

  // Initialize selected collections when dialog opens
  useEffect(() => {
    if (collections && promptId && open) {
      const collectionsWithPrompt = collections.filter(collection => 
        collection.prompts?.some(p => p.id === promptId)
      );
      setSelectedCollections(new Set(collectionsWithPrompt.map(c => c.id)));
    }
  }, [collections, promptId, open]);

  const handleCollectionToggle = async (collectionId, isChecked) => {
    if (isChecked) {
      // Add to collection
      await saveToCollection(
        { collectionId, promptId },
        {
          onSuccess: () => {
            setSelectedCollections(prev => new Set([...prev, collectionId]));
          },
          onError: (error) => {
            console.error("Error adding to collection:", error);
          }
        }
      );
    } else {
      // Remove from collection
      await removeFromCollection(
        { collectionId, promptId },
        {
          onSuccess: () => {
            setSelectedCollections(prev => {
              const newSet = new Set(prev);
              newSet.delete(collectionId);
              return newSet;
            });
          },
          onError: (error) => {
            console.error("Error removing from collection:", error);
          }
        }
      );
    }
  };

  const handleCreateCollection = async () => {
    if (!collectionName.trim()) return;

    await createCollection(
      { name: collectionName },
      {
        onSuccess: () => {
          setCollectionName("");
          setIsCreatingCollection(false);
        }
      }
    );
  };

  const handleClose = () => {
    setSelectedCollections(new Set());
    setSearchTerm("");
    setIsCreatingCollection(false);
    setCollectionName("");
    onClose();
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
      <Box sx={{ width: "100%", mx: "auto", p: 3 }}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.message || "An error occurred"}
            </Alert>
          )}

          <Typography variant="h5" fontWeight="bold" mb={2}>
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

          {!isCreatingCollection && (
            <TextField
              fullWidth
              placeholder="Search collections..."
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                backgroundColor: "#222",
                borderRadius: 1,
                mb: 3,
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
          )}

          {isCreatingCollection ? (
            <Stack spacing={2}>
              <TextField
                label="Collection Name"
                fullWidth
                required
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                autoFocus
                sx={{
                  "& .MuiInputLabel-root": { color: "#aaa" },
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "#222",
                    "& fieldset": { borderColor: "#444" },
                    "&:hover fieldset": { borderColor: "#666" },
                  },
                }}
              />
              <Stack direction="row" spacing={2}>
                <Button
                  onClick={() => setIsCreatingCollection(false)}
                  variant="outlined"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateCollection}
                  variant="contained"
                  disabled={!collectionName.trim() || loading}
                >
                  Create Collection
                </Button>
              </Stack>
            </Stack>
          ) : (
            <>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : filteredCollections.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body1" mb={2}>
                    {collections.length === 0
                      ? "No collections found. Create your first collection!"
                      : "No matching collections found."}
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    maxHeight: "300px",
                    overflowY: "auto",
                    mb: 3,
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
                        <Box sx={{ p: 2 }}>
                          <Stack direction="row" spacing={2} alignItems="center">
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
                                {collection.prompts?.length || 0} prompts
                              </Typography>
                            </Box>
                          </Stack>
                        </Box>
                      </Card>
                    ))}
                  </Stack>
                </Box>
              )}

              <Stack direction="row" spacing={2} justifyContent="space-between">
                <Button
                  variant="outlined"
                  onClick={() => setIsCreatingCollection(true)}
                >
                  Create New Collection
                </Button>
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
              </Stack>
            </>
          )}
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default SaveToCollectionDialog;
