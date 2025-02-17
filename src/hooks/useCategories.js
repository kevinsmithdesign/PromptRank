// hooks/useCategories.js
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../config/firebase";

const defaultCategories = [
  { text: "SEO", path: "/SEO" },
  { text: "Content Creation", path: "/ContentCreation" },
  { text: "Marketing Strategies", path: "/MarketingStrategies" },
  { text: "Web Development", path: "/WebDevelopment" },
  { text: "E-commerce", path: "/Ecommerce" },
  { text: "Social Media Management", path: "/SocialMediaManagement" },
  { text: "Business Planning", path: "/BusinessPlanning" },
  { text: "Financial Planning", path: "/FinancialPlanning" },
  { text: "Resume Builder", path: "/ResumeBuilder" },
  { text: "Side Hustle", path: "/SideHustle" },
];

export const useCategories = () => {
  const queryClient = useQueryClient();

  // Query to fetch user categories
  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["categories", auth?.currentUser?.uid],
    queryFn: async () => {
      if (!auth.currentUser) {
        return defaultCategories;
      }

      const userCategoriesRef = doc(db, "userCategories", auth.currentUser.uid);
      const docSnap = await getDoc(userCategoriesRef);

      if (!docSnap.exists()) {
        // Initialize with default categories if user doesn't have any
        await setDoc(userCategoriesRef, { categories: defaultCategories });
        return defaultCategories;
      }

      return docSnap.data().categories;
    },
    enabled: !!auth.currentUser,
  });

  // Mutation to update categories
  const updateCategories = useMutation({
    mutationFn: async (newCategories) => {
      if (!auth.currentUser) {
        throw new Error("User must be logged in to update categories");
      }

      const userCategoriesRef = doc(db, "userCategories", auth.currentUser.uid);
      await updateDoc(userCategoriesRef, {
        categories: newCategories,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["categories", auth?.currentUser?.uid]);
    },
  });

  return {
    categories: auth.currentUser ? categories : defaultCategories,
    isLoading,
    error,
    updateCategories: updateCategories.mutate,
    isUpdating: updateCategories.isLoading,
    updateError: updateCategories.error,
  };
};
