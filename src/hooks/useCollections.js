import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  updateDoc,
  increment,
  query,
  orderBy,
} from "firebase/firestore";
import { db, auth } from "../../config/firebase";

export const useCollections = () => {
  const queryClient = useQueryClient();

  // Fetch collections
  const {
    data: collections = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["collections"],
    queryFn: async () => {
      console.log("Fetching collections...");
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("not-logged-in");
      }
      console.log("Current user ID:", currentUser.uid);

      const collectionsRef = collection(
        db,
        "users",
        currentUser.uid,
        "collections"
      );
      console.log("Collections reference path:", collectionsRef.path);

      const q = query(collectionsRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      console.log("Fetched collections count:", snapshot.docs.length);
      console.log(
        "Collections data:",
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    },
    enabled: !!auth.currentUser,
  });

  // Create new collection
  const createCollectionMutation = useMutation({
    mutationFn: async ({ name, description }) => {
      console.log("Starting collection creation...");
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("You must be logged in to create collections");
      }
      console.log("Current user ID:", currentUser.uid);

      // Create the user document first if it doesn't exist
      const userDocRef = doc(db, "users", currentUser.uid);
      console.log("User document path:", userDocRef.path);

      try {
        await setDoc(
          userDocRef,
          {
            email: currentUser.email,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
        console.log("User document created/updated");

        // Then create the collection
        const collectionsRef = collection(
          db,
          "users",
          currentUser.uid,
          "collections"
        );
        console.log("Creating collection at path:", collectionsRef.path);

        const collectionData = {
          name: name.trim(),
          description: description.trim(),
          createdAt: new Date().toISOString(),
          promptCount: 0,
          userId: currentUser.uid,
        };
        console.log("Collection data to save:", collectionData);

        const newCollection = await addDoc(collectionsRef, collectionData);
        console.log("Collection created with ID:", newCollection.id);
        console.log("Full collection path:", newCollection.path);

        return {
          id: newCollection.id,
          ...collectionData,
        };
      } catch (error) {
        console.error("Error in collection creation:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log("Mutation succeeded. New collection:", data);
      queryClient.setQueryData(["collections"], (old = []) => [data, ...old]);
    },
    onError: (error) => {
      console.error("Mutation failed:", error);
    },
  });

  // Save prompt to collection
  const saveToCollectionMutation = useMutation({
    mutationFn: async ({ collectionId, promptId }) => {
      console.log("Starting save to collection...");
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error("You must be logged in to save to collections");
      }

      // Check if prompt already exists in collection
      const promptsRef = collection(
        db,
        "users",
        currentUser.uid,
        "collections",
        collectionId,
        "prompts"
      );

      const existingPromptsSnapshot = await getDocs(promptsRef);
      const promptExists = existingPromptsSnapshot.docs.some(
        (doc) => doc.data().promptId === promptId
      );

      if (promptExists) {
        throw new Error("This prompt is already in this collection");
      }

      // Add prompt to collection
      await addDoc(promptsRef, {
        promptId,
        addedAt: new Date().toISOString(),
      });

      // Update prompt count
      const collectionRef = doc(
        db,
        "users",
        currentUser.uid,
        "collections",
        collectionId
      );
      await updateDoc(collectionRef, {
        promptCount: increment(1),
      });

      return { collectionId, promptId };
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["collections"], (old = []) =>
        old.map((collection) =>
          collection.id === variables.collectionId
            ? { ...collection, promptCount: collection.promptCount + 1 }
            : collection
        )
      );
    },
  });

  return {
    collections,
    isLoading,
    error,
    createCollection: createCollectionMutation.mutateAsync,
    createCollectionLoading: createCollectionMutation.isLoading,
    createCollectionError: createCollectionMutation.error,
    saveToCollection: saveToCollectionMutation.mutateAsync,
    saveToCollectionLoading: saveToCollectionMutation.isLoading,
    saveToCollectionError: saveToCollectionMutation.error,
  };
};
