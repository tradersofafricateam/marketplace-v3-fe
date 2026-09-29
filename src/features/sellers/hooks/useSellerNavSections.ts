"use client";
import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";
import { sellerWorkspaceSections } from "../constants/workspace";
import type { DashboardNavSection } from "@/features/dashboard/types";

export const useSellerNavSections = (): DashboardNavSection[] => {
  const t = useTranslations("SellerWorkspace");
  const { routes } = useGetAllRoutes();
  return useMemo(() => (["business", "finance", "manage"] as const).map((group) => ({
    label: t(`groups.${group}`),
    items: sellerWorkspaceSections.filter((item) => item.group === group).map((item) => ({
      label: t(`nav.${item.key}`), href: routes.seller + (item.path ? `/${item.path}` : ""), icon: item.icon,
    })),
  })), [routes.seller, t]);
};
