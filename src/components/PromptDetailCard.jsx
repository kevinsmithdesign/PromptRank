// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   Typography,
//   Box,
//   Stack,
//   IconButton,
//   Card,
//   CardContent,
//   Rating,
//   Tooltip,
// } from "@mui/material";
// import StarIcon from "@mui/icons-material/Star";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import BackIcon from "../icons/BackIcon";
// import CopyIcon from "../icons/CopyIcon";
// import SaveIcon from "../icons/SaveIcon";

// const PromptDetailCard = ({ prompt }) => {
//   const navigate = useNavigate();

//   const [copied, setCopied] = useState(false);

//   const handleCopyDescription = async () => {
//     if (prompt?.description) {
//       try {
//         await navigator.clipboard.writeText(prompt.description);
//         setCopied(true);
//         setTimeout(() => setCopied(false), 2000);
//       } catch (err) {
//         console.error("Failed to copy text:", err);
//       }
//     }
//   };

//   return (
//     <Card>
//       <CardContent>
//         <Box display="flex" flexDirection="row" sx={{ mb: 2 }}>
//           <Box sx={{ flex: 1 }}>
//             <IconButton
//               onClick={() => navigate(-1)}
//               sx={{
//                 background: "#444",
//                 p: 2,
//                 "&:hover": { background: "#333" },
//               }}
//             >
//               <BackIcon />
//             </IconButton>
//           </Box>

//           <Box sx={{ mr: 1 }}>
//             <Tooltip title={copied ? "Copied!" : "Copy prompt"}>
//               <IconButton
//                 onClick={handleCopyDescription}
//                 sx={{
//                   background: "#444",
//                   p: 2,
//                   "&:hover": { background: "#333" },
//                   color: copied ? "success.main" : "primary.main",
//                 }}
//               >
//                 {copied ? <CheckCircleIcon fontSize="small" /> : <CopyIcon />}
//               </IconButton>
//             </Tooltip>
//           </Box>

//           <Box>
//             <IconButton
//               sx={{
//                 background: "#444",
//                 p: 2,
//                 "&:hover": { background: "#333" },
//               }}
//               onClick={() => console.log("open the collections")}
//             >
//               <SaveIcon />
//             </IconButton>
//           </Box>
//         </Box>

//         <Stack>
//           <Stack direction="row" alignItems="center" mb={4}>
//             <StarIcon sx={{ color: "rgb(250, 175, 0)" }} />
//             <Stack sx={{ ml: 1, mr: 1 }}>
//               <Typography fontWeight="bold">
//                 {prompt.avgRating.toFixed(1)}
//               </Typography>
//             </Stack>
//             <Typography color="#999">
//               {prompt.totalRatings}{" "}
//               {prompt.totalRatings === 1 ? "Review" : "Reviews"}
//             </Typography>
//           </Stack>

//           {prompt.category && (
//             <Typography
//               variant="body2"
//               sx={{
//                 textTransform: "uppercase",
//                 fontWeight: "bold",
//                 color: "#999",
//               }}
//             >
//               {prompt.category}
//             </Typography>
//           )}

//           <Typography variant="h4" fontWeight="bold" mb={2} color="white">
//             {prompt.title}
//           </Typography>

//           <Box sx={{ position: "relative", mb: 4 }}>
//             <Typography
//               variant="body1"
//               sx={{
//                 color: "rgba(255, 255, 255, 0.8)",
//                 lineHeight: 1.7,
//                 pr: 8,
//               }}
//             >
//               {prompt.description}
//             </Typography>
//           </Box>

//           <Typography variant="caption" sx={{ color: "#999" }}>
//             Created: {new Date(prompt.createdAt).toLocaleDateString()}
//           </Typography>

//           <Typography variant="caption" sx={{ color: "#999" }}>
//             Author: {prompt.authorName}
//           </Typography>
//         </Stack>
//       </CardContent>
//     </Card>
//   );
// };

// export default PromptDetailCard;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Stack,
  IconButton,
  Card,
  CardContent,
  Rating,
  Tooltip,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BackIcon from "../icons/BackIcon";
import CopyIcon from "../icons/CopyIcon";
import SaveIcon from "../icons/SaveIcon";
import PromptModelComparison from "./PromptModelComparison";

import SaveToCollectionDialog from "./SaveToCollectionDialog";

const PromptDetailCard = ({ prompt }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [saveToCollectionOpen, setSaveToCollectionOpen] = useState(false);

  const handleCopyDescription = async () => {
    if (prompt?.description) {
      try {
        await navigator.clipboard.writeText(prompt.description);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy text:", err);
      }
    }
  };

  return (
    <>
      <Card>
        <CardContent>
          <Box display="flex" flexDirection="row" sx={{ mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <IconButton
                onClick={() => navigate(-1)}
                sx={{
                  background: "#444",
                  p: 2,
                  "&:hover": { background: "#333" },
                }}
              >
                <BackIcon />
              </IconButton>
            </Box>

            <Box sx={{ mr: 1 }}>
              <Tooltip title={copied ? "Copied!" : "Copy prompt"}>
                <IconButton
                  onClick={handleCopyDescription}
                  sx={{
                    background: "#444",
                    p: 2,
                    "&:hover": { background: "#333" },
                    color: copied ? "success.main" : "primary.main",
                  }}
                >
                  {copied ? <CheckCircleIcon fontSize="small" /> : <CopyIcon />}
                </IconButton>
              </Tooltip>
            </Box>

            <Box>
              <Tooltip title="Save to Collection">
                <IconButton
                  sx={{
                    background: "#444",
                    p: 2,
                    "&:hover": { background: "#333" },
                  }}
                  onClick={() => setSaveToCollectionOpen(true)}
                >
                  <SaveIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Stack>
            <Stack direction="row" alignItems="center" mb={4}>
              <StarIcon sx={{ color: "rgb(250, 175, 0)" }} />
              <Stack sx={{ ml: 1, mr: 1 }}>
                <Typography fontWeight="bold">
                  {prompt.avgRating.toFixed(1)}
                </Typography>
              </Stack>
              <Typography color="#999">
                {prompt.totalRatings}{" "}
                {prompt.totalRatings === 1 ? "Review" : "Reviews"}
              </Typography>
            </Stack>

            {prompt.category && (
              <Typography
                variant="body2"
                sx={{
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  color: "#999",
                }}
              >
                {prompt.category}
              </Typography>
            )}

            <Typography variant="h4" fontWeight="bold" mb={2} color="white">
              {prompt.title}
            </Typography>

            <Box sx={{ mb: 4 }}>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  lineHeight: 1.7,
                }}
              >
                {prompt.description}
              </Typography>
            </Box>

            <Typography variant="caption" sx={{ color: "#999" }}>
              Created: {new Date(prompt.createdAt).toLocaleDateString()}
            </Typography>

            <Typography variant="caption" sx={{ color: "#999" }}>
              Author: {prompt.authorName}
            </Typography>
          </Stack>
          <PromptModelComparison />
        </CardContent>
      </Card>

      <SaveToCollectionDialog
        open={saveToCollectionOpen}
        onClose={() => setSaveToCollectionOpen(false)}
        promptId={prompt.id}
        onSave={(collectionId) => {
          console.log(
            `Saved prompt ${prompt.id} to collection ${collectionId}`
          );
          setSaveToCollectionOpen(false);
        }}
      />
    </>
  );
};

export default PromptDetailCard;
