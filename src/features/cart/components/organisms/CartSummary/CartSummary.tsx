"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { purchasePrimary } from "@/lib/constants/purchaseStyles";
import type { CartData } from "../../../types";
import CartMoney from "../../atoms/CartMoney/CartMoney";

export default function CartSummary({ cart, disabled }: { cart: CartData; disabled: boolean }) {
  const t = useTranslations("CartPage");
  const { routes } = useGetAllRoutes();
  const action = (mobile = false) => disabled
    ? <button disabled className={`${purchasePrimary} ${mobile ? "w-full px-4! text-xs!" : "w-full"}`}>{t("checkout")}</button>
    : <Link href={routes.checkout} className={`${purchasePrimary} ${mobile ? "w-full px-4! text-xs!" : "w-full"}`}>{t("checkout")}<ArrowRight size={16} aria-hidden="true" /></Link>;
  return <>
    <aside className="space-y-5 rounded-2xl bg-brand-subtle/45 p-5 sm:p-6 lg:sticky lg:top-48">
      <h2 className="heading-font text-lg font-medium">{t("summary")}</h2>
      <div className="flex items-start justify-between gap-4 text-sm"><span className="text-muted-foreground">{t("itemCount", { count: cart.totalCount })}</span><span className="text-muted-foreground">{t("sellerCount", { count: cart.sellerGroups.length })}</span></div>
      <div className="border-y border-border/70 py-4"><p className="text-sm font-semibold">{t("deliveryAtCheckout")}</p><p className="mt-1.5 text-xs leading-5 text-muted-foreground">{t("deliveryNote")}</p></div>
      <div className="flex flex-wrap items-baseline justify-between gap-2"><span className="text-sm font-semibold">{t("subtotal")} <span className="text-xs font-normal text-muted-foreground">({cart.currency})</span></span><strong className="text-xl tracking-tight"><CartMoney amount={cart.productsSubtotal} currency={cart.currency} /></strong></div>
      <div className="hidden sm:block">{action()}</div>
      <p className="text-xs leading-5 text-muted-foreground">{t("validationNote")}</p>
    </aside>
    <div data-mobile-cart-action className="fixed inset-x-0 bottom-0 z-30 space-y-2 border-t border-border bg-background px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-overlay sm:hidden"><div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1"><p className="text-[0.6875rem] text-muted-foreground">{t("subtotal")}</p><p className="text-sm font-bold"><CartMoney amount={cart.productsSubtotal} currency={cart.currency} /></p></div>{action(true)}</div>
  </>;
}
