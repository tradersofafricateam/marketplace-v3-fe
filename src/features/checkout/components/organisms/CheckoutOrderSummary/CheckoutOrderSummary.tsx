"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { CartData } from "@/features/cart/types";
import CartMoney from "@/features/cart/components/atoms/CartMoney/CartMoney";
import type { CheckoutPreview } from "../../../types";
export default function CheckoutOrderSummary({ cart, preview }: { cart: CartData; preview?: CheckoutPreview }) {
  const t = useTranslations("Checkout");
  const items = cart.sellerGroups.flatMap((group) => group.items);
  const currency = preview?.summary.currency || cart.currency;
  const external = preview?.sellerGroups.some((group) => group.delivery.type !== "integrated_logistics");
  return <aside className="space-y-5 rounded-2xl bg-brand-subtle/45 p-5 sm:p-6 lg:sticky lg:top-40 lg:max-h-[calc(100dvh-11rem)] lg:overflow-y-auto">
    <h2 className="heading-font text-lg font-medium">{t("summary")}</h2>
    <p className="text-xs text-muted-foreground">{t("cartLines", { count: cart.totalCount, sellers: cart.sellerGroups.length })}</p>
    <div className="space-y-4">{items.slice(0, 4).map((item) => <div key={item.cartItemId} className="flex items-center gap-3">{item.mainImage && <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-background"><Image src={item.mainImage} alt="" fill sizes="48px" className="object-contain" /></div>}<div className="min-w-0"><p className="line-clamp-2 text-xs font-medium leading-5">{item.productName}</p><p className="mt-0.5 text-[0.6875rem] text-muted-foreground">{t("quantityShort", { quantity: item.quantity, unit: item.minimumOrder.unit })}</p></div></div>)}</div>
    {items.length > 4 && <p className="text-xs text-muted-foreground">{t("moreItems", { count: items.length - 4 })}</p>}
    <dl className="space-y-3 border-t border-border/70 pt-5 text-sm"><div className="flex justify-between gap-3"><dt className="text-muted-foreground">{t("products")}</dt><dd className="font-semibold"><CartMoney amount={preview?.summary.productsTotal ?? cart.productsSubtotal} currency={currency} /></dd></div><div className="flex justify-between gap-3"><dt className="text-muted-foreground">{t("platformDelivery")}</dt><dd className="text-right text-xs leading-5">{preview ? <CartMoney amount={preview.summary.logisticsTotal} currency={currency} /> : t("calculatedAtReview")}</dd></div>{preview && <div className="flex flex-wrap justify-between gap-3 border-t border-border/70 pt-4"><dt className="font-semibold">{t("platformTotal")} <span className="text-xs font-normal text-muted-foreground">({currency})</span></dt><dd className="text-xl font-bold tracking-tight"><CartMoney amount={preview.summary.totalAmount} currency={currency} /></dd></div>}</dl>
    <p className="text-xs leading-5 text-muted-foreground">{t(external ? "externalCosts" : "summaryNote")}</p>
  </aside>;
}
