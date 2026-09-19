"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import DashboardLayout from "@/features/dashboard/components/templates/DashboardLayout/DashboardLayout";
import DashboardSkeleton from "@/features/dashboard/components/templates/DashboardSkeleton/DashboardSkeleton";
import SettingsTemplate from "@/features/dashboard/components/templates/SettingsTemplate/SettingsTemplate";
import { useBuyerNavSections } from "@/features/dashboard/hooks/useBuyerNavSections";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { useStore } from "@/store/authStore";

const SettingsDashboardShell = () => {
  const t = useTranslations("Settings");
  const router = useRouter();
  const { routes } = useGetAllRoutes();
  const sections = useBuyerNavSections();
  const user = useStore((state) => state.currentUser);
  const initialized = useStore((state) => state.isAuthInitialized);

  useEffect(() => {
    if (initialized && !user) {
      router.replace(
        `${routes.login}?${new URLSearchParams({ returnUrl: routes.profileSettings })}`,
      );
    }
  }, [initialized, user, router, routes]);

  if (!user) return <DashboardSkeleton />;

  return (
    <DashboardLayout sections={sections} title={t("title")}>
      <SettingsTemplate user={user} />
    </DashboardLayout>
  );
};

export default SettingsDashboardShell;
