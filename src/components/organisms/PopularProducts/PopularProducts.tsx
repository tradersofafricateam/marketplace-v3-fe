"use client";

import SectionWrapper from "@/components/atoms/SectionWrapper/SectionWrapper";
import PublicProductCollection from "@/features/products/components/templates/PublicProductCollection";

import { useTranslations } from "next-intl";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";

const PopularProducts = () => {
  const t = useTranslations("HomePage");
  const { routes } = useGetAllRoutes();

  return (
    <SectionWrapper paddingX="xl:px-14" className="sm:pb-14 pb-10">
      <PublicProductCollection
        title={t("popularProducts")}
        query={{ sortBy: "ranking" }}
        href={routes.productCollection("popular")}
      />
    </SectionWrapper>
  );
};

export default PopularProducts;
