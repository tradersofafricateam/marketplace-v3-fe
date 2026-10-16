"use client";
import { useCallback, useState } from "react";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import Container from "@/components/atoms/Container/Container";
import { useStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { useCartActions } from "../../../hooks/useCartActions";
import { canCheckout } from "../../../helpers/cartRules";
import CartSellerSection from "../../organisms/CartSellerSection/CartSellerSection";
import CartSummary from "../../organisms/CartSummary/CartSummary";
import CartSkeleton from "../../organisms/CartSkeleton/CartSkeleton";

export default function CartPageTemplate() {
  const t = useTranslations("CartPage");
  const { routes } = useGetAllRoutes();
  const user = useStore((state) => state.currentUser);
  const initialized = useStore((state) => state.isAuthInitialized);
  const cart = useCartStore((state) => state.cart);
  const loading = useCartStore((state) => state.isLoading);
  const loaded = useCartStore((state) => state.isLoaded);
  const error = useCartStore((state) => state.error);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const [confirmClear, setConfirmClear] = useState(false);
  const { mutate, isPending } = useCartActions();
  const update = useCallback((id: string, quantity: number) => mutate({ type: "update", id, quantity }), [mutate]);
  const remove = useCallback((id: string) => mutate({ type: "remove", id }), [mutate]);
  if (!initialized || (user && !loaded && !error)) return <CartSkeleton />;
  return <Container className="py-8 sm:py-12 xl:px-14">
    <Link href={routes.products} className="mb-7 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-(--orange)"><ArrowLeft size={15} />{t("continueShopping")}</Link>
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-xs font-bold uppercase tracking-widest text-(--orange)">TOFA Marketplace</p><h1 className="heading-font text-3xl font-bold sm:text-4xl">{t("title")}</h1><p className="mt-3 text-sm text-muted-foreground">{t("subtitle")}</p></div>{cart && cart.totalCount > 0 && <button type="button" disabled={isPending || loading} onClick={() => setConfirmClear(true)} className="text-sm text-muted-foreground underline disabled:opacity-50">{t("clear")}</button>}</header>
    {!user ? <div className="rounded-2xl border border-border bg-background px-6 py-16 text-center"><ShoppingBag className="mx-auto mb-4 text-(--orange)" size={40} /><h2 className="text-xl font-bold">{t("signInTitle")}</h2><p className="my-4 text-sm text-muted-foreground">{t("signInNote")}</p><Link href={`${routes.login}?${new URLSearchParams({ returnUrl: routes.cart })}`} className="inline-block rounded-xl bg-(--orange) px-6 py-3 text-sm font-bold text-white">{t("signIn")}</Link></div> : <>
      {error && <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-background p-4 text-sm"><p>{t("loadError")}</p><button type="button" disabled={loading} onClick={() => void fetchCart({ force: true })} className="inline-flex items-center gap-2 font-semibold text-(--orange)"><RefreshCw size={14} />{t("retry")}</button></div>}
      {confirmClear && <div role="group" aria-label={t("clearConfirm")} className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-background p-5"><p className="text-sm font-semibold">{t("clearConfirm")}</p><div className="flex gap-4"><button type="button" disabled={isPending} onClick={() => setConfirmClear(false)} className="text-sm underline">{t("cancel")}</button><button type="button" disabled={isPending} onClick={() => mutate({ type: "clear" }, { onSuccess: () => setConfirmClear(false) })} className="rounded-lg bg-destructive px-4 py-2 text-sm font-bold text-white">{t("clear")}</button></div></div>}
      {cart && cart.totalCount > 0 ? <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]" aria-busy={isPending || loading}><div className="space-y-6">{!canCheckout(cart) && <p role="alert" className="rounded-xl border border-destructive/30 bg-background p-4 text-sm text-destructive">{t("reviewItems")}</p>}{cart.sellerGroups.map((group) => <CartSellerSection key={group.sellerId} group={group} currency={cart.currency} disabled={isPending || loading || Boolean(error)} onUpdate={update} onRemove={remove} />)}</div><CartSummary cart={cart} disabled={isPending || loading || Boolean(error) || !canCheckout(cart)} /></div> : !error && <div className="rounded-2xl border border-dashed border-border bg-background px-6 py-20 text-center"><ShoppingBag size={48} strokeWidth={1.5} className="mx-auto mb-5 text-(--orange)" /><h2 className="text-xl font-bold">{t("emptyTitle")}</h2><p className="mx-auto mb-7 mt-3 max-w-md text-sm text-muted-foreground">{t("emptyNote")}</p><Link href={routes.products} className="inline-block rounded-xl bg-(--orange) px-6 py-3 text-sm font-bold text-white">{t("browse")}</Link></div>}
    </>}
  </Container>;
}
