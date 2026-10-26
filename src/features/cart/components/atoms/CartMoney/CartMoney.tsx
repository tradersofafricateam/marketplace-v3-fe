"use client";
import { useMemo } from "react";
import { formatCurrencyAmount } from "@/features/currencies/helpers";
import { useLocale } from "next-intl";
export default function CartMoney({ amount, currency }: { amount: number; currency: string }) {
  const locale = useLocale();
  const formatted = useMemo(() => formatCurrencyAmount(amount, currency, locale), [amount, currency, locale]);
  return <span className="tabular-nums">{formatted}</span>;
}
