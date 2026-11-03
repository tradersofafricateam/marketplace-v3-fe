"use client";
import { Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { purchaseFocus } from "@/lib/constants/purchaseStyles";
import type { CheckoutStep } from "../../../types";
const steps: CheckoutStep[] = ["address", "delivery", "payment", "review"];
export default function CheckoutStepper({ step, busy, onBack }: { step: CheckoutStep; busy: boolean; onBack: (step: CheckoutStep) => void }) {
  const t = useTranslations("Checkout");
  const current = steps.indexOf(step);
  return <nav aria-label={t("progress")} className="mb-8">
    <p className="mb-3 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm sm:hidden"><span className="text-xs text-muted-foreground">{t("stepOf", { current: current + 1, total: 4 })}</span><strong>{t(step)}</strong></p>
    <ol className="grid grid-cols-4 gap-2 sm:gap-5">{steps.map((name, i) => <li key={name} aria-label={t(name)} aria-current={name === step ? "step" : undefined} className={`border-b-2 ${i <= current ? "border-brand" : "border-border"}`}><button type="button" disabled={busy || i >= current} onClick={() => onBack(name)} className={`mb-2 hidden min-h-11 sm:flex w-full items-center gap-2 rounded-sm text-left text-xs transition-colors duration-150 enabled:hover:text-brand ${purchaseFocus} motion-reduce:transition-none ${i === current ? "font-bold text-brand" : i < current ? "font-semibold text-foreground" : "text-muted-foreground"}`}><span className="hidden sm:inline-flex">{i < current ? <Check size={14} aria-hidden="true" /> : `0${i + 1}`}</span><span className="hidden sm:inline">{t(name)}</span><span className="sr-only sm:hidden">{t(name)}</span></button></li>)}</ol>
  </nav>;
}
