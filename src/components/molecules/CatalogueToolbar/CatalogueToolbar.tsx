import { Grid2X2, List, SlidersHorizontal, LoaderCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ProductView } from "@/features/products/types";
import type { Category } from "@/features/categories/types";
import { productSortOptions } from "@/features/products/constants/catalogue";
import { Skeleton } from "@/components/ui/skeleton";

type CategoryQuery = {
  data?: Category[];
  isLoadingCurrentData: boolean;
  isError: boolean;
  refetch: () => unknown;
};
const categoryClassName =
  "min-h-10 shrink-0 rounded-full px-4 text-xs font-medium transition-colors hover:bg-brand-subtle focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2 active:bg-brand-subtle aria-pressed:bg-brand aria-pressed:text-primary-foreground aria-pressed:hover:bg-brand-hover aria-pressed:active:bg-brand-hover motion-reduce:transition-none";

export default function CatalogueToolbar({
  sort,
  view,
  filterCount,
  onSort,
  onView,
  onOpenFilters,
  filtersOpen,
  refreshing,
  categoryQuery,
  categoryIds,
  onCategory,
}: {
  sort: string;
  view: ProductView;
  filterCount: number;
  onSort: (value: string) => void;
  onView: (view: ProductView) => void;
  onOpenFilters: () => void;
  filtersOpen: boolean;
  refreshing?: boolean;
  categoryQuery: CategoryQuery;
  categoryIds: string[];
  onCategory: (id?: string) => void;
}) {
  const t = useTranslations("ProductCatalogue");
  const categoryT = useTranslations("CategoryData");
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3 border-b border-border/60 py-3.5">
      <button
        type="button"
        onClick={onOpenFilters}
        aria-haspopup="dialog"
        aria-expanded={filtersOpen}
        aria-controls="product-filter-sheet"
        className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full bg-brand px-4 text-xs font-semibold text-primary-foreground transition-colors hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-3 active:bg-brand-hover motion-reduce:transition-none"
      >
        <SlidersHorizontal size={14} aria-hidden="true" />
        {t("filters.title")}
        {filterCount > 0 && (
          <span className="flex min-w-5 items-center justify-center rounded-full bg-background/15 px-1 text-[0.6875rem]">
            {filterCount}
          </span>
        )}
      </button>
      <div
        role="group"
        aria-label={t("filters.categories")}
        className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto overscroll-x-contain py-1 lg:flex-initial"
      >
        <button
          type="button"
          aria-pressed={!categoryIds.length}
          onClick={() => onCategory()}
          className={categoryClassName}
        >
          {t("allCategoriesShort")}
        </button>
        {categoryQuery.isLoadingCurrentData ? (
          <Skeleton className="h-9 w-24 shrink-0 rounded-full" />
        ) : categoryQuery.isError ? (
          <button
            type="button"
            onClick={() => void categoryQuery.refetch()}
            className="min-h-10 shrink-0 rounded-full px-3 text-xs text-muted-foreground hover:text-brand"
          >
            {categoryT("retry")}
          </button>
        ) : (
          categoryQuery.data?.slice(0, 5).map((category) => (
            <button
              type="button"
              key={category.id}
              aria-pressed={categoryIds.includes(category.id)}
              title={category.name}
              onClick={() => onCategory(category.id)}
              className={`${categoryClassName} max-w-52 truncate bg-brand-subtle text-brand-hover`}
            >
              {category.name}
            </button>
          ))
        )}
        {!!categoryQuery.data && categoryQuery.data.length > 5 && (
          <button
            type="button"
            onClick={onOpenFilters}
            className={`${categoryClassName} text-muted-foreground`}
          >
            {t("moreCategories")}
          </button>
        )}
      </div>
      <div className="ml-auto flex min-w-0 items-center gap-3 max-sm:w-full">
        {refreshing && (
          <span
            role="status"
            aria-label={t("refreshing")}
            className="inline-flex shrink-0"
          >
            <LoaderCircle
              size={14}
              className="animate-spin text-muted-foreground motion-reduce:animate-none"
              aria-hidden="true"
            />
          </span>
        )}
        <label className="flex min-h-11 min-w-0 flex-1 items-center gap-2 text-xs text-muted-foreground sm:flex-none">
          <span className="shrink-0">{t("sortBy")}</span>
          <select
            aria-label={t("sortBy")}
            value={sort}
            onChange={(e) => onSort(e.target.value)}
            className="h-10 min-w-0 flex-1 rounded-sm bg-transparent px-1 text-xs text-foreground focus-visible:outline-2 focus-visible:outline-brand sm:w-40"
          >
            {productSortOptions.map((option) => (
              <option key={option} value={option}>
                {t(`sort.${option}`)}
              </option>
            ))}
          </select>
        </label>
        <div
          role="group"
          aria-label={t("displayOptions")}
          className="flex shrink-0 items-center gap-1"
        >
          {[
            { value: "grid", label: "galleryView", icon: Grid2X2 },
            { value: "list", label: "listView", icon: List },
          ].map(({ value, label, icon: Icon }) => (
            <button
              type="button"
              key={value}
              onClick={() => onView(value as ProductView)}
              aria-label={t(label)}
              aria-pressed={view === value}
              className="flex size-11 items-center justify-center rounded-lg border border-border/60 text-muted-foreground transition-colors hover:bg-brand-subtle focus-visible:outline-2 focus-visible:outline-brand active:bg-brand-subtle aria-pressed:border-transparent aria-pressed:bg-brand aria-pressed:text-primary-foreground aria-pressed:hover:bg-brand-hover aria-pressed:active:bg-brand-hover motion-reduce:transition-none"
            >
              <Icon size={15} aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
