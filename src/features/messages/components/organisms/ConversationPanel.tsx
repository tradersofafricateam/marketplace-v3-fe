"use client";
import { Fragment, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { useStore } from "@/store/authStore";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { useMessages } from "../../hooks/useMessageQueries";
import { useMessageActions } from "../../hooks/useMessageActions";
import { chronologicalMessages, localDayLabel, messageError } from "../../helpers";
import type { Conversation, Message, PendingMessage, ReportReason } from "../../types";
import MessageAvatar from "../atoms/MessageAvatar";
import MessageEmptyState from "../atoms/MessageEmptyState";
import MessageErrorState from "../atoms/MessageErrorState";
import MessageLoading from "../atoms/MessageLoading";
import MessageBubble from "../molecules/MessageBubble";
import MessageComposer from "../molecules/MessageComposer";
import MessageActionDialog from "./MessageActionDialog";

export default function ConversationPanel({ conversation, onBack, pendingMessage, setPendingMessage }: {
  conversation: Conversation; onBack: () => void; pendingMessage?: PendingMessage;
  setPendingMessage: (pending?: PendingMessage) => void;
}) {
  const t = useTranslations("MessageCenter");
  const locale = useLocale();
  const { routes } = useGetAllRoutes();
  const userId = useStore((state) => state.currentUser?.id);
  const query = useMessages(conversation.conversationId);
  const actions = useMessageActions(conversation.conversationId);
  const [reply, setReply] = useState<Message | null>(null);
  const [action, setAction] = useState<{ kind: "edit" | "delete" | "report"; message: Message } | null>(null);
  const [actionError, setActionError] = useState<string>();
  const scroll = useRef<HTMLDivElement>(null);
  const bottom = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(false);
  const lastReadAttempt = useRef<string | null>(null);
  const position = useRef({ first: "", last: "", height: 0, top: 0 });
  const ready = query.isFetchedAfterMount && !query.isPending && !query.isError;
  const messages = useMemo(() => ready && query.data ? chronologicalMessages(query.data.pages) : [], [query.data, ready]);
  const firstId = messages[0]?.id;
  const lastId = messages.at(-1)?.id;
  const latestIncoming = [...messages].reverse().find((message) => message.sender.id !== userId && message.status !== "deleted");
  const pending = pendingMessage && !messages.some((message) => message.clientMessageId === pendingMessage.payload.clientMessageId) ? pendingMessage : undefined;
  const { mutate: markRead } = actions.read;

  useLayoutEffect(() => {
    const node = scroll.current;
    if (!node || !ready) return;
    const previous = position.current;
    if (!previous.last || (previous.last !== lastId && node.scrollHeight - node.scrollTop - node.clientHeight < 320)) node.scrollTop = node.scrollHeight;
    else if (previous.first && previous.first !== firstId && previous.last === lastId) node.scrollTop = previous.top + node.scrollHeight - previous.height;
    position.current = { first: firstId || "", last: lastId || "", height: node.scrollHeight, top: node.scrollTop };
  }, [firstId, lastId, ready]);

  useEffect(() => {
    if (!bottom.current || !scroll.current || !ready) return;
    const observer = new IntersectionObserver(([entry]) => setAtBottom(entry.isIntersecting), { root: scroll.current });
    observer.observe(bottom.current);
    return () => observer.disconnect();
  }, [ready]);
  useEffect(() => {
    const mark = () => {
      if (!atBottom || document.visibilityState !== "visible" || !latestIncoming || latestIncoming.status === "read" || lastReadAttempt.current === latestIncoming.id || query.isError) return;
      lastReadAttempt.current = latestIncoming.id;
      markRead(latestIncoming.id);
    };
    mark();
    document.addEventListener("visibilitychange", mark);
    return () => document.removeEventListener("visibilitychange", mark);
  }, [atBottom, latestIncoming, markRead, query.isError]);

  const attemptSend = (outgoing: PendingMessage) => {
    setPendingMessage({ ...outgoing, state: "sending", error: undefined });
    void actions.send.mutateAsync(outgoing.payload).then(
      () => setPendingMessage(undefined),
      (error) => setPendingMessage({ ...outgoing, state: "failed", error: messageError(error, t("sendError")) }),
    );
  };
  const send = (content: string) => {
    if (pending) return;
    attemptSend({ state: "sending", payload: { clientMessageId: crypto.randomUUID(), messageType: "text", content, replyToMessageId: reply?.id ?? null, attachments: [] } });
    setReply(null);
  };
  const confirmAction = async (content: string, reason: ReportReason) => {
    if (!action) return;
    setActionError(undefined);
    try {
      if (action.kind === "edit") await actions.edit.mutateAsync({ id: action.message.id, content });
      else if (action.kind === "delete") await actions.remove.mutateAsync(action.message.id);
      else { await actions.report.mutateAsync({ id: action.message.id, reason, details: content }); toast.success(t("reported")); }
      setAction(null);
    } catch (error) { setActionError(messageError(error, t("actionError"))); }
  };
  const blocked = conversation.status === "blocked";
  const seller = conversation.participant.seller;
  const store = seller?.isSeller && seller.isVerified && seller.slug ? routes.sellerStore(encodeURIComponent(seller.slug)) : undefined;

  return <section className="flex h-full min-w-0 flex-col" aria-label={conversation.participant.displayName}>
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background px-4 py-4">
      <div className="flex min-w-0 items-center gap-3"><button type="button" onClick={onBack} aria-label={t("back")} className="rounded-xl p-2 hover:bg-muted md:hidden"><ArrowLeft size={19} /></button><MessageAvatar participant={conversation.participant} /><div className="min-w-0"><h2 className="truncate font-bold">{conversation.participant.displayName}</h2><p className="text-xs text-muted-foreground">{t(seller?.isVerified ? "verifiedSeller" : "conversation")}</p></div></div>
      <div className="flex items-center gap-2">{store && <><Link href={store} className="rounded-xl border border-border px-3 py-2 text-xs font-semibold">{t("viewStore")}</Link><Link href={store} className="rounded-xl bg-(--orange-light) px-3 py-2 text-xs font-semibold text-(--orange-dark)">{t("requestQuote")}</Link></>}<button type="button" disabled={query.isFetching} onClick={() => { lastReadAttempt.current = null; void query.refetch(); }} aria-label={t("refresh")} className="rounded-xl p-2 hover:bg-muted disabled:opacity-40"><RefreshCw size={17} className={query.isFetching ? "animate-spin" : ""} /></button></div>
    </header>
    <div ref={scroll} onScroll={() => { if (scroll.current) { position.current.top = scroll.current.scrollTop; position.current.height = scroll.current.scrollHeight; } }} className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-[radial-gradient(ellipse_at_top,#fff8f1,transparent_70%)] p-4 sm:p-6">
      {!ready && !query.isError ? <MessageLoading /> : query.isError ? <MessageErrorState retry={() => void query.refetch()} /> : <>
        {query.hasNextPage && <div className="mb-5 text-center"><button type="button" onClick={() => void query.fetchNextPage()} disabled={query.isFetching} className="rounded-full border border-border bg-background px-4 py-2 text-xs font-semibold disabled:opacity-50">{t(query.isFetchingNextPage ? "loading" : "older")}</button></div>}
        {!messages.length && !query.isError && <MessageEmptyState kind="conversation" name={conversation.participant.displayName} />}
        <div className="space-y-3">{messages.map((message, index) => {
          const day = localDayLabel(message.sentAt, locale, t("today"), t("yesterday"));
          const previousDay = index ? localDayLabel(messages[index - 1].sentAt, locale, t("today"), t("yesterday")) : null;
          return <Fragment key={message.id}>{day !== previousDay && <div className="flex items-center gap-3 py-4"><span className="h-px flex-1 bg-border" /><span className="text-xs font-medium text-muted-foreground">{day}</span><span className="h-px flex-1 bg-border" /></div>}<MessageBubble message={message} own={message.sender.id === userId} onReply={() => setReply(message)} onAction={(kind) => { setActionError(undefined); setAction({ kind, message }); }} /></Fragment>;
        })}</div>
      </>}
      {pending && <div aria-live="polite" className="ml-auto mt-4 max-w-[85%] rounded-2xl border border-dashed border-(--orange)/40 bg-(--orange-light)/50 p-4"><p className="text-body whitespace-pre-wrap break-words">{pending.payload.content}</p><p className="mt-2 text-xs text-muted-foreground">{pending.state === "sending" ? t("sending") : pending.error || t("sendError")}</p>{pending.state === "failed" && <div className="mt-2 flex gap-4"><button type="button" disabled={blocked} onClick={() => attemptSend(pending)} className="text-sm font-bold text-(--orange)">{t("retry")}</button><button type="button" onClick={() => setPendingMessage(undefined)} className="text-sm text-muted-foreground">{t("discard")}</button></div>}</div>}
      <div ref={bottom} className="h-1" />
    </div>
    {actions.read.isError && <p role="status" className="px-4 py-1 text-xs text-muted-foreground">{t("readError")}</p>}
    {blocked ? <p className="text-body border-t border-border p-4 text-center text-muted-foreground">{t("blocked")}</p> : <MessageComposer reply={reply} onCancelReply={() => setReply(null)} onSend={send} disabled={!ready || query.isError || !!pending} />}
    {action && <MessageActionDialog key={`${action.kind}:${action.message.id}`} action={action.kind} message={action.message} pending={actions.edit.isPending || actions.remove.isPending || actions.report.isPending} error={actionError} onClose={() => setAction(null)} onConfirm={(content, reason) => void confirmAction(content, reason)} />}
  </section>;
}
