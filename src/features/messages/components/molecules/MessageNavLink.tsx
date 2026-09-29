"use client";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMessageUnreadCount } from "../../hooks/useMessageQueries";
export default function MessageNavLink({ href }: { href: string }) {
  const t = useTranslations("MessageCenter");
  const query = useMessageUnreadCount();
  const count = query.isError || query.isFetching ? 0 : query.data?.totalUnread ?? 0;
  return <Link prefetch={false} href={href} aria-label={count ? t("unreadCount", { count }) : t("title")} className="relative flex size-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"><MessageSquare size={18} />{count > 0 && <span className="absolute -right-1 -top-1 min-w-4 rounded-full bg-(--orange) px-1 text-center text-[10px] font-bold leading-4 text-white">{count > 99 ? "99+" : count}</span>}</Link>;
}
