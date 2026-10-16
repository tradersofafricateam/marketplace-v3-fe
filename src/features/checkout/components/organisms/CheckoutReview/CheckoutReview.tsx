"use client";
import { useTranslations } from "next-intl";
import type { CheckoutPreview } from "../../../types";
import CartMoney from "@/features/cart/components/atoms/CartMoney/CartMoney";
export default function CheckoutReview({ preview }: { preview: CheckoutPreview }) {
  const t = useTranslations("Checkout");
  const address = preview.deliveryAddress;
  const money = (amount: number) => <CartMoney amount={amount} currency={preview.summary.currency} />;
  return <div className="space-y-5">
    {Boolean(preview.priceChanges?.length) && <p role="status" className="rounded-xl border border-orange-200 bg-(--orange-light) p-4 text-sm">{t("priceChanged")}</p>}
    <section className="rounded-xl border border-border p-4 text-sm"><h3 className="mb-2 font-bold">{t("address")}</h3><p>{address.recipientName}</p><p className="text-muted-foreground">{[address.addressLine1, address.addressLine2, address.city, address.state, address.country].filter(Boolean).join(", ")}</p></section>
    {preview.sellerGroups.map((group) => <section key={group.sellerId} className="space-y-3 rounded-xl border border-border p-4 text-sm"><h3 className="font-bold">{group.storeName}</h3>{group.items.map((item, index) => <div key={`${item.productId}:${item.variantId ?? index}`} className="flex justify-between gap-4"><span>{item.productName}<span className="block text-xs text-muted-foreground">{item.quantity} × {money(item.unitPrice)}</span></span><span>{money(item.subtotal)}</span></div>)}<div className="border-t border-border pt-3"><p className="font-semibold">{group.delivery.type === "integrated_logistics" ? `${group.delivery.providerName} · ${group.delivery.serviceName}` : t(group.delivery.type === "seller_arranged" ? "sellerDelivery" : "buyerDelivery")}</p>{group.delivery.type === "integrated_logistics" && group.delivery.amount !== null ? <p className="mt-1">{money(group.delivery.amount)} <span className="text-xs text-muted-foreground">{group.delivery.estimatedDelivery}</span></p> : <p className="mt-1 text-xs leading-5 text-muted-foreground">{t(group.delivery.type === "seller_arranged" ? "sellerDeliveryNote" : "buyerDeliveryNote")}</p>}</div><div className="flex justify-between border-t border-border pt-3 font-semibold"><span>{t("sellerTotal")}</span>{money(group.sellerTotal)}</div></section>)}
    <p className="text-sm"><strong>{t("payment")}: </strong>{preview.paymentMethod.name}</p>
    <dl className="space-y-3 rounded-xl bg-muted/30 p-5 text-sm"><div className="flex justify-between"><dt>{t("products")}</dt><dd>{money(preview.summary.productsTotal)}</dd></div><div className="flex justify-between"><dt>{t("platformDelivery")}</dt><dd>{money(preview.summary.logisticsTotal)}</dd></div><div className="flex justify-between border-t border-border pt-4 text-lg font-bold"><dt>{t("total")}</dt><dd>{money(preview.summary.totalAmount)}</dd></div></dl>
  </div>;
}
