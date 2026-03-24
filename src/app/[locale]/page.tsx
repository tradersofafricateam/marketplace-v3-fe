"use client";

import HeroSection from "@/components/organisms/HeroSection/HeroSection";
import MainCategorySection from "@/components/organisms/MainCategorySection/MainCategorySection";
import PopularProducts from "@/components/organisms/PopularProducts/PopularProducts";
import MainLayout from "@/components/templates/MainLayout/MainLayout";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("HomePage");

  return (
    <MainLayout>
      <HeroSection />
      <MainCategorySection />
      <PopularProducts />
      <h1>{t("title")}</h1>
      <div className="h-screen bg-gray-300"></div>
      <div className="h-screen bg-gray-600"></div>
    </MainLayout>
  );
}
