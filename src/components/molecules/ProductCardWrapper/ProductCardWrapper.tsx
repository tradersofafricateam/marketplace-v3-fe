import Link from "next/link";
import { useTranslations } from "next-intl";
import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import ProductGrid from "@/components/organisms/ProductGrid/ProductGrid";
import type { ProductData } from "@/features/products/types";

export default function ProductCardWrapper({
  title,
  products,
  href,
  loading = false,
  error = false,
  onRetry,
}: {
  title: string;
  products: ProductData[];
  href?: string;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => unknown;
}) {
  const t = useTranslations("ProductCatalogue");
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <SectionTitle title={title} />
        {href && (
          <Link
            href={href}
            className="shrink-0 rounded-sm text-sm font-semibold text-brand transition-colors hover:text-brand-hover hover:underline focus-visible:outline-brand"
          >
            {t("viewAll")}
          </Link>
        )}
      </div>
      {error ? (
        <div role="alert" className="py-4">
          <p className="text-sm text-muted-foreground">
            {t("errorDescription")}
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={() => void onRetry()}
              className="mt-3 rounded-sm text-sm font-semibold text-brand hover:text-brand-hover focus-visible:outline-brand"
            >
              {t("retry")}
            </button>
          )}
        </div>
      ) : (
        <ProductGrid products={products} loading={loading} />
      )}
    </div>
  );
}
