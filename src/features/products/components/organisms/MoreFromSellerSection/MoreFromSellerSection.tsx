"use client";

import { useTranslations } from "next-intl";

import ProductCardWrapper from "@/components/molecules/ProductCardWrapper/ProductCardWrapper";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { ProductData, ProductSeller } from "@/features/products/types";

const MoreFromSellerSection = ({
  seller,
  products,
  loading = false,
  error = false,
  onRetry,
}: {
  seller: ProductSeller;
  products: ProductData[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => unknown;
}) => {
  const t = useTranslations("ProductInfo");
  const { routes } = useGetAllRoutes();

  if (!loading && !error && products.length === 0) return null;

  return (
    <ProductCardWrapper
      title={t("moreFromSeller", { store: seller.storeName })}
      products={products}
      loading={loading}
      error={error}
      onRetry={onRetry}
      href={
        seller.slug
          ? routes.sellerStore(seller.slug)
          : `${routes.products}?sellerId=${encodeURIComponent(seller.id)}`
      }
    />
  );
};

export default MoreFromSellerSection;
