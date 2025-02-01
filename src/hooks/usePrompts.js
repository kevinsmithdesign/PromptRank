// src/hooks/usePrompts.js
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { promptsApi } from "../api/prompts";

// Base hook for prompts list operations
function usePrompts() {
  const queryClient = useQueryClient();

  const {
    data: prompts = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["prompts"],
    queryFn: promptsApi.getPrompts,
  });

  const createPromptMutation = useMutation({
    mutationFn: promptsApi.createPrompt,
    onSuccess: (newPrompt) => {
      queryClient.invalidateQueries(["prompts"]);
    },
  });

  const updatePromptMutation = useMutation({
    mutationFn: promptsApi.updatePrompt,
    onSuccess: (updatedPrompt) => {
      queryClient.invalidateQueries(["prompts"]);
      queryClient.invalidateQueries(["prompt", updatedPrompt.id]);
    },
  });

  const deletePromptMutation = useMutation({
    mutationFn: promptsApi.deletePrompt,
    onSuccess: (deletedId) => {
      queryClient.invalidateQueries(["prompts"]);
    },
  });

  return {
    prompts,
    isLoading,
    error,
    createPrompt: createPromptMutation.mutate,
    updatePrompt: updatePromptMutation.mutate,
    deletePrompt: deletePromptMutation.mutate,
    createPromptLoading: createPromptMutation.isLoading,
    updatePromptLoading: updatePromptMutation.isLoading,
    deletePromptLoading: deletePromptMutation.isLoading,
  };
}

// Hook for single prompt operations
function usePrompt(id) {
  return useQuery({
    queryKey: ["prompt", id],
    queryFn: () => promptsApi.getPromptById(id),
    enabled: !!id,
  });
}

// Hook for user-specific prompts
function useUserPrompts(userId) {
  return useQuery({
    queryKey: ["prompts", "user", userId],
    queryFn: () => promptsApi.getUserPrompts(userId),
    enabled: !!userId,
  });
}

// Hook for prompt details and ratings
function usePromptDetail(id) {
  const queryClient = useQueryClient();

  const {
    data: prompt,
    isLoading: promptLoading,
    error: promptError,
  } = useQuery({
    queryKey: ["prompt", id],
    queryFn: () => promptsApi.getPromptDetail(id),
    enabled: !!id,
  });

  const {
    data: ratings = [],
    isLoading: ratingsLoading,
    error: ratingsError,
  } = useQuery({
    queryKey: ["prompt-ratings", id],
    queryFn: () => promptsApi.getPromptRatings(id),
    enabled: !!id,
  });

  const submitRatingMutation = useMutation({
    mutationFn: promptsApi.submitRating,
    onSuccess: () => {
      queryClient.invalidateQueries(["prompt", id]);
      queryClient.invalidateQueries(["prompt-ratings", id]);
    },
  });

  return {
    prompt,
    ratings,
    isLoading: promptLoading || ratingsLoading,
    error: promptError || ratingsError,
    submitRating: submitRatingMutation.mutate,
    isSubmittingRating: submitRatingMutation.isLoading,
    submitRatingError: submitRatingMutation.error,
  };
}

// Single export statement for all hooks
export { usePrompts, usePrompt, useUserPrompts, usePromptDetail };
