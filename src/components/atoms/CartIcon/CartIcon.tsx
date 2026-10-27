"use client";

import { navigationControl } from "@/lib/constants/navigationStyles";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

import { useTranslations } from "next-intl";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";

const CartIcon = () => {
  const t = useTranslations("Nav");
  const { routes } = useGetAllRoutes();

  const cartCount = useCartStore((state) => state.cart?.totalCount ?? 0);

  return (
    <Link
      href={routes?.cart}
      className={`${navigationControl} relative gap-2! px-3!`}
      aria-label={`${t("cart")}${cartCount ? ` (${cartCount})` : ""}`}
    >
      <ShoppingCart size={20} aria-hidden="true" />
      <span className="hidden xl:inline">{t("cart")}</span>
      {cartCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 h-4.5 min-w-4.5 px-1 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center leading-none">
          {cartCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;
