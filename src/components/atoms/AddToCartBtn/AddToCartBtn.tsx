"use client";

import { useProductCardCart } from "@/features/cart/hooks/useProductCardCart";
import { useTranslations } from "next-intl";
import { LoaderCircle, ShoppingCart } from "lucide-react";
import { productActionClassName } from "@/features/products/constants/productPresentation";

export default function AddToCartBtn({ productId }: { productId: string }) {
  const t = useTranslations("Product");
  const catalogueT = useTranslations("ProductCatalogue");
  const { addFromCard, isPending } = useProductCardCart(productId);
  return (
    <button
      type="button"
      data-product-action="cart"
      onClick={addFromCard}
      disabled={isPending}
      aria-busy={isPending}
      aria-label={isPending ? catalogueT("adding") : t("addToCart")}
      className={productActionClassName}
    >
      <span className="flex size-4 shrink-0 items-center justify-center" aria-hidden="true">
        {isPending ? (
          <LoaderCircle size={16} className="animate-spin motion-reduce:animate-none" />
        ) : (
          <ShoppingCart size={16} />
        )}
      </span>
      <span className="grid" aria-hidden="true">
        <span className={`col-start-1 row-start-1 ${isPending ? "invisible" : ""}`}>
          {t("addToCart")}
        </span>
        <span className={`col-start-1 row-start-1 ${isPending ? "" : "invisible"}`}>
          {catalogueT("adding")}
        </span>
      </span>
    </button>
  );
}
