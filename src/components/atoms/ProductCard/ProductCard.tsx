"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import AddToCartBtn from "../AddToCartBtn/AddToCartBtn";
import WishlistButton from "../WishlistButton/WishlistButton";
import ProductImage from "../ProductImage/ProductImage";
import type { ProductData, ProductView } from "@/features/products/types";
import {
  productActionClassName,
  productActionContainerClassName,
  productBodyClassName,
  productCardClassName,
  productMediaClassName,
  productNameClassName,
} from "@/features/products/constants/productPresentation";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { useCurrency } from "@/lib/hooks/useCurrency/useCurrency";

export default function ProductCard({
  productName,
  storeName,
  id,
  slug,
  currency,
  amount,
  imgUrl,
  unit,
  totalReviews,
  productType,
  view = "grid",
}: ProductData & { view?: ProductView }) {
  const { routes } = useGetAllRoutes();
  const { formatMoney } = useCurrency();
  const t = useTranslations("ProductCatalogue");
  const href = routes.productInfo(slug);
  const list = view === "list";
  return (
    <article
      data-product-card
      data-view={view}
      data-product-type={productType}
      className={`${productCardClassName} rounded-xl transition-[box-shadow,translate] duration-200 hover:shadow-sm hover:shadow-foreground/10 motion-safe:pointer-fine:hover:-translate-y-0.5 focus-within:ring-2 focus-within:ring-brand/40 focus-within:ring-offset-4 focus-within:ring-offset-background motion-reduce:transform-none motion-reduce:translate-none motion-reduce:transition-none ${list ? "flex-row! gap-4 border-b border-border/60 pb-5 sm:gap-6" : ""}`}
    >
      <div
        className={`${productMediaClassName} ${list ? "w-28 shrink-0 self-start sm:w-44" : "w-full"}`}
      >
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className="absolute inset-0"
        >
          <ProductImage
            src={imgUrl}
            name={productName}
            sizes={
              list
                ? "176px"
                : "(max-width: 311px) calc(100vw - 2rem), 280px"
            }
          />
        </Link>
        <WishlistButton productId={id} productName={productName} />
      </div>
      <div
        className={`${productBodyClassName} ${list ? "pt-0! sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:content-center sm:gap-x-6" : ""}`}
      >
        {(storeName || totalReviews > 0) && (
          <p className="mb-1 flex min-w-0 items-baseline gap-2 text-[0.6875rem] font-medium leading-4 text-brand-hover sm:col-start-1">
            {storeName && <span className="min-w-0 truncate">{storeName}</span>}
            {totalReviews > 0 && <span className="shrink-0 font-normal text-muted-foreground">{t("reviewCount", { count: totalReviews })}</span>}
          </p>
        )}
        <h3
          className={`${productNameClassName} sm:col-start-1 ${list ? "sm:text-base" : ""}`}
        >
          <Link
            href={href}
            className="rounded-sm transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-4 active:text-brand-hover motion-reduce:transition-none"
          >
            {productName}
          </Link>
        </h3>
        <div className={`${list ? "" : "mt-auto"} pt-1.5 sm:col-start-1`}>
          <p
            className="flex min-h-6 flex-wrap items-baseline gap-x-1.5 text-base font-bold leading-6"
            aria-label={
              amount === null
                ? undefined
                : `${currency} ${formatMoney(amount, currency)}`
            }
          >
            {amount === null ? (
              <span className="font-semibold">{t("viewPricing")}</span>
            ) : (
              formatMoney(amount, currency)
            )}
            {amount !== null && unit && (
              <span className="text-xs font-normal text-muted-foreground">
                / {unit}
              </span>
            )}
          </p>
        </div>
        <div
          className={
            list
              ? "mt-2 sm:col-start-2 sm:row-span-3 sm:row-start-1 sm:my-auto"
              : productActionContainerClassName
          }
        >
          {productType === "VARIABLE" ? (
            <Link
              href={href}
              data-product-action="options"
              className={productActionClassName}
            >
              {t("chooseOptions")}
            </Link>
          ) : (
            <AddToCartBtn productId={id} />
          )}
        </div>
      </div>
    </article>
  );
}
