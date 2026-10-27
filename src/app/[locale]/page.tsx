import HeroSection from "@/components/organisms/HeroSection/HeroSection";
import HowItWorksSection from "@/components/organisms/HowItWorksSection/HowItWorksSection";
import MainCategorySection from "@/components/organisms/MainCategorySection/MainCategorySection";
import MoreCollectionSection from "@/components/organisms/MoreCollectionSection/MoreCollectionSection";
import NewlyAddedProducts from "@/components/organisms/NewlyAddedProducts/NewlyAddedProducts";
import PopularProducts from "@/components/organisms/PopularProducts/PopularProducts";
import MainLayout from "@/components/templates/MainLayout/MainLayout";
import ScrollReveal from "@/components/atoms/ScrollReveal/ScrollReveal";

export default function Home() {
  return (
    <MainLayout>
      <ScrollReveal>
        <HeroSection />
      </ScrollReveal>
      <ScrollReveal>
        <MainCategorySection />
      </ScrollReveal>
      <PopularProducts />
      <ScrollReveal>
        <HowItWorksSection />
      </ScrollReveal>
      <ScrollReveal>
        <MoreCollectionSection />
      </ScrollReveal>
      <NewlyAddedProducts />
    </MainLayout>
  );
}
