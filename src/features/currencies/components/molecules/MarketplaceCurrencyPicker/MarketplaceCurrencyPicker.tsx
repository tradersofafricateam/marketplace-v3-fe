"use client";

import { navigationControl } from "@/lib/constants/navigationStyles";
import { useTranslations } from "next-intl";

import SelectDropdown from "@/components/atoms/SelectDropdown/SelectDropdown";
import { useCurrency } from "@/lib/hooks/useCurrency/useCurrency";

export default function MarketplaceCurrencyPicker({ side = "bottom" }: { side?: "top" | "bottom" }) {
  const t = useTranslations("CurrencyData");
  const { currency, currencies, setCurrency, isLoading, isError, retry } = useCurrency();
  if (isLoading) return <span role="status" aria-label={t("loading")} className="mx-1 h-9 w-14 animate-pulse rounded-md bg-muted motion-reduce:animate-none" />;
  if (isError) return <button type="button" onClick={retry} className={`${navigationControl} text-brand!`}>{t("retry")}</button>;
  if (!currencies.length) return <span className="px-2 text-xs text-muted-foreground">{t("empty")}</span>;
  return <SelectDropdown side={side} selected={currency} onSelect={setCurrency} options={currencies.map((item) => ({ value: item.code, label: `${item.code} ${item.symbol || ""} — ${item.name}` }))} align="right" trigger={<span aria-label={t("label")}>{currency}</span>} />;
}
