"use client";
import { useTranslations } from "next-intl";
import type { DeliveryOptions, DeliverySelection } from "../../../types";
import { quoteIsValid } from "../../../helpers/checkoutRules";
import CartMoney from "@/features/cart/components/atoms/CartMoney/CartMoney";
export default function DeliveryChoices({ options, selections, disabled, onSelect, onApply, onRefresh, now }: { now: number; options: DeliveryOptions; selections: DeliverySelection[]; disabled: boolean; onSelect: (selection: DeliverySelection) => void; onApply: (providerId: string) => void; onRefresh: () => void }) {
  const t = useTranslations("Checkout");
  const providers = new Map(options.sellerGroups.flatMap((group) => group.integratedOptions.filter((quote) => quoteIsValid(quote.expiresAt, now)).map((quote) => [quote.providerId, quote.providerName] as const)));
  return <div className="space-y-5">
    <div className="flex items-center justify-between gap-3"><p className="text-xs text-muted-foreground">{t("deliveryIntro")}</p><button type="button" onClick={onRefresh} disabled={disabled} className="shrink-0 text-xs font-semibold text-(--orange)">{t("refreshQuotes")}</button></div>
    {options.sellerGroups.length > 1 && <div className="flex flex-wrap gap-2">{[...providers].map(([id, name]) => <button key={id} type="button" disabled={disabled} onClick={() => onApply(id)} className="rounded-lg border border-border px-3 py-2 text-xs font-semibold disabled:opacity-50">{t("applyProvider", { name })}</button>)}</div>}
    {options.sellerGroups.map((group) => {
      const selection = selections.find((value) => value.sellerId === group.sellerId);
      return <fieldset key={group.sellerId} disabled={disabled} className="space-y-3 rounded-xl border border-border p-4"><legend className="px-2 text-sm font-bold">{group.storeName}</legend>
        {group.integratedOptions.map((quote) => {
          const expired = !quoteIsValid(quote.expiresAt, now);
          return <label key={quote.quoteId} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${selection?.quoteId === quote.quoteId ? "border-(--orange) bg-(--orange-light)/40" : "border-border"} ${expired ? "opacity-50" : ""}`}>
            <input type="radio" name={`delivery-${group.sellerId}`} checked={selection?.quoteId === quote.quoteId} disabled={expired} onChange={() => onSelect({ sellerId: group.sellerId, type: "integrated_logistics", quoteId: quote.quoteId })} className="mt-1 accent-(--orange)" />
            <span className="min-w-0 flex-1 text-sm"><span className="block font-semibold">{quote.providerName} · {quote.serviceName}</span><span className="text-xs text-muted-foreground">{expired ? t("quoteExpired") : t("estimate", { min: quote.estimatedDelivery.min, max: quote.estimatedDelivery.max })}</span></span><span className="text-sm font-semibold"><CartMoney amount={quote.amount} currency={quote.currency} /></span>
          </label>;
        })}
        {([group.sellerArrangedOption, group.buyerArrangedOption]).filter((option) => option?.available).map((option) => <label key={option.type} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${selection?.type === option.type ? "border-(--orange) bg-(--orange-light)/40" : "border-border"}`}>
          <input type="radio" name={`delivery-${group.sellerId}`} checked={selection?.type === option.type} onChange={() => onSelect({ sellerId: group.sellerId, type: option.type, quoteId: null })} className="mt-1 accent-(--orange)" />
          <span className="text-sm"><span className="block font-semibold">{t(option.type === "seller_arranged" ? "sellerDelivery" : "buyerDelivery")}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{t(option.type === "seller_arranged" ? "sellerDeliveryNote" : "buyerDeliveryNote")}</span></span>
        </label>)}
        {!group.integratedOptions.length && !group.sellerArrangedOption?.available && !group.buyerArrangedOption?.available && <p role="alert" className="text-sm text-destructive">{t("noDelivery")}</p>}
      </fieldset>;
    })}
  </div>;
}
