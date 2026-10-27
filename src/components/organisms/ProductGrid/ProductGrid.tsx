import { useTranslations } from "next-intl";
import ProductCard from "@/components/atoms/ProductCard/ProductCard";
import ProductCardSkeleton from "@/components/atoms/ProductCardSkeleton/ProductCardSkeleton";
import type { ProductData, ProductView } from "@/features/products/types";
import { productGridClassName } from "@/features/products/constants/productPresentation";

export default function ProductGrid({
  products = [],
  view = "grid",
  loading = false,
  count = 8,
}: {
  products?: ProductData[];
  view?: ProductView;
  loading?: boolean;
  count?: number;
}) {
  const t = useTranslations("ProductCatalogue");
  return (
    <div className="@container w-full">
      <div
        role={loading ? "status" : undefined}
        aria-label={loading ? t("loading") : undefined}
        className={
          view === "list"
            ? "grid grid-cols-1 gap-5"
            : productGridClassName
        }
      >
        {loading
          ? Array.from({ length: count }, (_, i) => (
              <ProductCardSkeleton key={i} view={view} />
            ))
          : products.map((product) => (
              <ProductCard key={product.id} {...product} view={view} />
            ))}
      </div>
    </div>
  );
}
