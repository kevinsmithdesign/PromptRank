// import { useState } from "react";
// import { getAuth } from "firebase/auth";
// import { formatDistanceToNow } from "date-fns";
// import { useParams, useNavigate } from "react-router-dom";
// import Grid from "@mui/material/Grid2";
// import {
//   Container,
//   Typography,
//   Box,
//   Stack,
//   IconButton,
//   Card,
//   CardContent,
//   Rating,
//   Button,
//   Alert,
//   Tooltip,
//   Skeleton,
//   TextField,
// } from "@mui/material";
// import StarIcon from "@mui/icons-material/Star";
// import ContentCopyIcon from "@mui/icons-material/ContentCopy";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
// import BackIcon from "../icons/BackIcon";
// import ThumbUpIcon from "@mui/icons-material/ThumbUp";
// import ThumbDownIcon from "@mui/icons-material/ThumbDown";
// import ReplyIcon from "@mui/icons-material/Reply";
// import {
//   doc,
//   getDoc,
//   collection,
//   query,
//   where,
//   orderBy,
//   getDocs,
//   addDoc,
//   updateDoc,
//   arrayUnion,
//   arrayRemove,
//   increment,
//   serverTimestamp,
// } from "firebase/firestore";
// import { db } from "../../config/firebase";
// import RatingDialog from "../components/RatingDialog";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import SaveIcon from "../icons/SaveIcon";

// // Interactive Comment Component
// const InteractiveComment = ({
//   comment,
//   onAddReply,
//   onLike,
//   onDislike,
//   currentUser,
//   level = 0,
// }) => {
//   const [isReplying, setIsReplying] = useState(false);
//   const [replyText, setReplyText] = useState("");

//   const handleReplySubmit = (e) => {
//     e.preventDefault();
//     if (replyText.trim()) {
//       onAddReply(comment.id, replyText);
//       setReplyText("");
//       setIsReplying(false);
//     }
//   };

//   return (
//     <Box
//       sx={{
//         ml: level > 0 ? 4 : 0,
//         mb: 2,
//         p: 2,
//         bgcolor: "rgba(255, 255, 255, 0.05)",
//         borderRadius: 2,
//       }}
//     >
//       <Stack direction="row" spacing={1} alignItems="center" mb={1}>
//         <Box
//           sx={{
//             width: 32,
//             height: 32,
//             borderRadius: "50%",
//             bgcolor: "primary.main",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             fontSize: "0.875rem",
//           }}
//         >
//           {comment.userDisplayName.charAt(0)}
//         </Box>
//         <Stack>
//           <Typography variant="subtitle2" color="white">
//             {comment.userDisplayName}
//           </Typography>
//           <Typography variant="caption" color="#999">
//             {comment.timeAgo}
//           </Typography>
//         </Stack>
//       </Stack>

//       <Typography variant="body2" sx={{ mb: 2 }}>
//         {comment.content}
//       </Typography>

//       <Stack direction="row" spacing={2}>
//         <Button
//           startIcon={<ThumbUpIcon />}
//           size="small"
//           onClick={() => onLike(comment.id)}
//           sx={{
//             color: comment.likedBy?.includes(currentUser?.uid)
//               ? "primary.main"
//               : "text.secondary",
//           }}
//         >
//           {comment.likes || 0}
//         </Button>

//         <Button
//           startIcon={<ThumbDownIcon />}
//           size="small"
//           onClick={() => onDislike(comment.id)}
//           sx={{
//             color: comment.dislikedBy?.includes(currentUser?.uid)
//               ? "error.main"
//               : "text.secondary",
//           }}
//         >
//           {comment.dislikes || 0}
//         </Button>

//         <Button
//           startIcon={<ReplyIcon />}
//           size="small"
//           onClick={() => setIsReplying(!isReplying)}
//         >
//           Reply
//         </Button>
//       </Stack>

//       {isReplying && currentUser && (
//         <Box sx={{ mt: 2 }}>
//           <TextField
//             fullWidth
//             size="small"
//             value={replyText}
//             onChange={(e) => setReplyText(e.target.value)}
//             placeholder="Write a reply..."
//             multiline
//             rows={2}
//             sx={{ mb: 1 }}
//           />
//           <Button
//             variant="contained"
//             size="small"
//             onClick={handleReplySubmit}
//             disabled={!replyText.trim()}
//           >
//             Post Reply
//           </Button>
//         </Box>
//       )}

//       {comment.replies?.map((reply) => (
//         <InteractiveComment
//           key={reply.id}
//           comment={reply}
//           onAddReply={onAddReply}
//           onLike={onLike}
//           onDislike={onDislike}
//           currentUser={currentUser}
//           level={level + 1}
//         />
//       ))}
//     </Box>
//   );
// };

// function PromptDetail() {
//   const auth = getAuth();
//   const userId = auth.currentUser?.uid;
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();
//   const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
//   const [successMessage, setSuccessMessage] = useState(null);
//   const [copied, setCopied] = useState(false);
//   const [expandedComments, setExpandedComments] = useState({});
//   const [commentInputs, setCommentInputs] = useState({});

