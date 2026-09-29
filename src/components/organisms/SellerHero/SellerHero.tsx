import Image from "next/image";
import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";

import ScrollReveal from "@/components/atoms/ScrollReveal/ScrollReveal";
import SectionWrapper from "@/components/atoms/SectionWrapper/SectionWrapper";
import SellerCta from "@/components/atoms/SellerCta/SellerCta";

const SellerHero = () => {
  const t = useTranslations("becomeSeller");

  return (
    <SectionWrapper className="relative isolate overflow-hidden bg-[#fbf6ef] pb-16 pt-80 lg:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-80 lg:h-full">
        <Image
          src="/assets/images/become-hero-section.png"
          alt=""
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
          className="object-cover object-[75%_center] lg:object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_55%,#fbf6ef_100%)] lg:bg-[linear-gradient(to_right,#fbf6ef_0%,rgba(251,246,239,0.96)_25%,rgba(251,246,239,0.8)_40%,rgba(251,246,239,0.15)_60%,transparent_75%)]" />
      </div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-background to-transparent" />
      <div className="relative z-10 lg:w-[48%]">
        <ScrollReveal>
          <div className="max-w-xl space-y-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-(--orange-light) px-3 py-1 text-xs font-semibold text-(--orange)">
              <ShieldCheck size={13} />
              {t("hero.badge")}
            </span>
            <h1 className="heading-font text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              <span className="text-(--orange)">{t("hero.accent")}</span>{" "}
              {t("hero.title")}
            </h1>
            <p className="text-body max-w-md text-foreground/70">
              {t("hero.description")}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <SellerCta href="#seller-plans">{t("register")}</SellerCta>
              <a
                href="#seller-onboarding"
                className="text-sm font-semibold text-foreground underline-offset-4 transition-colors hover:text-(--orange) hover:underline"
              >
                {t("hero.secondaryCta")}
              </a>
            </div>
            <dl className="grid max-w-md grid-cols-3 gap-4 border-t border-border pt-6">
              {(["sellers", "countries", "payout"] as const).map((stat) => (
                <div key={stat}>
                  <dt className="sr-only">{t(`hero.stats.${stat}.label`)}</dt>
                  <dd className="heading-font text-xl font-bold text-foreground sm:text-2xl">
                    {t(`hero.stats.${stat}.value`)}
                  </dd>
                  <dd className="text-xs text-muted-foreground">
                    {t(`hero.stats.${stat}.label`)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </ScrollReveal>
      </div>
    </SectionWrapper>
  );
};

export default SellerHero;
