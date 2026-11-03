"use client";
import { useState, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import { useStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { cartRevision, canCheckout } from "@/features/cart/helpers/cartRules";
import type { CartData } from "@/features/cart/types";
import * as api from "../api";
import type { AddressInput, DeliverySelection, CheckoutSession } from "../types";
import { deliveryIsComplete, quoteIsValid } from "../helpers/checkoutRules";

export function useCheckout(cart: CartData) {
  const userId = useStore((state) => state.currentUser?.id);
  const locale = useLocale();
  const t = useTranslations("Checkout");
  const client = useQueryClient();
  const [chosenAddress, setAddress] = useState("");
  const [selections, setSelections] = useState<DeliverySelection[]>([]);
  const [stage, setStage] = useState<"delivery" | "payment" | "review">("delivery");
  const [paymentCode, setPaymentCode] = useState("");
  const [session, setSession] = useState<CheckoutSession>();
  const confirming = useRef(false);
  const [notes, setNotes] = useState("");
  const [revision, setRevision] = useState(0);
  const base = ["checkout", userId, locale] as const;
  const addresses = useQuery({ queryKey: [...base, "addresses"], queryFn: ({ signal }) => api.getAddresses(signal), enabled: Boolean(userId), staleTime: 0 });
  const addressId = chosenAddress || addresses.data?.find((address) => address.isDefault)?.id || "";
  const options = useQuery({ queryKey: [...base, "options", addressId, cartRevision(cart), revision], queryFn: ({ signal }) => api.getDeliveryOptions(addressId, signal), enabled: Boolean(userId && addressId && canCheckout(cart)) && !session, retry: false, gcTime: 0, staleTime: Infinity, refetchOnWindowFocus: false });
  const methods = useQuery({ queryKey: [...base, "methods", addressId, revision], queryFn: ({ signal }) => api.getPaymentMethods(signal), enabled: Boolean(userId && stage !== "delivery" && !session), retry: false, staleTime: 0 });
  const preview = useQuery({ queryKey: [...base, "preview", addressId, paymentCode, revision], queryFn: ({ signal }) => api.getCheckoutPreview(signal), enabled: Boolean(userId && stage === "review" && paymentCode && !session), retry: false, staleTime: 0 });
  const active = () => {
    if (!userId || useStore.getState().currentUser?.id !== userId) throw new Error("Session changed.");
  };
  const error = (error: unknown) => { if (useStore.getState().currentUser?.id === userId) promiseErrorFunction(error, t("actionError")); };
  const newAddress = useMutation({ mutationFn: (payload: AddressInput) => { active(); return api.addAddress(payload); }, retry: false, onSuccess: async (address) => {
    active(); setAddress(address.id); setStage("delivery"); setSelections([]); setPaymentCode("");
    await client.invalidateQueries({ queryKey: [...base, "addresses"] }); toast.success(t("addressAdded"));
  }, onError: error });
  const saveDelivery = useMutation({ mutationFn: async () => {
    active();
    if (!deliveryIsComplete(options.data, selections, cart.sellerGroups.map((group) => group.sellerId))) throw new Error("Delivery selection is incomplete or expired.");
    return api.selectDelivery(selections);
  }, retry: false, onSuccess: () => { active(); setStage("payment"); toast.success(t("deliverySaved")); }, onError: (failure) => {
    error(failure); setSelections([]); setRevision((value) => value + 1);
  } });
  const provider = useMutation({ mutationFn: (id: string) => { active(); return api.applyProvider(id); }, retry: false, onSuccess: (result, providerId) => {
    active();
    setSelections((previous) => {
      const next = previous.filter((selection) => !result.appliedSellerGroups.includes(selection.sellerId));
      for (const group of options.data?.sellerGroups ?? []) {
        const quote = group.integratedOptions.find((quote) => quote.providerId === providerId && quoteIsValid(quote.expiresAt));
        if (quote && result.appliedSellerGroups.includes(group.sellerId)) next.push({ sellerId: group.sellerId, type: "integrated_logistics", quoteId: quote.quoteId });
      }
      return next;
    });
    toast.success(t(result.unavailableSellerGroups.length ? "providerPartial" : "providerApplied"));
  }, onError: error });
  const payment = useMutation({ mutationFn: async (code: string) => {
    active(); if (!methods.data?.some((method) => method.code === code)) throw new Error("Invalid payment method.");
    return api.selectPayment(code);
  }, retry: false, onSuccess: (_, code) => { active(); setPaymentCode(code); setStage("review"); }, onError: error });
  const confirm = useMutation({ mutationFn: async () => {
    active();
    if (session || !preview.data || preview.isFetching || !canCheckout(cart) || !deliveryIsComplete(options.data, selections, cart.sellerGroups.map((group) => group.sellerId))) throw new Error("Please review checkout again.");
    if (confirming.current) throw new Error("Checkout is already being created.");
    confirming.current = true;
    try { return await api.createCheckout(notes); } catch (failure) { confirming.current = false; throw failure; }
  }, retry: false, onSuccess: (created) => { active(); setSession(created); toast.success(t("created")); }, onError: (failure) => {
    if (useStore.getState().currentUser?.id !== userId) return;
    error(failure); setStage("delivery"); setSelections([]); setPaymentCode(""); setRevision((value) => value + 1);
    void useCartStore.getState().fetchCart({ force: true });
  } });
  const busy = newAddress.isPending || saveDelivery.isPending || provider.isPending || payment.isPending || confirm.isPending;
  const resetDelivery = () => { setStage("delivery"); setSelections([]); setPaymentCode(""); setRevision((value) => value + 1); };
  return { addresses, addressId, options, selections, stage, methods, preview, notes, setNotes, session, busy, paymentCode,
    chooseAddress: (id: string) => { if (id !== addressId) { setAddress(id); resetDelivery(); } },
    chooseDelivery: (selection: DeliverySelection) => setSelections((previous) => [...previous.filter((value) => value.sellerId !== selection.sellerId), selection]),
    newAddress, saveDelivery, provider, payment, confirm, resetDelivery,
    editDelivery: () => setStage("delivery"),
    editPayment: () => setStage("payment"),
  };
}
