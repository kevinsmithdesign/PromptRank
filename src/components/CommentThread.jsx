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
  getDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";

const Comment = ({
  comment,
  parentId,
  currentUser,
  onReply,
  onEdit,
  onDelete,
  onLike,
  onDislike,
  isReply = false,
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [editText, setEditText] = useState(comment.content);

  const isAuthor = currentUser?.uid === comment.userId;

  // Calculate counts from arrays, ensuring they exist
  const likeCount = comment.likedBy?.length || 0;
  const dislikeCount = comment.dislikedBy?.length || 0;

  const handleSubmitReply = () => {
    if (replyText.trim()) {
      // If this is a reply to a reply, use the parent's ID
      const targetParentId = parentId || comment.id;
      onReply(targetParentId, replyText);
      setReplyText("");
      setIsReplying(false);
    }
  };

  const handleSubmitEdit = () => {
    if (editText.trim() && editText !== comment.content) {
      // For nested replies, we need both IDs
      if (parentId) {
        onEdit(parentId, comment.id, editText);
      } else {
        onEdit(comment.id, null, editText);
      }
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    if (parentId) {
      onDelete(parentId, comment.id);
    } else {
      onDelete(comment.id);
    }
  };

  const handleLike = () => {
    if (parentId) {
      onLike(parentId, comment.id);
    } else {
      onLike(comment.id);
    }
  };

  const handleDislike = () => {
    if (parentId) {
      onDislike(parentId, comment.id);
    } else {
      onDislike(comment.id);
    }
  };

  return (
    <Box
      sx={{
        pl: isReply ? 6 : 0,
        width: "100%",
      }}
    >
      {/* Main Comment Container */}
      <Box
        sx={{
          mb: 1,
          width: "100%",
        }}
      >
        <Stack spacing={1}>
          {/* User Info and Comment Content */}
          <Stack direction="row" spacing={1.5}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: "primary.main",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {comment.userDisplayName?.[0] || "A"}
            </Box>
            <Box
              sx={{
                bgcolor: "rgba(255, 255, 255, 0.05)",
                borderRadius: 2,
                p: 1.5,
                width: "fit-content",
                maxWidth: "calc(100% - 48px)",
              }}
            >
              <Typography variant="subtitle2" color="white" sx={{ mb: 0.5 }}>
                {comment.userDisplayName || "Anonymous"}
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  size="small"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  multiline
                  rows={2}
                  sx={{ mb: 1 }}
                />
              ) : (
                <Typography variant="body2" sx={{ wordBreak: "break-word" }}>
                  {comment.content}
                </Typography>
              )}
            </Box>
          </Stack>

          {/* Action Buttons */}
          <Stack
            direction="row"
            spacing={2}
            sx={{
              ml: 5.5,
              "& .MuiButton-root": {
                minWidth: "unset",
                px: 1,
                textTransform: "none",
                fontWeight: "normal",
              },
            }}
          >
            <Button
              size="small"
              onClick={handleLike}
              sx={{
                color: comment.likedBy?.includes(currentUser?.uid)
                  ? "primary.main"
                  : "text.secondary",
              }}
            >
              Like {likeCount > 0 && `(${likeCount})`}
            </Button>

            <Button
              size="small"
              onClick={handleDislike}
              sx={{
                color: comment.dislikedBy?.includes(currentUser?.uid)
                  ? "error.main"
                  : "text.secondary",
              }}
            >
              Dislike {dislikeCount > 0 && `(${dislikeCount})`}
            </Button>

            <Button
              size="small"
              onClick={() => setIsReplying(!isReplying)}
              sx={{ color: "text.secondary" }}
            >
              Reply
            </Button>

            {isAuthor && (
              <>
                <Button
                  size="small"
                  onClick={() => setIsEditing(!isEditing)}
                  sx={{ color: "text.secondary" }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  onClick={handleDelete}
                  sx={{ color: "error.main" }}
                >
                  Delete
                </Button>
              </>
            )}

            <Typography
              variant="caption"
              color="#999"
              sx={{ alignSelf: "center" }}
            >
              {comment.timeAgo}
            </Typography>
          </Stack>

          {/* Edit/Reply Forms */}
          {isEditing && (
            <Stack direction="row" spacing={1} sx={{ ml: 5.5 }}>
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
          )}

          {isReplying && (
            <Box sx={{ ml: 5.5 }}>
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
                Reply
              </Button>
            </Box>
          )}
        </Stack>
      </Box>

      {/* Nested Replies */}
      {comment.replies?.length > 0 && (
        <Stack spacing={1}>
          {comment.replies.map((reply) => (
            <Comment
              key={reply.id}
              comment={reply}
              parentId={comment.id}
              currentUser={currentUser}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onLike={onLike}
              onDislike={onDislike}
              isReply={true}
            />
          ))}
        </Stack>
      )}
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

      await updateDoc(commentRef, {
        replies: arrayUnion(replyData),
      });

      onCommentUpdate();
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  // Edit comment or reply
  const handleEdit = async (commentId, newContent, replyId = null) => {
    if (!currentUser) return;

    try {
      const commentRef = doc(db, "comments", commentId);
      const commentDoc = await getDoc(commentRef);

      if (!commentDoc.exists()) {
        console.error("Comment not found");
        return;
      }

      const comment = commentDoc.data();

      if (replyId) {
        // Editing a reply
        const updatedReplies = comment.replies.map((reply) => {
          if (reply.id === replyId) {
            if (reply.userId !== currentUser.uid) {
              throw new Error("Not authorized to edit this reply");
            }
            return {
              ...reply,
              content: newContent,
              editedAt: new Date().toISOString(),
            };
          }
          return reply;
        });

        await updateDoc(commentRef, {
          replies: updatedReplies,
        });
      } else {
        // Editing main comment
        if (comment.userId !== currentUser.uid) {
          throw new Error("Not authorized to edit this comment");
        }

        await updateDoc(commentRef, {
          content: newContent,
          editedAt: serverTimestamp(),
        });
      }

      onCommentUpdate();
    } catch (error) {
      console.error("Error editing comment:", error);
    }
  };

  // Delete comment or reply
  const handleDelete = async (commentId, replyId = null) => {
    if (!currentUser) return;

    try {
      const commentRef = doc(db, "comments", commentId);
      const commentDoc = await getDoc(commentRef);

      if (!commentDoc.exists()) {
        console.error("Comment not found");
        return;
      }

      if (replyId) {
        // Deleting a reply
        const comment = commentDoc.data();
        const replyIndex = comment.replies.findIndex(
          (reply) => reply.id === replyId
        );

        if (replyIndex === -1) {
          throw new Error("Reply not found");
        }

        if (comment.replies[replyIndex].userId !== currentUser.uid) {
          throw new Error("Not authorized to delete this reply");
        }

        const updatedReplies = comment.replies.filter(
          (reply) => reply.id !== replyId
        );
        await updateDoc(commentRef, {
          replies: updatedReplies,
        });
      } else {
        // Deleting main comment
        const comment = commentDoc.data();
        if (comment.userId !== currentUser.uid) {
          throw new Error("Not authorized to delete this comment");
        }
        await deleteDoc(commentRef);
      }

      onCommentUpdate();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // Handle likes/dislikes for both comments and replies
  const handleReaction = async (commentId, isLike, replyId = null) => {
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

      if (replyId) {
        // Handle reaction for reply
        const updatedReplies = comment.replies.map((reply) => {
          if (reply.id === replyId) {
            const likedBy = reply.likedBy || [];
            const dislikedBy = reply.dislikedBy || [];
            const hasReacted = isLike
              ? likedBy.includes(userId)
              : dislikedBy.includes(userId);
            const hasOppositeReaction = isLike
              ? dislikedBy.includes(userId)
              : likedBy.includes(userId);

            if (hasReacted) {
              // Remove reaction
              return {
                ...reply,
                [isLike ? "likedBy" : "dislikedBy"]: (isLike
                  ? likedBy
                  : dislikedBy
                ).filter((id) => id !== userId),
                [isLike ? "likes" : "dislikes"]:
                  (reply[isLike ? "likes" : "dislikes"] || 0) - 1,
              };
            } else {
              // Add reaction
              const updates = {
                ...reply,
                [isLike ? "likedBy" : "dislikedBy"]: [
                  ...(isLike ? likedBy : dislikedBy),
                  userId,
                ],
                [isLike ? "likes" : "dislikes"]:
                  (reply[isLike ? "likes" : "dislikes"] || 0) + 1,
              };

              if (hasOppositeReaction) {
                updates[isLike ? "dislikedBy" : "likedBy"] = (
                  isLike ? dislikedBy : likedBy
                ).filter((id) => id !== userId);
                updates[isLike ? "dislikes" : "likes"] =
                  (reply[isLike ? "dislikes" : "likes"] || 0) - 1;
              }

              return updates;
            }
          }
          return reply;
        });

        await updateDoc(commentRef, { replies: updatedReplies });
      } else {
        // Handle reaction for main comment
        const action = isLike ? "likedBy" : "dislikedBy";
        const oppositeAction = isLike ? "dislikedBy" : "likedBy";
        const counterField = isLike ? "likes" : "dislikes";
        const oppositeCounter = isLike ? "dislikes" : "likes";

        const hasReacted = comment[action]?.includes(userId);
        const hasOppositeReaction = comment[oppositeAction]?.includes(userId);

        if (hasReacted) {
          await updateDoc(commentRef, {
            [action]: arrayRemove(userId),
            [counterField]: increment(-1),
          });
        } else {
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
              onLike={(commentId, replyId) =>
                handleReaction(commentId, true, replyId)
              }
              onDislike={(commentId, replyId) =>
                handleReaction(commentId, false, replyId)
              }
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default CommentThread;
