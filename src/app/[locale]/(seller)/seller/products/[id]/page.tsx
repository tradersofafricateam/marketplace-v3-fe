import SellerProductDetailTemplate from "@/features/sellerProducts/components/templates/SellerProductDetailTemplate/SellerProductDetailTemplate";

export default async function SellerProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SellerProductDetailTemplate productId={id} />;
}
