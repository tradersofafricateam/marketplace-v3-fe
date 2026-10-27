"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, X } from "lucide-react";
import PriceRange from "@/components/atoms/PriceRange/PriceRange";
import { Skeleton } from "@/components/ui/skeleton";
import type { CatalogueFilters } from "@/features/products/types";
import type { Category } from "@/features/categories/types";
import { selectedCategoryIds } from "@/features/products/helpers/catalogueFilters";
import { usePriceFilterCurrency } from "@/lib/hooks/usePriceFilterCurrency/usePriceFilterCurrency";
import {
  navigationIconButton,
  navigationPrimary,
  navigationSecondary,
} from "@/lib/constants/navigationStyles";

type CategoryState = {
  data?: Category[];
  isLoadingCurrentData: boolean;
  isError: boolean;
  refetch: () => unknown;
};
const fieldClassName =
  "h-11 w-full min-w-0 rounded-lg border border-input bg-background px-3 text-sm font-normal focus-visible:outline-2 focus-visible:outline-brand";

export default function ProductFilters({
  filters,
  onChange,
  onApply,
  onClear,
  onClose,
  categoryQuery,
  changed = false,
}: {
  filters: CatalogueFilters;
  onChange: (next: Partial<CatalogueFilters>) => void;
  onApply: () => void;
  onClear: () => void;
  onClose?: () => void;
  categoryQuery: CategoryState;
  changed?: boolean;
}) {
  const t = useTranslations("ProductCatalogue");
  const categoryT = useTranslations("CategoryData");
  const price = usePriceFilterCurrency(filters, onChange);
  const ids = selectedCategoryIds(filters);
  const group = (label: string, content: ReactNode, open = false) => (
    <details className="group border-b border-border/60 py-1" open={open}>
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 rounded-sm text-sm font-semibold focus-visible:outline-2 focus-visible:outline-brand [&::-webkit-details-marker]:hidden">
        <span>{label}</span>
        <ChevronDown
          size={15}
          aria-hidden="true"
          className="shrink-0 text-muted-foreground transition-transform duration-150 group-open:rotate-180 motion-reduce:transition-none"
        />
      </summary>
      <div className="pb-5">{content}</div>
    </details>
  );
  const rows = (categories: Category[], depth = 0): ReactNode =>
    categories.map((category) => (
      <div key={category.id}>
        <label
          className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-lg py-2 pr-3 text-sm transition-colors hover:bg-muted ${depth === 0 ? "pl-2" : depth === 1 ? "pl-5" : "pl-8"} ${ids.includes(category.id) ? "font-semibold text-brand-hover" : "text-muted-foreground"}`}
        >
          <input
            type="checkbox"
            checked={ids.includes(category.id)}
            onChange={(e) => {
              const next = e.target.checked
                ? [...ids, category.id]
                : ids.filter((id) => id !== category.id);
              onChange({
                category: next.length === 1 ? next[0] : "",
                categoryIds: next.length > 1 ? next : [],
              });
            }}
            className="size-4 shrink-0 accent-brand focus-visible:outline-brand"
          />
          <span className="min-w-0 wrap-anywhere">{category.name}</span>
        </label>
        {rows(category.children, depth + 1)}
      </div>
    ));
  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border/60 pb-4">
        <h2
          id={onClose ? "product-filters-title" : undefined}
          className="font-poppins text-lg font-medium"
        >
          {t("filters.title")}
        </h2>
        {onClose && (
          <button
            data-filter-close
            type="button"
            onClick={onClose}
            aria-label={t("filters.close")}
            className={navigationIconButton}
          >
            <X size={18} aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 pb-5">
        {group(
          t("filters.categories"),
          categoryQuery.isLoadingCurrentData ? (
            <div
              role="status"
              aria-label={categoryT("loading")}
              className="space-y-4 py-3"
            >
              {[0, 1, 2].map((n) => (
                <Skeleton key={n} className="h-5 w-4/5" />
              ))}
            </div>
          ) : categoryQuery.isError ? (
            <div role="alert" className="py-2 text-sm text-muted-foreground">
              <p className="text-sm">{categoryT("error")}</p>
              <button
                type="button"
                onClick={() => void categoryQuery.refetch()}
                className="mt-2 min-h-10 rounded-sm font-semibold text-brand focus-visible:outline-brand"
              >
                {categoryT("retry")}
              </button>
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto overscroll-contain">
              <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-muted">
                <input
                  type="checkbox"
                  checked={ids.length === 0}
                  onChange={() => onChange({ category: "", categoryIds: [] })}
                  className="size-4 shrink-0 accent-brand focus-visible:outline-brand"
                />
                {t("filters.allCategories")}
              </label>
              {categoryQuery.data?.length ? (
                rows(categoryQuery.data)
              ) : (
                <p className="px-2 py-3 text-sm text-muted-foreground">
                  {categoryT("empty")}
                </p>
              )}
            </div>
          ),
          true,
        )}
        {group(
          `${t("filters.price")}${price.symbol ? ` · ${price.symbol}` : ""}`,
          <div className="pt-2">
            <PriceRange
              min={price.displayMin}
              max={price.displayMax}
              limit={price.displayLimit}
              symbol={price.symbol}
              minLabel={t("filters.min")}
              maxLabel={t("filters.max")}
              anyLabel={t("anyPrice")}
              disabled={price.disabled}
              onChange={price.changeDisplayRange}
            />
            {price.isLoading && <Skeleton className="mt-3 h-3 w-3/5" />}
            {price.isError && !price.symbol && (
              <p className="mt-3 text-xs text-muted-foreground">
                {t("currencyUnavailable")}{" "}
                <button
                  type="button"
                  onClick={price.retry}
                  className="min-h-10 text-brand focus-visible:outline-brand"
                >
                  {t("retry")}
                </button>
              </p>
            )}
          </div>,
          true,
        )}
        {group(
          t("filters.rating"),
          <fieldset>
            <legend className="sr-only">{t("filters.rating")}</legend>
            {["", "4", "3", "2", "1"].map((rating) => (
              <label
                key={rating}
                className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm hover:bg-muted"
              >
                <input
                  type="radio"
                  name="catalogue-rating"
                  value={rating}
                  checked={filters.rating === rating}
                  onChange={() => onChange({ rating })}
                  className="size-4 accent-brand focus-visible:outline-brand"
                />
                {rating
                  ? t("filters.ratingUp", { rating: Number(rating) })
                  : t("anyRating")}
              </label>
            ))}
          </fieldset>,
        )}
        {group(
          t("stock"),
          <select
            aria-label={t("stock")}
            value={filters.inventoryStatus || ""}
            onChange={(e) =>
              onChange({
                inventoryStatus: e.target
                  .value as CatalogueFilters["inventoryStatus"],
                inStock: e.target.value === "in_stock",
              })
            }
            className={fieldClassName}
          >
            <option value="">{t("anyAvailability")}</option>
            <option value="in_stock">{t("inStock")}</option>
            <option value="out_of_stock">{t("outOfStock")}</option>
          </select>,
        )}
        {group(
          t("offers"),
          <select
            aria-label={t("offers")}
            value={
              filters.hasDiscount === undefined
                ? ""
                : String(filters.hasDiscount)
            }
            onChange={(e) =>
              onChange({
                hasDiscount:
                  e.target.value === "" ? undefined : e.target.value === "true",
              })
            }
            className={fieldClassName}
          >
            <option value="">{t("anyOffer")}</option>
            <option value="true">{t("discounted")}</option>
            <option value="false">{t("notDiscounted")}</option>
          </select>,
        )}
        {group(
          t("country"),
          <input
            aria-label={t("country")}
            value={filters.countryOfOrigin || ""}
            onChange={(e) => onChange({ countryOfOrigin: e.target.value })}
            placeholder={t("anyCountry")}
            className={fieldClassName}
          />,
        )}
      </div>
      <div className="shrink-0 border-t border-border/60 bg-background pt-4">
        {changed && (
          <p className="mb-3 text-xs leading-4 text-muted-foreground">
            {t("draftChanges")}
          </p>
        )}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onApply}
            className={`${navigationPrimary} flex-1 rounded-full!`}
          >
            {t("filters.apply")}
          </button>
          <button
            type="button"
            onClick={onClear}
            className={`${navigationSecondary} rounded-full!`}
          >
            {t("filters.clear")}
          </button>
        </div>
      </div>
    </div>
  );
}
