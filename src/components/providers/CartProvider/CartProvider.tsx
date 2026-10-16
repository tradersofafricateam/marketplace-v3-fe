"use client";

import { useEffect } from "react";
import { useStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

/** Keep the global cart synchronized with authentication, including account switches. */
export default function CartProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const sync = () => {
      const auth = useStore.getState();
      const userId = auth.isAuthInitialized ? auth.currentUser?.id ?? null : null;
      const cart = useCartStore.getState();
      const changed = cart.userId !== userId;
      cart.setAccount(userId);
      if (userId && (changed || !cart.isLoaded)) void useCartStore.getState().fetchCart();
    };
    const unsubscribe = useStore.subscribe((state, previous) => {
      if (state.currentUser?.id !== previous.currentUser?.id || state.isAuthInitialized !== previous.isAuthInitialized) sync();
    });
    sync();
    return unsubscribe;
  }, []);

  return children;
}
