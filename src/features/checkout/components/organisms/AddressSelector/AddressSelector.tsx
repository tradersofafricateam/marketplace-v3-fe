"use client";
import { useTranslations } from "next-intl";
import type { Address } from "../../../types";
export default function AddressSelector({ addresses, value, disabled, onChange }: { addresses: Address[]; value: string; disabled: boolean; onChange: (id: string) => void }) {
  const t = useTranslations("Checkout");
  return <fieldset disabled={disabled} className="grid gap-3 sm:grid-cols-2"><legend className="sr-only">{t("selectAddress")}</legend>{addresses.map((address) => <label key={address.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors duration-150 hover:border-brand/50 focus-within:outline-2 focus-within:outline-brand motion-reduce:transition-none sm:p-5 ${address.id === value ? "border-brand bg-brand-subtle/35" : "border-border bg-background"}`}>
    <input type="radio" name="delivery-address" value={address.id} checked={address.id === value} onChange={() => onChange(address.id)} className="mt-1 size-4 shrink-0 accent-brand" />
    <span className="min-w-0 text-sm"><span className="flex flex-wrap items-center gap-2"><strong>{address.label}</strong>{address.isDefault && <span className="rounded-full bg-brand-subtle px-2 py-0.5 text-[0.625rem] font-semibold text-brand-hover">{t("default")}</span>}</span><span className="mt-2 block font-medium">{address.recipientName}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{address.phoneNumber}</span><span className="mt-2 block leading-6 text-muted-foreground">{[address.addressLine1, address.addressLine2].filter(Boolean).join(", ")}<br />{[address.city, address.state, address.country, address.postalCode].filter(Boolean).join(", ")}</span></span>
  </label>)}</fieldset>;
}
