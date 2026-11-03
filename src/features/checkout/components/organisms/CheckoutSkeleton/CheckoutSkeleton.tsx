import { useTranslations } from "next-intl";
import Container from "@/components/atoms/Container/Container";
import { Skeleton } from "@/components/ui/skeleton";
import { purchaseColumns } from "@/lib/constants/purchaseStyles";
export default function CheckoutSkeleton() {
  const t = useTranslations("Checkout");
  return <Container className="py-10 xl:px-14"><div role="status" aria-label={t("loading")}><Skeleton className="h-5 w-28" /><Skeleton className="mt-6 h-9 w-48" /><Skeleton className="mb-8 mt-3 h-5 w-3/5" /><div className={purchaseColumns}><div><Skeleton className="mb-8 h-12 w-full" /><Skeleton className="mb-4 h-7 w-48" /><div className="grid gap-3 sm:grid-cols-2"><Skeleton className="h-44 rounded-xl" /><Skeleton className="h-44 rounded-xl" /></div><Skeleton className="mt-5 h-11 w-44 rounded-full" /></div><Skeleton className="h-96 rounded-2xl" /></div></div></Container>;
}