//   // Fetch prompt data
//   const {
//     data: prompt,
//     error: promptError,
//     isLoading: promptLoading,
//   } = useQuery({
//     queryKey: ["prompt", id],
//     queryFn: async () => {
//       const promptDoc = doc(db, "prompts", id);
//       const promptSnapshot = await getDoc(promptDoc);

//       if (!promptSnapshot.exists()) {
//         throw new Error("Prompt not found");
//       }

//       const data = promptSnapshot.data();
//       const authorRef = doc(db, "users", data.authorId);
//       const authorDoc = await getDoc(authorRef);
//       const authorData = authorDoc.exists() ? authorDoc.data() : null;

//       return {
//         id: promptSnapshot.id,
//         ...data,
//         avgRating: data.avgRating || 0,
//         totalRatings: data.totalRatings || 0,
//         authorName: authorData?.displayName || authorData?.email || "Anonymous",
//       };
//     },
//   });

//   // Fetch ratings with caching
//   const { data: ratings = [], isLoading: ratingsLoading } = useQuery({
//     queryKey: ["ratings", id],
//     queryFn: async () => {
//       const ratingsQuery = query(
//         collection(db, "ratings"),
//         where("promptId", "==", id),
//         orderBy("createdAt", "desc")
//       );
//       const snapshot = await getDocs(ratingsQuery);

//       return Promise.all(
//         snapshot.docs.map(async (docSnapshot) => {
//           const ratingData = docSnapshot.data();
//           const userDisplayName = ratingData.userDisplayName;
//           let finalDisplayName = userDisplayName;

//           if (!finalDisplayName) {
//             const userRef = doc(db, "users", ratingData.userId);
//             const userDoc = await getDoc(userRef);
//             if (userDoc.exists()) {
//               const userData = userDoc.data();
//               finalDisplayName = userData.displayName;
//             }
//           }

//           return {
//             id: docSnapshot.id,
//             ...ratingData,
//             user: {
//               name: finalDisplayName || "Anonymous User",
//               avatar: null,
//               userName: null,
//             },
//             timeAgo: formatDistanceToNow(new Date(ratingData.createdAt), {
//               addSuffix: true,
//             }),
//           };
//         })
//       );
//     },
//     staleTime: 5 * 60 * 1000,
//     cacheTime: 30 * 60 * 1000,
//   });

//   // Fetch comments with caching
//   const { data: commentsMap = {}, isLoading: commentsLoading } = useQuery({
//     queryKey: ["comments", id],
//     staleTime: 5 * 60 * 1000,
//     cacheTime: 30 * 60 * 1000,
//     queryFn: async () => {
//       try {
//         const commentsQuery = query(
//           collection(db, "comments"),
//           where("promptId", "==", id),
//           orderBy("createdAt", "desc")
//         );

//         const snapshot = await getDocs(commentsQuery);
//         const commentsByRating = {};

//         for (const doc of snapshot.docs) {
//           const commentData = doc.data();
//           const ratingId = commentData.ratingId;

//           if (!commentsByRating[ratingId]) {
//             commentsByRating[ratingId] = [];
//           }

//           const timestamp =
//             commentData.createdAt?.toDate?.() ||
//             new Date(commentData.createdAt);

//           let userName = commentData.userDisplayName;
//           if (!userName && commentData.userId) {
//             const userRef = doc(db, "users", commentData.userId);
//             const userDoc = await getDoc(userRef);
//             if (userDoc.exists()) {
//               userName = userDoc.data().displayName;
//             }
//           }

//           commentsByRating[ratingId].push({
//             id: doc.id,
//             ...commentData,
//             userDisplayName: userName || "Anonymous",
//             timeAgo: formatDistanceToNow(timestamp, { addSuffix: true }),
//             replies: commentData.replies || [],
//             likes: commentData.likes || 0,
//             dislikes: commentData.dislikes || 0,
//             likedBy: commentData.likedBy || [],
//             dislikedBy: commentData.dislikedBy || [],
//           });
//         }

//         return commentsByRating;
//       } catch (error) {
//         console.error("Error in comments query:", error);
//         throw error;
//       }
//     },
//   });

//   const handleCommentLikeDislike = async (commentId, isLike) => {
//     if (!auth.currentUser) return;

//     try {
//       const commentRef = doc(db, "comments", commentId);
//       const action = isLike ? "likedBy" : "dislikedBy";
//       const counterField = isLike ? "likes" : "dislikes";
//       const oppositeAction = isLike ? "dislikedBy" : "likedBy";
//       const oppositeCounter = isLike ? "dislikes" : "likes";

//       const comment = (await getDoc(commentRef)).data();
//       const hasOppositeReaction = comment[oppositeAction]?.includes(userId);
//       const hasThisReaction = comment[action]?.includes(userId);

//       if (hasThisReaction) {
//         // Remove reaction
//         await updateDoc(commentRef, {
//           [action]: arrayRemove(userId),
//           [counterField]: increment(-1),
//         });
//       } else {
//         // Add reaction and remove opposite if exists
//         const updates = {
//           [action]: arrayUnion(userId),
//           [counterField]: increment(1),
//         };

