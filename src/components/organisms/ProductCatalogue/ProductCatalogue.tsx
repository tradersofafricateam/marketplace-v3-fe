"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import Container from "@/components/atoms/Container/Container";
import { Skeleton } from "@/components/ui/skeleton";
import CatalogueToolbar from "@/components/molecules/CatalogueToolbar/CatalogueToolbar";
import ProductFilters from "@/components/molecules/ProductFilters/ProductFilters";
import ProductFilterSheet from "@/components/molecules/ProductFilterSheet/ProductFilterSheet";
import ProductGrid from "@/components/organisms/ProductGrid/ProductGrid";
import { useProductCatalogue } from "@/lib/hooks/useProductCatalogue/useProductCatalogue";
import {
  navigationPrimary,
  navigationSecondary,
} from "@/lib/constants/navigationStyles";

export default function ProductCatalogue() {
  const catalogue = useProductCatalogue();
  const t = useTranslations("ProductCatalogue");
  return (
    <section
      data-catalogue-redesign="image-led"
      className="bg-brand-subtle/35 pb-10 sm:pb-14"
    >
      <Container>
        <header className="py-6 sm:py-7">
          <nav
            aria-label={t("breadcrumbLabel")}
            className="mb-4 flex flex-wrap items-center gap-2 text-[0.6875rem] leading-4 text-muted-foreground"
          >
            <Link
              href={`/${catalogue.locale}`}
              className="rounded-sm hover:text-brand focus-visible:outline-brand"
            >
              {t("home")}
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{t("collections.all")}</span>
          </nav>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <h1 className="max-w-4xl font-poppins text-[1.75rem] font-medium leading-tight tracking-tight wrap-anywhere sm:text-3xl">
                {catalogue.contextTitle}
              </h1>
              <p className="mt-2 text-xs leading-5 text-muted-foreground sm:text-[0.8125rem]">
                {t("browseDescription")}
              </p>
            </div>
            <div
              aria-live="polite"
              className="shrink-0 text-xs text-muted-foreground"
            >
              {catalogue.isLoading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                !catalogue.isError &&
                catalogue.pagination &&
                t("productCount", { count: catalogue.pagination.total })
              )}
            </div>
          </div>
        </header>
      </Container>
      <Container>
        <CatalogueToolbar
          sort={catalogue.sort}
          view={catalogue.view}
          filterCount={catalogue.activeFilterCount}
          onSort={catalogue.changeSort}
          onView={catalogue.setView}
          onOpenFilters={catalogue.openFilters}
          filtersOpen={catalogue.filtersOpen}
          refreshing={catalogue.isRefreshing}
          categoryQuery={catalogue.categoryQuery}
          categoryIds={catalogue.categoryIds}
          onCategory={catalogue.selectCategory}
        />
        {!!catalogue.chips.length && (
          <div
            className="flex flex-wrap items-center gap-2 pt-4"
            aria-label={t("appliedFilters")}
          >
            {catalogue.chips.map((chip) => (
              <button
                type="button"
                key={`${chip.key}-${chip.categoryId || ""}`}
                onClick={() =>
                  catalogue.removeFilter(chip.key, chip.categoryId)
                }
                aria-label={t("removeFilter", { filter: chip.label })}
                className="inline-flex min-h-9 max-w-full items-center gap-2 rounded-full bg-background/75 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-brand-subtle hover:text-brand-hover focus-visible:outline-2 focus-visible:outline-brand active:bg-muted"
              >
                <span className="min-w-0 wrap-anywhere">{chip.label}</span>
                <X size={12} aria-hidden="true" className="shrink-0" />
              </button>
            ))}
            <button
              type="button"
              onClick={catalogue.clearFilters}
              className="min-h-9 rounded-sm px-2 text-xs font-semibold text-brand hover:underline focus-visible:outline-brand"
            >
              {t("clearAll")}
            </button>
          </div>
        )}
        <div className="pt-6 sm:pt-7" aria-busy={catalogue.isRefreshing}>
          {catalogue.refreshError && (
            <div
              role="alert"
              className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-background p-4"
            >
              <p className="text-sm">{t("refreshError")}</p>
              <button
                type="button"
                onClick={() => void catalogue.retry()}
                className="min-h-10 rounded-sm text-sm font-semibold text-brand hover:underline focus-visible:outline-brand"
              >
                {t("retry")}
              </button>
            </div>
          )}
          {catalogue.isLoading ? (
            <ProductGrid loading view={catalogue.view} count={12} />
          ) : catalogue.isError ? (
            <div
              role="alert"
              className="mx-auto max-w-xl py-12 text-center sm:py-16"
            >
              <h2 className="font-poppins text-xl font-medium">
                {t("errorTitle")}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                {t("errorDescription")}
              </p>
              <button
                type="button"
                onClick={() => void catalogue.retry()}
                className={`${navigationPrimary} mt-5`}
              >
                {t("retry")}
              </button>
            </div>
          ) : catalogue.visibleProducts.length ? (
            <ProductGrid
              products={catalogue.visibleProducts}
              view={catalogue.view}
            />
          ) : (
            <div className="mx-auto max-w-xl py-12 text-center sm:py-16">
              <h2 className="font-poppins text-xl font-medium">
                {t(
                  catalogue.hasSearch
                    ? "emptySearchTitle"
                    : catalogue.activeFilterCount
                      ? "empty.title"
                      : "emptyCatalogueTitle",
                )}
              </h2>
              <p className="mt-3 text-sm text-muted-foreground">
                {t(
                  catalogue.activeFilterCount || catalogue.hasSearch
                    ? "empty.description"
                    : "emptyCatalogueDescription",
                )}
              </p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                {catalogue.activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={catalogue.clearFilters}
                    className={navigationPrimary}
                  >
                    {t("clearAll")}
                  </button>
                )}
                <Link
                  href={`/${catalogue.locale}/products`}
                  className={navigationSecondary}
                >
                  {t("browseAll")}
                </Link>
              </div>
            </div>
          )}
        </div>
        {!catalogue.isLoading &&
          !catalogue.isError &&
          catalogue.pagination &&
          catalogue.pagination.totalPages > 1 && (
            <nav
              aria-label={t("pagination.label")}
              className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-5 text-xs text-muted-foreground"
            >
              <p className="text-xs">
                {t("pagination.pageOf", {
                  page: catalogue.pagination.page,
                  total: catalogue.pagination.totalPages,
                })}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled={catalogue.pagination.page <= 1}
                  onClick={() =>
                    catalogue.changePage(catalogue.pagination!.page - 1)
                  }
                  className={navigationSecondary}
                >
                  {t("pagination.previous")}
                </button>
                <button
                  type="button"
                  disabled={
                    catalogue.pagination.page >= catalogue.pagination.totalPages
                  }
                  onClick={() =>
                    catalogue.changePage(catalogue.pagination!.page + 1)
                  }
                  className={navigationSecondary}
                >
                  {t("pagination.next")}
                </button>
              </div>
            </nav>
          )}
      </Container>
      {catalogue.filtersOpen && (
        <ProductFilterSheet onClose={catalogue.closeFilters}>
          <ProductFilters
            filters={catalogue.draftFilters}
            onChange={catalogue.changeFilters}
            onApply={catalogue.applyFilters}
            onClear={catalogue.resetDraftFilters}
            onClose={catalogue.closeFilters}
            categoryQuery={catalogue.categoryQuery}
            changed={catalogue.draftChanged}
          />
        </ProductFilterSheet>
      )}
    </section>
  );
}
