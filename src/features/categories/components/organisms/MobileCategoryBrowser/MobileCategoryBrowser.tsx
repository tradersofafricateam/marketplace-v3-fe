"use client";

import { navigationControl, navigationItem, navigationPrimary, navigationSecondary } from "@/lib/constants/navigationStyles";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCategoryTree } from "../../../hooks/useCategories";
import type { Category } from "../../../types";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { Skeleton } from "@/components/ui/skeleton";

export default function MobileCategoryBrowser({ onBack, onNavigate }: { onBack: () => void; onNavigate: () => void }) {
  const query = useCategoryTree();
  const [path, setPath] = useState<Category[]>([]);
  const content = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const t = useTranslations("Nav");
  const category = useTranslations("CategoryData");
  const { routes } = useGetAllRoutes();
  const current = path[path.length - 1];
  const children = current ? current.children : query.data ?? [];
  useEffect(() => { content.current?.parentElement?.scrollTo({ top: 0 }); heading.current?.focus({ preventScroll: true }); }, [path]);
  return <div ref={content} className="pb-6">
    <div className="sticky top-0 z-10 border-b border-border bg-background px-5 pb-5 pt-4">
      <button type="button" className={`${navigationControl} px-0!`} onClick={() => path.length ? setPath(path.slice(0, -1)) : onBack()}><ArrowLeft size={17} aria-hidden="true" />{path.length > 1 ? path[path.length - 2].name : path.length ? category("title") : t("mega.back")}</button>
      <h2 ref={heading} tabIndex={-1} className="font-poppins mt-3 text-xl font-semibold leading-snug outline-none" aria-live="polite">{current?.name ?? category("title")}</h2>
      {current && <Link href={routes.categoryInfo(current.id)} onClick={onNavigate} className={`${navigationPrimary} mt-4 w-full`}>{t("navigation.browseCategory", { name: current.name })}</Link>}
    </div>
    <div className="px-5 py-3">
      {query.isLoadingCurrentData ? <div role="status" aria-label={category("loading")}>{[0,1,2,3,4].map(n => <div key={n} className="flex h-14 items-center"><Skeleton className="h-5 w-3/4" /></div>)}</div> : query.isError ? <div role="alert" className="py-4"><p className="text-sm text-muted-foreground">{category("error")}</p><button type="button" disabled={query.isFetching} onClick={() => void query.refetch()} className={`${navigationSecondary} mt-4`}>{category("retry")}</button></div> : !children.length ? <p className="py-5 text-sm text-muted-foreground">{category("empty")}</p> : <nav aria-label={current?.name ?? category("title")}>{children.map(child => child.children.length ? <button key={child.id} type="button" className={`${navigationItem} min-h-14! border-b border-border/60 rounded-none!`} onClick={() => { setPath([...path, child]); }}><span className="font-medium">{child.name}</span><ChevronRight size={17} aria-hidden="true" className="shrink-0 text-muted-foreground" /></button> : <Link key={child.id} href={routes.categoryInfo(child.id)} onClick={onNavigate} className={`${navigationItem} min-h-14! border-b border-border/60 rounded-none!`}>{child.name}</Link>)}</nav>}
      {!current && <Link href={routes.categories} onClick={onNavigate} className={`${navigationSecondary} mt-5 w-full`}>{t("navigation.allCategories")}</Link>}
    </div>
  </div>;
}
