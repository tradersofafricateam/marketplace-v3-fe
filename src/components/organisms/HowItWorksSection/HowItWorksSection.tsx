"use client";

import { useTranslations } from "next-intl";

import SectionWrapper from "@/components/atoms/SectionWrapper/SectionWrapper";
import StepsWrapper from "@/components/molecules/StepsWrapper/StepsWrapper";
import HowItWorksHeader from "@/components/molecules/HowItWorksHeader/HowItWorksHeader";

const HowItWorksSection = () => {
  const t = useTranslations("HowItWorks");

  return (
    <SectionWrapper className="sm:py-14 py-10 bg-(--brown)">
      <div className="space-y-10">
        <HowItWorksHeader>
          {t("weProvide")} <br />
          {t("bestCustomer")}
        </HowItWorksHeader>
        <StepsWrapper />
        <HowItWorksHeader>{t("howItWorks")}</HowItWorksHeader>
      </div>
    </SectionWrapper>
  );
};

export default HowItWorksSection;
