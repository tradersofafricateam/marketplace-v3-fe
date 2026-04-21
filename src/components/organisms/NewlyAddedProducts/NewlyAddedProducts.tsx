"use client";

import SectionWrapper from "@/components/atoms/SectionWrapper/SectionWrapper";
import ProductCardWrapper from "@/components/molecules/ProductCardWrapper/ProductCardWrapper";

import { products } from "@/features/products/constants/dummy";
import { useTranslations } from "next-intl";

const NewlyAddedProducts = () => {
  const t = useTranslations("HomePage");

  return (
    <SectionWrapper className="sm:pb-14 pb-10">
      <ProductCardWrapper title={t("newlyAddedProducts")} products={products} />
    </SectionWrapper>
  );
};

export default NewlyAddedProducts;
