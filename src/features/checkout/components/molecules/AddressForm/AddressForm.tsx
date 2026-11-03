"use client";
import { useId, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { purchaseInput, purchasePrimary, purchaseSecondary } from "@/lib/constants/purchaseStyles";
import type { AddressInput } from "../../../types";
const fields = ["recipientName", "phoneNumber", "addressLine1", "addressLine2", "city", "state", "country", "postalCode", "label"] as const;
export default function AddressForm({ busy, onSave, onCancel }: { busy: boolean; onSave: (address: AddressInput) => void; onCancel: () => void }) {
  const t = useTranslations("Checkout");
  const id = useId();
  const [invalid, setInvalid] = useState<string[]>([]);
  return <form noValidate onSubmit={(event) => {
    event.preventDefault(); if (busy) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    const text = (key: string) => String(values.get(key) ?? "").trim();
    const missing = fields.filter((field) => field !== "addressLine2" && field !== "postalCode" && !text(field));
    setInvalid(missing);
    if (missing.length) { form.querySelector<HTMLInputElement>(`[name="${missing[0]}"]`)?.focus(); return; }
    onSave({ label: text("label"), recipientName: text("recipientName"), phoneNumber: text("phoneNumber"), addressLine1: text("addressLine1"), addressLine2: text("addressLine2") || null, city: text("city"), state: text("state"), country: text("country"), postalCode: text("postalCode") || null, isDefault: values.has("isDefault") });
  }} className="space-y-5">
    <h3 className="text-base font-bold">{t("addAddress")}</h3>
    <fieldset disabled={busy} className="grid gap-x-4 gap-y-5 sm:grid-cols-2">{fields.map((field) => <label key={field} htmlFor={`${id}-${field}`} className={`text-xs font-semibold ${["addressLine1", "addressLine2", "label"].includes(field) ? "sm:col-span-2" : ""}`}>{t(field)}
      <input id={`${id}-${field}`} name={field} required={field !== "addressLine2" && field !== "postalCode"} type={field === "phoneNumber" ? "tel" : "text"} maxLength={field === "phoneNumber" ? 30 : 200} aria-invalid={invalid.includes(field)} aria-describedby={invalid.includes(field) ? `${id}-${field}-error` : undefined} autoComplete={field === "recipientName" ? "shipping name" : field === "phoneNumber" ? "shipping tel" : field === "addressLine1" ? "shipping address-line1" : field === "addressLine2" ? "shipping address-line2" : field === "postalCode" ? "shipping postal-code" : field === "city" ? "shipping address-level2" : field === "state" ? "shipping address-level1" : field === "country" ? "shipping country-name" : undefined} onChange={() => setInvalid((previous) => previous.filter((name) => name !== field))} className={`${purchaseInput} mt-2`} />
      {invalid.includes(field) && <span id={`${id}-${field}-error`} className="mt-1 block text-xs font-normal text-destructive">{t("requiredField")}</span>}
    </label>)}<label className="flex min-h-11 items-center gap-3 text-sm sm:col-span-2"><input type="checkbox" name="isDefault" className="size-4 accent-brand" />{t("setDefault")}</label></fieldset>
    <div className="flex flex-wrap gap-3"><button type="submit" disabled={busy} aria-busy={busy} className={purchasePrimary}>{busy && <LoaderCircle size={16} className="animate-spin motion-reduce:animate-none" />}{t(busy ? "saving" : "saveAddress")}</button><button type="button" disabled={busy} onClick={onCancel} className={purchaseSecondary}>{t("cancel")}</button></div>
  </form>;
}
