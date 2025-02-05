import { useState } from "react";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import {
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  collection,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";
import { getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

const Comment = ({
  comment,
  currentUser,
  onReply,
  onEdit,
  onDelete,
  onLike,
  onDislike,
  level = 0,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editText, setEditText] = useState(comment.content);

  const isAuthor = currentUser?.uid === comment.userId;

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText("");
      setIsReplying(false);
    }
  };

  const handleSubmitEdit = () => {
    if (editText.trim() && editText !== comment.content) {
      onEdit(comment.id, editText);
      setIsEditing(false);
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
      {/* User Info */}
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
          }}
        >
          {comment.userDisplayName?.[0] || "A"}
        </Box>
        <Stack>
          <Typography variant="subtitle2" color="white">
            {comment.userDisplayName || "Anonymous"}
          </Typography>
          <Typography variant="caption" color="#999">
            {comment.timeAgo}
          </Typography>
        </Stack>
      </Stack>

      {/* Comment Content */}
      {isEditing ? (
        <Box sx={{ mt: 2, mb: 2 }}>
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
              onClick={handleSubmitEdit}
              disabled={!editText.trim() || editText === comment.content}
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
      ) : (
        <Typography variant="body2" sx={{ mb: 2 }}>
          {comment.content}
        </Typography>
      )}

      {/* Action Buttons */}
      <Stack direction="row" spacing={2}>
        <Button
          size="small"
          onClick={() => onLike(comment.id)}
          sx={{
            color: comment.likedBy?.includes(currentUser?.uid)
              ? "primary.main"
              : "text.secondary",
          }}
        >
          Like ({comment.likes || 0})
        </Button>
        <Button
          size="small"
          onClick={() => onDislike(comment.id)}
          sx={{
            color: comment.dislikedBy?.includes(currentUser?.uid)
              ? "error.main"
              : "text.secondary",
          }}
        >
          Dislike ({comment.dislikes || 0})
        </Button>

        {isAuthor ? (
          <>
            <Button size="small" onClick={() => setIsEditing(!isEditing)}>
              Edit
            </Button>
            <Button
              size="small"
              color="error"
              onClick={() => onDelete(comment.id)}
            >
              Delete
            </Button>
          </>
        ) : (
          <Button size="small" onClick={() => setIsReplying(!isReplying)}>
            Reply
          </Button>
        )}
      </Stack>

      {/* Reply Form */}
      {isReplying && (
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
            onClick={handleSubmitReply}
            disabled={!replyText.trim()}
          >
            Post Reply
          </Button>
        </Box>
      )}

      {/* Nested Replies */}
      {comment.replies?.map((reply) => (
        <Comment
          key={reply.id}
          comment={reply}
          currentUser={currentUser}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
          onLike={onLike}
          onDislike={onDislike}
          level={level + 1}
        />
      ))}
    </Box>
  );
};

const CommentThread = ({
  ratingId,
  promptId,
  currentUser,
  comments = [],
  onCommentUpdate,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newCommentText, setNewCommentText] = useState("");

  // Add new top-level comment
  const handleAddComment = async () => {
    if (!newCommentText.trim() || !currentUser) return;

    try {
      const newComment = {
        promptId,
        ratingId,
        userId: currentUser.uid,
        userDisplayName: currentUser.displayName || "Anonymous",
        content: newCommentText,
        createdAt: serverTimestamp(),
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: [],
        replies: [],
      };

      await addDoc(collection(db, "comments"), newComment);
      setNewCommentText("");
      onCommentUpdate();
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Add reply to existing comment
  const handleReply = async (commentId, replyContent) => {
    if (!currentUser) return;

    try {
      const commentRef = doc(db, "comments", commentId);
      const commentDoc = await getDoc(commentRef);

      if (!commentDoc.exists()) {
        console.error("Comment not found");
        return;
      }

      const replyData = {
        id: Date.now().toString(), // Simple unique ID
        content: replyContent,
        userId: currentUser.uid,
        userDisplayName: currentUser.displayName || "Anonymous",
        createdAt: new Date().toISOString(),
        likes: 0,
        dislikes: 0,
        likedBy: [],
        dislikedBy: [],
      };

      // Add new reply to the replies array
      await updateDoc(commentRef, {
        replies: arrayUnion(replyData),
      });

      onCommentUpdate();
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  // Edit comment
  const handleEdit = async (commentId, newContent) => {
    if (!currentUser) return;

    try {
      const commentRef = doc(db, "comments", commentId);
      const commentDoc = await getDoc(commentRef);

      if (!commentDoc.exists()) {
        console.error("Comment not found");
        return;
      }

      // Only allow editing if user is the author
      if (commentDoc.data().userId !== currentUser.uid) {
        console.error("Not authorized to edit this comment");
        return;
      }

      await updateDoc(commentRef, {
        content: newContent,
        editedAt: serverTimestamp(),
      });

      onCommentUpdate();
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  // Delete comment
  const handleDelete = async (commentId) => {
    if (!currentUser) return;

    try {
      const commentRef = doc(db, "comments", commentId);
      const commentDoc = await getDoc(commentRef);

      if (!commentDoc.exists()) {
        console.error("Comment not found");
        return;
      }

      // Only allow deletion if user is the author
      if (commentDoc.data().userId !== currentUser.uid) {
        console.error("Not authorized to delete this comment");
        return;
      }

      await deleteDoc(commentRef);
      onCommentUpdate();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Handle likes/dislikes
  const handleReaction = async (commentId, isLike) => {
    if (!currentUser) return;

    try {
      const commentRef = doc(db, "comments", commentId);
      const commentDoc = await getDoc(commentRef);

      if (!commentDoc.exists()) {
        console.error("Comment not found");
        return;
      }

      const comment = commentDoc.data();
      const userId = currentUser.uid;
      const action = isLike ? "likedBy" : "dislikedBy";
      const oppositeAction = isLike ? "dislikedBy" : "likedBy";
      const counterField = isLike ? "likes" : "dislikes";
      const oppositeCounter = isLike ? "dislikes" : "likes";

      const hasReacted = comment[action]?.includes(userId);
      const hasOppositeReaction = comment[oppositeAction]?.includes(userId);

      if (hasReacted) {
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

      onCommentUpdate();
    } catch (error) {
      console.error("Error updating reaction:", error);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Button
        startIcon={<ChatBubbleOutlineIcon />}
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{ mb: 1 }}
      >
        {comments.length} Comments
      </Button>

      {isExpanded && (
        <Stack spacing={2}>
          {/* New Comment Form */}
          {currentUser && (
            <Stack spacing={1}>
              <TextField
                size="small"
                placeholder="Add a comment..."
                multiline
                rows={2}
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                sx={{ bgcolor: "rgba(255, 255, 255, 0.05)", borderRadius: 1 }}
              />
              <Button
                variant="contained"
                size="small"
                disabled={!newCommentText.trim()}
                onClick={handleAddComment}
              >
                Post Comment
              </Button>
            </Stack>
          )}

          {/* Comments List */}
          {comments.map((comment) => (
            <Comment
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              onReply={handleReply}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onLike={(commentId) => handleReaction(commentId, true)}
              onDislike={(commentId) => handleReaction(commentId, false)}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default CommentThread;
