import { Suspense } from "react";
import type { Metadata } from "next";

import ProductCatalogue from "@/components/organisms/ProductCatalogue/ProductCatalogue";
import ProductCatalogueSkeleton from "@/components/organisms/ProductCatalogueSkeleton/ProductCatalogueSkeleton";
import MainLayout from "@/components/templates/MainLayout/MainLayout";

export const metadata: Metadata = {
  title: "African Products",
  description: "Search and filter products from verified African suppliers.",
};

export default function ProductsPage() {
  return (
    <MainLayout>
      <Suspense fallback={<ProductCatalogueSkeleton />}>
        <ProductCatalogue />
      </Suspense>
    </MainLayout>
  );
}
