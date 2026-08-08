"use client";

import SectionWrapper from "@/components/atoms/SectionWrapper/SectionWrapper";
import ProductCardWrapper from "@/components/molecules/ProductCardWrapper/ProductCardWrapper";

import { products } from "@/features/products/constants/dummy";
import { useTranslations } from "next-intl";

const PopularProducts = () => {
  const t = useTranslations("HomePage");

  return (
    <SectionWrapper paddingX="xl:px-14" className="sm:pb-14 pb-10">
      <ProductCardWrapper title={t("popularProducts")} products={products} />
    </SectionWrapper>
  );
};

export default PopularProducts;
