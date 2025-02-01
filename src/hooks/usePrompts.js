import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { promptsApi } from "../api/prompts";

export function usePrompts() {
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
      queryClient.setQueryData(["prompts"], (old) => {
        return [newPrompt, ...(old || [])];
      });
    },
  });

  const updatePromptMutation = useMutation({
    mutationFn: promptsApi.updatePrompt,
    onMutate: async (updatedPrompt) => {
      await queryClient.cancelQueries(["prompts"]);
      await queryClient.cancelQueries(["prompt", updatedPrompt.id]);

      const previousPrompts = queryClient.getQueryData(["prompts"]);

      queryClient.setQueryData(["prompts"], (old) => {
        return old?.map((prompt) =>
          prompt.id === updatedPrompt.id
            ? { ...prompt, ...updatedPrompt }
            : prompt
        );
      });

      queryClient.setQueryData(["prompt", updatedPrompt.id], (old) => ({
        ...old,
        ...updatedPrompt,
      }));

      return { previousPrompts };
    },
    onError: (err, newPrompt, context) => {
      queryClient.setQueryData(["prompts"], context.previousPrompts);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["prompts"]);
    },
  });

  const deletePromptMutation = useMutation({
    mutationFn: promptsApi.deletePrompt,
    onMutate: async (promptId) => {
      await queryClient.cancelQueries(["prompts"]);
      const previousPrompts = queryClient.getQueryData(["prompts"]);

      queryClient.setQueryData(["prompts"], (old) => {
        return old?.filter((prompt) => prompt.id !== promptId);
      });

      return { previousPrompts };
    },
    onError: (err, promptId, context) => {
      queryClient.setQueryData(["prompts"], context.previousPrompts);
    },
    onSettled: () => {
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
    createPromptError: createPromptMutation.error,
    updatePromptError: updatePromptMutation.error,
    deletePromptError: deletePromptMutation.error,
  };
}

export function usePrompt(id) {
  return useQuery({
    queryKey: ["prompt", id],
    queryFn: () => promptsApi.getPromptById(id),
    enabled: !!id,
  });
}

export function useUserPrompts(userId) {
  return useQuery({
    queryKey: ["prompts", "user", userId],
    queryFn: () => promptsApi.getUserPrompts(userId),
    enabled: !!userId,
  });
}

export function usePromptDetail(id) {
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
