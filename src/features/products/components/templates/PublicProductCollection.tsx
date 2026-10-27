"use client";
import ProductCardWrapper from "@/components/molecules/ProductCardWrapper/ProductCardWrapper";
import { usePublicProducts } from "../../hooks/usePublicProducts";
import type { PublicProductQuery } from "../../api";

export default function PublicProductCollection({
  title,
  href,
  query,
}: {
  title: string;
  href: string;
  query: PublicProductQuery;
}) {
  const products = usePublicProducts({ limit: 8, ...query });
  if (
    !products.isError &&
    !products.isLoadingCurrentData &&
    !products.data?.items.length
  )
    return null;
  return (
    <ProductCardWrapper
      title={title}
      href={href}
      products={products.data?.items || []}
      loading={products.isLoadingCurrentData}
      error={products.isError}
      onRetry={products.refetch}
    />
  );
}
