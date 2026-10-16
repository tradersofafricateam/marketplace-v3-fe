"use client";
import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2, LoaderCircle, ArrowLeft } from "lucide-react";
import Container from "@/components/atoms/Container/Container";
import { useStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { canCheckout, cartRevision } from "@/features/cart/helpers/cartRules";
import type { CartData } from "@/features/cart/types";
import CartSkeleton from "@/features/cart/components/organisms/CartSkeleton/CartSkeleton";
import CartMoney from "@/features/cart/components/atoms/CartMoney/CartMoney";
import { useQuoteClock } from "../../../hooks/useQuoteClock";
import { useCheckout } from "../../../hooks/useCheckout";
import { deliveryIsComplete } from "../../../helpers/checkoutRules";
import AddressForm from "../../molecules/AddressForm/AddressForm";
import DeliveryChoices from "../../organisms/DeliveryChoices/DeliveryChoices";
import CheckoutReview from "../../organisms/CheckoutReview/CheckoutReview";

export default function CheckoutTemplate() {
  const t = useTranslations("Checkout");
  const { routes } = useGetAllRoutes();
  const userId = useStore((state) => state.currentUser?.id);
  const initialized = useStore((state) => state.isAuthInitialized);
  const cart = useCartStore((state) => state.cart);
  const error = useCartStore((state) => state.error);
  const loading = useCartStore((state) => state.isLoading);
  const fetchCart = useCartStore((state) => state.fetchCart);
  if (!initialized || (userId && !cart && !error)) return <CartSkeleton />;
  if (!userId || !cart || error || !canCheckout(cart)) return <Container className="py-20 text-center"><h1 className="text-2xl font-bold">{t(!userId ? "signIn" : error ? "loadError" : "reviewCart")}</h1><div className="mt-6 flex justify-center gap-5">{error && <button type="button" disabled={loading} onClick={() => void fetchCart({ force: true })} className="text-(--orange) underline">{t("retry")}</button>}<Link href={userId ? routes.cart : `${routes.login}?${new URLSearchParams({ returnUrl: routes.checkout })}`} className="font-semibold text-(--orange) underline">{t(userId ? "backCart" : "signIn")}</Link></div></Container>;
  return <CheckoutFlow key={`${userId}:${cartRevision(cart)}`} cart={cart} />;
}
function CheckoutFlow({ cart }: { cart: CartData }) {
  const t = useTranslations("Checkout");
  const { routes } = useGetAllRoutes();
  const locale = useLocale();
  const checkout = useCheckout(cart);
  const [addingAddress, setAddingAddress] = useState(false);
  const { addresses, addressId, options, selections, stage, methods, preview, busy, session } = checkout;
  const now = useQuoteClock(options.data);
  const complete = deliveryIsComplete(options.data, selections, cart.sellerGroups.map((group) => group.sellerId), now);
  const retry = (callback: () => void) => <button type="button" disabled={busy} onClick={callback} className="font-semibold text-(--orange) underline">{t("retry")}</button>;
  if (session) return <Container className="py-16 xl:px-14"><div className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-border bg-background p-8 text-center"><CheckCircle2 className="mx-auto text-green-600" size={48} /><h1 className="text-2xl font-bold">{t("created")}</h1><p className="text-sm text-muted-foreground">{t("sessionNote")}</p><p className="break-all text-sm">{t("reference")}: {session.checkoutId}</p><p className="text-2xl font-bold"><CartMoney amount={session.totalAmount} currency={session.currency} /></p><p className="text-sm">{t("expires")}: <time dateTime={session.expiresAt}>{new Date(session.expiresAt).toLocaleString(locale)}</time></p><Link href={routes.cart} className="inline-block text-sm font-semibold text-(--orange) underline">{t("backCart")}</Link></div></Container>;
  return <Container className="py-8 sm:py-12 xl:px-14"><Link href={routes.cart} className="mb-7 inline-flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft size={15} />{t("backCart")}</Link><h1 className="heading-font text-3xl font-bold">{t("title")}</h1><p className="mb-8 mt-3 text-sm text-muted-foreground">{t("intro")}</p>
    <ol className="mb-8 flex flex-wrap gap-4 text-xs font-semibold">{["address", "delivery", "payment", "review"].map((name, index) => <li key={name} className="flex items-center gap-2"><span className="flex size-6 items-center justify-center rounded-full bg-(--orange-light) text-(--orange)">{index + 1}</span>{t(name)}</li>)}</ol>
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-6">
        <section className="space-y-4 rounded-2xl border border-border bg-background p-5 sm:p-6"><h2 className="text-lg font-bold">1. {t("address")}</h2>
          {addresses.isPending ? <p role="status">{t("loading")}</p> : addresses.isError ? <div role="alert">{t("loadError")} {retry(() => void addresses.refetch())}</div> : <fieldset disabled={busy || stage !== "delivery"} className="space-y-3">
            {addresses.data?.map((address) => <label key={address.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${address.id === addressId ? "border-(--orange) bg-(--orange-light)/30" : "border-border"}`}><input type="radio" name="address" checked={address.id === addressId} onChange={() => checkout.chooseAddress(address.id)} className="mt-1 accent-(--orange)" /><span className="text-sm"><strong>{address.label} {address.isDefault && <span className="ml-2 text-xs text-(--orange)">{t("default")}</span>}</strong><span className="mt-1 block">{address.recipientName} · {address.phoneNumber}</span><span className="mt-1 block text-muted-foreground">{[address.addressLine1, address.addressLine2, address.city, address.state, address.country].filter(Boolean).join(", ")}</span></span></label>)}
            {!addingAddress && <button type="button" onClick={() => setAddingAddress(true)} className="text-sm font-semibold text-(--orange)">+ {t("addAddress")}</button>}
          </fieldset>}
          {addingAddress && stage === "delivery" && <AddressForm busy={busy} onCancel={() => setAddingAddress(false)} onSave={(address) => checkout.newAddress.mutate(address, { onSuccess: () => setAddingAddress(false) })} />}
          {stage !== "delivery" && <button type="button" disabled={busy} onClick={checkout.resetDelivery} className="text-sm font-semibold text-(--orange)">{t("change")}</button>}
        </section>
        <section className="space-y-4 rounded-2xl border border-border bg-background p-5 sm:p-6"><h2 className="text-lg font-bold">2. {t("delivery")}</h2>
          {!addressId ? <p className="text-sm text-muted-foreground">{t("selectAddress")}</p> : options.isPending || options.isFetching ? <p role="status" className="text-sm">{t("loadingDelivery")}</p> : options.isError ? <div role="alert" className="text-sm">{t("loadError")} {retry(checkout.resetDelivery)}</div> : options.data && <DeliveryChoices now={now} options={options.data} selections={selections} disabled={busy || stage !== "delivery"} onSelect={checkout.chooseDelivery} onApply={(id) => checkout.provider.mutate(id)} onRefresh={checkout.resetDelivery} />}
          {stage === "delivery" && <button type="button" disabled={busy || !complete || options.isFetching} onClick={() => checkout.saveDelivery.mutate()} className="rounded-xl bg-(--orange) px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{t("continuePayment")}</button>}
        </section>
        {stage !== "delivery" && <section className="space-y-4 rounded-2xl border border-border bg-background p-5 sm:p-6"><h2 className="text-lg font-bold">3. {t("payment")}</h2>{methods.isPending ? <p role="status">{t("loading")}</p> : methods.isError ? <div role="alert">{t("loadError")} {retry(() => void methods.refetch())}</div> : stage === "payment" ? <div className="space-y-3">{methods.data?.length === 0 && <p role="alert" className="text-sm">{t("noPayment")}</p>}{methods.data?.map((method) => <button key={method.code} type="button" disabled={busy || methods.isFetching} onClick={() => checkout.payment.mutate(method.code)} className="block w-full rounded-xl border border-border p-4 text-left text-sm font-semibold transition hover:border-(--orange) disabled:opacity-50">{method.name}</button>)}</div> : <div className="flex justify-between gap-4 text-sm"><span>{preview.data?.paymentMethod?.name}</span><button type="button" disabled={busy} onClick={checkout.editPayment} className="font-semibold text-(--orange)">{t("change")}</button></div>}</section>}
        {stage === "review" && <section className="space-y-5 rounded-2xl border border-border bg-background p-5 sm:p-6"><h2 className="text-lg font-bold">4. {t("review")}</h2>{preview.isPending || preview.isFetching ? <p role="status">{t("loading")}</p> : preview.isError ? <div role="alert">{t("loadError")} {retry(() => void preview.refetch())}</div> : preview.data && <><CheckoutReview preview={preview.data} /><label className="block text-sm font-semibold">{t("notes")}<textarea value={checkout.notes} onChange={(event) => checkout.setNotes(event.target.value)} maxLength={1000} disabled={busy} rows={3} className="mt-2 block w-full resize-y rounded-xl border border-border bg-background p-3 font-normal" /></label><button type="button" disabled={busy || !complete || preview.isFetching} onClick={() => checkout.confirm.mutate()} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-(--orange) px-6 py-3 text-sm font-bold text-white disabled:opacity-50">{busy && <LoaderCircle className="animate-spin" size={16} />}{t("confirm")}</button><p className="text-xs leading-5 text-muted-foreground">{t("confirmNote")}</p></>}</section>}
      </div>
      <aside className="space-y-4 rounded-2xl border border-border bg-background p-6 lg:sticky lg:top-6"><h2 className="text-lg font-bold">{t("summary")}</h2><div className="flex justify-between text-sm"><span>{t("products")}</span><CartMoney amount={stage === "review" && preview.data ? preview.data.summary.productsTotal : cart.productsSubtotal} currency={stage === "review" && preview.data ? preview.data.summary.currency : cart.currency} /></div><p className="text-xs leading-5 text-muted-foreground">{t("summaryNote")}</p>{stage === "review" && preview.data && <div className="flex justify-between border-t border-border pt-4 font-bold"><span>{t("total")}</span><CartMoney amount={preview.data.summary.totalAmount} currency={preview.data.summary.currency} /></div>}</aside>
    </div>
  </Container>;
}