//         if (hasOppositeReaction) {
//           updates[oppositeAction] = arrayRemove(userId);
//           updates[oppositeCounter] = increment(-1);
//         }

//         await updateDoc(commentRef, updates);
//       }

//       queryClient.invalidateQueries(["comments", id]);
//     } catch (error) {
//       console.error("Error updating reaction:", error);
//       setSuccessMessage("Failed to update reaction");
//     }
//   };

//   const handleAddReply = async (commentId, replyContent) => {
//     if (!auth.currentUser) return;

//     try {
//       const commentRef = doc(db, "comments", commentId);
//       const replyData = {
//         id: Date.now().toString(), // Simple ID generation
//         content: replyContent,
//         userId: auth.currentUser.uid,
//         userDisplayName: auth.currentUser.displayName || "Anonymous",
//         createdAt: new Date().toISOString(),
//         likes: 0,
//         dislikes: 0,
//         likedBy: [],
//         dislikedBy: [],
//       };

//       await updateDoc(commentRef, {
//         replies: arrayUnion(replyData),
//       });

//       queryClient.invalidateQueries(["comments", id]);
//       setSuccessMessage("Reply added successfully");
//     } catch (error) {
//       console.error("Error adding reply:", error);
//       setSuccessMessage("Failed to add reply");
//     }
//   };

//   const handleRatingSubmit = async (data) => {
//     if (data.success) {
//       setSuccessMessage(data.message);
//       setTimeout(() => setSuccessMessage(null), 5000);
//       queryClient.invalidateQueries(["ratings", id]);
//       queryClient.invalidateQueries(["prompt", id]);
//     }
//   };

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

//   const handleAddComment = async (ratingId) => {
//     const commentContent = commentInputs[ratingId]?.trim();
//     if (!commentContent || !auth.currentUser) return;

//     try {
//       const newComment = {
//         promptId: id,
//         ratingId,
//         userId: auth.currentUser.uid,
//         userDisplayName: auth.currentUser.displayName || "Anonymous",
//         content: commentContent,
//         createdAt: serverTimestamp(),
//         likes: 0,
//         dislikes: 0,
//         likedBy: [],
//         dislikedBy: [],
//         replies: [],
//       };

//       await addDoc(collection(db, "comments"), newComment);
//       setCommentInputs((prev) => ({ ...prev, [ratingId]: "" }));
//       queryClient.invalidateQueries(["comments", id]);
//       setSuccessMessage("Comment added successfully");
//       setTimeout(() => setSuccessMessage(null), 3000);
//     } catch (error) {
//       console.error("Error adding comment:", error);
//       setSuccessMessage("Failed to add comment. Please try again.");
//       setTimeout(() => setSuccessMessage(null), 3000);
//     }
//   };

//   const toggleComments = (ratingId) => {
//     setExpandedComments((prev) => ({
//       ...prev,
//       [ratingId]: !prev[ratingId],
//     }));
//   };

//   const renderCommentSection = (ratingId) => {
//     const comments = commentsMap[ratingId] || [];
//     const isExpanded = expandedComments[ratingId];

//     return (
//       <Box sx={{ mt: 2 }}>
//         <Button
//           startIcon={<ChatBubbleOutlineIcon />}
//           onClick={() => toggleComments(ratingId)}
//           sx={{ mb: 1 }}
//         >
//           {comments.length} Comments
//         </Button>

//         {isExpanded && (
//           <Stack spacing={2}>
//             {comments.map((comment) => (
//               <InteractiveComment
//                 key={comment.id}
//                 comment={comment}
//                 onAddReply={handleAddReply}
//                 onLike={(commentId) =>
//                   handleCommentLikeDislike(commentId, true)
//                 }
//                 onDislike={(commentId) =>
//                   handleCommentLikeDislike(commentId, false)
//                 }
//                 currentUser={auth.currentUser}
//               />
//             ))}

//             {auth.currentUser && (
//               <Stack spacing={1}>
//                 <TextField
//                   size="small"
//                   placeholder="Add a comment..."
//                   multiline
//                   rows={2}
//                   value={commentInputs[ratingId] || ""}
//                   onChange={(e) =>
//                     setCommentInputs((prev) => ({
//                       ...prev,
//                       [ratingId]: e.target.value,
//                     }))
//                   }
//                   sx={{
//                     bgcolor: "rgba(255, 255, 255, 0.05)",
//                     borderRadius: 1,
//                   }}
//                 />
//                 <Button
//                   variant="contained"
//                   size="small"
//                   disabled={!commentInputs[ratingId]?.trim()}
//                   onClick={() => handleAddComment(ratingId)}
//                 >
//                   Post Comment
//                 </Button>
//               </Stack>
//             )}
//           </Stack>
//         )}
//       </Box>
//     );
//   };

//   if (promptLoading) {
//     return (
//       <Container sx={{ mt: 8 }}>
//         <Stack spacing={4}>
//           <Skeleton variant="rectangular" height={200} />
//           <Skeleton variant="rectangular" height={100} />
//           <Skeleton variant="rectangular" height={100} />
//         </Stack>
//       </Container>
//     );
//   }

