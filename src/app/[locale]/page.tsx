"use client";

import FooterSection from "@/components/organisms/FooterSection/FooterSection";
import HeroSection from "@/components/organisms/HeroSection/HeroSection";
import HowItWorksSection from "@/components/organisms/HowItWorksSection/HowItWorksSection";
import MainCategorySection from "@/components/organisms/MainCategorySection/MainCategorySection";
import MoreCollectionSection from "@/components/organisms/MoreCollectionSection/MoreCollectionSection";
import NewlyAddedProducts from "@/components/organisms/NewlyAddedProducts/NewlyAddedProducts";
import PopularProducts from "@/components/organisms/PopularProducts/PopularProducts";
import MainLayout from "@/components/templates/MainLayout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <MainCategorySection />
      <PopularProducts />
      <HowItWorksSection />
      <MoreCollectionSection />
      <NewlyAddedProducts />
      <FooterSection />
    </MainLayout>
  );
}
