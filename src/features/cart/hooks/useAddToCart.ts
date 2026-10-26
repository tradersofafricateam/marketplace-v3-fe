"use client";

import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { useCartStore } from "@/store/cartStore";
import { useStore } from "@/store/authStore";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { promiseErrorFunction } from "@/lib/helpers/promiseError";
import { addCartItem, type AddCartItemPayload } from "../api";

export function useAddToCart() {
  const t = useTranslations("Cart");
  const userId = useStore((state) => state.currentUser?.id);
  const router = useRouter();
  const pathname = usePathname();
  const { routes } = useGetAllRoutes();
  const mutation = useMutation({
    mutationFn: addCartItem,
    retry: false,
    onSuccess: () => {
      if (useStore.getState().currentUser?.id !== userId) return;
      toast.success(t("added"));
      const cart = useCartStore.getState();
      cart.setAccount(userId ?? null);
      void cart.fetchCart({ force: true });
    },
    onError: (error) => promiseErrorFunction(error, t("addError")),
  });
  const addToCart = (payload: AddCartItemPayload) => {
    if (mutation.isPending) return;
    if (!userId) {
      router.push(`${routes.login}?${new URLSearchParams({ returnUrl: pathname })}`);
      return;
    }
    mutation.mutate(payload);
  };
  return { addToCart, isAdding: mutation.isPending };
}
