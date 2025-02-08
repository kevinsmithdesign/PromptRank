import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Avatar,
  IconButton,
} from "@mui/material";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import {
  getFirestore,
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
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../../config/firebase";

const auth = getAuth();

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

  // Get first letter of display name or email for avatar
  const getAvatarText = () => {
    if (data.userDisplayName) return data.userDisplayName[0].toUpperCase();
    if (data.userEmail) return data.userEmail[0].toUpperCase();
    return "U";
  };

  // Check if current user is the comment author
  const isAuthor = currentUser && currentUser.uid === data.userId;

  return (
    <Box sx={{ marginBottom: 1, marginLeft: data.parentId === "root" ? 0 : 4 }}>
      <Paper
        elevation={0}
        sx={{
          padding: 1.5,
          borderRadius: 2,
          backgroundColor: "#f0f2f5",
          maxWidth: "500px",
          display: "flex",
          alignItems: "flex-start",
          gap: 1.5,
        }}
      >
        <Avatar sx={{ width: 32, height: 32 }} src={data.userPhotoURL || null}>
          {!data.userPhotoURL && getAvatarText()}
        </Avatar>

        <Box>
          <Typography variant="body2" fontWeight="bold">
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
            <Typography variant="body2">{data.text}</Typography>
          )}

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="caption" color="gray">
              {timeAgo}
            </Typography>
            {currentUser && (
              <Button
                size="small"
                onClick={() => setReplying(!replying)}
                sx={{
                  fontSize: "0.75rem",
                  color: "blue",
                  textTransform: "none",
                  padding: "0px 5px",
                }}
              >
                Reply
              </Button>
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
      </Paper>

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
          <Avatar
            sx={{ width: 28, height: 28 }}
            src={currentUser.photoURL || null}
          >
            {!currentUser.photoURL &&
              (currentUser.displayName?.[0] || currentUser.email?.[0] || "U")}
          </Avatar>
          <TextField
            fullWidth
            size="small"
            placeholder="Write a reply..."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            sx={{ backgroundColor: "#f0f2f5", borderRadius: "20px" }}
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

const CommentThread = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Set up auth state listener
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    // Set up real-time listener for comments
    const q = query(collection(db, "comments"), orderBy("timestamp", "desc"));

    const unsubscribeComments = onSnapshot(q, (snapshot) => {
      const commentsMap = new Map();

      snapshot.forEach((doc) => {
        const comment = {
          id: doc.id,
          ...doc.data(),
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
    });

    return () => {
      unsubscribeAuth();
      unsubscribeComments();
    };
  }, []);

  const handleAddComment = async (parentId, text) => {
    if (!currentUser) return;

    try {
      await addDoc(collection(db, "comments"), {
        text,
        parentId: parentId || "root",
        timestamp: serverTimestamp(),
        likes: 0,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        userDisplayName: currentUser.displayName,
        userPhotoURL: currentUser.photoURL,
      });
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  const handleEditComment = async (commentId, newText) => {
    if (!currentUser) return;

    try {
      const commentRef = doc(db, "comments", commentId);
      await updateDoc(commentRef, {
        text: newText,
        editedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error editing comment: ", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!currentUser) return;

    try {
      await deleteDoc(doc(db, "comments", commentId));
    } catch (error) {
      console.error("Error deleting comment: ", error);
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
      console.error("Error liking comment: ", error);
    }
  };

  return (
    <Box sx={{ padding: 2, maxWidth: "600px", backgroundColor: "#ffffff" }}>
      {currentUser ? (
        <>
          <TextField
            fullWidth
            variant="outlined"
            size="small"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
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
