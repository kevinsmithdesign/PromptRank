import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

export const useUserPrompts = (userId) => {
  return useQuery({
    queryKey: ["userPrompts", userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }

      try {
        // This matches how prompts are stored in the PromptsPage
        const promptsRef = collection(db, "prompts");
        const q = query(
          promptsRef,
          where("authorId", "==", userId) // Changed from userId to authorId to match the schema
        );

        const querySnapshot = await getDocs(q);
        const prompts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Fetched user prompts:", prompts); // Debug log
        return prompts;
      } catch (error) {
        console.error("Error fetching user prompts:", error);
        throw error;
      }
    },
    enabled: !!userId,
  });
};
