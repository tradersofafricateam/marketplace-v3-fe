"use client";
import { useId, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { sellerWorkspaceSections } from "../../../constants/workspace";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";

export default function WorkspaceSearch() {
  const t = useTranslations("SellerWorkspace");
  const { routes } = useGetAllRoutes();
  const [query, setQuery] = useState("");
  const id = useId();
  const results = query.trim() ? sellerWorkspaceSections.filter((item) => t(`nav.${item.key}`).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())) : [];
  return <div className="relative w-full max-w-sm">
    <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 px-3"><Search size={16} className="shrink-0 text-muted-foreground" /><input aria-label={t("search")} aria-controls={query.trim() ? id : undefined} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") setQuery(""); }} placeholder={t("search")} className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none" type="search" /></div>
    {query.trim() && <div id={id} className="absolute inset-x-0 top-full z-40 mt-2 rounded-xl border border-border bg-background p-2 shadow-xl">{results.length ? results.map((item) => <Link prefetch={false} key={item.key} href={routes.seller + (item.path ? `/${item.path}` : "")} onClick={() => setQuery("")} className="block rounded-lg px-3 py-2 text-sm hover:bg-muted">{t(`nav.${item.key}`)}</Link>) : <p className="p-3 text-sm text-muted-foreground">{t("noResults")}</p>}</div>}
  </div>;
}
