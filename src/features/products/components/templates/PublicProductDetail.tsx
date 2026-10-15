"use client";
import { useLocale } from "next-intl";
import type { ProductDetail } from "../../types";
import { usePublicProduct, usePublicProducts } from "../../hooks/usePublicProducts";
import ProductInfoTemplate from "./ProductInfoTemplate/ProductInfoTemplate";
import ProductInfoSkeleton from "./ProductInfoSkeleton/ProductInfoSkeleton";
export default function PublicProductDetail({ id }: { id: string }) {
  const query = usePublicProduct(id);
  const locale = useLocale();
  if (query.isLoadingCurrentData) return <ProductInfoSkeleton />;
  if (query.isError || !query.data) return <div role="alert" className="mx-auto max-w-xl p-10 text-center"><h1 className="text-xl font-semibold">This product could not be loaded</h1><p className="mt-2">It may no longer be available. Please try again.</p><button type="button" onClick={() => void query.refetch()} className="mt-4 rounded-xl bg-(--orange) px-5 py-3 text-white">Try again</button></div>;
  return <LoadedProduct key={`${id}:${query.data.isSaved}`} product={query.data} locale={locale} />;
}

function LoadedProduct({ product, locale }: { product: ProductDetail; locale: string }) {
  const similar = usePublicProducts({ categoryId: product.categoryIds[0], limit: 7 }, !!product.categoryIds[0]);
  const seller = usePublicProducts({ sellerId: product.seller.id, limit: 7 }, !!product.seller.id);
  return <ProductInfoTemplate product={product} locale={locale} similarProducts={similar.data?.items.filter((item) => item.id !== product.id) ?? []} moreFromSeller={seller.data?.items.filter((item) => item.id !== product.id) ?? []} />;
}