//   if (promptError) {
//     return (
//       <Container sx={{ mt: 8 }}>
//         <Typography color="error">{promptError.message}</Typography>
//       </Container>
//     );
//   }

//   if (!prompt) {
//     return (
//       <Container sx={{ mt: 8 }}>
//         <Typography>Prompt not found</Typography>
//       </Container>
//     );
//   }

//   return (
//     <>
//       {successMessage && (
//         <Alert
//           severity="success"
//           sx={{
//             mb: 2,
//             backgroundColor: "rgba(76, 175, 80, 0.1)",
//             color: "#4CAF50",
//             "& .MuiAlert-icon": {
//               color: "#4CAF50",
//             },
//           }}
//         >
//           {successMessage}
//         </Alert>
//       )}

//       <Grid container alignItems="flex-end" mb={2}>
//         <Grid size={{ xs: 12, md: 6 }}>
//           <Stack>
//             <Typography variant="h4" fontWeight="bold">
//               Prompt Details
//             </Typography>
//           </Stack>
//         </Grid>
//         <Grid size={{ xs: 12, md: 6 }}>
//           <Stack flexDirection="row" justifyContent="flex-end">
//             {prompt.authorId !== userId && (
//               <Button
//                 variant="contained"
//                 onClick={() => setRatingDialogOpen(true)}
//               >
//                 Rank Prompt
//               </Button>
//             )}
//           </Stack>
//         </Grid>
//       </Grid>

//       <Card>
//         <CardContent>
//           <Box display="flex" flexDirection="row" sx={{ mb: 2 }}>
//             <Box sx={{ flex: 1 }}>
//               <IconButton
//                 onClick={() => navigate(-1)}
//                 sx={{
//                   background: "#444",
//                   p: 2,
//                   "&:hover": { background: "#333" },
//                 }}
//               >
//                 <BackIcon />
//               </IconButton>
//             </Box>

//             <Box sx={{ mr: 1 }}>
//               <Tooltip title={copied ? "Copied!" : "Copy prompt"}>
//                 <IconButton
//                   onClick={handleCopyDescription}
//                   sx={{
//                     background: "#444",
//                     p: 2,
//                     "&:hover": { background: "#333" },
//                     color: copied ? "success.main" : "primary.main",
//                   }}
//                 >
//                   {copied ? (
//                     <CheckCircleIcon fontSize="small" />
//                   ) : (
//                     <ContentCopyIcon fontSize="small" />
//                   )}
//                 </IconButton>
//               </Tooltip>
//             </Box>

//             <Box>
//               <IconButton
//                 sx={{
//                   background: "#444",
//                   p: 2,
//                   "&:hover": { background: "#333" },
//                 }}
//               >
//                 <SaveIcon />
//               </IconButton>
//             </Box>
//           </Box>

//           <Stack>
//             <Stack direction="row" alignItems="center" mb={4}>
//               <StarIcon sx={{ color: "rgb(250, 175, 0)" }} />
//               <Stack sx={{ ml: 1, mr: 1 }}>
//                 <Typography fontWeight="bold">
//                   {prompt.avgRating.toFixed(1)}
//                 </Typography>
//               </Stack>
//               <Typography color="#999">
//                 {prompt.totalRatings}{" "}
//                 {prompt.totalRatings === 1 ? "Review" : "Reviews"}
//               </Typography>
//             </Stack>

//             {prompt.category && (
//               <Typography
//                 variant="body2"
//                 sx={{
//                   textTransform: "uppercase",
//                   fontWeight: "bold",
//                   color: "#999",
//                 }}
//               >
//                 {prompt.category}
//               </Typography>
//             )}

//             <Typography variant="h4" fontWeight="bold" mb={2} color="white">
//               {prompt.title}
//             </Typography>

//             <Box sx={{ position: "relative", mb: 4 }}>
//               <Typography
//                 variant="body1"
//                 sx={{
//                   color: "rgba(255, 255, 255, 0.8)",
//                   lineHeight: 1.7,
//                   pr: 8,
//                 }}
//               >
//                 {prompt.description}
//               </Typography>
//             </Box>

//             <Typography variant="caption" sx={{ color: "#999" }}>
//               Created: {new Date(prompt.createdAt).toLocaleDateString()}
//             </Typography>

//             <Typography variant="caption" sx={{ color: "#999" }}>
//               Author: {prompt.authorName}
//             </Typography>
//           </Stack>
//         </CardContent>
//       </Card>

//       <Stack spacing={2} sx={{ mt: 4 }}>
//         <Typography variant="h5" fontWeight="bold">
//           Ratings {!ratingsLoading && `(${ratings.length})`}
//         </Typography>

