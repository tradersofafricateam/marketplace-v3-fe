import type { Message, MessagePage } from "../types";

export function chronologicalMessages(pages: MessagePage[]): Message[] {
  const unique = new Map<string, Message>();
  // Newest page wins when overlapping cursor pages contain the same message.
  for (const page of [...pages].reverse()) for (const message of page.data) unique.set(message.id, message);
  return [...unique.values()].sort((a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime());
}
export function localDayLabel(timestamp: string, locale: string, today: string, yesterday: string, now = new Date()): string {
  const date = new Date(timestamp);
  const previous = new Date(now); previous.setDate(previous.getDate() - 1);
  if (date.toDateString() === now.toDateString()) return today;
  if (date.toDateString() === previous.toDateString()) return yesterday;
  return date.toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" });
}
export function safeAttachmentUrl(value?: string | null): string | undefined {
  if (!value) return undefined;
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) ? url.href : undefined; } catch { return undefined; }
}
export function messageError(error: unknown, fallback: string): string {
  const response = (error as { response?: { data?: { message?: unknown } } })?.response?.data;
  return typeof response?.message === "string" ? response.message : fallback;
}
