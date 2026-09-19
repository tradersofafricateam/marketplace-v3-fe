"use client";
import { useTranslations } from "next-intl";

export default function CategoryQueryState({ loading, error, empty, onRetry }: {
  loading: boolean; error: boolean; empty: boolean; onRetry: () => void;
}) {
  const t = useTranslations("CategoryData");
  if (loading) return <div role="status" aria-label={t("loading")} className="w-full space-y-2 p-3">{[0, 1, 2].map((key) => <div key={key} className="h-7 animate-pulse rounded-lg bg-muted" />)}</div>;
  if (error) return <div role="alert" className="p-3 text-sm text-muted-foreground"><p>{t("error")}</p><button type="button" onClick={onRetry} className="mt-2 font-semibold text-(--orange)">{t("retry")}</button></div>;
  if (empty) return <p className="p-3 text-sm text-muted-foreground">{t("empty")}</p>;
  return null;
}
