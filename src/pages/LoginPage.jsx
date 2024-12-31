// import * as React from "react";
// import { Container, Box, Typography, Button, Stack } from "@mui/material";
// import { Auth } from "../components/Auth";

// import Grid from "@mui/material/Grid2";

// export default function LoginPage() {
//   return (
//     <Container>
//       <Grid container spacing={2} mt={4}>
//         <Grid
//           size={6}
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//           }}
//         >
//           <Auth />
//         </Grid>
//         <Grid size={6}>
//           <Box
//             sx={{
//               background: "#eee",
//               height: "400px",
//               width: "100%",
//               borderRadius: 4,
//             }}
//           ></Box>
//         </Grid>
//       </Grid>
//     </Container>
//   );
// }

// src/pages/LoginPage.js
import React from "react";
import { Container, Box } from "@mui/material";
import { Login } from "../components/Login";
import Grid from "@mui/material/Grid2";

export default function LoginPage() {
  return (
    <Container>
      <Grid container spacing={12} mt={4}>
        <Grid
          size={5}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Login />
        </Grid>
        <Grid size={7}>
          <Box
            sx={{
              background: "#eee",
              height: "400px",
              width: "100%",
              borderRadius: 4,
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
