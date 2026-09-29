"use client";
import { useMutation, useQueryClient, type InfiniteData } from "@tanstack/react-query";
import { useStore } from "@/store/authStore";
import * as api from "../api";
import { messageKeys } from "./useMessageQueries";
import type { ConversationPage, Message, MessagePage, ReportReason, SendMessagePayload } from "../types";

export function useMessageActions(conversationId: string) {
  const client = useQueryClient();
  const userId = useStore((state) => state.currentUser?.id);
  const historyKey = messageKeys.history(userId, conversationId);
  const updateMessage = (id: string, update: Partial<Message>) => client.setQueryData<InfiniteData<MessagePage>>(historyKey, (current) => current && ({ ...current, pages: current.pages.map((page) => ({ ...page, data: page.data.map((message) => message.id === id ? { ...message, ...update } : message) })) }));
  const refreshLists = () => { void client.invalidateQueries({ queryKey: messageKeys.conversations(userId) }); void client.invalidateQueries({ queryKey: messageKeys.unread(userId) }); };
  const send = useMutation({ mutationFn: (payload: SendMessagePayload) => api.sendMessage(conversationId, payload), retry: false,
    onSuccess: (message, payload) => {
      message = { ...message, clientMessageId: message.clientMessageId ?? payload.clientMessageId };
      client.setQueryData<InfiniteData<MessagePage>>(historyKey, (current) => current && ({ ...current, pages: current.pages.map((page, index) => index === 0 ? { ...page, data: [...page.data.filter((item) => item.id !== message.id), message] } : page) }));
      refreshLists();
    },
  });
  const edit = useMutation({ mutationFn: ({ id, content }: { id: string; content: string }) => api.editMessage(id, content), onSuccess: (result) => { updateMessage(result.messageId, { content: result.content, editedAt: result.editedAt }); refreshLists(); } });
  const remove = useMutation({ mutationFn: api.deleteMessage, onSuccess: (_, id) => { updateMessage(id, { status: "deleted", content: null, attachments: [], replyTo: null }); refreshLists(); } });
  const report = useMutation({ mutationFn: ({ id, reason, details }: { id: string; reason: ReportReason; details: string }) => api.reportMessage(id, reason, details) });
  const read = useMutation({ mutationFn: (id: string) => api.markConversationRead(conversationId, id), retry: false, onSuccess: () => {
    client.setQueriesData<ConversationPage>({ queryKey: messageKeys.conversations(userId) }, (current) => current && ({ ...current, data: current.data.map((item) => item.conversationId === conversationId ? { ...item, unreadCount: 0 } : item) }));
    refreshLists();
  } });
  return { send, edit, remove, report, read };
}
