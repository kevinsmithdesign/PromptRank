import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  TextField,
  Avatar,
  IconButton,
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
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
} from "firebase/firestore";
import { db } from "../../config/firebase";

const Comment = ({ data, onReply, onLike, onEdit, onDelete, currentUser }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editText, setEditText] = useState(data.text);

  const timeAgo = data.timestamp
    ? Math.floor((new Date() - new Date(data.timestamp.toDate())) / 60000) +
      "m ago"
    : "just now";

  const getAvatarText = () => {
    if (data.userDisplayName) return data.userDisplayName[0].toUpperCase();
    if (data.userEmail) return data.userEmail[0].toUpperCase();
    return "U";
  };

  const isAuthor = currentUser && currentUser.uid === data.userId;

  return (
    <Box sx={{ marginBottom: 1, marginLeft: data.parentId === "root" ? 0 : 4 }}>
      <Card
        elevation={0}
        sx={{
          padding: 2,
          borderRadius: 2,
          border: "1px solid #444",
          backgroundColor: "#222",
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <Avatar sx={{ width: 32, height: 32 }} src={data.userPhotoURL || null}>
          {!data.userPhotoURL && getAvatarText()}
        </Avatar>

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
            <Typography variant="body2" mb={1}>
              {data.text}
            </Typography>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="caption" color="#999">
              {timeAgo}
            </Typography>
            {currentUser && (
              <Box
                size="small"
                onClick={() => setReplying(!replying)}
                sx={{
                  fontSize: "0.75rem",
                  color: "#999",
                  textTransform: "none",
                  padding: "0px 5px",
                  cursor: "pointer",
                }}
              >
                Reply
              </Box>
            )}
            <IconButton
              size="small"
              onClick={() => currentUser && onLike(data.id)}
              disabled={!currentUser}
            >
              <ThumbUpAltIcon
                sx={{
                  fontSize: "1rem",
                  color: data.likes > 0 ? "blue" : "gray",
                }}
              />
            </IconButton>
            <Typography variant="caption">
              {data.likes > 0 ? data.likes : ""}
            </Typography>
            {isAuthor && (
              <>
                <IconButton size="small" onClick={() => setEditing(!editing)}>
                  <EditIcon sx={{ fontSize: "1rem", color: "gray" }} />
                </IconButton>
                <IconButton size="small" onClick={() => onDelete(data.id)}>
                  <DeleteIcon sx={{ fontSize: "1rem", color: "gray" }} />
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
        <Button
          size="small"
          onClick={() => setShowReplies(!showReplies)}
          sx={{
            fontSize: "0.75rem",
            textTransform: "none",
            color: "gray",
            marginLeft: 4,
          }}
        >
          {showReplies ? "Hide Replies" : `View Replies (${data.replyCount})`}
        </Button>
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
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userDisplayName: currentUser.displayName,
        userPhotoURL: currentUser.photoURL,
      };

      const docRef = await addDoc(collection(db, "comments"), commentData);
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
      await updateDoc(commentRef, {
        likes: increment(1),
      });
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      {currentUser ? (
        <>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            sx={{
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
          <Button
            sx={{ marginTop: 1 }}
            variant="contained"
            onClick={() => {
              if (newComment.trim()) {
                handleAddComment("root", newComment);
                setNewComment("");
              }
            }}
          >
            Post
          </Button>
        </>
      ) : (
        <Typography variant="body2" color="gray" sx={{ marginBottom: 2 }}>
          Please sign in to post comments
        </Typography>
      )}
      <Box sx={{ marginTop: 2 }}>
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
