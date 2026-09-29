"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { useConversations } from "../../hooks/useMessageQueries";
import type { Conversation } from "../../types";
import MessageLoading from "../atoms/MessageLoading";
import MessageErrorState from "../atoms/MessageErrorState";
import MessageEmptyState from "../atoms/MessageEmptyState";
import ConversationItem from "../molecules/ConversationItem";

export default function ConversationList({ selectedId, onSelect }: { selectedId?: string; onSelect: (conversation: Conversation) => void }) {
  const t = useTranslations("MessageCenter");
  const { routes } = useGetAllRoutes();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({ search: "", unread: false, page: 1 });
  useEffect(() => { const timer = setTimeout(() => setFilter((current) => ({ ...current, search, page: 1 })), 300); return () => clearTimeout(timer); }, [search]);
  const query = useConversations(filter.search, filter.unread, filter.page);
  const loading = query.isLoadingCurrentData || search !== filter.search;
  return <section aria-label={t("conversations")} className="flex h-full min-w-0 flex-col border-r border-border bg-background">
    <div className="border-b border-border p-4"><div className="flex items-center justify-between"><h2 className="heading-font text-xl font-semibold">{t("inbox")}</h2><button type="button" onClick={() => void query.refetch()} disabled={query.isFetching} aria-label={t("refresh")} className="rounded-xl p-2 text-muted-foreground hover:bg-muted disabled:opacity-40"><RefreshCw size={16} /></button></div>
      <label className="relative mt-4 block"><Search size={17} aria-hidden="true" className="absolute left-3 top-3 text-muted-foreground" /><input value={search} onChange={(event) => setSearch(event.target.value)} aria-label={t("search")} placeholder={t("search")} className="h-11 w-full rounded-xl border border-border bg-muted/30 pl-10 pr-3 text-sm outline-none focus:border-(--orange)" /></label>
      <div className="mt-3 flex gap-2">{[false, true].map((unread) => <button key={String(unread)} type="button" aria-pressed={filter.unread === unread} onClick={() => setFilter((current) => ({ ...current, unread, page: 1 }))} className={`rounded-full px-4 py-1.5 text-xs font-semibold ${filter.unread === unread ? "bg-foreground text-background" : "bg-muted/60 text-muted-foreground"}`}>{t(unread ? "unread" : "all")}</button>)}</div>
    </div>
    <div className="min-h-0 flex-1 overflow-y-auto p-2">
      {loading ? <MessageLoading list /> : query.isError ? <MessageErrorState retry={() => void query.refetch()} /> : query.data?.data.length ? <div className="space-y-1">{query.data.data.map((conversation) => <ConversationItem key={conversation.conversationId} conversation={conversation} selected={selectedId === conversation.conversationId} onSelect={() => onSelect(conversation)} />)}</div> : <MessageEmptyState kind={search ? "search" : filter.unread ? "unread" : "inbox"}>{!search && !filter.unread && <Link href={routes.home} className="inline-flex rounded-xl bg-(--orange) px-4 py-2.5 text-sm font-semibold text-white">{t("explore")}</Link>}</MessageEmptyState>}
    </div>
    {!loading && query.data && query.data.pagination.totalPages > 1 && <nav aria-label={t("pagination")} className="flex items-center justify-between border-t border-border p-3"><button type="button" disabled={filter.page === 1} onClick={() => setFilter({ ...filter, page: filter.page - 1 })} aria-label={t("previous")} className="rounded-lg p-2 disabled:opacity-30"><ChevronLeft size={18} /></button><span className="text-xs text-muted-foreground">{t("page", { page: filter.page, total: query.data.pagination.totalPages })}</span><button type="button" disabled={filter.page >= query.data.pagination.totalPages} onClick={() => setFilter({ ...filter, page: filter.page + 1 })} aria-label={t("next")} className="rounded-lg p-2 disabled:opacity-30"><ChevronRight size={18} /></button></nav>}
  </section>;
}
