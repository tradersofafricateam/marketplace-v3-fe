"use client";
import { memo } from "react";
import { Store } from "lucide-react";
import { useTranslations } from "next-intl";
import type { CartSellerGroup } from "../../../types";
import CartItemRow from "../../molecules/CartItemRow/CartItemRow";
import CartMoney from "../../atoms/CartMoney/CartMoney";
function CartSellerSection({ group, currency, disabled, onUpdate, onRemove }: { group: CartSellerGroup; currency: string; disabled: boolean; onUpdate: (id: string, quantity: number) => void; onRemove: (id: string) => void }) {
  const t = useTranslations("CartPage");
  return <section className="overflow-hidden rounded-2xl border border-border bg-background">
    <header className="flex items-center justify-between gap-4 border-b border-border bg-muted/25 px-5 py-4"><h2 className="flex items-center gap-2 font-bold"><Store size={18} className="text-(--orange)" />{group.storeName}</h2><span className="text-xs text-muted-foreground">{t("itemCount", { count: group.itemsCount })}</span></header>
    <div className="divide-y divide-border px-5">{group.items.map((item) => <CartItemRow key={`${item.cartItemId}:${item.quantity}`} item={item} disabled={disabled} onUpdate={onUpdate} onRemove={onRemove} />)}</div>
    <footer className="flex justify-between gap-4 border-t border-border px-5 py-4 text-sm"><span className="text-muted-foreground">{t("sellerSubtotal")}</span><strong><CartMoney amount={group.productsSubtotal} currency={currency} /></strong></footer>
  </section>;
}
export default memo(CartSellerSection);
