import SectionWrapper from "@/components/atoms/SectionWrapper/SectionWrapper";
import CategoryPanel from "@/components/molecules/CategoryPanel/CategoryPanel";
import React from "react";

const HeroSection = () => {
  return (
    <SectionWrapper className="bg-muted/30 py-14">
      <div
        className="
        grid gap-3
        grid-cols-1
        md:grid-cols-[1fr_1fr]
        lg:grid-cols-[250px_2fr_1fr]
      "
      >
        {" "}
        <div className="hidden lg:block">
          <CategoryPanel />
        </div>
      </div>
    </SectionWrapper>
  );
};

export default HeroSection;
