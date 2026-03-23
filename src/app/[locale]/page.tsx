"use client";

import MainLayout from "@/components/templates/MainLayout/MainLayout";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <MainLayout>
      <h1>{t("title")}</h1>
    </MainLayout>
  );
}
