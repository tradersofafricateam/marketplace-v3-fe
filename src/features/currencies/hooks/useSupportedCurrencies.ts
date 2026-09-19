"use client";
import { useLocale } from "next-intl";
import { useFreshQuery } from "@/lib/hooks/useFreshQuery";
import { getCurrencies } from "../api";

export function useSupportedCurrencies() {
  const locale = useLocale();
  return useFreshQuery({ queryKey: ["currencies", locale], queryFn: ({ signal }) => getCurrencies(locale, signal) });
}
