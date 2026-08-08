import Image from "next/image";
import { useTranslations } from "next-intl";

import ScrollReveal from "@/components/atoms/ScrollReveal/ScrollReveal";
import SectionWrapper from "@/components/atoms/SectionWrapper/SectionWrapper";
import SellerCta from "@/components/atoms/SellerCta/SellerCta";
import DotPattern from "@/components/atoms/DotPattern/DotPattern";

const SellerHero = () => {
  const t = useTranslations("becomeSeller");

  return (
    <SectionWrapper className="bg-background py-14 lg:py-20">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <ScrollReveal>
          <div className="max-w-xl space-y-6">
            <h1 className="heading-font text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              <span className="text-(--orange)">{t("hero.accent")}</span>{" "}
              {t("hero.title")}
            </h1>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              {t("hero.description")}
            </p>
            <SellerCta href="#seller-plans">{t("register")}</SellerCta>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div className="relative mx-auto flex min-h-105 w-full max-w-120 items-center justify-center sm:min-h-120">
            <DotPattern
              count={16}
              columns={4}
              color="blue"
              className="left-0 top-8 z-0"
            />
            <DotPattern
              count={12}
              columns={3}
              color="blue"
              className="bottom-16 right-0 z-0"
            />
            <DotPattern
              count={4}
              columns={2}
              color="orange"
              className="bottom-6 left-1/3 z-0"
            />
            <Image
              src="/assets/images/trade.svg"
              alt=""
              width={358}
              height={418}
              priority
              className="relative z-10 h-auto w-full max-w-[358px]"
            />
          </div>
        </ScrollReveal>
      </div>
    </SectionWrapper>
  );
};

export default SellerHero;
