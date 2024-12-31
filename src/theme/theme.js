// Import necessary modules from MUI
import { createTheme } from "@mui/material/styles";

// Define the theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Default primary color
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
      default: "#111",

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
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Disable uppercase text
          borderRadius: "0.5rem", // Custom border radius for buttons
          padding: "12px 28px",
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
      ],
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          borderRadius: "0.5rem",
          background: "#222",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#222",
          borderRadius: "16px",
          boxShadow: "none",
          padding: "32px", // Equivalent to theme.spacing(4)
        },
      },
    },
  },
});

export default theme;
