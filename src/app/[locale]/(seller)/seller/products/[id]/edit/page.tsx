import type { Metadata } from "next";

import ProductWizardTemplate from "@/features/sellerProducts/components/templates/ProductWizardTemplate/ProductWizardTemplate";

export const metadata: Metadata = { title: "Edit product | TOFA Seller Workspace" };

export default async function EditSellerProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProductWizardTemplate mode="edit" productId={id} />;
}
