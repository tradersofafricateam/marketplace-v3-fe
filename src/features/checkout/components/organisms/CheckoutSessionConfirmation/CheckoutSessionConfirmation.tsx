"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { Check, ChevronLeft } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Container from "@/components/atoms/Container/Container";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { purchaseBack } from "@/lib/constants/purchaseStyles";
import CartMoney from "@/features/cart/components/atoms/CartMoney/CartMoney";
import type { CheckoutSession } from "../../../types";

export default function CheckoutSessionConfirmation({ session }: { session: CheckoutSession }) {
  const t = useTranslations("Checkout");
  const locale = useLocale();
  const { routes } = useGetAllRoutes();
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); window.scrollTo({ top: 0, behavior: "instant" }); }, []);
  return <div className="bg-brand-subtle/20"><Container className="py-10 sm:py-16 xl:px-14"><section aria-labelledby="session-heading" className="mx-auto max-w-2xl">
    <div className="mb-5 flex size-11 items-center justify-center rounded-full bg-brand-subtle text-brand"><Check size={24} strokeWidth={1.5} aria-hidden="true" /></div>
    <p className="mb-2 text-xs font-semibold text-brand-hover">{t("paymentPending")}</p>
    <h1 id="session-heading" tabIndex={-1} ref={heading} className="outline-none heading-font text-2xl font-medium tracking-tight sm:text-3xl">{t("created")}</h1>
    <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground">{t("sessionNote")}</p>
    <dl className="my-8 divide-y divide-border border-y border-border"><div className="grid gap-2 py-5 sm:grid-cols-[11rem_minmax(0,1fr)]"><dt className="text-sm text-muted-foreground">{t("reference")}</dt><dd className="break-all text-sm font-semibold select-all">{session.checkoutId}</dd></div><div className="grid items-baseline gap-2 py-5 sm:grid-cols-[11rem_minmax(0,1fr)]"><dt className="text-sm text-muted-foreground">{t("platformTotal")} ({session.currency})</dt><dd className="text-2xl font-bold tracking-tight"><CartMoney amount={session.totalAmount} currency={session.currency} /></dd></div><div className="grid gap-2 py-5 sm:grid-cols-[11rem_minmax(0,1fr)]"><dt className="text-sm text-muted-foreground">{t("expires")}</dt><dd className="text-sm font-medium"><time dateTime={session.expiresAt}>{new Date(session.expiresAt).toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" })}</time></dd></div></dl>
    <p className="mb-6 rounded-xl bg-brand-subtle/50 p-4 text-xs leading-6 text-muted-foreground">{t("sessionPendingNote")}</p>
    <Link href={routes.cart} className={purchaseBack}><ChevronLeft size={18} aria-hidden="true" />{t("backCart")}</Link>
  </section></Container></div>;
}
