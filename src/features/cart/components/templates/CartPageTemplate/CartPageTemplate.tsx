"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { useIsMutating } from "@tanstack/react-query";
import { ShoppingBag, ChevronLeft, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import Container from "@/components/atoms/Container/Container";
import { useStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { purchaseBack, purchaseColumns, purchasePrimary, purchaseText } from "@/lib/constants/purchaseStyles";
import { canCheckout } from "../../../helpers/cartRules";
import CartSellerSection from "../../organisms/CartSellerSection/CartSellerSection";
import CartSummary from "../../organisms/CartSummary/CartSummary";
import CartSkeleton from "../../organisms/CartSkeleton/CartSkeleton";
import ClearCartDialog from "../../molecules/ClearCartDialog/ClearCartDialog";

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
  const pending = useIsMutating({ mutationKey: ["cart-actions", user?.id] }) > 0;
  const clearing = useIsMutating({ mutationKey: ["cart-actions", user?.id], predicate: (mutation) => (mutation.state.variables as { type?: string })?.type === "clear" }) > 0;
  const emptyHeading = useRef<HTMLHeadingElement>(null);
  const previousCount = useRef(cart?.totalCount ?? 0);
  useEffect(() => {
    if (previousCount.current > 0 && cart?.totalCount === 0) emptyHeading.current?.focus();
    previousCount.current = cart?.totalCount ?? 0;
  }, [cart?.totalCount]);
  if (!initialized || (user && !loaded && !error)) return <CartSkeleton />;
  return <div className="bg-brand-subtle/20"><Container className="pt-5 pb-[calc(7rem+env(safe-area-inset-bottom))] sm:pb-14 sm:pt-7 xl:px-14">
    <Link href={routes.products} className={`${purchaseBack} mb-3`}><ChevronLeft size={18} aria-hidden="true" />{t("continueShopping")}</Link>
    <header className="mb-8 flex flex-wrap items-end justify-between gap-3"><div><div className="flex flex-wrap items-baseline gap-3"><h1 className="heading-font text-3xl font-medium tracking-tight">{t("title")}</h1>{cart && cart.totalCount > 0 && <span className="text-sm text-muted-foreground">{t("itemCount", { count: cart.totalCount })}</span>}</div><p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">{t("subtitle")}</p></div>{cart && cart.totalCount > 0 && user && <ClearCartDialog disabled={pending || loading} />}</header>
    {!user ? <div className="mx-auto max-w-lg py-14 text-center"><ShoppingBag className="mx-auto mb-5 text-brand" size={32} strokeWidth={1.4} aria-hidden="true" /><h2 className="heading-font text-xl font-medium">{t("signInTitle")}</h2><p className="my-4 text-sm leading-6 text-muted-foreground">{t("signInNote")}</p><Link href={`${routes.login}?${new URLSearchParams({ returnUrl: routes.cart })}`} className={purchasePrimary}>{t("signIn")}</Link></div> : <>
      {error && <div role="alert" className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-brand-subtle p-4 text-sm"><p>{t("loadError")}</p><button type="button" disabled={loading} onClick={() => void fetchCart({ force: true })} className={purchaseText}>{t("retry")}</button></div>}
      {cart && cart.totalCount > 0 ? <div className={purchaseColumns}><div className="min-w-0 space-y-7">{!canCheckout(cart) && <p role="alert" className="rounded-xl border-l-2 border-destructive bg-background p-4 text-sm leading-6 text-destructive">{t("reviewItems")}</p>}{loading && <p role="status" className="flex items-center gap-2 text-xs text-muted-foreground"><LoaderCircle size={13} className="animate-spin motion-reduce:animate-none" />{t("refreshing")}</p>}{cart.sellerGroups.map((group) => <CartSellerSection key={group.sellerId} group={group} currency={cart.currency} disabled={clearing || Boolean(error)} />)}</div><CartSummary cart={cart} disabled={pending || loading || Boolean(error) || !canCheckout(cart)} /></div> : !error && <div className="mx-auto max-w-lg py-14 text-center"><ShoppingBag size={36} strokeWidth={1.3} className="mx-auto mb-5 text-brand" aria-hidden="true" /><h2 ref={emptyHeading} tabIndex={-1} className="heading-font text-xl font-medium outline-none">{t("emptyTitle")}</h2><p className="my-4 text-sm leading-6 text-muted-foreground">{t("emptyNote")}</p><Link href={routes.products} className={purchasePrimary}>{t("browse")}</Link></div>}
    </>}
  </Container></div>;
}
