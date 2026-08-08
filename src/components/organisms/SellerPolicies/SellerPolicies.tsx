import { useTranslations } from "next-intl";

import ScrollReveal from "@/components/atoms/ScrollReveal/ScrollReveal";
import SectionWrapper from "@/components/atoms/SectionWrapper/SectionWrapper";
import SellerPolicyCard from "@/components/atoms/SellerPolicyCard/SellerPolicyCard";

const SellerPolicies = () => {
  const t = useTranslations("becomeSeller");

  return (
    <SectionWrapper className="bg-muted/60 py-14">
      <div className="grid gap-12 lg:grid-cols-2">
        <ScrollReveal><SellerPolicyCard title={t("policies.compliance.title")} description={t("policies.compliance.description")} downloadLabel={t("policies.compliance.download")} downloadHref="/documents/supplier-compliance.pdf" /></ScrollReveal>
        <ScrollReveal><SellerPolicyCard title={t("policies.exclusions.title")} description={t("policies.exclusions.description")} downloadLabel={t("policies.exclusions.download")} downloadHref="/documents/product-exclusions.pdf" /></ScrollReveal>
      </div>
    </SectionWrapper>
  );
};

export default SellerPolicies;
