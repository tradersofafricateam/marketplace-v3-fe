"use client";
import { useTranslations } from "next-intl";
import { useCurrency } from "@/lib/hooks/useCurrency/useCurrency";

export default function CurrencySelect({ value, onChange, error }: { value: string; onChange: (value: string) => void; error?: string }) {
  const t = useTranslations("CurrencyData");
  const { currencies, isLoading, isError, retry } = useCurrency();
  const unsupported = value && !currencies.some((item) => item.code === value);
  return <div className="flex flex-col gap-1.5">
    <label htmlFor="product-currency" className="text-sm font-semibold">{t("label")}</label>
    <select id="product-currency" name="currency" value={value} onChange={(event) => onChange(event.target.value)} required disabled={isLoading || isError || !currencies.length} aria-invalid={!!error || !!unsupported} className="h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-(--orange) disabled:opacity-60">
      <option value="">{t(isLoading ? "loading" : isError ? "error" : !currencies.length ? "empty" : "select")}</option>
      {unsupported && <option value={value} disabled>{value} — {t("unavailable")}</option>}
      {currencies.map((item) => <option key={item.code} value={item.code}>{item.code} — {item.name}{item.symbol ? ` (${item.symbol})` : ""}</option>)}
    </select>
    {isError && <button type="button" onClick={retry} className="text-left text-xs font-semibold text-(--orange)">{t("retry")}</button>}
    {(error || (!isLoading && !isError && unsupported)) && <p role="alert" className="text-xs text-destructive">{error || t("unsupported")}</p>}
  </div>;
}
