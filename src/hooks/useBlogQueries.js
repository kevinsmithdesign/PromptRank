import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllBlogPosts,
  getBlogPostById,
  getBlogPostsByCategory,
  searchBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
} from "../api/blogService";

// Hook for fetching all blog posts
export const useGetBlogPosts = () => {
  return useQuery({
    queryKey: ["blogPosts"],
    queryFn: getAllBlogPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching a single blog post by ID
export const useGetBlogPost = (id) => {
  return useQuery({
    queryKey: ["blogPost", id],
    queryFn: () => getBlogPostById(id),
    enabled: !!id, // Only run query if ID exists
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for fetching blog posts by category
export const useGetBlogPostsByCategory = (category) => {
  return useQuery({
    queryKey: ["blogPosts", "category", category],
    queryFn: () => getBlogPostsByCategory(category),
    enabled: !!category, // Only run if category is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for searching blog posts
export const useSearchBlogPosts = (searchQuery) => {
  return useQuery({
    queryKey: ["blogPosts", "search", searchQuery],
    queryFn: () => searchBlogPosts(searchQuery),
    enabled: !!searchQuery && searchQuery.length > 2, // Only search if query has 3+ characters
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for creating a new blog post
export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ blogData, imageFile }) =>
      createBlogPost(blogData, imageFile),
    onSuccess: () => {
      // Invalidate the blog posts query to refetch the list
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
    },
  });
};

// Hook for updating a blog post
export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, blogData, imageFile }) =>
      updateBlogPost(id, blogData, imageFile),
    onSuccess: (data) => {
      // Invalidate specific queries
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
      queryClient.invalidateQueries({ queryKey: ["blogPost", data.id] });
    },
  });
};

// Hook for deleting a blog post
export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteBlogPost,
    onSuccess: () => {
      // Invalidate the blog posts query
      queryClient.invalidateQueries({ queryKey: ["blogPosts"] });
    },
  });
};
