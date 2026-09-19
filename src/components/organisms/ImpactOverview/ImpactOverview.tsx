import Image from "next/image";
import { useTranslations } from "next-intl";
import SectionWrapper from "@/components/atoms/SectionWrapper/SectionWrapper";
import ScrollReveal from "@/components/atoms/ScrollReveal/ScrollReveal";
import ImpactStats from "@/components/molecules/ImpactStats/ImpactStats";

export default function ImpactOverview() {
  const t = useTranslations("impactContent");
  const stats = [
    { value: "16,000", label: t("onlineSuppliers"), icon: "group 1.svg" },
    { value: "13,857+", label: t("listedProducts"), icon: "Frame.svg" },
    { value: "15", label: t("countryCoverage"), icon: "signal 1.svg" },
    { value: "$11,603,827", label: t("volumeTraded"), icon: "revenue 1.svg" },
    { value: "1,000,000+", label: t("offlineSuppliers"), icon: "group 1.svg" },
    { value: "5", label: t("countryPresence"), icon: "earth-globe 1.svg" },
  ];
  return (
    <SectionWrapper className="pb-10 pt-14 sm:pb-14 sm:pt-20 lg:pb-14 lg:pt-16">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <ScrollReveal>
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">{t("futureTitle")}</h2>
          <p className="text-body mt-5 max-w-xl text-neutral-700">{t.rich("futureDescription", { strong: (chunks) => <strong className="font-semibold">{chunks}</strong> })}</p>
          <h3 className="mb-6 mt-8 text-sm font-semibold text-neutral-800">{t("atGlance")}</h3>
          <ImpactStats stats={stats} />
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <Image src="/assets/images/our-impact/African map plain.svg" alt={t("mapAlt")} width={553} height={590} className="mx-auto h-auto w-full max-w-[440px]" />
        </ScrollReveal>
      </div>
    </SectionWrapper>
  );
}
