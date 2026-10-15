"use client";

import SectionWrapper from "@/components/atoms/SectionWrapper/SectionWrapper";
import PublicProductCollection from "@/features/products/components/templates/PublicProductCollection";

import { useTranslations } from "next-intl";
import { useGetAllRoutes } from "@/lib/hooks/useGetAllRoutes";

const NewlyAddedProducts = () => {
  const t = useTranslations("HomePage");
  const { routes } = useGetAllRoutes();

  return (
    <SectionWrapper paddingX="xl:px-14" className="sm:pb-14 pb-10">
      <PublicProductCollection
        title={t("newlyAddedProducts")}
        query={{ sortBy: "newest" }}
        href={routes.productCollection("new")}
      />
    </SectionWrapper>
  );
};

export default NewlyAddedProducts;
