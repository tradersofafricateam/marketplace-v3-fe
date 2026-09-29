"use client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useFreshQuery } from "@/lib/hooks/useFreshQuery";
import { useStore } from "@/store/authStore";
import { getConversations, getMessages, getUnreadCount } from "../api";

export const messageKeys = {
  all: (userId?: string) => ["messageCenter", userId] as const,
  conversations: (userId?: string) => ["messageCenter", userId, "conversations"] as const,
  history: (userId: string | undefined, id: string) => ["messageCenter", userId, "history", id] as const,
  unread: (userId?: string) => ["messageCenter", userId, "unread"] as const,
};
export function useConversations(search: string, unreadOnly: boolean, page: number) {
  const userId = useStore((state) => state.currentUser?.id);
  return useFreshQuery({ queryKey: [...messageKeys.conversations(userId), search, unreadOnly, page], queryFn: ({ signal }) => getConversations({ search, unreadOnly, page }, signal), enabled: !!userId });
}
export function useMessages(conversationId: string) {
  const userId = useStore((state) => state.currentUser?.id);
  return useInfiniteQuery({
    queryKey: messageKeys.history(userId, conversationId),
    queryFn: ({ pageParam, signal }) => getMessages(conversationId, pageParam, signal),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (last, _pages, lastParam) => last.pagination.hasMore && last.pagination.nextCursor && last.pagination.nextCursor !== lastParam ? last.pagination.nextCursor : undefined,
    enabled: !!userId && !!conversationId, staleTime: 0, refetchOnMount: "always", retry: false,
  });
}
export function useMessageUnreadCount() {
  const userId = useStore((state) => state.currentUser?.id);
  return useQuery({ queryKey: messageKeys.unread(userId), queryFn: ({ signal }) => getUnreadCount(signal), enabled: !!userId, staleTime: 30_000, retry: false });
}
