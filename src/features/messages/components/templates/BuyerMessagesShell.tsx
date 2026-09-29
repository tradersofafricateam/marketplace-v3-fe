"use client";
import { useTranslations } from "next-intl";
import DashboardLayout from "@/features/dashboard/components/templates/DashboardLayout/DashboardLayout";
import { useBuyerNavSections } from "@/features/dashboard/hooks/useBuyerNavSections";
import MessageCenterTemplate from "./MessageCenterTemplate";
export default function BuyerMessagesShell() {
  const sections = useBuyerNavSections();
  const t = useTranslations("MessageCenter");
  return <DashboardLayout sections={sections} title={t("title")}><MessageCenterTemplate /></DashboardLayout>;
}
