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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { auth } from "../../config/firebase";
import { useCollections } from "../hooks/useCollections";

const SaveToCollectionDialog = ({ open, onClose, promptId, onSave }) => {
  const theme = useTheme();
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [duplicateError, setDuplicateError] = useState("");

  // New collection form states
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");

  const {
    collections,
    isLoading,
    error,
    createCollection,
    createCollectionLoading,
    saveToCollection,
    saveToCollectionLoading,
  } = useCollections();

  const handleCollectionSelect = (collectionId) => {
    setSelectedCollection(collectionId);
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) {
      return;
    }

    createCollection(
      {
        name: newCollectionName,
        description: newCollectionDescription,
      },
      {
        onSuccess: (newCollection) => {
          setSelectedCollection(newCollection.id);
          handleBackToList();
        },
      }
    );
  };

  const handleSave = async () => {
    if (!selectedCollection) {
      return;
    }

    console.log("Starting save, loading state:", saveToCollectionLoading);

    saveToCollection(
      {
        collectionId: selectedCollection,
        promptId,
      },
      {
        onSuccess: () => {
          console.log("Save successful");
          onSave(selectedCollection);
          handleClose();
        },
        onError: (error) => {
          console.log("Save error:", error);
          if (error.message === "This prompt is already in this collection") {
            setDuplicateError(
              `This prompt is already in the selected collection`
            );
            setTimeout(() => {
              setDuplicateError("");
            }, 3000);
          }
        },
      }
    );
  };

  const handleBackToList = () => {
    setIsCreatingCollection(false);
    setNewCollectionName("");
    setNewCollectionDescription("");
  };

  const handleClose = () => {
    setSelectedCollection(null);
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
            {isCreatingCollection && (
              <IconButton
                onClick={handleBackToList}
                size="small"
                sx={{ color: "white", ml: -1 }}
              >
                <ArrowBackIcon />
              </IconButton>
            )}
          </Stack>

          {!isCreatingCollection && (
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

          {isCreatingCollection ? (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Collection Name"
                fullWidth
                required
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
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
                        padding: 0,
                        borderRadius: "8px",
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
                            : "transparent",
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
