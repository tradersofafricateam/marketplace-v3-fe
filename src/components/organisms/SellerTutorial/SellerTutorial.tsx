import { useTranslations } from "next-intl";

import ScrollReveal from "@/components/atoms/ScrollReveal/ScrollReveal";
import SectionWrapper from "@/components/atoms/SectionWrapper/SectionWrapper";
import InlineVideoPlayer from "@/components/molecules/InlineVideoPlayer/InlineVideoPlayer";

const SellerTutorial = () => {
  const t = useTranslations("becomeSeller");

  return (
    <SectionWrapper className="bg-background py-14">
      <ScrollReveal>
        <div className="text-center">
          <h2 className="heading-font text-2xl font-bold">{t("tutorial.title")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("tutorial.subtitle")}</p>
        </div>
        <InlineVideoPlayer
          url="https://youtu.be/JlNN4nfaMQs?si=gW-ma6BdKEEJR37R"
          playLabel={t("tutorial.play")}
        />
      </ScrollReveal>
    </SectionWrapper>
  );
};

export default SellerTutorial;
