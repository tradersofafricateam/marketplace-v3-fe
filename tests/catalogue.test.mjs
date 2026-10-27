import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";
import { QueryClient, QueryObserver } from "@tanstack/react-query";

function load(file, mocks = {}) {
  const code = ts.transpileModule(
    fs.readFileSync(new URL(`../${file}`, import.meta.url), "utf8"),
    {
      fileName: file,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
      },
    },
  ).outputText;
  const compiled = { exports: {} };
  new Function("require", "module", "exports", code)(
    (name) => {
      assert.ok(name in mocks, `Unexpected import: ${name}`);
      return mocks[name];
    },
    compiled,
    compiled.exports,
  );
  return compiled.exports;
}
const constants = load("src/features/products/constants/catalogue.ts");
const query = load("src/features/products/helpers/publicProductQuery.ts");
const filters = load("src/features/products/helpers/catalogueFilters.ts", {
  "../helpers/publicProductQuery": query,
  "./publicProductQuery": query,
  "../constants/catalogue": constants,
});

test("catalogue filter drafts preserve zero, false, multiple categories and unrelated URL context", () => {
  const current = new URLSearchParams(
    "q=rice+%26+beans&sort=reviews&sellerId=seller-a&collection=popular&page=4",
  );
  const draft = {
    ...constants.emptyCatalogueFilters,
    categoryIds: ["rice", "beans"],
    minPrice: "0",
    maxPrice: "7000",
    hasDiscount: false,
    priceCurrency: "NGN",
    inventoryStatus: "out_of_stock",
  };
  const applied = filters.applyCatalogueFilters(current, draft);
  assert.equal(current.get("page"), "4");
  assert.equal(applied.get("page"), null);
  assert.equal(applied.get("q"), "rice & beans");
  assert.equal(applied.get("sort"), "reviews");
  assert.equal(applied.get("sellerId"), "seller-a");
  assert.equal(applied.get("minPrice"), "0");
  assert.equal(applied.get("hasDiscount"), "false");
  assert.deepEqual(
    filters.selectedCategoryIds(filters.catalogueFilters(applied)),
    ["rice", "beans"],
  );
  assert.equal(
    filters.catalogueFilters(applied).inventoryStatus,
    "out_of_stock",
  );
});

test("clearing filters retains search and sorting; individual category removal retains other selections", () => {
  const params = new URLSearchParams(
    "search=cement&sort=newest&page=3&categoryIds=a,b,c&rating=4&inStock=1&minPrice=0&currency=USD&hasDiscount=false&sellerId=s",
  );
  const removed = filters.removeCatalogueFilter(params, "categories", "b");
  assert.equal(removed.get("categoryIds"), "a,c");
  const single = filters.removeCatalogueFilter(removed, "categories", "a");
  assert.equal(single.get("categoryId"), "c");
  assert.equal(single.get("categoryIds"), null);
  assert.equal(
    filters.removeCatalogueFilter(params, "minRating").get("rating"),
    null,
  );
  assert.equal(
    filters.removeCatalogueFilter(params, "inventoryStatus").get("inStock"),
    null,
  );
  assert.equal(
    filters.clearCatalogueFilters(params).toString(),
    "search=cement&sort=newest",
  );
});

function catalogueHarness(client, context) {
  let options;
  const { useCatalogueProducts } = load(
    "src/features/products/hooks/useCatalogueProducts.ts",
    {
      "@tanstack/react-query": {
        useQuery(next) {
          options = next;
          return new QueryObserver(client, {
            ...next,
            _optimisticResults: "optimistic",
          }).getOptimisticResult({ ...next, _optimisticResults: "optimistic" });
        },
      },
      "next-intl": { useLocale: () => context.locale },
      "@/store/authStore": {
        useStore: (select) =>
          select({
            currentUser: context.user ? { id: context.user } : null,
            isAuthInitialized: context.initialized,
          }),
      },
      "@/lib/hooks/useCurrency/useCurrency": {
        useCurrency: () => ({
          currency: context.currency,
          isLoading: context.loading,
        }),
      },
      "../api": {
        getPublicProducts: async () => ({
          data: [],
          pagination: { page: 1, total: 0, totalPages: 0, limit: 12 },
        }),
      },
      "../helpers/publicProduct": { publicProductCard: (value) => value },
    },
  );
  return { read: useCatalogueProducts, options: () => options };
}

test("catalogue retains validated same-key products while isolating user, locale, currency and query changes", () => {
  const client = new QueryClient();
  const context = {
    user: "a",
    locale: "en",
    currency: "NGN",
    initialized: true,
    loading: false,
  };
  const hook = catalogueHarness(client, context);
  const request = { search: "rice", sortBy: "newest" };
  hook.read(request);
  const key = hook.options().queryKey;
  assert.equal(key[0], "publicProducts");
  client.setQueryData(key, { items: [{ id: "rice" }] });
  assert.deepEqual(hook.read(request).data.items, [{ id: "rice" }]);
  for (const [field, value] of [
    ["user", "b"],
    ["locale", "fr"],
    ["currency", "USD"],
  ]) {
    const original = context[field];
    context[field] = value;
    assert.equal(hook.read(request).data, undefined);
    context[field] = original;
  }
  assert.equal(hook.read({ search: "cement" }).data, undefined);
  assert.equal(hook.options().placeholderData, undefined);
  assert.equal(hook.options().gcTime, 0);
  context.initialized = false;
  assert.equal(hook.read(request).data, undefined);
  assert.equal(hook.read(request).isLoadingCurrentData, true);
  context.initialized = true;
  context.loading = true;
  assert.equal(hook.read(request).data, undefined);
  client.clear();
});

