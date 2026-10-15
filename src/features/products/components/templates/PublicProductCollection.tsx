"use client";
import ProductCardWrapper from "@/components/molecules/ProductCardWrapper/ProductCardWrapper";
import { usePublicProducts } from "../../hooks/usePublicProducts";
import type { PublicProductQuery } from "../../api";
export default function PublicProductCollection({ title, href, query }: { title: string; href: string; query: PublicProductQuery }) {
  const products = usePublicProducts({ limit: 8, ...query });
  if (products.isLoadingCurrentData) return <div role="status" aria-label="Loading products" className="h-64 animate-pulse rounded-xl bg-muted" />;
  if (products.isError) return <div role="alert" className="rounded-xl border border-border p-5"><h2 className="font-semibold">{title}</h2><p>Products could not be loaded.</p><button type="button" onClick={() => void products.refetch()} className="mt-3 text-(--orange)">Try again</button></div>;
  if (!products.data?.items.length) return null;
  return <ProductCardWrapper title={title} href={href} products={products.data.items} />;
}
