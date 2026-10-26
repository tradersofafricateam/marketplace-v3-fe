"use client";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import type { CartData } from "../../../types";
import CartMoney from "../../atoms/CartMoney/CartMoney";
export default function CartSummary({ cart, disabled }: { cart: CartData; disabled: boolean }) {
  const t = useTranslations("CartPage");
  const { routes } = useGetAllRoutes();
  return <aside className="space-y-5 rounded-2xl border border-border bg-background p-6 lg:sticky lg:top-6">
    <h2 className="text-lg font-bold">{t("summary")}</h2>
    <div className="flex justify-between gap-3 text-sm"><span className="text-muted-foreground">{t("itemCount", { count: cart.totalCount })}</span><span><CartMoney amount={cart.productsSubtotal} currency={cart.currency} /></span></div>
    <div className="flex items-start gap-2 text-xs leading-5 text-muted-foreground"><Truck size={16} className="mt-0.5 shrink-0" />{t("deliveryNote")}</div>
    <div className="flex justify-between gap-3 border-t border-border pt-5"><strong>{t("subtotal")}</strong><strong><CartMoney amount={cart.productsSubtotal} currency={cart.currency} /></strong></div>
    {disabled ? <button disabled className="w-full rounded-xl bg-(--orange) p-3 text-sm font-bold text-white opacity-50">{t("checkout")}</button> : <Link href={routes.checkout} className="flex items-center justify-center gap-2 rounded-xl bg-(--orange) p-3 text-sm font-bold text-white hover:bg-(--orange-dark)">{t("checkout")}<ArrowRight size={16} /></Link>}
    <p className="flex items-start gap-2 text-xs leading-5 text-muted-foreground"><ShieldCheck size={17} className="shrink-0" />{t("validationNote")}</p>
  </aside>;
}
