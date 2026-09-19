"use client";
import { useTranslations } from "next-intl";
import DashboardLayout from "@/features/dashboard/components/templates/DashboardLayout/DashboardLayout";
import { useSellerNavSections } from "../../../hooks/useSellerNavSections";

export default function SellerWorkspaceShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations("SellerWorkspace");
  const sections = useSellerNavSections();
  return <DashboardLayout workspace="seller" sections={sections} title={t("title")}>{children}</DashboardLayout>;
}
