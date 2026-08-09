import Image from "next/image";
import { useTranslations } from "next-intl";

import ScrollReveal from "@/components/atoms/ScrollReveal/ScrollReveal";
import SectionWrapper from "@/components/atoms/SectionWrapper/SectionWrapper";
import SellerCta from "@/components/atoms/SellerCta/SellerCta";
import { sellerSteps } from "@/features/sellers/constants";

const SellerOnboarding = () => {
  const t = useTranslations("becomeSeller");

  return (
    <SectionWrapper className="bg-background py-14">
      <ScrollReveal>
        <h2 className="heading-font mb-8 text-2xl font-bold">
          {t("onboarding.title")}
        </h2>
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="flex justify-center lg:justify-start">
            <Image
              src="/assets/images/become-seller.svg"
              alt=""
              width={473}
              height={238}
              className="h-auto w-full max-w-118.25"
            />
          </div>
          <div>
            <ol className="space-y-4 text-sm leading-6">
              {sellerSteps.map((step, index) => (
                <li key={step} className="flex gap-3">
                  <span className="font-bold">{index + 1}.</span>
                  <span>{t(`onboarding.steps.${step}`)}</span>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex justify-end">
              <SellerCta href="#seller-plans">{t("register")}</SellerCta>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </SectionWrapper>
  );
};

export default SellerOnboarding;
