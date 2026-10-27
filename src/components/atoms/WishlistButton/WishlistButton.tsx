"use client";

import { useEffect } from "react";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";
import { useWishlistStore } from "@/store/wishlistStore";

export default function WishlistButton({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const t = useTranslations("ProductCatalogue");
  const saved = useWishlistStore((state) => state.savedProductIds.includes(productId));
  const toggleProduct = useWishlistStore((state) => state.toggleProduct);

  useEffect(() => {
    if (!useWishlistStore.persist.hasHydrated()) {
      void useWishlistStore.persist.rehydrate();
    }
  }, []);

  return (
    <button
      type="button"
      data-product-wishlist
      aria-pressed={saved}
      aria-label={t(saved ? "removeProductLocal" : "saveProductLocal", { name: productName })}
      title={t("localWishlistHint")}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleProduct(productId);
      }}
      className="absolute right-3 top-3 z-10 flex size-10 items-center justify-center rounded-full bg-background/95 text-foreground shadow-sm shadow-foreground/10 transition-colors duration-150 hover:bg-brand-subtle hover:text-brand focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 active:bg-brand-subtle active:text-brand-hover aria-pressed:text-brand motion-reduce:transition-none"
    >
      <Heart size={18} aria-hidden="true" className={saved ? "fill-current" : ""} />
    </button>
  );
}
