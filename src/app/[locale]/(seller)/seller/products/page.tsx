import type { Metadata } from "next";

import SellerProductsListTemplate from "@/features/sellerProducts/components/templates/SellerProductsListTemplate/SellerProductsListTemplate";

export const metadata: Metadata = { title: "Products | TOFA Seller Workspace" };

export default function SellerProductsPage() {
  return <SellerProductsListTemplate />;
}
