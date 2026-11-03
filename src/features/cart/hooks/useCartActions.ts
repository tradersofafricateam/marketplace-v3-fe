"use client";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { useStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { clearCart, removeCartItem, updateCartItem } from "../api";
import { validCartQuantity } from "../helpers/cartRules";

type Action = { type: "update"; id: string; quantity: number } | { type: "remove"; id: string } | { type: "clear" };
export function useCartActions() {
  const t = useTranslations("CartPage");
  const userId = useStore((state) => state.currentUser?.id);
  return useMutation({
    mutationKey: ["cart-actions", userId],
    mutationFn: async (action: Action) => {
      if (!userId || useStore.getState().currentUser?.id !== userId) throw new Error("Session changed.");
      if (action.type === "clear") return clearCart();
      if (action.type === "remove") return removeCartItem(action.id);
      const item = useCartStore.getState().cart?.sellerGroups.flatMap((group) => group.items).find((item) => item.cartItemId === action.id);
      if (!item || !validCartQuantity(action.quantity, item)) throw new Error("Invalid quantity.");
      return updateCartItem(action.id, action.quantity);
    },
    retry: false,
    onSuccess: async (_, action) => {
      if (useStore.getState().currentUser?.id !== userId) return;
      toast.success(t(action.type === "clear" ? "cleared" : action.type === "remove" ? "removed" : "updated"));
      await useCartStore.getState().fetchCart({ force: true });
    },
    onError: (error) => {
      if (useStore.getState().currentUser?.id !== userId) return;
      promiseErrorFunction(error, t("actionError"));
      if (useStore.getState().currentUser?.id === userId) void useCartStore.getState().fetchCart({ force: true });
    },
  });
}
