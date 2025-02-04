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
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import RatingDialog from "../components/RatingDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import SaveIcon from "../icons/SaveIcon";

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
        console.log("Fetching comments for promptId:", id);

        const commentsQuery = query(
          collection(db, "comments"),
          where("promptId", "==", id),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(commentsQuery);
        console.log("Found comments:", snapshot.docs.length);

        const commentsByRating = {};

        for (const doc of snapshot.docs) {
          const commentData = doc.data();
          console.log("Processing comment data:", commentData);

          const ratingId = commentData.ratingId;
          if (!commentsByRating[ratingId]) {
            commentsByRating[ratingId] = [];
          }

          // Properly handle Firestore timestamp
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
            timeAgo: formatDistanceToNow(timestamp, {
              addSuffix: true,
            }),
          });
        }

        console.log("Final commentsByRating:", commentsByRating);
        return commentsByRating;
      } catch (error) {
        console.error("Error in comments query:", error);
        throw error;
      }
    },
  });

  console.log("Current commentsMap:", commentsMap);

  const handleRatingSubmit = async (data) => {
    if (data.success) {
      setSuccessMessage(data.message);
      setTimeout(() => setSuccessMessage(null), 5000);
      // Invalidate relevant queries
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
      };

      // Add to Firebase
      const docRef = await addDoc(collection(db, "comments"), newComment);
      console.log("Added comment with ID:", docRef.id);

      // Invalidate the comments query to fetch fresh data
      queryClient.invalidateQueries(["comments", id]);

      // Clear input
      setCommentInputs((prev) => ({ ...prev, [ratingId]: "" }));

      // Show success message
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

    console.log("Rendering comments for ratingId:", ratingId, {
      commentsFound: comments.length,
      comments,
      isExpanded,
    });

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
          <Stack spacing={1}>
            {comments.map((comment) => (
              <Box
                key={comment.id}
                sx={{
                  p: 4,
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
                <Typography variant="body2">{comment.content}</Typography>
              </Box>
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
      // Loading state JSX remains the same...
      <div>Loading...</div>
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

      {/* Rest of the JSX remains the same... */}
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

            {/* Fixed Copy Button */}
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

          {/* <Box>
              <Tooltip title={copied ? "Copied!" : "Copy description"}>
                <IconButton
                  onClick={handleCopyDescription}
                  sx={{
                    position: "absolute",
                    right: 0,
                    top: 0,
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
            </Box> */}

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
              {/* <Tooltip title={copied ? "Copied!" : "Copy description"}>
                <IconButton
                  onClick={handleCopyDescription}
                  sx={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    color: copied ? "success.main" : "primary.main",
                  }}
                >
                  {copied ? (
                    <CheckCircleIcon fontSize="small" />
                  ) : (
                    <ContentCopyIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip> */}
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
