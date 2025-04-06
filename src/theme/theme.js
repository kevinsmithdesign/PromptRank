// Import necessary modules from MUI
import { createTheme } from "@mui/material/styles";

// Define the theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1E44FF", // Default primary color
    },
    secondary: {
      main: "#999", // Default secondary color
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ffa726",
    },
    info: {
      main: "#2196f3",
    },
    success: {
      main: "#4caf50",
    },
    background: {
      default: "#000",

      //   paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Roboto, Arial, sans-serif",
    body1: {
      fontSize: "1rem",
      color: "#fff",
    },
    body2: {
      fontSize: "0.875rem",
      color: "#fff",
    },
  },
  shape: {
    borderRadius: 8, // Default border radius
  },
  spacing: 8, // Default spacing multiplier
  components: {
    MuiRating: {
      styleOverrides: {
        iconEmpty: {
          color: "#999", // Change empty star color globally
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          backgroundColor: "#333", // Change this to your desired color
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Disable uppercase text
          borderRadius: "0.5rem", // Custom border radius for buttons

          padding: "16px 32px", // Increased padding for taller height
          minHeight: "60px", // Increased to 60px
          "&.Mui-disabled": {
            backgroundColor: "rgba(255, 255, 255, 0.12)", // Very dim white
            color: "rgba(255, 255, 255, 0.3)", // Faded text
          },
        },
      },
      variants: [
        {
          props: { variant: "contained" },
          style: {
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          },
        },
        {
          props: { variant: "outlined" },
          style: {
            color: "#fff",
          },
        },
      ],
    },
    // MuiTextField: {
    //   styleOverrides: {
    //     root: ({ theme }) => ({
    //       borderRadius: "0.5rem",
    //       border: `1px solid #444`, // Access primary color
    //       background: "#222",
    //       color: "#fff",
    //       "& .MuiInputBase-input": {
    //         color: "#fff", // Input text color
    //       },
    //       "& .MuiInputBase-input::placeholder": {
    //         color: "#fff", // Placeholder text color
    //         opacity: 1, // Ensures placeholder is fully visible
    //       },
    //     }),
    //   },
    // },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          "& .MuiOutlinedInput-root": {
            borderRadius: "0.5rem",
            background: "#111",
            height: "60px", // Increased to 60px
            "& fieldset": {
              border: "1px solid #222",
              borderRadius: "0.5rem",
            },
            "&:hover fieldset": {
              border: "1px solid #333",
            },
            "&.Mui-focused fieldset": {
              border: `2px solid ${theme.palette.primary.main} !important`,
            },
            "& fieldset, &:hover fieldset, &.Mui-focused fieldset": {
              transition: "none",
            },
            // Adjusted input padding for taller height
            "& input": {
              padding: "0 14px", // Removed top/bottom padding to let the container height control vertical centering
              height: "100%", // Make input fill the container height
            },
          },
          "& .MuiInputBase-input": {
            color: "#fff",
          },
          "& .MuiInputBase-input::placeholder": {
            color: "#fff",
            opacity: 1,
          },
        }),
      },
    },

    // MuiOutlinedInput: {
    //   styleOverrides: {
    //     root: {
    //       borderRadius: "0.5rem",
    //       backgroundColor: "#222",
    //       "& .MuiOutlinedInput-notchedOutline": {
    //         borderColor: "#333",
    //       },
    //       "&:hover .MuiOutlinedInput-notchedOutline": {
    //         borderColor: "#555",
    //       },
    //       "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    //         borderColor: "#0069FF", // Example primary color
    //       },
    //       "& input": {
    //         padding: "12px", // Adjust padding as needed
    //         color: "#fff",
    //       },
    //     },
    //   },
    // },

    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "rgba(255, 255, 255, 0.7)",
          "&.Mui-checked": {
            color: "#1976d2",
          },
          "&:hover": {
            backgroundColor: "rgba(25, 118, 210, 0.08)",
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          color: "rgba(255, 255, 255, 0.7)",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#111",
          borderRadius: "16px",
          boxShadow: "none",
          padding: "32px", // Equivalent to theme.spacing(4)
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: "0.5rem",
          background: "#111",
          height: "60px", // Increased to 60px
          "& .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #444",
            borderRadius: "0.5rem",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #666",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: `2px solid ${theme.palette.primary.main} !important`,
          },
          "& .MuiOutlinedInput-notchedOutline, &:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              transition: "none",
            },
          "& .MuiSelect-select": {
            padding: "0 14px", // Adjusted padding for taller height
            height: "100%", // Make select content fill the container height
            display: "flex",
            alignItems: "center",
          },
          "& .MuiSelect-icon": {
            color: "#fff",
          },
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          color: "#fff",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
          },
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundColor: "#333",
          borderRadius: "0.5rem",
        },
      },
    },
  },
});

export default theme;
