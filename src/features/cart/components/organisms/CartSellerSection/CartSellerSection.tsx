"use client";
import { useTranslations } from "next-intl";
import type { CartSellerGroup } from "../../../types";
import CartItemRow from "../../molecules/CartItemRow/CartItemRow";
import CartMoney from "../../atoms/CartMoney/CartMoney";

export default function CartSellerSection({ group, currency, disabled }: { group: CartSellerGroup; currency: string; disabled: boolean }) {
  const t = useTranslations("CartPage");
  return <section aria-label={group.storeName} className="border-t border-border">
    <header className="flex flex-wrap items-baseline justify-between gap-2 pt-5"><div><p className="text-[0.6875rem] font-medium uppercase tracking-wider text-muted-foreground">{t("soldBy")}</p><h2 className="mt-1 text-base font-bold">{group.storeName}</h2></div><span className="text-xs text-muted-foreground">{t("itemCount", { count: group.itemsCount })}</span></header>
    <div className="divide-y divide-border/60">{group.items.map((item) => <CartItemRow key={`${item.cartItemId}:${item.quantity}`} item={item} disabled={disabled} />)}</div>
    <footer className="flex justify-between gap-4 border-t border-border/60 py-4 text-sm"><span className="text-muted-foreground">{t("sellerSubtotal")}</span><strong><CartMoney amount={group.productsSubtotal} currency={currency} /></strong></footer>
  </section>;
}
