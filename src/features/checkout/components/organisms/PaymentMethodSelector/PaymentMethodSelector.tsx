"use client";
import { useState } from "react";
import { ChevronLeft, ArrowRight, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { purchaseBack, purchasePrimary } from "@/lib/constants/purchaseStyles";
import type { PaymentMethod } from "../../../types";

export default function PaymentMethodSelector({ methods, selectedCode, busy, saving, onSave, onBack }: { methods: PaymentMethod[]; selectedCode: string; busy: boolean; saving: boolean; onSave: (code: string) => void; onBack: () => void }) {
  const t = useTranslations("Checkout");
  const [choice, setChoice] = useState(selectedCode);
  const available = methods.some((method) => method.code === choice);
  return <div>
    <fieldset disabled={busy} className="space-y-3"><legend className="sr-only">{t("payment")}</legend>
      {!methods.length && <p role="alert" className="rounded-xl bg-brand-subtle/50 p-4 text-sm leading-6">{t("noPayment")}</p>}
      {methods.map((method) => <label key={method.code} className={`flex min-h-20 cursor-pointer items-center gap-3 rounded-xl border px-4 py-5 transition-colors duration-150 hover:border-brand/50 focus-within:outline-2 focus-within:outline-brand motion-reduce:transition-none ${choice === method.code ? "border-brand bg-brand-subtle/35" : "border-border bg-background"}`}><input type="radio" name="payment-method" value={method.code} checked={choice === method.code} onChange={() => setChoice(method.code)} className="size-4 shrink-0 accent-brand" /><span className="text-sm font-semibold">{method.name}</span></label>)}
    </fieldset>
    <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5"><button type="button" disabled={busy} onClick={onBack} className={purchaseBack}><ChevronLeft size={18} aria-hidden="true" />{t("delivery")}</button><button type="button" disabled={busy || !available} aria-busy={saving} onClick={() => onSave(choice)} className={`${purchasePrimary} max-sm:w-full`}>{saving ? <LoaderCircle size={16} className="animate-spin motion-reduce:animate-none" /> : <ArrowRight size={16} aria-hidden="true" />}{t(saving ? "saving" : "continueReview")}</button></div>
  </div>;
}
