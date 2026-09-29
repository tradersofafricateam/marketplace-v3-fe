import { axiosInstance } from "@/lib/axiosInstance";
import type { Conversation, ConversationPage, Message, MessagePage, ReportReason, SendMessagePayload } from "../types";

type Envelope<T> = { success: boolean; message?: string; data: T };
function success<T>(body: Envelope<T>): T {
  if (body.success === false) throw new Error(body.message || "Message request failed");
  return body.data;
}
const conversationPath = (id: string) => `/messages/conversations/${encodeURIComponent(id)}`;
const messagePath = (id: string) => `/messages/${encodeURIComponent(id)}`;

export async function getConversations(params: { search?: string; unreadOnly?: boolean; page: number; limit?: number }, signal?: AbortSignal): Promise<ConversationPage> {
  const { search, ...filters } = params;
  const normalizedSearch = search?.trim();
  const { data } = await axiosInstance.get<Envelope<Conversation[]> & Pick<ConversationPage, "pagination">>("/messages/conversations", { params: { limit: 20, ...filters, ...(normalizedSearch ? { search: normalizedSearch } : {}) }, signal });
  const conversations = success(data);
  if (!Array.isArray(conversations) || !data.pagination || conversations.some((item) => !item.conversationId || !item.participant?.id)) throw new Error("Invalid conversation response");
  return { data: conversations, pagination: data.pagination };
}
export async function startConversation(recipientUserId: string) {
  const { data } = await axiosInstance.post<Envelope<Conversation>>("/messages/conversations", { recipientUserId });
  const conversation = success(data);
  if (!conversation?.conversationId || !conversation.participant?.id) throw new Error("Invalid conversation response");
  return { ...conversation, unreadCount: conversation.unreadCount ?? 0 };
}
export async function getMessages(conversationId: string, cursor?: string, signal?: AbortSignal): Promise<MessagePage> {
  const { data } = await axiosInstance.get<Envelope<Message[]> & Pick<MessagePage, "pagination">>(`${conversationPath(conversationId)}/messages`, { params: { limit: 30, ...(cursor ? { cursor } : {}) }, signal });
  const messages = success(data);
  if (!Array.isArray(messages) || !data.pagination || messages.some((item) => !item.id || !item.sender?.id || !Array.isArray(item.attachments))) throw new Error("Invalid messages response");
  return { data: messages, pagination: data.pagination };
}
export async function sendMessage(conversationId: string, payload: SendMessagePayload) {
  const { data } = await axiosInstance.post<Envelope<Message>>(`${conversationPath(conversationId)}/messages`, payload);
  const message = success(data);
  if (!message?.id || !message.sender?.id || !Array.isArray(message.attachments)) throw new Error("Invalid message response");
  return message;
}
export async function markConversationRead(conversationId: string, lastReadMessageId: string) {
  const { data } = await axiosInstance.patch<Envelope<{ conversationId: string; unreadCount: number; lastReadMessageId: string }>>(`${conversationPath(conversationId)}/read`, { lastReadMessageId });
  return success(data);
}
export async function getUnreadCount(signal?: AbortSignal) {
  const { data } = await axiosInstance.get<Envelope<{ totalUnread: number }>>("/messages/unread-count", { signal });
  const result = success(data);
  if (!Number.isInteger(result?.totalUnread) || result.totalUnread < 0) throw new Error("Invalid unread count");
  return result;
}
export async function editMessage(id: string, content: string) {
  const { data } = await axiosInstance.patch<Envelope<{ messageId: string; content: string; editedAt: string }>>(messagePath(id), { content });
  return success(data);
}
export async function deleteMessage(id: string) {
  const { data } = await axiosInstance.delete<Envelope<undefined>>(messagePath(id));
  success(data);
}
export async function reportMessage(id: string, reason: ReportReason, details: string) {
  const { data } = await axiosInstance.post<Envelope<undefined>>(`${messagePath(id)}/report`, { reason, details });
  success(data);
}
