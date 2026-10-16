import { create } from "zustand";
import { getCart, type CartData } from "@/features/cart/api";

interface CartStoreState {
  cart: CartData | null;
  userId: string | null;
  isLoading: boolean;
  isLoaded: boolean;
  error: string | null;
  setAccount: (userId: string | null) => void;
  fetchCart: (options?: { force?: boolean }) => Promise<void>;
}

/** Session-only state; never persist one account's cart in browser storage. */
export const useCartStore = create<CartStoreState>()((set, get) => {
  let controller: AbortController | undefined;
  let pending: Promise<void> | undefined;

  return {
    cart: null,
    userId: null,
    isLoading: false,
    isLoaded: false,
    error: null,
    setAccount: (userId) => {
      if (get().userId === userId) return;
      controller?.abort();
      controller = undefined;
      pending = undefined;
      set({ userId, cart: null, isLoading: false, isLoaded: false, error: null });
    },
    fetchCart: (options = {}) => {
      const userId = get().userId;
      if (!userId) return Promise.resolve();
      if (pending && !options.force) return pending;
      controller?.abort();
      const request = new AbortController();
      controller = request;
      set({ isLoading: true, error: null });
      pending = (async () => {
        try {
          const cart = await getCart(request.signal);
          if (controller !== request || get().userId !== userId) return;
          set({ cart, isLoaded: true, error: null });
        } catch (error) {
          if (controller !== request || get().userId !== userId || request.signal.aborted) return;
          set({ error: error instanceof Error ? error.message : "Could not load cart." });
        } finally {
          if (controller === request) {
            controller = undefined;
            pending = undefined;
            set({ isLoading: false });
          }
        }
      })();
      return pending;
    },
  };
});
