"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@/store/authStore";
import { startConversation } from "../api";
import { messageKeys } from "./useMessageQueries";

export function useStartConversation() {
  const userId = useStore((state) => state.currentUser?.id);
  const client = useQueryClient();
  return useMutation({ mutationFn: (recipientUserId: string) => {
    if (!userId || recipientUserId === userId) throw new Error("Invalid recipient");
    return startConversation(recipientUserId);
  }, onSuccess: () => { void client.invalidateQueries({ queryKey: messageKeys.conversations(userId) }); } });
}
