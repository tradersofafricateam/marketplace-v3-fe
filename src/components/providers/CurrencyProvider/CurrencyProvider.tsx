"use client";

import { createContext, useCallback, useMemo, useSyncExternalStore } from "react";
import { useLocale } from "next-intl";
import { useSupportedCurrencies } from "@/features/currencies/hooks/useSupportedCurrencies";
import { formatCurrencyAmount, resolveCurrency } from "@/features/currencies/helpers";
import type { MarketplaceCurrency } from "@/features/currencies/types";

export const CurrencyContext = createContext<{
  currency: string;
  currencies: MarketplaceCurrency[];
  setCurrency: (currency: string) => void;
  isLoading: boolean;
  isError: boolean;
  retry: () => void;
  formatMoney: (amount: number, code: string) => string;
} | null>(null);

const subscribe = (notify: () => void) => {
  window.addEventListener("storage", notify);
  window.addEventListener("tofa-currency-change", notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener("tofa-currency-change", notify);
  };
};
const getSavedCurrency = () => {
  try { return window.localStorage.getItem("tofa-currency"); } catch { return null; }
};
const getServerCurrency = () => null;
const emptyCurrencies: MarketplaceCurrency[] = [];

const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const locale = useLocale();
  const query = useSupportedCurrencies();
  const currencies = query.data ?? emptyCurrencies;
  const saved = useSyncExternalStore(subscribe, getSavedCurrency, getServerCurrency);
  const currency = resolveCurrency(saved, currencies);
  const setCurrency = useCallback((next: string) => {
    if (!currencies.some((item) => item.code === next)) return;
    try { window.localStorage.setItem("tofa-currency", next); } catch { return; }
    window.dispatchEvent(new Event("tofa-currency-change"));
  }, [currencies]);
  const formatMoney = useCallback((amount: number, code: string) => formatCurrencyAmount(amount, code, locale, currencies.find((item) => item.code === code)), [locale, currencies]);
  const { refetch } = query;
  const retry = useCallback(() => { void refetch(); }, [refetch]);
  const value = useMemo(() => ({ currency, currencies, setCurrency, formatMoney, retry, isLoading: query.isLoadingCurrentData, isError: query.isError }), [currency, currencies, setCurrency, formatMoney, retry, query.isLoadingCurrentData, query.isError]);
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};

export default CurrencyProvider;
