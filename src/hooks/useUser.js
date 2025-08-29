import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../../config/firebase";

export const useUser = (userId) => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        // For new users, create a basic user document if it doesn't exist
        // This handles the case where signup succeeded but document creation failed
        const currentUser = auth.currentUser;
        if (currentUser && currentUser.uid === userId) {
          const userData = {
            email: currentUser.email,
            displayName: currentUser.displayName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          // Create the missing user document
          await setDoc(docRef, userData);
          return { id: userId, ...userData };
        }
        
        throw new Error("User not found");
      }
      
      return { id: docSnap.id, ...docSnap.data() };
    },
    enabled: !!userId,
    retry: 3, // Retry up to 3 times for network issues
    retryDelay: 1000, // Wait 1 second between retries
  });

  const updateUser = useMutation({
    mutationFn: async ({ displayName, email }) => {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {
        displayName,
        email,
        updatedAt: new Date().toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["user", userId]);
    },
  });

  return {
    user,
    isLoading,
    error,
    updateUser,
  };
};
