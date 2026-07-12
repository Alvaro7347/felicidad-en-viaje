// Hook de React Query para la discusión de una clase (MVP1).
//
// Responsabilidad ÚNICA: conectar componentes de UI con
// `lessonDiscussionRepository`. No conoce JSX, navegación, progreso ni journey.
// No emite toasts. Los errores se propagan como `LessonDiscussionError` para
// que la capa visual decida el mensaje.

import { useMutation, useQuery, useQueryClient, type QueryKey } from "@tanstack/react-query";

import {
  addReaction,
  createLessonPost,
  listLessonDiscussion,
  removeReaction,
  softDeleteOwnPost,
} from "../services/lessonDiscussionRepository";
import type { CreateLessonPostInput, LessonDiscussionPost, LessonDiscussionResult } from "../types";
import { LessonDiscussionError } from "../types";

/**
 * Query key estable y centralizada. No mezclar con progreso ni journey.
 * Consumidores externos deben usar este helper (no armar el array a mano).
 */
export const lessonDiscussionQueryKey = (lessonId: string): QueryKey => [
  "lesson-discussion",
  lessonId,
];

const STALE_TIME_MS = 30_000;

type ReactionSnapshot = {
  previous: LessonDiscussionResult | undefined;
};

function applyReactionDelta(
  cache: LessonDiscussionResult | undefined,
  postId: string,
  nextReacted: boolean,
): LessonDiscussionResult | undefined {
  if (!cache) return cache;
  const posts = cache.posts.map((post: LessonDiscussionPost) => {
    if (post.id !== postId) return post;
    if (post.hasCurrentUserReacted === nextReacted) return post;
    const delta = nextReacted ? 1 : -1;
    // Nunca permitir conteos negativos.
    const nextCount = Math.max(0, post.applauseCount + delta);
    return {
      ...post,
      hasCurrentUserReacted: nextReacted,
      applauseCount: nextCount,
    };
  });
  return { ...cache, posts };
}

export function useLessonDiscussion(lessonId: string) {
  const queryClient = useQueryClient();
  const queryKey = lessonDiscussionQueryKey(lessonId);
  const enabled = typeof lessonId === "string" && lessonId.trim().length > 0;

  const query = useQuery<LessonDiscussionResult, LessonDiscussionError>({
    queryKey,
    queryFn: () => listLessonDiscussion(lessonId),
    enabled,
    staleTime: STALE_TIME_MS,
    retry: 1,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey, exact: true });

  const createPostMutation = useMutation<
    LessonDiscussionPost,
    LessonDiscussionError,
    Omit<CreateLessonPostInput, "lessonId">
  >({
    // El contenido del formulario permanece en el componente: si la mutación
    // falla, el componente conserva su estado local sin que este hook lo toque.
    mutationFn: (input) =>
      createLessonPost({
        lessonId,
        postType: input.postType,
        content: input.content,
      }),
    onSuccess: () => {
      void invalidate();
    },
  });

  const deletePostMutation = useMutation<void, LessonDiscussionError, string>({
    mutationFn: (postId) => softDeleteOwnPost(postId),
    onSuccess: () => {
      void invalidate();
    },
  });

  // Optimistic update seguro y simple: alternamos la bandera y el conteo,
  // con rollback ante error. Cualquier cambio del servidor se reconcilia
  // vía invalidación al finalizar.
  const addApplauseMutation = useMutation<void, LessonDiscussionError, string, ReactionSnapshot>({
    mutationFn: (postId) => addReaction(postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey, exact: true });
      const previous = queryClient.getQueryData<LessonDiscussionResult>(queryKey);
      queryClient.setQueryData<LessonDiscussionResult>(queryKey, (cache) =>
        applyReactionDelta(cache, postId, true),
      );
      return { previous };
    },
    onError: (_error, _postId, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(queryKey, ctx.previous);
      }
    },
    onSettled: () => {
      void invalidate();
    },
  });

  const removeApplauseMutation = useMutation<void, LessonDiscussionError, string, ReactionSnapshot>(
    {
      mutationFn: (postId) => removeReaction(postId),
      onMutate: async (postId) => {
        await queryClient.cancelQueries({ queryKey, exact: true });
        const previous = queryClient.getQueryData<LessonDiscussionResult>(queryKey);
        queryClient.setQueryData<LessonDiscussionResult>(queryKey, (cache) =>
          applyReactionDelta(cache, postId, false),
        );
        return { previous };
      },
      onError: (_error, _postId, ctx) => {
        if (ctx?.previous) {
          queryClient.setQueryData(queryKey, ctx.previous);
        }
      },
      onSettled: () => {
        void invalidate();
      },
    },
  );

  const posts: LessonDiscussionPost[] = query.data?.posts ?? [];
  const currentUserHasActivePost = query.data?.currentUserHasActivePost ?? false;

  const isTogglingApplause = addApplauseMutation.isPending || removeApplauseMutation.isPending;

  return {
    // Lectura
    data: query.data,
    posts,
    currentUserHasActivePost,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error ?? null,
    refetch: query.refetch,

    // Crear
    createPost: (input: Omit<CreateLessonPostInput, "lessonId">) =>
      createPostMutation.mutateAsync(input),
    isCreatingPost: createPostMutation.isPending,
    createPostError: createPostMutation.error ?? null,

    // Eliminar (soft delete propio)
    deleteOwnPost: (postId: string) => deletePostMutation.mutateAsync(postId),
    isDeletingPost: deletePostMutation.isPending,
    deleteOwnPostError: deletePostMutation.error ?? null,

    // Aplausos
    addApplause: (postId: string) => addApplauseMutation.mutateAsync(postId),
    removeApplause: (postId: string) => removeApplauseMutation.mutateAsync(postId),
    isTogglingApplause,
    applauseError: addApplauseMutation.error ?? removeApplauseMutation.error ?? null,
  } as const;
}

export type UseLessonDiscussionReturn = ReturnType<typeof useLessonDiscussion>;
