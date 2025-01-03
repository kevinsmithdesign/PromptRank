import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { db, auth } from "../../config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  doc,
  updateDoc,
  increment,
  query,
  orderBy,
} from "firebase/firestore";

const SaveToCollectionDialog = ({ open, onClose, promptId, onSave }) => {
  const theme = useTheme();
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // New collection form states
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");

  useEffect(() => {
    if (open) {
      fetchCollections();
    }
  }, [open]);

  const fetchCollections = async () => {
    try {
      setInitialLoading(true);
      setError(null);

      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("You must be logged in to view collections");
      }

      const collectionsRef = collection(
        db,
        "users",
        currentUser.uid,
        "collections"
      );
      const q = query(collectionsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const collectionsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCollections(collectionsData);
    } catch (err) {
      setError(err.message || "Failed to fetch collections");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleCollectionSelect = (collectionId) => {
    setSelectedCollection(collectionId);
    setError(null);
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      setError("Collection name is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("You must be logged in to create collections");
      }

      const collectionsRef = collection(
        db,
        "users",
        currentUser.uid,
        "collections"
      );
      const newCollection = await addDoc(collectionsRef, {
        name: newCollectionName.trim(),
        description: newCollectionDescription.trim(),
        createdAt: new Date().toISOString(),
        promptCount: 0,
      });

      const createdCollection = {
        id: newCollection.id,
        name: newCollectionName.trim(),
        description: newCollectionDescription.trim(),
        promptCount: 0,
      };

      setCollections((prev) => [createdCollection, ...prev]);
      setSelectedCollection(createdCollection.id);
      handleBackToList();
    } catch (err) {
      setError(err.message || "Failed to create collection");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedCollection) {
      setError("Please select a collection");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("You must be logged in to save to collections");
      }

      const promptsRef = collection(
        db,
        "users",
        currentUser.uid,
        "collections",
        selectedCollection,
        "prompts"
      );

      await addDoc(promptsRef, {
        promptId: promptId,
        addedAt: new Date().toISOString(),
      });

      const collectionRef = doc(
        db,
        "users",
        currentUser.uid,
        "collections",
        selectedCollection
      );
      await updateDoc(collectionRef, {
        promptCount: increment(1),
      });

      onSave(selectedCollection);
      handleClose();
    } catch (err) {
      setError(err.message || "Failed to save to collection");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setIsCreatingCollection(false);
    setNewCollectionName("");
    setNewCollectionDescription("");
    setError(null);
  };

  const handleClose = () => {
    setSelectedCollection(null);
    setError(null);
    setIsCreatingCollection(false);
    setNewCollectionName("");
    setNewCollectionDescription("");
    setSearchTerm("");
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
              {error}
            </Alert>
          )}

          <Stack direction="row" alignItems="center" spacing={2} mb={1}>
            {isCreatingCollection && (
              <IconButton
                onClick={handleBackToList}
                size="small"
                sx={{ color: "white", ml: -1 }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
            <Typography variant="h5" fontWeight="bold">
              {isCreatingCollection
                ? "Create New Collection"
                : "Save Prompt to Collection"}
            </Typography>
          </Stack>

          {!isCreatingCollection && (
            <Stack flexDirection="row" mb={2}>
              <Stack flexGrow={1} mr={3}>
                <TextField
                  fullWidth
                  placeholder="Search Collections"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Stack>
              <Stack>
                <Button
                  variant="outlined"
                  onClick={() => setIsCreatingCollection(true)}
                >
                  Add New Collection
                </Button>
              </Stack>
            </Stack>
          )}

          {isCreatingCollection ? (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Collection Name"
                fullWidth
                required
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
              />
              <TextField
                label="Description (Optional)"
                fullWidth
                multiline
                rows={3}
                value={newCollectionDescription}
                onChange={(e) => setNewCollectionDescription(e.target.value)}
              />
            </Stack>
          ) : (
            <Stack spacing={2} sx={{ mt: 1 }}>
              {initialLoading ? (
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
                      sx={{
                        height: "100%",
                        padding: 0,
                        borderRadius: "8px",
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
                      onClick={() => handleCollectionSelect(collection.id)}
                    >
                      <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body1">
                              {collection.name}
                            </Typography>
                            <Typography variant="body2">
                              {collection.promptCount} prompts
                            </Typography>
                          </Box>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </Stack>
          )}

          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Stack flexDirection="row" gap={2}>
              <Button
                variant="outlined"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              {isCreatingCollection ? (
                <Button
                  onClick={handleCreateCollection}
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? "Creating..." : "Create Collection"}
                </Button>
              ) : (
                <Button
                  onClick={handleSave}
                  variant="contained"
                  disabled={loading || initialLoading || !selectedCollection}
                >
                  {loading ? "Saving..." : "Save to Collection"}
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