//         {ratingsLoading || commentsLoading
//           ? [1, 2, 3].map((index) => (
//               <Card key={index}>
//                 <CardContent>
//                   <Stack spacing={2}>
//                     <Stack direction="row" alignItems="center" spacing={2}>
//                       <Skeleton
//                         variant="circular"
//                         width={40}
//                         height={40}
//                         sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
//                       />
//                       <Stack sx={{ flex: 1 }}>
//                         <Skeleton
//                           variant="text"
//                           width="60%"
//                           sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
//                         />
//                         <Skeleton
//                           variant="text"
//                           width="40%"
//                           sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
//                         />
//                       </Stack>
//                       <Rating
//                         value={0}
//                         readOnly
//                         icon={
//                           <StarIcon sx={{ color: "rgba(250, 175, 0, 0.1)" }} />
//                         }
//                         emptyIcon={
//                           <StarIcon
//                             sx={{ color: "rgba(255, 255, 255, 0.1)" }}
//                           />
//                         }
//                       />
//                     </Stack>
//                     <Stack spacing={1}>
//                       <Skeleton
//                         variant="text"
//                         width="100%"
//                         sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
//                       />
//                       <Skeleton
//                         variant="text"
//                         width="80%"
//                         sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
//                       />
//                     </Stack>
//                   </Stack>
//                 </CardContent>
//               </Card>
//             ))
//           : ratings.map((rating) => (
//               <Card key={rating.id}>
//                 <CardContent>
//                   <Stack spacing={2}>
//                     <Stack direction="row" alignItems="center" spacing={2}>
//                       <Box
//                         sx={{
//                           width: 40,
//                           height: 40,
//                           borderRadius: "50%",
//                           backgroundColor: "primary.main",
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           color: "white",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         {rating.user.name.charAt(0)}
//                       </Box>
//                       <Stack sx={{ flex: 1 }}>
//                         <Typography
//                           variant="subtitle1"
//                           fontWeight="bold"
//                           sx={{ color: "white" }}
//                         >
//                           {rating.user.name}
//                         </Typography>
//                         <Typography variant="caption" color="#999">
//                           {rating.timeAgo}
//                         </Typography>
//                       </Stack>
//                       <Rating
//                         value={rating.rating}
//                         readOnly
//                         icon={<StarIcon sx={{ color: "rgb(250, 175, 0)" }} />}
//                         emptyIcon={<StarIcon />}
//                       />
//                     </Stack>
//                     {rating.comment && (
//                       <Typography variant="body1">{rating.comment}</Typography>
//                     )}
//                     {renderCommentSection(rating.id)}
//                   </Stack>
//                 </CardContent>
//               </Card>
//             ))}
//       </Stack>

//       <RatingDialog
//         open={ratingDialogOpen}
//         onClose={() => setRatingDialogOpen(false)}
//         onSubmit={handleRatingSubmit}
//         promptId={id}
//         userId={auth.currentUser?.uid}
//       />
//     </>
//   );
// }

// export default PromptDetail;

import { useState } from "react";
import { getAuth } from "firebase/auth";
import { formatDistanceToNow } from "date-fns";
import { useParams, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import {
  Container,
  Typography,
  Box,
  Stack,
  IconButton,
  Card,
  CardContent,
  Rating,
  Button,
  Alert,
  Tooltip,
  Skeleton,
  TextField,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BackIcon from "../icons/BackIcon";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ReplyIcon from "@mui/icons-material/Reply";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import RatingDialog from "../components/RatingDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SaveIcon from "../icons/SaveIcon";

// Interactive Comment Component
const InteractiveComment = ({
  comment,
  onAddReply,
  onLike,
  onDislike,
  currentUser,
  level = 0,
  onDeleteComment,
  onEditComment,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editText, setEditText] = useState(comment.content);

  const isAuthor = currentUser?.uid === comment.userId;

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (replyText.trim()) {
      onAddReply(comment.id, replyText);
      setReplyText("");
      setIsReplying(false);
    }
  };

  return (
    <Box
      sx={{
        ml: level > 0 ? 4 : 0,
        mb: 2,
        p: 2,
        bgcolor: "rgba(255, 255, 255, 0.05)",
        borderRadius: 2,
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            bgcolor: "primary.main",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.875rem",
          }}
        >
          {comment.userDisplayName.charAt(0)}
        </Box>
        <Stack>
          <Typography variant="subtitle2" color="white">
            {comment.userDisplayName}
          </Typography>
          <Typography variant="caption" color="#999">
            {comment.timeAgo}
          </Typography>
        </Stack>
      </Stack>

      <Typography variant="body2" sx={{ mb: 2 }}>
        {comment.content}
      </Typography>

      <Stack direction="row" spacing={2}>
        <Button
          startIcon={<ThumbUpIcon />}
          size="small"
          onClick={() => onLike(comment.id)}
          sx={{
            color: comment.likedBy?.includes(currentUser?.uid)
              ? "primary.main"
              : "text.secondary",
          }}
        >
          {comment.likes || 0}
        </Button>

        <Button
          startIcon={<ThumbDownIcon />}
          size="small"
          onClick={() => onDislike(comment.id)}
          sx={{
            color: comment.dislikedBy?.includes(currentUser?.uid)
              ? "error.main"
              : "text.secondary",
          }}
        >
          {comment.dislikes || 0}
        </Button>

        {isAuthor ? (
          <>
            <Button
              startIcon={<EditIcon />}
              size="small"
              onClick={() => setIsEditing(!isEditing)}
            >
              Edit
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              size="small"
              color="error"
              onClick={() => onDeleteComment(comment.id)}
            >
              Delete
            </Button>
          </>
        ) : (
          <Button
            startIcon={<ReplyIcon />}
            size="small"
            onClick={() => setIsReplying(!isReplying)}
          >
            Reply
          </Button>
        )}
      </Stack>

      {isEditing && (
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            size="small"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            multiline
            rows={2}
            sx={{ mb: 1 }}
          />
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                onEditComment(comment.id, editText);
                setIsEditing(false);
              }}
              disabled={!editText.trim() || editText.trim() === comment.content}
            >
              Save
            </Button>
            <Button
              size="small"
              onClick={() => {
                setIsEditing(false);
                setEditText(comment.content);
              }}
            >
              Cancel
            </Button>
          </Stack>
        </Box>
      )}

      {isReplying && currentUser && (
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            size="small"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write a reply..."
            multiline
            rows={2}
            sx={{ mb: 1 }}
          />
          <Button
            variant="contained"
            size="small"
            onClick={handleReplySubmit}
            disabled={!replyText.trim()}
          >
            Post Reply
          </Button>
        </Box>
      )}

      {comment.replies?.map((reply) => (
        <InteractiveComment
          key={reply.id}
          comment={reply}
          onAddReply={onAddReply}
          onLike={onLike}
          onDislike={onDislike}
          currentUser={currentUser}
          level={level + 1}
        />
      ))}
    </Box>
  );
};

