export type Participant = {
  id: string; displayName: string; profileImage?: string | null; isSeller?: boolean;
  seller?: { isSeller: boolean; isVerified?: boolean; storeName?: string; slug?: string };
};
export type MessageAttachment = { id: string; type?: "image" | "file"; attachmentType?: "image" | "file"; fileName: string; fileUrl: string; mimeType: string; fileSize: number };
export type Message = {
  id: string; conversationId?: string; clientMessageId?: string; sender: Participant;
  messageType: "text" | "image" | "file" | "mixed"; content: string | null;
  attachments: MessageAttachment[]; replyTo?: { messageId: string; contentPreview: string } | null;
  status: "sent" | "delivered" | "read" | "deleted"; sentAt: string; editedAt?: string | null;
};
export type Conversation = {
  conversationId: string; conversationReference?: string; participant: Participant;
  status?: "active" | "blocked"; unreadCount: number;
  lastMessage?: { id: string; senderId: string; messageType: Message["messageType"]; content: string | null; sentAt: string } | null;
  lastMessageAt?: string | null; createdAt?: string;
};
export type ConversationPage = { data: Conversation[]; pagination: { page: number; limit: number; total: number; totalPages: number } };
export type MessagePage = { data: Message[]; pagination: { nextCursor: string | null; hasMore: boolean } };
export type SendMessagePayload = { clientMessageId: string; messageType: Message["messageType"]; content: string | null; replyToMessageId: string | null; attachments: { fileId: string }[] };
export type ReportReason = "spam" | "abusive_content" | "fraud_attempt" | "payment_scam" | "inappropriate_content" | "off_platform_solicitation" | "other";
export type PendingMessage = { payload: SendMessagePayload; state: "sending" | "failed"; error?: string };
