// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Dialog,
//   DialogContent,
//   TextField,
//   Typography,
//   Stack,
//   Box,
//   Autocomplete,
//   Chip,
// } from "@mui/material";

// // Default categories that will be shown initially
// const defaultCategories = [
//   "Development",
//   "Design",
//   "Debugging",
//   "UI Design",
//   "Web Design",
//   "Backend Development",
//   "Frontend Development",
//   "DevOps",
//   "Mobile Development",
//   "Testing",
// ];

// const FilterCategoriesDialog = ({ open, onClose }) => {
//   const [selectedCategories, setSelectedCategories] = useState([]);
//   const [inputValue, setInputValue] = useState("");
//   const [subCategoryError, setSubCategoryError] = useState("");

//   // Load saved categories from localStorage on component mount
//   useEffect(() => {
//     const savedCategories = localStorage.getItem("userCategories");
//     if (savedCategories) {
//       setSelectedCategories(JSON.parse(savedCategories));
//     } else {
//       // If no saved categories, use the default categories
//       setSelectedCategories(defaultCategories);
//     }
//   }, []);

//   const handleCategoryChange = (event, value, reason) => {
//     if (
//       reason === "createOption" ||
//       reason === "selectOption" ||
//       reason === "remove"
//     ) {
//       setSelectedCategories(value);
//       setSubCategoryError("");
//     }
//   };

//   const handleSave = () => {
//     // Save categories to localStorage
//     localStorage.setItem("userCategories", JSON.stringify(selectedCategories));
//     onClose?.();
//   };

//   return (
//     <Dialog
//       fullScreen
//       open={open}
//       onClose={onClose}
//       sx={{
//         "& .MuiDialog-paper": {
//           backgroundColor: "#111",
//           color: "#fff",
//         },
//       }}
//       PaperProps={{
//         sx: {
//           "& .MuiAutocomplete-popper .MuiPaper-root": {
//             backgroundColor: "#222",
//             color: "#fff",
//           },
//           "& .MuiAutocomplete-option": {
//             backgroundColor: "#222",
//             color: "#fff",
//             "&:hover": {
//               backgroundColor: "#333",
//             },
//           },
//           "& .MuiAutocomplete-listbox": {
//             backgroundColor: "#222",
//           },
//         },
//       }}
//     >
//       <Box sx={{ maxWidth: "600px", width: "100%", mx: "auto", p: 2 }}>
//         <DialogContent>
//           <Typography variant="h5" fontWeight="bold" mb={3}>
//             Filter Categories
//           </Typography>
//           <Typography>Tailor categories to your preferences</Typography>
//           <Stack spacing={3}>
//             <Autocomplete
//               multiple
//               freeSolo
//               options={defaultCategories}
//               value={selectedCategories}
//               onChange={handleCategoryChange}
//               inputValue={inputValue}
//               onInputChange={(event, newInputValue) => {
//                 setInputValue(newInputValue);
//               }}
//               PopperProps={{
//                 sx: {
//                   "& .MuiPaper-root": {
//                     backgroundColor: "#222",
//                   },
//                 },
//               }}
//               ListboxProps={{
//                 style: { backgroundColor: "#222" },
//               }}
//               renderTags={(value, getTagProps) => (
//                 <Box
//                   sx={{
//                     width: "100%",
//                     minHeight: 45,
//                     display: "flex",
//                     flexWrap: "wrap",
//                     gap: 1,
//                     overflowY: "auto",
//                     maxHeight: "200px",
//                     padding: "8px 0",
//                     "&::-webkit-scrollbar": {
//                       width: "8px",
//                     },
//                     "&::-webkit-scrollbar-track": {
//                       background: "#333",
//                     },
//                     "&::-webkit-scrollbar-thumb": {
//                       background: "#555",
//                       borderRadius: "4px",
//                     },
//                   }}
//                 >
//                   {value.map((option, index) => (
//                     <Chip
//                       {...getTagProps({ index })}
//                       key={option}
//                       label={option}
//                       sx={{
//                         backgroundColor: "#333",
//                         color: "#fff",
//                         margin: "2px",
//                         "& .MuiChip-deleteIcon": {
//                           color: "#fff",
//                           "&:hover": {
//                             color: "#ff4444",
//                           },
//                         },
//                       }}
//                     />
//                   ))}
//                 </Box>
//               )}
//               renderInput={(params) => (
//                 <TextField
//                   {...params}
//                   placeholder="Select or type to add new categories"
//                   error={!!subCategoryError}
//                   helperText={subCategoryError}
//                   FormHelperTextProps={{
//                     sx: { color: "#ff4444" },
//                   }}
//                   sx={{
//                     backgroundColor: "#222",
//                     borderRadius: 1,
//                     "& .MuiOutlinedInput-root": {
//                       color: "#fff",
//                       height: "auto",
//                       minHeight: "45px",
//                       alignItems: "flex-start",
//                     },
//                     "& .MuiOutlinedInput-notchedOutline": {
//                       borderColor: "#444",
//                     },
//                   }}
//                 />
//               )}
//             />
//           </Stack>

//           <Box
//             sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}
//           >
//             <Button variant="outlined" onClick={onClose}>
//               Cancel
//             </Button>
//             <Button
//               onClick={handleSave}
//               variant="contained"
//               sx={{
//                 backgroundColor: "#0088ff",
//                 "&:hover": {
//                   backgroundColor: "#0077dd",
//                 },
//                 "&:disabled": {
//                   backgroundColor: "#004488",
//                 },
//               }}
//             >
//               Save
//             </Button>
//           </Box>
//         </DialogContent>
//       </Box>
//     </Dialog>
//   );
// };

// export default FilterCategoriesDialog;

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

  useEffect(() => {
    if (categories) {
      setSelectedCategories(categories);
    }
  }, [categories]);

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
          <Typography>Tailor categories to your preferences</Typography>
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
              renderTags={(value, getTagProps) => (
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
                  {value.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option.text || option}
                      label={option.text || option}
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
                  ))}
                </Box>
              )}
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
                backgroundColor: "#0088ff",
                "&:hover": {
                  backgroundColor: "#0077dd",
                },
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
