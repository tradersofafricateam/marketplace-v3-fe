import type { Metadata } from "next";

import ProductWizardTemplate from "@/features/sellerProducts/components/templates/ProductWizardTemplate/ProductWizardTemplate";

export const metadata: Metadata = { title: "Add product | TOFA Seller Workspace" };

export default function NewSellerProductPage() {
  return <ProductWizardTemplate mode="create" />;
}
