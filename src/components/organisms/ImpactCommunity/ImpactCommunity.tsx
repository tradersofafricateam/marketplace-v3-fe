import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ChevronsRight } from "lucide-react";
import SectionWrapper from "@/components/atoms/SectionWrapper/SectionWrapper";
import ScrollReveal from "@/components/atoms/ScrollReveal/ScrollReveal";

export default function ImpactCommunity() {
  const t = useTranslations("impactContent");
  const locale = useLocale();
  return (
    <div className="relative isolate overflow-hidden">
      <Image src="/assets/images/our-impact/TOFA Tribe.jpg" alt="" fill sizes="100vw" className="-z-20 object-cover object-center" />
      <div className="absolute inset-0 -z-10 bg-black/55" />
      <SectionWrapper className="flex min-h-[460px] items-center py-20 sm:min-h-[560px] sm:py-28 lg:min-h-[620px]">
        <ScrollReveal>
          <div className="mx-auto max-w-xl text-center text-white">
            <h2 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">{t("communityTitleLineOne")}<br />{t("communityTitleLineTwo")}</h2>
            <p className="text-body mx-auto mt-6 max-w-lg text-white/95">{t("communityDescription")}</p>
            <Link href={`/${locale}/register`} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded px-3 text-sm font-medium transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">{t("getStarted")}<ChevronsRight size={19} aria-hidden="true" /></Link>
          </div>
        </ScrollReveal>
      </SectionWrapper>
    </div>
  );
}
