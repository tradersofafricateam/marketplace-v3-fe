"use client";
import { useTranslations } from "next-intl";
import type { AddressInput } from "../../../types";
export default function AddressForm({ busy, onSave, onCancel }: { busy: boolean; onSave: (address: AddressInput) => void; onCancel: () => void }) {
  const t = useTranslations("Checkout");
  const fields = ["label", "recipientName", "phoneNumber", "addressLine1", "addressLine2", "city", "state", "country", "postalCode"] as const;
  return <form onSubmit={(event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const text = (key: string) => String(values.get(key) ?? "").trim();
    onSave({ label: text("label"), recipientName: text("recipientName"), phoneNumber: text("phoneNumber"), addressLine1: text("addressLine1"), addressLine2: text("addressLine2") || null, city: text("city"), state: text("state"), country: text("country"), postalCode: text("postalCode") || null, isDefault: values.has("isDefault") });
  }} className="space-y-4 rounded-xl bg-muted/30 p-4">
    <h3 className="font-semibold">{t("addAddress")}</h3>
    <fieldset disabled={busy} className="grid gap-4 sm:grid-cols-2">
      {fields.map((field) => <label key={field} className="space-y-1 text-xs font-semibold">{t(field)}<input name={field} required={field !== "addressLine2" && field !== "postalCode"} type={field === "phoneNumber" ? "tel" : "text"} maxLength={field === "phoneNumber" ? 30 : 200} pattern={field !== "addressLine2" && field !== "postalCode" ? ".*\\S.*" : undefined} autoComplete={field === "recipientName" ? "shipping name" : field === "phoneNumber" ? "shipping tel" : field === "addressLine1" ? "shipping address-line1" : field === "addressLine2" ? "shipping address-line2" : field === "postalCode" ? "shipping postal-code" : field === "city" ? "shipping address-level2" : field === "state" ? "shipping address-level1" : field === "country" ? "shipping country-name" : undefined} className="mt-1 block w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm font-normal" /></label>)}
      <label className="flex items-center gap-2 text-sm sm:col-span-2"><input type="checkbox" name="isDefault" />{t("setDefault")}</label>
    </fieldset>
    <div className="flex gap-4"><button type="submit" disabled={busy} className="rounded-lg bg-(--orange) px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{t("saveAddress")}</button><button type="button" disabled={busy} onClick={onCancel} className="text-sm underline">{t("cancel")}</button></div>
  </form>;
}
