import MainLayout from "@/components/templates/MainLayout/MainLayout";
import PublicProductDetail from "@/features/products/components/templates/PublicProductDetail";

// The existing route segment is retained, but links now supply the backend product ID.
export default async function ProductInfoPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { slug } = await params;
  return <MainLayout><PublicProductDetail id={slug} /></MainLayout>;
}
