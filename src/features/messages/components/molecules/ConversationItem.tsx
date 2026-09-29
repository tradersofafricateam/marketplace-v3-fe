import { useLocale, useTranslations } from "next-intl";
import MessageAvatar from "../atoms/MessageAvatar";
import type { Conversation } from "../../types";
export default function ConversationItem({ conversation, selected, onSelect }: { conversation: Conversation; selected: boolean; onSelect: () => void }) {
  const t = useTranslations("MessageCenter");
  const locale = useLocale();
  const date = conversation.lastMessageAt || conversation.createdAt;
  return <button type="button" aria-current={selected ? "true" : undefined} onClick={onSelect} className={`flex w-full items-start gap-3 rounded-2xl p-3 text-left transition-colors ${selected ? "bg-(--orange-light) ring-1 ring-inset ring-(--orange)/15" : "hover:bg-muted/60"}`}>
    <MessageAvatar participant={conversation.participant} />
    <span className="min-w-0 flex-1">
      <span className="flex items-center justify-between gap-2"><span className="truncate text-sm font-bold">{conversation.participant.displayName}</span>{date && <time dateTime={date} className="shrink-0 text-[11px] text-muted-foreground">{new Date(date).toLocaleDateString(locale, { month: "short", day: "numeric" })}</time>}</span>
      <span className="mt-1 flex items-center justify-between gap-2"><span className="truncate text-sm text-muted-foreground">{conversation.lastMessage?.content || t(conversation.lastMessage ? "attachment" : "noMessages")}</span>{conversation.unreadCount > 0 && <span aria-label={t("unreadCount", { count: conversation.unreadCount })} className="flex min-w-5 items-center justify-center rounded-full bg-(--orange) px-1.5 py-0.5 text-[11px] font-bold text-white">{conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}</span>}</span>
    </span>
  </button>;
}
