import { useTranslations } from "next-intl";

import SellerBenefitCard from "@/components/atoms/SellerBenefitCard/SellerBenefitCard";
import SectionWrapper from "@/components/atoms/SectionWrapper/SectionWrapper";
import ScrollReveal from "@/components/atoms/ScrollReveal/ScrollReveal";
import { sellerBenefits } from "@/features/sellers/constants";

const SellerBenefits = () => {
  const t = useTranslations("becomeSeller");

  return (
    <SectionWrapper className="bg-muted/60 py-14">
      <ScrollReveal>
        <div className="mb-10 text-center">
          <h2 className="heading-font text-2xl font-bold">{t("benefits.title")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("benefits.subtitle")}</p>
        </div>
      </ScrollReveal>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {sellerBenefits.map(({ key, icon }) => (
          <ScrollReveal key={key}>
            <SellerBenefitCard icon={icon} title={t(`benefits.items.${key}.title`)} description={t(`benefits.items.${key}.description`)} />
          </ScrollReveal>
        ))}
      </div>
    </SectionWrapper>
  );
};

export default SellerBenefits;