function PromptDetail() {
  const auth = getAuth();
  const userId = auth.currentUser?.uid;
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [copied, setCopied] = useState(false);
  const [expandedComments, setExpandedComments] = useState({});
  const [commentInputs, setCommentInputs] = useState({});

  // Fetch prompt data
  const {
    data: prompt,
    error: promptError,
    isLoading: promptLoading,
  } = useQuery({
    queryKey: ["prompt", id],
    queryFn: async () => {
      const promptDoc = doc(db, "prompts", id);
      const promptSnapshot = await getDoc(promptDoc);

      if (!promptSnapshot.exists()) {
        throw new Error("Prompt not found");
      }

      const data = promptSnapshot.data();
      const authorRef = doc(db, "users", data.authorId);
      const authorDoc = await getDoc(authorRef);
      const authorData = authorDoc.exists() ? authorDoc.data() : null;

      return {
        id: promptSnapshot.id,
        ...data,
        avgRating: data.avgRating || 0,
        totalRatings: data.totalRatings || 0,
        authorName: authorData?.displayName || authorData?.email || "Anonymous",
      };
    },
  });

  // Fetch ratings with caching
  const { data: ratings = [], isLoading: ratingsLoading } = useQuery({
    queryKey: ["ratings", id],
    queryFn: async () => {
      const ratingsQuery = query(
        collection(db, "ratings"),
        where("promptId", "==", id),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(ratingsQuery);

      return Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const ratingData = docSnapshot.data();
          const userDisplayName = ratingData.userDisplayName;
          let finalDisplayName = userDisplayName;

          if (!finalDisplayName) {
            const userRef = doc(db, "users", ratingData.userId);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              const userData = userDoc.data();
              finalDisplayName = userData.displayName;
            }
          }

          return {
            id: docSnapshot.id,
            ...ratingData,
            user: {
              name: finalDisplayName || "Anonymous User",
              avatar: null,
              userName: null,
            },
            timeAgo: formatDistanceToNow(new Date(ratingData.createdAt), {
              addSuffix: true,
            }),
          };
        })
      );
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });

  // Fetch comments with caching
  const { data: commentsMap = {}, isLoading: commentsLoading } = useQuery({
    queryKey: ["comments", id],
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    queryFn: async () => {
      try {
        const commentsQuery = query(
          collection(db, "comments"),
          where("promptId", "==", id),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(commentsQuery);
        const commentsByRating = {};

        for (const doc of snapshot.docs) {
          const commentData = doc.data();
          const ratingId = commentData.ratingId;

          if (!commentsByRating[ratingId]) {
            commentsByRating[ratingId] = [];
          }

          const timestamp =
            commentData.createdAt?.toDate?.() ||
            new Date(commentData.createdAt);

          let userName = commentData.userDisplayName;
          if (!userName && commentData.userId) {
            const userRef = doc(db, "users", commentData.userId);
            const userDoc = await getDoc(userRef);
            if (userDoc.exists()) {
              userName = userDoc.data().displayName;
            }
          }

          commentsByRating[ratingId].push({
            id: doc.id,
            ...commentData,
            userDisplayName: userName || "Anonymous",
            timeAgo: formatDistanceToNow(timestamp, { addSuffix: true }),
            replies: commentData.replies || [],
            likes: commentData.likes || 0,
            dislikes: commentData.dislikes || 0,
            likedBy: commentData.likedBy || [],
            dislikedBy: commentData.dislikedBy || [],
          });
        }

        return commentsByRating;
      } catch (error) {
        console.error("Error in comments query:", error);
        throw error;
      }
    },
  });

  const handleCommentLikeDislike = async (commentId, isLike) => {
    if (!auth.currentUser) return;

    try {
      const commentRef = doc(db, "comments", commentId);
      const action = isLike ? "likedBy" : "dislikedBy";
      const counterField = isLike ? "likes" : "dislikes";
      const oppositeAction = isLike ? "dislikedBy" : "likedBy";
      const oppositeCounter = isLike ? "dislikes" : "likes";

      const comment = (await getDoc(commentRef)).data();
      const hasOppositeReaction = comment[oppositeAction]?.includes(userId);
      const hasThisReaction = comment[action]?.includes(userId);

      if (hasThisReaction) {
        // Remove reaction
        await updateDoc(commentRef, {
          [action]: arrayRemove(userId),
          [counterField]: increment(-1),
        });
      } else {
        // Add reaction and remove opposite if exists
        const updates = {
          [action]: arrayUnion(userId),
          [counterField]: increment(1),
        };

        if (hasOppositeReaction) {
          updates[oppositeAction] = arrayRemove(userId);
          updates[oppositeCounter] = increment(-1);
        }

        await updateDoc(commentRef, updates);
      }

      queryClient.invalidateQueries(["comments", id]);
    } catch (error) {
      console.error("Error updating reaction:", error);
      setSuccessMessage("Failed to update reaction");
    }
  };

  const handleAddReply = async (commentId, replyContent) => {
    if (!auth.currentUser) return;

    try {
      const commentRef = doc(db, "comments", commentId);
      const replyData = {
        id: Date.now().toString(), // Simple ID generation
        content: replyContent,
        userId: auth.currentUser.uid,
        userDisplayName: auth.currentUser.displayName || "Anonymous",
        createdAt: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: [],
      };

      await updateDoc(commentRef, {
        replies: arrayUnion(replyData),
      });

      queryClient.invalidateQueries(["comments", id]);
      setSuccessMessage("Reply added successfully");
    } catch (error) {
      console.error("Error adding reply:", error);
      setSuccessMessage("Failed to add reply");
    }
  };

  const handleRatingSubmit = async (data) => {
    if (data.success) {
      setSuccessMessage(data.message);
      setTimeout(() => setSuccessMessage(null), 5000);
      queryClient.invalidateQueries(["ratings", id]);
      queryClient.invalidateQueries(["prompt", id]);
    }
  };

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

  const handleDeleteComment = async (commentId) => {
    if (!auth.currentUser) return;

    try {
      const commentRef = doc(db, "comments", commentId);
      await deleteDoc(commentRef);

      queryClient.invalidateQueries(["comments", id]);
      setSuccessMessage("Comment deleted successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error deleting comment:", error);
      setSuccessMessage("Failed to delete comment");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    if (!auth.currentUser) return;

    try {
      const commentRef = doc(db, "comments", commentId);
      await updateDoc(commentRef, {
        content: newContent,
        editedAt: serverTimestamp(),
      });

      queryClient.invalidateQueries(["comments", id]);
      setSuccessMessage("Comment updated successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error updating comment:", error);
      setSuccessMessage("Failed to update comment");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const handleAddComment = async (ratingId) => {
    const commentContent = commentInputs[ratingId]?.trim();
    if (!commentContent || !auth.currentUser) return;

    try {
      const newComment = {
        promptId: id,
        ratingId,
        userId: auth.currentUser.uid,
        userDisplayName: auth.currentUser.displayName || "Anonymous",
        content: commentContent,
        createdAt: serverTimestamp(),
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: [],
        replies: [],
      };

      await addDoc(collection(db, "comments"), newComment);
      setCommentInputs((prev) => ({ ...prev, [ratingId]: "" }));
      queryClient.invalidateQueries(["comments", id]);
      setSuccessMessage("Comment added successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error adding comment:", error);
      setSuccessMessage("Failed to add comment. Please try again.");
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  const toggleComments = (ratingId) => {
    setExpandedComments((prev) => ({
      ...prev,
      [ratingId]: !prev[ratingId],
    }));
  };

  const renderCommentSection = (ratingId) => {
    const comments = commentsMap[ratingId] || [];
    const isExpanded = expandedComments[ratingId];

    return (
      <Box sx={{ mt: 2 }}>
        <Button
          startIcon={<ChatBubbleOutlineIcon />}
          onClick={() => toggleComments(ratingId)}
          sx={{ mb: 1 }}
        >
          {comments.length} Comments
        </Button>

        {isExpanded && (
          <Stack spacing={2}>
            {comments.map((comment) => (
              <InteractiveComment
                key={comment.id}
                comment={comment}
                onAddReply={handleAddReply}
                onLike={(commentId) =>
                  handleCommentLikeDislike(commentId, true)
                }
                onDislike={(commentId) =>
                  handleCommentLikeDislike(commentId, false)
                }
                onDeleteComment={handleDeleteComment}
                onEditComment={handleEditComment}
                currentUser={auth.currentUser}
              />
            ))}

            {auth.currentUser && (
              <Stack spacing={1}>
                <TextField
                  size="small"
                  placeholder="Add a comment..."
                  multiline
                  rows={2}
                  value={commentInputs[ratingId] || ""}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({
                      ...prev,
                      [ratingId]: e.target.value,
                    }))
                  }
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                    borderRadius: 1,
                  }}
                />
                <Button
                  variant="contained"
                  size="small"
                  disabled={!commentInputs[ratingId]?.trim()}
                  onClick={() => handleAddComment(ratingId)}
                >
                  Post Comment
                </Button>
              </Stack>
            )}
          </Stack>
        )}
      </Box>
    );
  };

  if (promptLoading) {
    return (
      <Container sx={{ mt: 8 }}>
        <Stack spacing={4}>
          <Skeleton variant="rectangular" height={200} />
          <Skeleton variant="rectangular" height={100} />
          <Skeleton variant="rectangular" height={100} />
        </Stack>
      </Container>
    );
  }

  if (promptError) {
    return (
      <Container sx={{ mt: 8 }}>
        <Typography color="error">{promptError.message}</Typography>
      </Container>
    );
  }

  if (!prompt) {
    return (
      <Container sx={{ mt: 8 }}>
        <Typography>Prompt not found</Typography>
      </Container>
    );
  }

  return (
    <>
      {successMessage && (
        <Alert
          severity="success"
          sx={{
            mb: 2,
            backgroundColor: "rgba(76, 175, 80, 0.1)",
            color: "#4CAF50",
            "& .MuiAlert-icon": {
              color: "#4CAF50",
            },
          }}
        >
          {successMessage}
        </Alert>
      )}

      <Grid container alignItems="flex-end" mb={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack>
            <Typography variant="h4" fontWeight="bold">
              Prompt Details
            </Typography>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack flexDirection="row" justifyContent="flex-end">
            {prompt.authorId !== userId && (
              <Button
                variant="contained"
                onClick={() => setRatingDialogOpen(true)}
              >
                Rank Prompt
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>

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
                  {copied ? (
                    <CheckCircleIcon fontSize="small" />
                  ) : (
                    <ContentCopyIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </Box>

            <Box>
              <IconButton
                sx={{
                  background: "#444",
                  p: 2,
                  "&:hover": { background: "#333" },
                }}
              >
                <SaveIcon />
              </IconButton>
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

            <Box sx={{ position: "relative", mb: 4 }}>
              <Typography
                variant="body1"
                sx={{
                  color: "rgba(255, 255, 255, 0.8)",
                  lineHeight: 1.7,
                  pr: 8,
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
        </CardContent>
      </Card>

      <Stack spacing={2} sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight="bold">
          Ratings {!ratingsLoading && `(${ratings.length})`}
        </Typography>

        {ratingsLoading || commentsLoading
          ? [1, 2, 3].map((index) => (
              <Card key={index}>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Skeleton
                        variant="circular"
                        width={40}
                        height={40}
                        sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
                      />
                      <Stack sx={{ flex: 1 }}>
                        <Skeleton
                          variant="text"
                          width="60%"
                          sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
                        />
                        <Skeleton
                          variant="text"
                          width="40%"
                          sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
                        />
                      </Stack>
                      <Rating
                        value={0}
                        readOnly
                        icon={
                          <StarIcon sx={{ color: "rgba(250, 175, 0, 0.1)" }} />
                        }
                        emptyIcon={
                          <StarIcon
                            sx={{ color: "rgba(255, 255, 255, 0.1)" }}
                          />
                        }
                      />
                    </Stack>
                    <Stack spacing={1}>
                      <Skeleton
                        variant="text"
                        width="100%"
                        sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
                      />
                      <Skeleton
                        variant="text"
                        width="80%"
                        sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
                      />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))
          : ratings.map((rating) => (
              <Card key={rating.id}>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: "50%",
                          backgroundColor: "primary.main",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          fontWeight: "bold",
                        }}
                      >
                        {rating.user.name.charAt(0)}
                      </Box>
                      <Stack sx={{ flex: 1 }}>
                        <Typography
                          variant="subtitle1"
                          fontWeight="bold"
                          sx={{ color: "white" }}
                        >
                          {rating.user.name}
                        </Typography>
                        <Typography variant="caption" color="#999">
                          {rating.timeAgo}
                        </Typography>
                      </Stack>
                      <Rating
                        value={rating.rating}
                        readOnly
                        icon={<StarIcon sx={{ color: "rgb(250, 175, 0)" }} />}
                        emptyIcon={<StarIcon />}
                      />
                    </Stack>
                    {rating.comment && (
                      <Typography variant="body1">{rating.comment}</Typography>
                    )}
                    {renderCommentSection(rating.id)}
                  </Stack>
                </CardContent>
              </Card>
            ))}
      </Stack>

      <RatingDialog
        open={ratingDialogOpen}
        onClose={() => setRatingDialogOpen(false)}
        onSubmit={handleRatingSubmit}
        promptId={id}
        userId={auth.currentUser?.uid}
      />
    </>
  );
}

export default PromptDetail;
