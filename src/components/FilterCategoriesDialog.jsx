import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  TextField,
  Typography,
  Stack,
  Box,
  Autocomplete,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useCategories } from "../hooks/useCategories";

const FilterCategoriesDialog = ({ open, onClose }) => {
  const { categories, isLoading, error, updateCategories, isUpdating } =
    useCategories();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    if (categories && open) {
      setSelectedCategories(categories);
    }
  }, [open, categories]);

  const handleCategoryChange = (event, value) => {
    const formattedCategories = value.map((cat) => {
      if (typeof cat === "string") {
        return {
          text: cat,
          path: `/${cat.replace(/\s+/g, "")}`,
        };
      }
      return cat;
    });
    setSelectedCategories(formattedCategories);
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null) return;

    const newCategories = [...selectedCategories];
    const item = newCategories[draggedItem];
    newCategories.splice(draggedItem, 1);
    newCategories.splice(index, 0, item);

    setDraggedItem(index);
    setSelectedCategories(newCategories);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleSave = async () => {
    try {
      await updateCategories(selectedCategories);
      onClose();
    } catch (err) {
      console.error("Error updating categories:", err);
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          backgroundColor: "#111",
          color: "#fff",
        },
      }}
    >
      <Box sx={{ maxWidth: "600px", width: "100%", mx: "auto", p: 2 }}>
        <DialogContent>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Filter Categories
          </Typography>
          <Typography mb={2}>
            Select up to 10 categories that match your preferences. Delete,
            replace, and rearrange them with drag-and-drop.
          </Typography>
          <Stack spacing={3}>
            <Autocomplete
              multiple
              freeSolo
              options={categories}
              value={selectedCategories}
              onChange={handleCategoryChange}
              inputValue={inputValue}
              onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
              }}
              getOptionLabel={(option) => {
                if (typeof option === "string") return option;
                return option.text;
              }}
              renderTags={() => null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select or type to add new categories"
                  sx={{
                    backgroundColor: "#222",
                    borderRadius: 1,
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                      height: "auto",
                      minHeight: "45px",
                      alignItems: "flex-start",
                    },
                  }}
                />
              )}
            />

            <Box
              sx={{
                width: "100%",
                minHeight: 45,
                display: "flex",
                flexWrap: "wrap",
                gap: 1,
                overflowY: "auto",
                maxHeight: "200px",
                padding: "8px 0",
              }}
            >
              {selectedCategories.map((option, index) => (
                <div
                  key={option.text}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  style={{
                    cursor: "grab",
                    opacity: draggedItem === index ? 0.5 : 1,
                  }}
                >
                  <Chip
                    label={option.text}
                    onDelete={() => {
                      const newCategories = selectedCategories.filter(
                        (_, i) => i !== index
                      );
                      setSelectedCategories(newCategories);
                    }}
                    sx={{
                      backgroundColor: "#333",
                      color: "#fff",
                      "& .MuiChip-deleteIcon": {
                        color: "#fff",
                        "&:hover": {
                          color: "#ff4444",
                        },
                      },
                    }}
                  />
                </div>
              ))}
            </Box>
          </Stack>

          <Box
            sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}
          >
            <Button variant="outlined" onClick={onClose} disabled={isUpdating}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              variant="contained"
              disabled={isUpdating}
              sx={{
                // backgroundColor: "#0088ff",
                // "&:hover": {
                //   backgroundColor: "#0077dd",
                // },
                "&:disabled": {
                  backgroundColor: "#004488",
                },
              }}
            >
              {isUpdating ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </Box>
        </DialogContent>
      </Box>
    </Dialog>
  );
};

export default FilterCategoriesDialog;
