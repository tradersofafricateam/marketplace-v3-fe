import type { MarketplaceCurrency } from "../types";

export function normalizeCurrencies(value: unknown): MarketplaceCurrency[] {
  if (!Array.isArray(value)) throw new Error("Invalid currencies response");
  const result = new Map<string, MarketplaceCurrency>();
  for (const entry of value) {
    if (!entry || typeof entry !== "object") throw new Error("Invalid currency record");
    if (entry.status && entry.status !== "active") continue;
    if (typeof entry.code !== "string" || !/^[A-Z]{3}$/.test(entry.code) || typeof entry.name !== "string") throw new Error("Invalid currency record");
    if (entry.decimalPlaces !== undefined && (!Number.isInteger(entry.decimalPlaces) || entry.decimalPlaces < 0 || entry.decimalPlaces > 20)) throw new Error("Invalid currency precision");
    result.set(entry.code, { code: entry.code, name: entry.name, symbol: typeof entry.symbol === "string" ? entry.symbol : undefined, decimalPlaces: entry.decimalPlaces });
  }
  return [...result.values()];
}

export function resolveCurrency(saved: string | null, currencies: MarketplaceCurrency[]): string {
  return currencies.find((item) => item.code === saved)?.code ?? currencies[0]?.code ?? "";
}

export function formatCurrencyAmount(amount: number, code: string, locale: string, metadata?: MarketplaceCurrency): string {
  const options: Intl.NumberFormatOptions = { style: "currency", currency: code, currencyDisplay: "symbol" };
  if (metadata?.decimalPlaces !== undefined) {
    options.minimumFractionDigits = metadata.decimalPlaces;
    options.maximumFractionDigits = metadata.decimalPlaces;
  }
  try {
    return new Intl.NumberFormat(locale, options).formatToParts(amount).map((part) => part.type === "currency" ? metadata?.symbol || part.value : part.value).join("");
  } catch {
    return `${code} ${new Intl.NumberFormat(locale).format(amount)}`;
  }
}
