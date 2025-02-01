import { db, auth } from "../../config/firebase";
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  orderBy,
  where,
  writeBatch,
} from "firebase/firestore";
import { formatDistanceToNow } from "date-fns";

const promptsCollection = collection(db, "prompts");
const ratingsCollection = collection(db, "ratings");

export const promptsApi = {
  getPrompts: async () => {
    const q = query(promptsCollection, orderBy("createdAt", "desc"));
    const data = await getDocs(q);
    return data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  },

  getPromptById: async (id) => {
    const promptDoc = await getDoc(doc(db, "prompts", id));
    if (!promptDoc.exists()) {
      throw new Error("Prompt not found");
    }
    return { ...promptDoc.data(), id: promptDoc.id };
  },

  getUserPrompts: async (userId) => {
    const q = query(
      promptsCollection,
      where("authorId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const data = await getDocs(q);
    return data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
  },

  createPrompt: async ({ title, description, category, isVisible }) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("Must be logged in to create prompts");
    }

    const newPrompt = {
      title,
      description,
      category,
      isVisible,
      authorId: currentUser.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      avgRating: 0,
      totalRatings: 0,
    };

    const docRef = await addDoc(promptsCollection, newPrompt);
    return { ...newPrompt, id: docRef.id };
  },

  updatePrompt: async ({ id, title, description, category, isVisible }) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("Must be logged in to edit prompts");
    }

    const promptDoc = doc(db, "prompts", id);
    const promptSnapshot = await getDoc(promptDoc);

    if (!promptSnapshot.exists()) {
      throw new Error("Prompt not found");
    }

    if (promptSnapshot.data().authorId !== currentUser.uid) {
      throw new Error("You can only edit your own prompts");
    }

    const updateData = {
      title,
      description,
      category,
      isVisible,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(promptDoc, updateData);
    return {
      id,
      ...promptSnapshot.data(),
      ...updateData,
    };
  },

  deletePrompt: async (id) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("Must be logged in to delete prompts");
    }

    const promptDoc = doc(db, "prompts", id);
    const promptSnapshot = await getDoc(promptDoc);

    if (!promptSnapshot.exists()) {
      throw new Error("Prompt not found");
    }

    if (promptSnapshot.data().authorId !== currentUser.uid) {
      throw new Error("You can only delete your own prompts");
    }

    await deleteDoc(promptDoc);
    return id;
  },

  getPromptDetail: async (id) => {
    const promptDoc = await getDoc(doc(db, "prompts", id));

    if (!promptDoc.exists()) {
      throw new Error("Prompt not found");
    }

    const data = promptDoc.data();

    const authorRef = doc(db, "users", data.authorId);
    const authorDoc = await getDoc(authorRef);
    const authorData = authorDoc.exists() ? authorDoc.data() : null;

    return {
      id: promptDoc.id,
      ...data,
      avgRating: data.avgRating || 0,
      totalRatings: data.totalRatings || 0,
      authorName: authorData?.displayName || authorData?.email || "Anonymous",
    };
  },

  getPromptRatings: async (promptId) => {
    const ratingsQuery = query(
      ratingsCollection,
      where("promptId", "==", promptId),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(ratingsQuery);

    const ratingsWithUserData = await Promise.all(
      snapshot.docs.map(async (docSnapshot) => {
        const ratingData = docSnapshot.data();
        let finalDisplayName = ratingData.userDisplayName;

        if (!finalDisplayName) {
          const userDoc = await getDoc(doc(db, "users", ratingData.userId));
          if (userDoc.exists()) {
            finalDisplayName = userDoc.data().displayName;
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

    return ratingsWithUserData;
  },

  submitRating: async ({ promptId, rating, comment }) => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("Must be logged in to submit ratings");
    }

    const batch = writeBatch(db);

    const ratingRef = doc(collection(db, "ratings"));
    const ratingData = {
      promptId,
      userId: currentUser.uid,
      userDisplayName: currentUser.displayName,
      rating,
      comment,
      createdAt: new Date().toISOString(),
    };

    batch.set(ratingRef, ratingData);

    const promptRef = doc(db, "prompts", promptId);
    const promptDoc = await getDoc(promptRef);
    const promptData = promptDoc.data();

    const currentTotal = promptData.totalRatings || 0;
    const currentAvg = promptData.avgRating || 0;
    const newTotal = currentTotal + 1;
    const newAvg = (currentAvg * currentTotal + rating) / newTotal;

    batch.update(promptRef, {
      avgRating: newAvg,
      totalRatings: newTotal,
    });

    await batch.commit();

    return {
      success: true,
      message: "Rating submitted successfully",
      rating: { id: ratingRef.id, ...ratingData },
    };
  },
};
