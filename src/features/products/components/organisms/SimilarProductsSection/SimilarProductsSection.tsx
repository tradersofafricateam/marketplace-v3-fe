"use client";

import { useTranslations } from "next-intl";

import ProductCardWrapper from "@/components/molecules/ProductCardWrapper/ProductCardWrapper";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { ProductData } from "@/features/products/types";

const SimilarProductsSection = ({
  products,
  loading = false,
  error = false,
  onRetry,
  categoryId,
}: {
  products: ProductData[];
  loading?: boolean;
  error?: boolean;
  onRetry?: () => unknown;
  categoryId?: string;
}) => {
  const t = useTranslations("ProductInfo");
  const { routes } = useGetAllRoutes();

  if (!loading && !error && products.length === 0) return null;

  return (
    <ProductCardWrapper
      title={t("similarProducts")}
      products={products}
      loading={loading}
      error={error}
      onRetry={onRetry}
      href={categoryId ? routes.categoryInfo(categoryId) : routes.products}
    />
  );
};

export default SimilarProductsSection;
