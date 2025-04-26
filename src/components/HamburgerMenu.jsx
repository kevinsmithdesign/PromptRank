import React, { useEffect } from "react";
import { gsap } from "gsap";
import { Card, Typography, Box, Stack, useTheme } from "@mui/material";

// export const MenuContainer = styled(Box)(({ theme }) => ({
//   width: "2.25rem",
//   height: "2.25rem",
//   borderRadius: theme.customBorderRadius.circle,
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   backgroundColor: theme.palette.primary.main,
// }));

// export const InnerContainer = styled(Box)({
//   display: "flex",
//   alignItems: "center",
//   flexDirection: "column",
//   justifyContent: "center",
//   cursor: "pointer",
// });

// export const Bar = styled(Box)(({ theme }) => ({
//   height: "0.1875rem",
//   width: "1.25rem",
//   backgroundColor: theme.palette.common.white,
//   marginBottom: "0.1875rem", // one off
//   borderRadius: theme.customBorderRadius.small,
//   "&:last-child": {
//     marginBottom: 0,
//   },
// }));

const HamburgerMenu = ({ menuOpen, setMenuOpen, hamburgerRef }) => {
  const theme = useTheme();
  useEffect(() => {
    const tl = gsap.timeline();

    if (menuOpen) {
      tl.to(".bar-one", { y: 6, rotation: 45, duration: 0.3 })
        .to(".bar-two", { opacity: 0, duration: 0 }, "-=0.3")
        .to(".bar-three", { y: -6, rotation: -45, duration: 0.3 }, "-=0.3");
    } else {
      tl.to(".bar-one", { y: 0, rotation: 0, duration: 0.3 })
        .to(".bar-two", { opacity: 1, duration: 0 }, "-=0.3")
        .to(".bar-three", { y: 0, rotation: 0, duration: 0.3 }, "-=0.3");
    }
  }, [menuOpen]);

  const handleHamburgerMenu = () => {
    setMenuOpen((prevState) => !prevState);
  };

  return (
    <Box
      sx={{
        width: "48px",
        height: "48px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.palette.primary.main,
        cursor: "pointer",
        "&:hover": {
          background: theme.palette.primary.dark,
        },
      }}
      ref={hamburgerRef}
      onClick={handleHamburgerMenu}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            height: "0.1875rem",
            width: "1.25rem",
            backgroundColor: theme.palette.common.white,
            marginBottom: "0.1875rem", // one off
            borderRadius: "2px",
            "&:last-child": {
              marginBottom: 0,
            },
          }}
          className="bar-one"
        />
        <Box
          sx={{
            height: "0.1875rem",
            width: "1.25rem",
            backgroundColor: theme.palette.common.white,
            marginBottom: "0.1875rem", // one off
            borderRadius: "2px",
            "&:last-child": {
              marginBottom: 0,
            },
          }}
          className="bar-two"
        />
        <Box
          sx={{
            height: "0.1875rem",
            width: "1.25rem",
            backgroundColor: theme.palette.common.white,
            marginBottom: "0.1875rem", // one off
            borderRadius: "2px",
            "&:last-child": {
              marginBottom: 0,
            },
          }}
          className="bar-three"
        />
      </Box>
    </Box>
  );
};

export default HamburgerMenu;
