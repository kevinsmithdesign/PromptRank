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
import { useTheme } from "@mui/material/styles";
import { useCategories } from "../hooks/useCategories";

const FilterCategoriesDialog = ({ open, onClose }) => {
  const { categories, isLoading, error, updateCategories, isUpdating } =
    useCategories();
  const theme = useTheme();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  
  // Predefined categories that users can select from
  const availableCategories = [
    "SEO Ranking",
    "Content Creation", 
    "Marketing Strategies",
    "Web Development",
    "E-commerce",
    "Social Media Management",
    "Business Planning",
    "Financial Planning",
    "Resume Builder",
    "Side Hustle",
    "UI Design",
    "UX Design",
    "Frontend",
    "Backend",
    "Database",
    "Performance",
    "Security",
    "Testing",
    "Analytics",
    "Email Marketing",
    "Customer Service",
    "Project Management",
    "Data Analysis",
    "AI & Machine Learning",
    "Copywriting",
    "Branding",
    "Sales",
    "Leadership",
    "Productivity",
    "Health & Wellness"
  ];

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

  const handleCategoryToggle = (categoryText) => {
    const isSelected = selectedCategories.some(cat => cat.text === categoryText);
    
    if (isSelected) {
      // Remove category
      setSelectedCategories(prev => prev.filter(cat => cat.text !== categoryText));
    } else {
      // Add category (max 10)
      if (selectedCategories.length < 10) {
        const newCategory = {
          text: categoryText,
          path: `/${categoryText.replace(/\s+/g, "")}`
        };
        setSelectedCategories(prev => [...prev, newCategory]);
      }
    }
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
      // fullScreen
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
            Add up to 10 categories that match your preferences. Select from suggestions below or type your own custom categories.
          </Typography>
          
          <Stack spacing={3}>
            {/* Add Category Input */}
            <Autocomplete
              freeSolo
              options={availableCategories}
              value={null}
              onChange={(event, value) => {
                if (value && selectedCategories.length < 10) {
                  handleCategoryToggle(value);
                }
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && event.target.value.trim()) {
                  event.preventDefault();
                  const customCategory = event.target.value.trim();
                  if (customCategory && selectedCategories.length < 10) {
                    handleCategoryToggle(customCategory);
                    event.target.value = '';
                  }
                }
              }}
              PopperProps={{
                sx: {
                  "& .MuiPaper-root": {
                    backgroundColor: "#222",
                  },
                },
              }}
              ListboxProps={{
                style: { backgroundColor: "#222" },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Type a category name or select from suggestions"
                  helperText={`${selectedCategories.length}/10 categories selected`}
                  FormHelperTextProps={{
                    sx: { color: "#aaa" },
                  }}
                  sx={{
                    backgroundColor: "#222",
                    borderRadius: 1,
                    "& .MuiOutlinedInput-root": {
                      color: "#fff",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#444",
                    },
                  }}
                />
              )}
            />

            {/* Selected Categories - Draggable */}
            {selectedCategories.length > 0 && (
              <>
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Your Selected Categories (drag to reorder)
                </Typography>
                <Box
                  sx={{
                    width: "100%",
                    minHeight: 45,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    overflowY: "auto",
                    maxHeight: "150px",
                    padding: "8px",
                    border: "1px solid #444",
                    borderRadius: 1,
                    backgroundColor: "#111",
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
                          backgroundColor: theme.palette.primary.main,
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
              </>
            )}
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
