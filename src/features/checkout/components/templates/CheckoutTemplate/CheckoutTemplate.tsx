"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LoaderCircle, ChevronLeft, ArrowRight, Plus } from "lucide-react";
import Container from "@/components/atoms/Container/Container";
import { useStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { purchaseBack, purchaseInput, purchaseColumns, purchasePrimary, purchaseText } from "@/lib/constants/purchaseStyles";
import { canCheckout, cartRevision } from "@/features/cart/helpers/cartRules";
import type { CartData } from "@/features/cart/types";
import { useQuoteClock } from "../../../hooks/useQuoteClock";
import { useCheckout } from "../../../hooks/useCheckout";
import { deliveryIsComplete } from "../../../helpers/checkoutRules";
import type { CheckoutStep } from "../../../types";
import AddressForm from "../../molecules/AddressForm/AddressForm";
import CheckoutStepSkeleton from "../../molecules/CheckoutStepSkeleton/CheckoutStepSkeleton";
import CheckoutStepper from "../../molecules/CheckoutStepper/CheckoutStepper";
import AddressSelector from "../../organisms/AddressSelector/AddressSelector";
import CheckoutOrderSummary from "../../organisms/CheckoutOrderSummary/CheckoutOrderSummary";
import CheckoutSkeleton from "../../organisms/CheckoutSkeleton/CheckoutSkeleton";
import DeliveryChoices from "../../organisms/DeliveryChoices/DeliveryChoices";
import CheckoutSessionConfirmation from "../../organisms/CheckoutSessionConfirmation/CheckoutSessionConfirmation";
import PaymentMethodSelector from "../../organisms/PaymentMethodSelector/PaymentMethodSelector";
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
  if (!initialized || (userId && !cart && !error)) return <CheckoutSkeleton />;
  if (!userId || !cart || error || !canCheckout(cart)) return <Container className="py-20 text-center"><h1 className="heading-font text-2xl font-medium">{t(!userId ? "signIn" : error ? "loadError" : "reviewCart")}</h1><div className="mt-6 flex flex-wrap justify-center gap-5">{error && <button type="button" disabled={loading} onClick={() => void fetchCart({ force: true })} className={purchaseText}>{t("retry")}</button>}<Link href={userId ? routes.cart : `${routes.login}?${new URLSearchParams({ returnUrl: routes.checkout })}`} className={purchasePrimary}>{t(userId ? "backCart" : "signIn")}</Link></div></Container>;
  return <CheckoutFlow key={`${userId}:${cartRevision(cart)}`} cart={cart} />;
}
function CheckoutFlow({ cart }: { cart: CartData }) {
  const t = useTranslations("Checkout");
  const { routes } = useGetAllRoutes();
  const checkout = useCheckout(cart);
  const [addingAddress, setAddingAddress] = useState(false);
  // Presentation only: the existing checkout hook still owns delivery/payment/review.
  const [addressVisible, setAddressVisible] = useState(true);
  const { addresses, addressId, options, selections, stage, methods, preview, busy, session } = checkout;
  const step: CheckoutStep = stage === "delivery" ? addressVisible ? "address" : "delivery" : stage;
  const heading = useRef<HTMLHeadingElement>(null);
  const stepTop = useRef<HTMLDivElement>(null);
  const previousStep = useRef(step);
  useEffect(() => {
    if (previousStep.current !== step) {
      heading.current?.focus({ preventScroll: true });
      stepTop.current?.scrollIntoView({ block: "start", behavior: "instant" });
      previousStep.current = step;
    }
  }, [step]);
  const now = useQuoteClock(options.data);
  const complete = deliveryIsComplete(options.data, selections, cart.sellerGroups.map((group) => group.sellerId), now);
  const back = (target: CheckoutStep) => {
    if (busy) return;
    if (target === "address" || target === "delivery") { checkout.editDelivery(); setAddressVisible(target === "address"); setAddingAddress(false); }
    else if (target === "payment") checkout.editPayment();
  };
  const retry = (callback: () => void) => <button type="button" disabled={busy} onClick={callback} className={purchaseText}>{t("retry")}</button>;
  const loadingState = (label: string) => <CheckoutStepSkeleton step={step} label={label} />;
  if (session) return <CheckoutSessionConfirmation session={session} />;
  return <div className="bg-brand-subtle/20"><Container className="pt-5 pb-[max(3rem,env(safe-area-inset-bottom))] sm:pt-7 sm:pb-14 xl:px-14">
    <Link href={routes.cart} className={`${purchaseBack} mb-3`}><ChevronLeft size={18} aria-hidden="true" />{t("backCart")}</Link>
    <header className="mb-8"><h1 className="heading-font text-3xl font-medium tracking-tight">{t("title")}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{t("intro")}</p></header>
    <div className={purchaseColumns}>
      <div className="min-w-0">
        <div ref={stepTop} className="scroll-mt-40"><CheckoutStepper step={step} busy={busy} onBack={back} /></div>
        {checkout.confirm.isError && <p role="alert" className="mb-5 rounded-xl border-l-2 border-brand bg-brand-subtle p-4 text-sm leading-6">{t("sessionCreateError")}</p>}
        <section aria-labelledby="checkout-step-heading"><h2 id="checkout-step-heading" tabIndex={-1} ref={heading} className="heading-font scroll-mt-44 text-xl font-medium outline-none sm:text-2xl">{t(step)}</h2><p className="mb-6 mt-2 text-sm leading-6 text-muted-foreground">{t(`${step}Intro`)}</p>
          {step === "address" && <>
            {addresses.isPending ? loadingState(t("loading")) : addresses.isError ? <div role="alert" className="rounded-xl bg-brand-subtle p-4 text-sm">{t("loadError")} {retry(() => void addresses.refetch())}</div> : <>
              {!addingAddress && <><AddressSelector addresses={addresses.data || []} value={addressId} disabled={busy} onChange={checkout.chooseAddress} />{!addresses.data?.length && <p className="py-3 text-sm text-muted-foreground">{t("noAddresses")}</p>}<button type="button" disabled={busy} onClick={() => setAddingAddress(true)} className={`${purchaseText} mt-3`}><Plus size={16} aria-hidden="true" />{t("addAddress")}</button></>}
              {addingAddress && <AddressForm busy={checkout.newAddress.isPending} onCancel={() => setAddingAddress(false)} onSave={(address) => checkout.newAddress.mutate(address, { onSuccess: () => setAddingAddress(false) })} />}
              {checkout.newAddress.isError && <p role="alert" className="mt-3 text-sm text-destructive">{t("actionError")}</p>}
            </>}
            {!addingAddress && <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5"><Link href={routes.cart} className={purchaseBack}><ChevronLeft size={18} aria-hidden="true" />{t("backCart")}</Link><button type="button" disabled={busy || !addressId || addresses.isPending || addresses.isError} onClick={() => setAddressVisible(false)} className={`${purchasePrimary} max-sm:w-full`}>{t("continueDelivery")}<ArrowRight size={16} aria-hidden="true" /></button></div>}
          </>}
          {step === "delivery" && <>
            {options.isPending || options.isFetching ? loadingState(t("loadingDelivery")) : options.isError ? <div role="alert" className="rounded-xl bg-brand-subtle p-4 text-sm">{t("loadError")} {retry(checkout.resetDelivery)}</div> : options.data && <DeliveryChoices now={now} options={options.data} selections={selections} disabled={busy} onSelect={checkout.chooseDelivery} onApply={(id) => checkout.provider.mutate(id)} onRefresh={checkout.resetDelivery} onChangeAddress={() => back("address")} applyingProviderId={checkout.provider.isPending ? checkout.provider.variables : undefined} />}
            {checkout.saveDelivery.isError && <p role="alert" className="mt-4 text-sm text-destructive">{t("actionError")}</p>}
            <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5"><button type="button" disabled={busy} onClick={() => back("address")} className={purchaseBack}><ChevronLeft size={18} aria-hidden="true" />{t("address")}</button><button type="button" disabled={busy || !complete || options.isFetching} aria-busy={checkout.saveDelivery.isPending} onClick={() => checkout.saveDelivery.mutate()} className={`${purchasePrimary} max-sm:w-full`}>{checkout.saveDelivery.isPending && <LoaderCircle size={16} className="animate-spin motion-reduce:animate-none" />}{t(checkout.saveDelivery.isPending ? "saving" : "continuePayment")}</button></div>
          </>}
          {step === "payment" && <>
            {methods.isPending || methods.isFetching ? loadingState(t("loading")) : methods.isError ? <div role="alert" className="rounded-xl bg-brand-subtle p-4 text-sm">{t("loadError")} {retry(() => void methods.refetch())}</div> : <PaymentMethodSelector methods={methods.data || []} selectedCode={checkout.paymentCode} busy={busy} saving={checkout.payment.isPending} onSave={(code) => checkout.payment.mutate(code)} onBack={() => back("delivery")} />}
            {checkout.payment.isError && <p role="alert" className="mt-4 text-sm text-destructive">{t("actionError")}</p>}
          </>}
          {step === "review" && <>
            {preview.isPending || preview.isFetching ? loadingState(t("loading")) : preview.isError ? <div role="alert" className="text-sm">{t("loadError")} {retry(() => void preview.refetch())}</div> : preview.data && <>{!complete && <div role="alert" className="mb-5 rounded-xl bg-brand-subtle p-4 text-sm leading-6">{t("deliveryNeedsRefresh")}<button type="button" disabled={busy} onClick={() => { checkout.resetDelivery(); setAddressVisible(false); }} className={`${purchaseText} ml-2`}>{t("refreshQuotes")}</button></div>}<CheckoutReview preview={preview.data} cart={cart} disabled={busy} onChangeAddress={() => back("address")} onChangePayment={() => back("payment")} /><label className="mt-6 block text-sm font-semibold">{t("notes")}<textarea value={checkout.notes} onChange={(event) => checkout.setNotes(event.target.value)} maxLength={1000} disabled={busy} rows={3} className={`${purchaseInput} mt-2 block resize-y`} /></label><p className="mt-1 text-right text-[0.6875rem] text-muted-foreground">{t("noteCount", { count: checkout.notes.length })}</p><div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5"><button type="button" disabled={busy} onClick={() => back("payment")} className={purchaseBack}><ChevronLeft size={18} aria-hidden="true" />{t("payment")}</button><button type="button" disabled={busy || !complete || preview.isFetching} aria-busy={checkout.confirm.isPending} onClick={() => checkout.confirm.mutate()} className={`${purchasePrimary} max-sm:w-full`}>{checkout.confirm.isPending && <LoaderCircle size={16} className="animate-spin motion-reduce:animate-none" />}{t(checkout.confirm.isPending ? "creating" : "confirm")}</button></div><p className="mt-3 text-xs leading-5 text-muted-foreground">{t("confirmNote")}</p></>}
          </>}
        </section>
      </div>
      <CheckoutOrderSummary cart={cart} preview={stage === "review" && !preview.isFetching && !preview.isError ? preview.data : undefined} />
    </div>
  </Container></div>;
}
