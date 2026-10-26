"use client";

import { useAddToCart } from "@/features/cart/hooks/useAddToCart";
import { useTranslations } from "next-intl";

const AddToCartButton = ({
  productId,
  quantity,
  variantId,
  disabled = false,
}: {
  productId: string;
  quantity: number;
  variantId?: string;
  disabled?: boolean;
}) => {
  const t = useTranslations("ProductInfo");

  const { addToCart, isAdding } = useAddToCart();

  return (
    <button
      type="button"
      onClick={() => addToCart({ productId, variantId, quantity })}
      aria-busy={isAdding}
      disabled={disabled || isAdding}
      className="flex h-11 items-center justify-center gap-2 rounded-full bg-(--orange) px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-(--orange-dark) disabled:pointer-events-none disabled:opacity-50"
    >
      {t("addToCart")}
    </button>
  );
};

export default AddToCartButton;
