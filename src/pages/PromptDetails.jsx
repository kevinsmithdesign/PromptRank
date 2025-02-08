import { useState } from "react";
import { getAuth } from "firebase/auth";
import { formatDistanceToNow } from "date-fns";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import {
  Container,
  Typography,
  Stack,
  Card,
  CardContent,
  Rating,
  Button,
  Alert,
  Box,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import RatingDialog from "../components/RatingDialog";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PromptDetailCard from "../components/PromptDetailCard";
import CommentThread from "../components/CommentThread";

function PromptDetail() {
  const auth = getAuth();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [ratingDialogOpen, setRatingDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

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

  // Find if current user has already rated
  const userExistingRating = ratings.find(
    (rating) => rating.userId === auth.currentUser?.uid
  );

  // Fetch comments with caching
  // const { data: commentsMap = {}, isLoading: commentsLoading } = useQuery({
  //   queryKey: ["comments", id],
  //   staleTime: 5 * 60 * 1000,
  //   cacheTime: 30 * 60 * 1000,
  //   queryFn: async () => {
  //     try {
  //       const commentsQuery = query(
  //         collection(db, "comments"),
  //         where("promptId", "==", id),
  //         orderBy("createdAt", "desc")
  //       );

  //       const snapshot = await getDocs(commentsQuery);
  //       const commentsByRating = {};

  //       for (const doc of snapshot.docs) {
  //         const commentData = doc.data();
  //         const ratingId = commentData.ratingId;

  //         if (!commentsByRating[ratingId]) {
  //           commentsByRating[ratingId] = [];
  //         }

  //         const timestamp =
  //           commentData.createdAt?.toDate?.() ||
  //           new Date(commentData.createdAt);

  //         let userName = commentData.userDisplayName;
  //         if (!userName && commentData.userId) {
  //           const userRef = doc(db, "users", commentData.userId);
  //           const userDoc = await getDoc(userRef);
  //           if (userDoc.exists()) {
  //             userName = userDoc.data().displayName;
  //           }
  //         }

  //         commentsByRating[ratingId].push({
  //           id: doc.id,
  //           ...commentData,
  //           userDisplayName: userName || "Anonymous",
  //           timeAgo: formatDistanceToNow(timestamp, { addSuffix: true }),
  //           replies: commentData.replies || [],
  //           likes: commentData.likes || 0,
  //           dislikes: commentData.dislikes || 0,
  //           likedBy: commentData.likedBy || [],
  //           dislikedBy: commentData.dislikedBy || [],
  //         });
  //       }

  //       return commentsByRating;
  //     } catch (error) {
  //       console.error("Error in comments query:", error);
  //       throw error;
  //     }
  //   },
  // });

  const handleRatingSubmit = async (data) => {
    if (data.success) {
      setSuccessMessage(data.message);
      setTimeout(() => setSuccessMessage(null), 5000);
      queryClient.invalidateQueries(["ratings", id]);
      queryClient.invalidateQueries(["prompt", id]);
    }
  };

  const handleDeleteRating = async (ratingId) => {
    try {
      await deleteDoc(doc(db, "ratings", ratingId));
      setSuccessMessage("Rating deleted successfully");
      setTimeout(() => setSuccessMessage(null), 5000);
      queryClient.invalidateQueries(["ratings", id]);
      queryClient.invalidateQueries(["prompt", id]);
    } catch (error) {
      console.error("Error deleting rating:", error);
      setSuccessMessage("Error deleting rating");
    }
  };

  // const renderCommentSection = (ratingId) => {
  //   const comments = commentsMap[ratingId] || [];

  //   return (
  //     <CommentThread
  //       promptId={id}
  //       ratingId={ratingId}
  //       currentUser={auth.currentUser}
  //       comments={comments}
  //       onCommentUpdate={() => queryClient.invalidateQueries(["comments", id])}
  //     />
  //   );
  // };

  if (promptLoading) {
    return (
      <Container sx={{ mt: 8 }}>
        <Stack spacing={4}>Loading...</Stack>
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
          <Stack flexDirection="row" justifyContent="flex-end" spacing={2}>
            {prompt.authorId !== auth.currentUser?.uid && (
              <Button
                variant="contained"
                onClick={() => setRatingDialogOpen(true)}
              >
                {userExistingRating ? "Update Rating" : "Rank Prompt"}
              </Button>
            )}
          </Stack>
        </Grid>
      </Grid>

      <PromptDetailCard prompt={prompt} />

      <Stack spacing={2} sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight="bold">
          Ratings {!ratingsLoading && `(${ratings.length})`}
        </Typography>

        {ratings.map((rating) => (
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
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Rating
                      value={rating.rating}
                      readOnly
                      icon={<StarIcon sx={{ color: "rgb(250, 175, 0)" }} />}
                      emptyIcon={<StarIcon />}
                    />
                    {rating.userId === auth.currentUser?.uid && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteRating(rating.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </Stack>
                </Stack>
                {rating.comment && (
                  <Typography variant="body1">{rating.comment}</Typography>
                )}
                {/* {renderCommentSection(rating.id)} */}

                {/* COMMENTS WILL GO HERE */}
                <CommentThread />
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
        existingRating={userExistingRating}
      />
    </>
  );
}

export default PromptDetail;
