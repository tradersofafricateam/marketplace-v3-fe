"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useStore } from "@/store/authStore";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { useSellerVerificationStatus } from "@/features/dashboard/hooks/useSellerVerificationStatus";
import { sellerAccessDestination } from "@/features/auth/helpers/routeAccess";
import DashboardSkeleton from "@/features/dashboard/components/templates/DashboardSkeleton/DashboardSkeleton";

export default function AccountBoundary({ children, seller = false }: { children: React.ReactNode; seller?: boolean }) {
  const user = useStore((state) => state.currentUser);
  const initialized = useStore((state) => state.isAuthInitialized);
  const { routes } = useGetAllRoutes();
  const locale = useLocale();
  const t = useTranslations("SellerWorkspace");
  const router = useRouter();
  const pathname = usePathname();
  const verification = useSellerVerificationStatus();

  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      const query = new URLSearchParams({ returnUrl: pathname + window.location.search });
      router.replace(`${routes.login}?${query}`);
    } else if (seller && verification.status && verification.status !== "approved") {
      router.replace(sellerAccessDestination(verification.status, locale));
    }
  }, [initialized, user, seller, verification.status, locale, pathname, router, routes.login]);

  if (!initialized || !user) return <DashboardSkeleton />;
  if (seller && verification.isLoadingCurrentData) return <DashboardSkeleton />;
  if (seller && verification.isError) return (
    <div role="alert" className="mx-auto max-w-lg p-10 text-center">
      <p>{t("accessError")}</p>
      <button type="button" onClick={() => void verification.refetch()} className="mt-4 rounded-xl bg-(--orange) px-5 py-3 font-semibold text-white">{t("retry")}</button>
    </div>
  );
  if (seller && verification.status !== "approved") return <DashboardSkeleton />;
  return children;
}
