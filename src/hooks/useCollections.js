// import { useState, useEffect } from "react";
// import {
//   collection,
//   query,
//   where,
//   getDocs,
//   addDoc,
//   updateDoc,
//   deleteDoc,
//   doc,
// } from "firebase/firestore";
// import { db, auth } from "../../config/firebase";

// export const useCollections = () => {
//   const [collections, setCollections] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [createCollectionLoading, setCreateCollectionLoading] = useState(false);
//   const [saveToCollectionLoading, setSaveToCollectionLoading] = useState(false);
//   const [updateCollectionLoading, setUpdateCollectionLoading] = useState(false);
//   const [deleteCollectionLoading, setDeleteCollectionLoading] = useState(false);

//   const fetchCollections = async () => {
//     setIsLoading(true);
//     try {
//       const collectionsRef = collection(db, "collections");
//       const q = query(
//         collectionsRef,
//         where("userId", "==", auth.currentUser?.uid)
//       );
//       const querySnapshot = await getDocs(q);

//       const fetchedCollections = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//         prompts: doc.data().prompts || [],
//       }));

//       setCollections(fetchedCollections);
//     } catch (err) {
//       setError(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         fetchCollections();
//       } else {
//         setError({ message: "not-logged-in" });
//         setIsLoading(false);
//         setCollections([]);
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   const createCollection = async ({ name }, { onSuccess }) => {
//     setCreateCollectionLoading(true);
//     try {
//       const collectionsRef = collection(db, "collections");
//       const newCollection = {
//         name,
//         userId: auth.currentUser?.uid,
//         prompts: [],
//         createdAt: new Date().toISOString(),
//       };

//       const docRef = await addDoc(collectionsRef, newCollection);
//       const createdCollection = { id: docRef.id, ...newCollection };

//       setCollections((prev) => [...prev, createdCollection]);
//       onSuccess?.(createdCollection);
//     } catch (err) {
//       setError(err);
//       throw err;
//     } finally {
//       setCreateCollectionLoading(false);
//     }
//   };

//   const updateCollection = async (
//     { id, name, description },
//     { onSuccess, onError }
//   ) => {
//     setUpdateCollectionLoading(true);
//     try {
//       if (!id || !name) {
//         throw new Error("Missing required fields for update");
//       }

//       console.log("Updating collection in Firebase:", {
//         id,
//         name,
//         description,
//       }); // Debug log

//       const collectionRef = doc(db, "collections", id);
//       const updateData = {
//         name,
//         description: description || "",
//         updatedAt: new Date().toISOString(),
//       };

//       await updateDoc(collectionRef, updateData);

//       setCollections((prev) =>
//         prev.map((collection) =>
//           collection.id === id ? { ...collection, ...updateData } : collection
//         )
//       );

//       console.log("Update successful"); // Debug log
//       onSuccess?.();
//     } catch (err) {
//       console.error("Update error:", err); // Debug log
//       onError?.(err);
//       setError(err);
//     } finally {
//       setUpdateCollectionLoading(false);
//     }
//   };

//   const deleteCollection = async ({ id }, { onSuccess, onError }) => {
//     setDeleteCollectionLoading(true);
//     try {
//       if (!id) {
//         throw new Error("Missing collection ID for deletion");
//       }

//       console.log("Deleting collection from Firebase:", id); // Debug log

//       const collectionRef = doc(db, "collections", id);
//       await deleteDoc(collectionRef);

//       setCollections((prev) =>
//         prev.filter((collection) => collection.id !== id)
//       );

//       console.log("Delete successful"); // Debug log
//       onSuccess?.();
//     } catch (err) {
//       console.error("Delete error:", err); // Debug log
//       onError?.(err);
//       setError(err);
//     } finally {
//       setDeleteCollectionLoading(false);
//     }
//   };

//   const saveToCollection = async (
//     { collectionId, promptId },
//     { onSuccess, onError }
//   ) => {
//     setSaveToCollectionLoading(true);
//     try {
//       const collectionRef = doc(db, "collections", collectionId);
//       const collection = collections.find((c) => c.id === collectionId);

//       if (!collection) throw new Error("Collection not found");

//       // Check for duplicate
//       if (collection.prompts?.some((p) => p.id === promptId)) {
//         throw new Error("This prompt is already in this collection");
//       }

//       // Add prompt to collection's prompts array
//       await updateDoc(collectionRef, {
//         prompts: [
//           ...(collection.prompts || []),
//           { id: promptId, addedAt: new Date().toISOString() },
//         ],
//       });

//       // Update local state
//       setCollections((prev) =>
//         prev.map((c) =>
//           c.id === collectionId
//             ? {
//                 ...c,
//                 prompts: [
//                   ...(c.prompts || []),
//                   { id: promptId, addedAt: new Date().toISOString() },
//                 ],
//               }
//             : c
//         )
//       );

//       onSuccess?.();
//     } catch (err) {
//       onError?.(err);
//     } finally {
//       setSaveToCollectionLoading(false);
//     }
//   };

//   return {
//     collections,
//     isLoading,
//     error,
//     createCollection,
//     createCollectionLoading,
//     saveToCollection,
//     saveToCollectionLoading,
//     updateCollection,
//     deleteCollection,
//     updateCollectionLoading,
//     deleteCollectionLoading,
//   };
// };

import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "../../config/firebase";

export const useCollections = () => {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createCollectionLoading, setCreateCollectionLoading] = useState(false);
  const [saveToCollectionLoading, setSaveToCollectionLoading] = useState(false);
  const [updateCollectionLoading, setUpdateCollectionLoading] = useState(false);
  const [deleteCollectionLoading, setDeleteCollectionLoading] = useState(false);

  const getUserCollectionsRef = (userId) => {
    return collection(db, `users/${userId}/collections`);
  };

  const fetchCollections = async () => {
    setIsLoading(true);
    try {
      if (!auth.currentUser?.uid) {
        throw new Error("User not authenticated");
      }

      const collectionsRef = getUserCollectionsRef(auth.currentUser.uid);
      const querySnapshot = await getDocs(collectionsRef);

      const fetchedCollections = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        prompts: doc.data().prompts || [],
      }));

      setCollections(fetchedCollections);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        fetchCollections();
      } else {
        setError({ message: "not-logged-in" });
        setIsLoading(false);
        setCollections([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const createCollection = async ({ name }, { onSuccess }) => {
    setCreateCollectionLoading(true);
    try {
      if (!auth.currentUser?.uid) {
        throw new Error("User not authenticated");
      }

      const collectionsRef = getUserCollectionsRef(auth.currentUser.uid);
      const newCollection = {
        name,
        prompts: [],
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collectionsRef, newCollection);
      const createdCollection = { id: docRef.id, ...newCollection };

      setCollections((prev) => [...prev, createdCollection]);
      onSuccess?.(createdCollection);
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setCreateCollectionLoading(false);
    }
  };

  const updateCollection = async (
    { id, name, description },
    { onSuccess, onError }
  ) => {
    setUpdateCollectionLoading(true);
    try {
      if (!auth.currentUser?.uid || !id || !name) {
        throw new Error("Missing required fields for update");
      }

      const collectionRef = doc(
        db,
        `users/${auth.currentUser.uid}/collections`,
        id
      );
      const updateData = {
        name,
        description: description || "",
        updatedAt: new Date().toISOString(),
      };

      await updateDoc(collectionRef, updateData);

      setCollections((prev) =>
        prev.map((collection) =>
          collection.id === id ? { ...collection, ...updateData } : collection
        )
      );

      onSuccess?.();
    } catch (err) {
      console.error("Update error:", err);
      onError?.(err);
      setError(err);
    } finally {
      setUpdateCollectionLoading(false);
    }
  };

  const deleteCollection = async ({ id }, { onSuccess, onError }) => {
    setDeleteCollectionLoading(true);
    try {
      if (!auth.currentUser?.uid || !id) {
        throw new Error("Missing required fields for deletion");
      }

      const collectionRef = doc(
        db,
        `users/${auth.currentUser.uid}/collections`,
        id
      );
      await deleteDoc(collectionRef);

      setCollections((prev) =>
        prev.filter((collection) => collection.id !== id)
      );

      onSuccess?.();
    } catch (err) {
      console.error("Delete error:", err);
      onError?.(err);
      setError(err);
    } finally {
      setDeleteCollectionLoading(false);
    }
  };

  const saveToCollection = async (
    { collectionId, promptId },
    { onSuccess, onError }
  ) => {
    setSaveToCollectionLoading(true);
    try {
      if (!auth.currentUser?.uid) {
        throw new Error("User not authenticated");
      }

      const collectionRef = doc(
        db,
        `users/${auth.currentUser.uid}/collections`,
        collectionId
      );
      const collection = collections.find((c) => c.id === collectionId);

      if (!collection) throw new Error("Collection not found");

      if (collection.prompts?.some((p) => p.id === promptId)) {
        throw new Error("This prompt is already in this collection");
      }

      await updateDoc(collectionRef, {
        prompts: [
          ...(collection.prompts || []),
          { id: promptId, addedAt: new Date().toISOString() },
        ],
      });

      setCollections((prev) =>
        prev.map((c) =>
          c.id === collectionId
            ? {
                ...c,
                prompts: [
                  ...(c.prompts || []),
                  { id: promptId, addedAt: new Date().toISOString() },
                ],
              }
            : c
        )
      );

      onSuccess?.();
    } catch (err) {
      onError?.(err);
    } finally {
      setSaveToCollectionLoading(false);
    }
  };

  return {
    collections,
    isLoading,
    error,
    createCollection,
    createCollectionLoading,
    saveToCollection,
    saveToCollectionLoading,
    updateCollection,
    deleteCollection,
    updateCollectionLoading,
    deleteCollectionLoading,
  };
};