test("same-query refresh failure retains validated results rather than presenting a false empty state", async () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const context = {
    locale: "en",
    currency: "NGN",
    initialized: true,
    loading: false,
  };
  const hook = catalogueHarness(client, context);
  hook.read({});
  const key = hook.options().queryKey;
  assert.equal(key[0], "publicProducts");
  client.setQueryData(key, { items: [{ id: "existing" }] });
  await assert.rejects(
    client.fetchQuery({
      queryKey: key,
      queryFn: () => Promise.reject(new Error("Offline")),
    }),
  );
  const result = hook.read({});
  assert.equal(result.isError, true);
  assert.equal(result.data.items[0].id, "existing");
  assert.equal(result.isLoadingCurrentData, false);
  client.clear();
});

test("all new catalogue messages exist with consistent placeholders in every locale", () => {
  const locales = ["en", "fr", "es", "pt", "sw"];
  const messages = locales.map(
    (locale) =>
      JSON.parse(
        fs.readFileSync(
          new URL(`../messages/${locale}.json`, import.meta.url),
          "utf8",
        ),
      ).ProductCatalogue,
  );
  for (const key of Object.keys(messages[0]))
    for (let i = 1; i < messages.length; i++) {
      assert.equal(
        typeof messages[i][key],
        typeof messages[0][key],
        `${locales[i]}: ${key}`,
      );
      if (typeof messages[0][key] === "string") {
        const placeholders = (message) =>
          [
            ...new Set(
              [...message.matchAll(/\{(\w+)(?:,|\})/g)].map(
                (match) => match[1],
              ),
            ),
          ].sort();
        assert.deepEqual(
          placeholders(messages[i][key]),
          placeholders(messages[0][key]),
          `${locales[i]}: ${key} placeholders`,
        );
      }
    }
});

// Render the shared card rather than asserting on class strings or implementation text.
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
const jsx = await import("react/jsx-runtime");
function card() {
  return load("src/components/atoms/ProductCard/ProductCard.tsx", {
    "react/jsx-runtime": jsx,
    "next/link": {
      default: ({ href, children, ...props }) =>
        React.createElement("a", { href, ...props }, children),
    },
    "next-intl": {
      useTranslations: () => (key, values) =>
        key === "reviewCount" ? `${values.count} reviews` : key,
    },
    "../AddToCartBtn/AddToCartBtn": {
      default: ({ productId }) =>
        React.createElement(
          "button",
          { "data-cart-product": productId },
          "Add to cart",
        ),
    },
    "../WishlistButton/WishlistButton": {
      default: ({ productId }) =>
        React.createElement(
          "button",
          { "data-wishlist-product": productId },
          "Local wishlist",
        ),
    },
    "../ProductImage/ProductImage": {
      default: ({ src, name }) =>
        React.createElement("img", { src: src || undefined, alt: name }),
    },
    "@/features/products/constants/productPresentation": load(
      "src/features/products/constants/productPresentation.ts",
    ),
    "@/lib/hooks/useGetAllRoutes": {
      useGetAllRoutes: () => ({
        routes: { productInfo: (id) => `/en/products/info/${id}` },
      }),
    },
    "@/lib/hooks/useCurrency/useCurrency": {
      useCurrency: () => ({
        formatMoney: (amount, currency) => `${currency} ${amount}`,
      }),
    },
  }).default;
}
const sample = {
  id: "product-a",
  slug: "product-a",
  productName: "Wholesale bananas",
  storeName: "Harvest",
  amount: 2400,
  currency: "NGN",
  unit: "kg",
  totalReviews: 0,
  imgUrl: "",
};

test("shared card preserves native currency, real product destination and cart identity in grid and list views", () => {
  for (const view of ["grid", "list"]) {
    const html = renderToStaticMarkup(
      React.createElement(card(), { ...sample, view }),
    );
    assert.match(html, /NGN 2400/);
    assert.match(html, /\/ kg/);
    assert.match(html, /href="\/en\/products\/info\/product-a"/);
    assert.match(html, /data-cart-product="product-a"/);
    assert.doesNotMatch(html, /reviews/);
    assert.match(html, /data-wishlist-product="product-a"/);
  }
});

test("shared card provides a local wishlist independently of backend saved flags and preserves real reviews/pricing", () => {
  const html = renderToStaticMarkup(
    React.createElement(card(), {
      ...sample,
      amount: null,
      totalReviews: 7,
      isInWishList: true,
    }),
  );
  assert.match(html, /viewPricing/);
  assert.match(html, /7 reviews/);
  assert.match(html, /data-wishlist-product="product-a"/);
  assert.doesNotMatch(html, /NGN 0|\/ kg/);
});

test("variable cards link to product information without variant controls or cart buttons", () => {
  const html = renderToStaticMarkup(
    React.createElement(card(), { ...sample, productType: "VARIABLE" }),
  );
  assert.match(html, /chooseOptions/);
  assert.match(html, /data-product-action="options"/);
  assert.match(html, /href="\/en\/products\/info\/product-a"/);
  assert.doesNotMatch(html, /data-cart-product|<select|<dialog/);
});

test("public card mapping carries only supported backend product types, without inventing missing metadata", () => {
  const { publicProductCard } = load(
    "src/features/products/helpers/publicProduct.ts",
  );
  for (const [input, expected] of [
    ["variable", "VARIABLE"],
    ["simple", "SIMPLE"],
    ["SIMPLE", "SIMPLE"],
  ]) {
    assert.equal(
      publicProductCard({ id: "p", productType: input }, "en").productType,
      expected,
    );
  }
  for (const value of [undefined, "unknown"])
    assert.equal(
      "productType" in publicProductCard({ id: "p", productType: value }, "en"),
      false,
    );
});
