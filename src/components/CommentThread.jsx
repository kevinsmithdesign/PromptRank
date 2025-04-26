import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  TextField,
  Avatar,
  IconButton,
  InputAdornment,
  Stack,
  useTheme,
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import LikeIcon from "../icons/LikeIcon";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  onSnapshot,
  serverTimestamp,
  orderBy,
  increment,
  where,
  getDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../config/firebase";

const Comment = ({ data, onReply, onLike, onEdit, onDelete, currentUser }) => {
  const theme = useTheme();
  const [showReplies, setShowReplies] = useState(false);
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editText, setEditText] = useState(data.text);

  const timeAgo = data.timestamp
    ? (() => {
        const now = new Date();
        const date = new Date(data.timestamp.toDate());
        const diffInMinutes = Math.floor((now - date) / 60000);

        if (diffInMinutes < 1) return "just now";
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440)
          return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
      })()
    : "just now";

  const isAuthor = currentUser && currentUser.uid === data.userId;
  const hasUserLiked = data.likedBy?.includes(currentUser?.uid);

  return (
    <Box sx={{ marginBottom: 1, marginLeft: data.parentId === "root" ? 0 : 4 }}>
      <Card
        elevation={0}
        sx={{
          padding: 2,
          borderRadius: 2,
          backgroundColor: "#222",
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        {/* <Avatar sx={{ width: 32, height: 32 }} src={data.userPhotoURL || null}>
          {!data.userPhotoURL && getAvatarText()}
        </Avatar> 
        {/* <img src={data.userPhotoURL} alt="profile image" /> */}

        <Box>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "50%",
              backgroundColor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: "bold",
              fontSize: 14,
            }}
          >
            {data.userDisplayName.charAt(0)}
          </Box>
        </Box>
        <Box sx={{ width: "100%" }}>
          <Typography variant="body2" fontWeight="bold" mb={0.5}>
            {data.userDisplayName || data.userEmail || "Anonymous User"}
          </Typography>
          {editing ? (
            <TextField
              fullWidth
              size="small"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
          ) : (
            <Typography variant="body2" mb={2}>
              {data.text}
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.6,
            }}
          >
            <Typography variant="caption" color="#999">
              {timeAgo}
            </Typography>
            <Box sx={{ width: "24px" }}></Box>

            <Box
              size="small"
              onClick={() => currentUser && !hasUserLiked && onLike(data.id)}
              disabled={!currentUser || hasUserLiked}
              sx={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <ThumbUpAltIcon
                sx={{
                  fontSize: "1rem",
                  color: hasUserLiked ? "#fff" : "gray",
                }}
              />
            </Box>
            <Box variant="caption" color="#fff" sx={{ fontSize: ".8rem" }}>
              {data.likes > 0 ? data.likes : ""}
            </Box>
            {isAuthor && (
              <>
                <IconButton size="small" onClick={() => setEditing(!editing)}>
                  <EditIcon
                    sx={{
                      fontSize: "1rem",
                      color: "#fff",
                      "&:hover": { color: theme.palette.primary.main },
                    }}
                  />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(data.id)}>
                  <DeleteIcon
                    sx={{
                      fontSize: "1rem",
                      color: "#fff",
                      "&:hover": { color: theme.palette.error.main },
                    }}
                  />
                </IconButton>
              </>
            )}
            {editing && (
              <Button
                size="small"
                onClick={() => {
                  onEdit(data.id, editText);
                  setEditing(false);
                }}
              >
                Save
              </Button>
            )}
            <Box sx={{ flex: 1 }}></Box>
            <Box>
              {currentUser && (
                <Box
                  size="small"
                  onClick={() => setReplying(!replying)}
                  sx={{
                    fontSize: "0.75rem",
                    color: "#fff",
                    "&:hover": {
                      color: theme.palette.primary.main,
                    },
                    textTransform: "none",
                    padding: "0px 5px",
                    cursor: "pointer",
                  }}
                >
                  Reply
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Card>

      {replying && currentUser && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            marginTop: 1,
            marginLeft: 5,
          }}
        >
          <Avatar sx={{}} src={currentUser.photoURL || null}>
            {!currentUser.photoURL &&
              (currentUser.displayName?.[0] || currentUser.email?.[0] || "U")}
          </Avatar>
          <TextField
            fullWidth
            size="small"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            sx={{ backgroundColor: "#1e1e1e", borderRadius: "20px" }}
          />
          <IconButton
            onClick={() => {
              if (replyText.trim()) {
                onReply(data.id, replyText);
                setReplyText("");
                setReplying(false);
              }
            }}
          >
            <SendIcon sx={{ color: "blue" }} />
          </IconButton>
        </Box>
      )}

      {data.replyCount > 0 && (
        <Box
          onClick={() => setShowReplies(!showReplies)}
          sx={{
            fontSize: "0.75rem",

            color: "gray",
            marginLeft: 2.5,
            cursor: "pointer",
            mt: 1,
          }}
        >
          {showReplies ? "Hide Replies" : `View Replies (${data.replyCount})`}
        </Box>
      )}

      {showReplies && data.replies && (
        <Box sx={{ marginLeft: 4, marginTop: 1 }}>
          {data.replies.map((reply) => (
            <Comment
              key={reply.id}
              data={reply}
              onReply={onReply}
              onLike={onLike}
              onEdit={onEdit}
              onDelete={onDelete}
              currentUser={currentUser}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

const CommentThread = ({ promptId, ratingId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    if (!promptId || !ratingId) {
      console.log("Missing promptId or ratingId:", { promptId, ratingId });
      return;
    }

    const q = query(
      collection(db, "comments"),
      where("promptId", "==", promptId),
      where("ratingId", "==", ratingId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const commentsMap = new Map();

        snapshot.forEach((doc) => {
          const commentData = doc.data();

          const comment = {
            id: doc.id,
            ...commentData,
            replies: [],
            replyCount: 0,
          };
          commentsMap.set(doc.id, comment);
        });

        const topLevelComments = [];
        commentsMap.forEach((comment) => {
          if (comment.parentId === "root") {
            topLevelComments.push(comment);
          } else {
            const parentComment = commentsMap.get(comment.parentId);
            if (parentComment) {
              parentComment.replies.push(comment);
              parentComment.replyCount++;
            }
          }
        });

        setComments(topLevelComments);
      },
      (error) => {
        console.error("Error in comments snapshot:", error);
      }
    );

    return () => unsubscribe();
  }, [promptId, ratingId]);

  const handleAddComment = async (parentId, text) => {
    if (!currentUser || !text.trim()) return;

    try {
      const commentData = {
        text,
        parentId: parentId || "root",
        promptId,
        ratingId,
        timestamp: serverTimestamp(),
        likes: 0,
        likedBy: [],
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userDisplayName: currentUser.displayName,
        userPhotoURL: currentUser.photoURL,
      };

      await addDoc(collection(db, "comments"), commentData);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleEditComment = async (commentId, newText) => {
    if (!currentUser || !newText.trim()) return;

    try {
      const commentRef = doc(db, "comments", commentId);
      await updateDoc(commentRef, {
        text: newText,
        editedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!currentUser) return;

    try {
      await deleteDoc(doc(db, "comments", commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!currentUser) return;

    try {
      const commentRef = doc(db, "comments", commentId);
      const commentSnap = await getDoc(commentRef);

      if (!commentSnap.exists()) return;

      // Check if user has already liked this comment
      const likedBy = commentSnap.data().likedBy || [];
      if (likedBy.includes(currentUser.uid)) return;

      // Add user to likedBy array and increment likes count
      await updateDoc(commentRef, {
        likes: increment(1),
        likedBy: arrayUnion(currentUser.uid),
      });
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  return (
    <Box sx={{ pt: 3 }}>
      {currentUser ? (
        <Box
          sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}
        >
          <Box>
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
                mr: 2,
              }}
            >
              {currentUser?.photoURL ? (
                <img
                  src={currentUser.photoURL}
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
          </Box>
          <Box sx={{ flex: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Write a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      edge="end"
                      onClick={() => {
                        if (newComment.trim()) {
                          handleAddComment("root", newComment);
                          setNewComment("");
                        }
                      }}
                      disabled={!newComment.trim()}
                    >
                      <SendIcon sx={{ color: "#fff" }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                width: "100%",
                backgroundColor: "#1e1e1e",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#444",
                  },
                  "&:hover fieldset": {
                    borderColor: "#666",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#888",
                  },
                },
              }}
            />
          </Box>
        </Box>
      ) : (
        <Typography variant="body2" color="gray" sx={{ marginBottom: 2 }}>
          Please{" "}
          <Link to="/login" style={{ color: theme.palette.primary.main }}>
            sign in
          </Link>{" "}
          to post comments
        </Typography>
      )}
      <Box sx={{ marginTop: 3 }}>
        {comments.map((comment) => (
          <Comment
            key={comment.id}
            data={comment}
            onReply={handleAddComment}
            onLike={handleLikeComment}
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
            currentUser={currentUser}
          />
        ))}
      </Box>
    </Box>
  );
};

export default CommentThread;
