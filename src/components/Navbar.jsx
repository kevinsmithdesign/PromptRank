import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import { auth } from "../../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "../icons/LogoutIcon";
import HamburgerMenu from "./HamburgerMenu";
import ProfileIcon from "../icons/ProfileIcon";

const navLinks = [
  { label: "Prompts", path: "/main/prompts" },
  { label: "AI Tools", path: "/main/ai-tools" },
  { label: "Tutorials", path: "/main/tutorials" },
];

const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  // Profile dropdown state
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Mobile nav menu state
  const [navMenuAnchorEl, setNavMenuAnchorEl] = useState(null);
  const isNavMenuOpen = Boolean(navMenuAnchorEl);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const hamburgerRef = useRef(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Profile menu handlers
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      handleProfileMenuClose();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Mobile nav menu handlers
  const handleNavMenuOpen = (event) => {
    setNavMenuAnchorEl(event.currentTarget);
  };

  const handleNavMenuClose = () => {
    setNavMenuAnchorEl(null);
  };

  return (
    <Box>
      <Container>
        <Stack flexDirection="row" alignItems="center" sx={{ pt: 3, pb: 8 }}>
          {/* Logo */}
          <Stack flexGrow={1}>
            <Typography variant="h5" fontWeight="bold">
              PromptRank
            </Typography>
          </Stack>

          {/* Desktop Nav Links */}
          <Stack
            sx={{
              display: { xs: "none", md: "flex" }, // Hide on mobile & tablet
              flexDirection: "row",
            }}
          >
            {navLinks.map(({ label, path }) => (
              <Typography
                key={path}
                variant="body1"
                component={Link}
                to={path}
                sx={{
                  textDecoration: "none",
                  backgroundColor:
                    location.pathname === path
                      ? theme.palette.primary.main
                      : "transparent",
                  p: "8px 20px",
                  mr: 1,
                  color: "white",
                  borderRadius: "32px",
                  // location.pathname === path
                  //   ? theme.palette.primary.main
                  //   : "#fff",
                  fontWeight: "bold",
                  // borderBottom:
                  //   location.pathname === path ? "2px solid" : "none",
                  // mr: 3,
                }}
              >
                {label}
              </Typography>
            ))}
          </Stack>

          {/* Profile Dropdown */}
          <Stack>
            <Box
              sx={{
                height: "40px",
                width: "40px",
                background: "#eee",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ml: 4,
              }}
              onClick={handleProfileMenuOpen}
              aria-controls={open ? "account-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
            >
              {auth.currentUser?.photoURL ? (
                <img
                  src={auth.currentUser.photoURL}
                  alt="Profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <AccountCircleIcon sx={{ color: "#666", fontSize: 30 }} />
              )}
            </Box>
          </Stack>

          {/* Mobile Nav Toggle */}
          <Stack
            sx={{
              display: { xs: "block", md: "none" }, // Show on mobile & tablet
            }}
          >
            <Box
              ref={hamburgerRef}
              onClick={handleNavMenuOpen}
              sx={{ cursor: "pointer" }}
            >
              <HamburgerMenu menuOpen={isNavMenuOpen} />
            </Box>
          </Stack>
        </Stack>

        {/* Profile Dropdown Menu */}
        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleProfileMenuClose}
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
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {isAuthenticated ? (
            <>
              <MenuItem
                sx={{
                  "&:hover": {
                    background: "#333",
                  },
                }}
                onClick={() => {
                  navigate("/main/profile");
                  handleProfileMenuClose(); // Close the menu after navigating
                }}
              >
                <ListItemIcon>
                  <ProfileIcon />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </MenuItem>
              <MenuItem
                sx={{
                  "&:hover": {
                    background: "#333",
                  },
                }}
                onClick={handleLogout}
              >
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText>Logout</ListItemText>
              </MenuItem>
            </>
          ) : (
            <MenuItem
              sx={{
                "&:hover": {
                  background: "#333",
                },
              }}
              onClick={() => navigate("/login")}
            >
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText>Login</ListItemText>
            </MenuItem>
          )}
        </Menu>

        {/* Mobile Nav Menu */}
        <Menu
          id="nav-menu"
          anchorEl={navMenuAnchorEl}
          open={isNavMenuOpen}
          onClose={handleNavMenuClose}
          PaperProps={{
            elevation: 0,
            sx: {
              mt: 1.5,
              background: "#222",
              // width: "200px",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {navLinks.map(({ label, path }) => (
            <MenuItem
              key={path}
              component={Link}
              to={path}
              onClick={handleNavMenuClose}
              sx={{
                color: location.pathname === path ? "#1976d2" : "#fff",
                "&:hover": {
                  background: "#333",
                },
              }}
            >
              {label}
            </MenuItem>
          ))}
        </Menu>
      </Container>
    </Box>
  );
};

export default Navbar;
