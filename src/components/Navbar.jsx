import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { auth } from "../../config/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "../icons/LogoutIcon";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const open = Boolean(anchorEl);
  const isRootRoute = location.pathname === "/";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
    });

    return () => unsubscribe();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      handleClose();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <Box>
      <Container>
        <Stack flexDirection="row" alignItems="center" sx={{ pt: 3, pb: 8 }}>
          <Stack flexGrow={1}>
            <Typography variant="h5" fontWeight="bold">
              PromptRank
            </Typography>
          </Stack>

          {!isRootRoute && (
            <>
              <Stack sx={{ mr: 3 }}>
                <Typography variant="body1" component={Link} to="/main/prompts">
                  Prompts
                </Typography>
              </Stack>
              <Stack sx={{ mr: 3 }}>
                <Typography
                  variant="body1"
                  component={Link}
                  to="/main/ai-tools"
                >
                  AI Tools
                </Typography>
              </Stack>
            </>
          )}

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
              }}
              onClick={handleClick}
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
        </Stack>

        <Menu
          id="account-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
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
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText>Logout</ListItemText>
            </MenuItem>
          ) : (
            <MenuItem onClick={handleLogin}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText>Login</ListItemText>
            </MenuItem>
          )}
        </Menu>
      </Container>
    </Box>
  );
};

export default Navbar;
