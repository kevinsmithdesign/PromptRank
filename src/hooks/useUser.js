import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, updateDoc } from "firebase/firestore";
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
        throw new Error("User not found");
      }
      return { id: docSnap.id, ...docSnap.data() };
    },
    enabled: !!userId,
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
