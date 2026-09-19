import Image from "next/image";
import { useTranslations } from "next-intl";
import SectionWrapper from "@/components/atoms/SectionWrapper/SectionWrapper";
import ScrollReveal from "@/components/atoms/ScrollReveal/ScrollReveal";
import ImpactStats from "@/components/molecules/ImpactStats/ImpactStats";

export default function ImpactCapacity() {
  const t = useTranslations("impactContent");
  const stats = [
    { value: "$200,000", label: t("fundingProvided"), icon: "revenue 1.svg" },
    { value: "300", label: t("trainees"), icon: "cap 1.svg" },
    { value: "3", label: t("africanCountries"), icon: "africa 1.svg" },
  ];
  return (
    <SectionWrapper className="pb-20 pt-4 sm:pb-28 lg:pb-36">
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <ScrollReveal>
          <Image src="/assets/images/our-impact/Group 539.svg" alt={t("capacityAlt")} width={599} height={559} className="mx-auto h-auto w-full max-w-[500px]" />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-800">{t("capacityTitle")}</h2>
          <p className="text-body mt-4 text-neutral-700">{t("capacityDescription")}</p>
          <p className="text-body mb-8 mt-5 text-neutral-700">{t("capacityNetwork")}</p>
          <ImpactStats stats={stats} />
        </ScrollReveal>
      </div>
    </SectionWrapper>
  );
}
