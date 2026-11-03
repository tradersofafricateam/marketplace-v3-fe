"use client";
import { LoaderCircle } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { DeliveryOptions, DeliverySelection } from "../../../types";
import { deliveryIsComplete, quoteIsValid } from "../../../helpers/checkoutRules";
import { purchaseSecondary, purchaseText } from "@/lib/constants/purchaseStyles";
import CartMoney from "@/features/cart/components/atoms/CartMoney/CartMoney";

export default function DeliveryChoices({ options, selections, disabled, onSelect, onApply, onRefresh, onChangeAddress, applyingProviderId, now }: {
  options: DeliveryOptions; selections: DeliverySelection[]; disabled: boolean;
  onSelect: (selection: DeliverySelection) => void; onApply: (providerId: string) => void;
  onRefresh: () => void; onChangeAddress?: () => void; applyingProviderId?: string; now: number;
}) {
  const t = useTranslations("Checkout");
  const locale = useLocale();
  const providers = new Map(options.sellerGroups.flatMap((group) => group.integratedOptions.filter((quote) => quoteIsValid(quote.expiresAt, now)).map((quote) => [quote.providerId, quote.providerName] as const)));
  const ready = (sellerId: string) => deliveryIsComplete(options, selections.filter((s) => s.sellerId === sellerId), [sellerId], now);
  const count = options.sellerGroups.filter((g) => ready(g.sellerId)).length;
  const selectable = "flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors duration-150 hover:border-brand/50 focus-within:outline-2 focus-within:outline-brand motion-reduce:transition-none";
  return <div className="space-y-6">
    <div className="flex flex-wrap items-center justify-between gap-2"><p role="status" className="text-xs text-muted-foreground">{t("deliveryProgress", { selected: count, total: options.sellerGroups.length })}</p><button type="button" onClick={onRefresh} disabled={disabled} className={purchaseText}>{t("refreshQuotes")}</button></div>
    {options.sellerGroups.length > 1 && providers.size > 0 && <div className="flex flex-wrap items-center gap-2">{[...providers].map(([id, name]) => <button key={id} type="button" disabled={disabled} aria-busy={applyingProviderId === id} onClick={() => onApply(id)} className={`${purchaseSecondary} min-h-10! px-3! text-xs!`}>{applyingProviderId === id && <LoaderCircle size={14} className="animate-spin motion-reduce:animate-none" />}{t("applyProvider", { name })}</button>)}</div>}
    {options.sellerGroups.map((group) => {
      const selection = selections.find((value) => value.sellerId === group.sellerId);
      const complete = ready(group.sellerId);
      const external = [group.sellerArrangedOption, group.buyerArrangedOption].filter((option) => option?.available);
      return <fieldset key={group.sellerId} disabled={disabled} data-delivery-seller={group.sellerId} className="min-w-0 space-y-3 border-t border-border pt-5">
        <legend className="sr-only">{group.storeName}</legend>
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2"><h3 className="text-base font-bold">{group.storeName}</h3><span className={`text-[0.6875rem] font-medium ${complete ? "text-brand-hover" : "text-muted-foreground"}`}>{t(complete ? "deliverySelected" : "selectionRequired")}</span></div>
        {group.integratedOptions.map((quote) => {
          const expired = !quoteIsValid(quote.expiresAt, now);
          const selected = selection?.quoteId === quote.quoteId && !expired;
          return <label key={quote.quoteId} className={`${selectable} ${selected ? "border-brand bg-brand-subtle/35" : "border-border bg-background"} ${expired ? "cursor-not-allowed! opacity-60" : ""}`}>
            <input type="radio" name={`delivery-${group.sellerId}`} value={quote.quoteId} checked={selected} disabled={expired} onChange={() => onSelect({ sellerId: group.sellerId, type: "integrated_logistics", quoteId: quote.quoteId })} className="mt-1 size-4 shrink-0 accent-brand" />
            <span className="min-w-0 flex-1 text-sm"><span className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1"><strong>{quote.providerName}</strong><strong className="tabular-nums"><CartMoney amount={quote.amount} currency={quote.currency} /></strong></span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{quote.serviceName} · {t("estimate", { min: quote.estimatedDelivery.min, max: quote.estimatedDelivery.max })}</span><span className="mt-2 flex flex-wrap justify-between gap-x-3 gap-y-1 text-[0.6875rem] leading-5"><span className="text-brand-hover">{t("includedInTotal")}</span><span className="text-muted-foreground">{expired ? t("quoteExpired") : t("quoteValidUntil", { time: new Date(quote.expiresAt).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" }) })}</span></span></span>
          </label>;
        })}
        {external.map((option) => <label key={option.type} className={`${selectable} ${selection?.type === option.type ? "border-brand bg-brand-subtle/35" : "border-border bg-background"}`}>
          <input type="radio" name={`delivery-${group.sellerId}`} value={option.type} checked={selection?.type === option.type} onChange={() => onSelect({ sellerId: group.sellerId, type: option.type, quoteId: null })} className="mt-1 size-4 shrink-0 accent-brand" />
          <span className="min-w-0 text-sm"><strong>{t(option.type === "seller_arranged" ? "sellerDelivery" : "buyerDelivery")}</strong><span className="mt-1 block text-xs leading-5 text-muted-foreground">{t(option.type === "seller_arranged" ? "sellerDeliveryNote" : "buyerDeliveryNote")}</span><span className="mt-2 block text-[0.6875rem] font-medium text-brand-hover">{t("paidOutside")}</span></span>
        </label>)}
        {!group.integratedOptions.length && !external.length && <div role="alert" className="rounded-xl bg-brand-subtle/40 p-4"><p className="text-sm leading-6">{t("noDelivery")}</p>{onChangeAddress && <button type="button" onClick={onChangeAddress} disabled={disabled} className={purchaseText}>{t("changeAddress")}</button>}</div>}
      </fieldset>;
    })}
  </div>;
}
