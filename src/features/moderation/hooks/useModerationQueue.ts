// Hook de React Query para el workspace de moderación.
//
// - Query key aislada de la caché de estudiantes (`["moderation", ...]`).
// - Al mutar, invalida la cola de moderación y ADEMÁS la caché del hook
//   estudiante (`lesson-discussion`) de la lección afectada, para que la
//   experiencia pedagógica refleje el cambio de inmediato.

import { useMutation, useQuery, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { lessonDiscussionQueryKey } from "@/features/discussions/hooks/useLessonDiscussion";
import {
  createOfficialReply,
  hidePost,
  hideReply,
  listModerationPosts,
  type ModerationError,
  type ModerationPost,
  type ModerationReply,
} from "../services/moderationRepository";

export const moderationQueueQueryKey = (lessonId: string | null): QueryKey => [
  "moderation",
  "posts",
  lessonId ?? "all",
];

const STALE_MS = 15_000;

export function useModerationQueue(lessonId: string | null) {
  const queryClient = useQueryClient();
  const queryKey = moderationQueueQueryKey(lessonId);

  const query = useQuery<ModerationPost[], ModerationError>({
    queryKey,
    queryFn: () => listModerationPosts(lessonId ?? undefined),
    staleTime: STALE_MS,
    retry: 1,
  });

  const invalidateAll = (affectedLessonId?: string) => {
    void queryClient.invalidateQueries({ queryKey: ["moderation", "posts"] });
    if (affectedLessonId) {
      void queryClient.invalidateQueries({
        queryKey: lessonDiscussionQueryKey(affectedLessonId),
        exact: true,
      });
    }
  };

  const hidePostMutation = useMutation<void, ModerationError, { postId: string; lessonId: string }>(
    {
      mutationFn: ({ postId }) => hidePost(postId),
      onSuccess: (_data, vars) => invalidateAll(vars.lessonId),
    },
  );

  const hideReplyMutation = useMutation<
    void,
    ModerationError,
    { replyId: string; lessonId: string }
  >({
    mutationFn: ({ replyId }) => hideReply(replyId),
    onSuccess: (_data, vars) => invalidateAll(vars.lessonId),
  });

  const createReplyMutation = useMutation<
    ModerationReply,
    ModerationError,
    { postId: string; lessonId: string; content: string }
  >({
    mutationFn: ({ postId, content }) => createOfficialReply({ postId, content }),
    onSuccess: (_data, vars) => invalidateAll(vars.lessonId),
  });

  return {
    posts: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error ?? null,
    refetch: query.refetch,

    hidePost: hidePostMutation.mutateAsync,
    isHidingPost: hidePostMutation.isPending,

    hideReply: hideReplyMutation.mutateAsync,
    isHidingReply: hideReplyMutation.isPending,

    createReply: createReplyMutation.mutateAsync,
    isCreatingReply: createReplyMutation.isPending,
    createReplyError: createReplyMutation.error ?? null,
  } as const;
}
