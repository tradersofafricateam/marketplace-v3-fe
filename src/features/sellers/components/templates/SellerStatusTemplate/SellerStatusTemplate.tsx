"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock3, FileWarning } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { useSellerVerificationStatus } from "@/features/dashboard/hooks/useSellerVerificationStatus";
import DashboardSkeleton from "@/features/dashboard/components/templates/DashboardSkeleton/DashboardSkeleton";

const BecomeSellerModal = dynamic(() => import("@/features/dashboard/components/organisms/BecomeSellerModal/BecomeSellerModal"), { ssr: false });

export default function SellerStatusTemplate() {
  const t = useTranslations("SellerWorkspace");
  const promo = useTranslations("Dashboard.sellerPromo");
  const query = useSellerVerificationStatus();
  const { routes } = useGetAllRoutes();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (query.status === "approved") router.replace(routes.seller);
    if (query.status === "not_submitted") router.replace(routes.becomeSeller);
  }, [query.status, router, routes]);
  if (query.isLoadingCurrentData || query.status === "approved" || query.status === "not_submitted") return <DashboardSkeleton />;
  const rejected = query.status === "rejected";
  const Icon = rejected ? FileWarning : Clock3;
  return <main className="flex min-h-[70vh] items-center justify-center px-5 py-12"><div className="w-full max-w-xl rounded-3xl border border-border bg-background p-8 text-center shadow-sm sm:p-12">
    <Icon size={42} className="mx-auto text-(--orange)" />
    <h1 className="heading-font mt-6 text-2xl font-bold">{query.isError ? t("accessError") : promo(rejected ? "rejectedTitle" : "pendingTitle")}</h1>
    {!query.isError && <p className="text-body mt-4 whitespace-pre-wrap text-muted-foreground">{rejected ? query.data?.rejectionReason || promo("rejectedDescription") : promo("pendingDescription")}</p>}
    <div className="mt-7 flex flex-wrap justify-center gap-3">
      {rejected && !query.isError && <button type="button" onClick={() => setOpen(true)} className="rounded-xl bg-(--orange) px-5 py-3 text-sm font-bold text-white">{promo("resubmit")}</button>}
      <button type="button" disabled={query.isFetching} onClick={() => void query.refetch()} className="rounded-xl border border-border px-5 py-3 text-sm font-semibold disabled:opacity-50">{t(query.isError ? "retry" : "checkStatus")}</button>
      <Link prefetch={false} href={routes.dashboard} className="rounded-xl border border-border px-5 py-3 text-sm font-bold">{t("myPurchases")}</Link>
    </div>
    <BecomeSellerModal open={open && query.canSubmit} onOpenChange={setOpen} />
  </div></main>;
}
