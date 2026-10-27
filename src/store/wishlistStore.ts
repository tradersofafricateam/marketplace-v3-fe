import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface WishlistState {
  savedProductIds: string[];
  toggleProduct: (productId: string) => void;
}

/** Browser-local preferences, deliberately independent of authentication and APIs. */
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      savedProductIds: [],
      toggleProduct: (productId) =>
        set(({ savedProductIds }) => ({
          savedProductIds: savedProductIds.includes(productId)
            ? savedProductIds.filter((id) => id !== productId)
            : [...savedProductIds, productId],
        })),
    }),
    {
      name: "tofa-local-wishlist",
      version: 1,
      // Read storage after mount, keeping server and first client render identical.
      skipHydration: true,
      partialize: ({ savedProductIds }) => ({ savedProductIds }),
      storage: createJSONStorage(() => ({
        getItem: (name) => {
          try { return localStorage.getItem(name); } catch { return null; }
        },
        setItem: (name, value) => {
          // Keep the interaction usable in memory if browser storage is blocked/full.
          try { localStorage.setItem(name, value); } catch { /* Session-only fallback. */ }
        },
        removeItem: (name) => {
          try { localStorage.removeItem(name); } catch { /* Storage may be blocked. */ }
        },
      })),
      merge: (persisted, current) => {
        const ids = (persisted as Partial<WishlistState> | undefined)?.savedProductIds;
        return {
          ...current,
          savedProductIds: Array.isArray(ids)
            ? [...new Set(ids.filter((id): id is string => typeof id === "string"))]
            : [],
        };
      },
    },
  ),
);
