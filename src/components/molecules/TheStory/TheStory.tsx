import Image from "next/image";

import SectionTitle from "@/components/atoms/SectionTitle/SectionTitle";
import SectionWrapper from "@/components/atoms/SectionWrapper/SectionWrapper";

import { useTranslations } from "next-intl";

const TheStory = () => {
  const t = useTranslations("aboutUs");

  return (
    <div
      className="bg-no-repeat bg-center bg-cover w-full pb-20 lg:pt-28 md:pt-20 pt-14 h-full"
      style={{ backgroundImage: "url('/assets/images/about-bg.png')" }}
    >
      <SectionWrapper className="">
        <div className="grid grid-cols-12">
          <div className="lg:col-span-6 md:col-span-10 col-span-12 space-y-4">
            <SectionTitle
              title={t("ourStory")}
              className="font-bold text-2xl"
            />
            <div className="space-y-8">
              <p className=" leading-loose">{t("theStory")}</p>
              <div className="border-l-4 border-(--orange) py-2">
                <p className="sm:pl-6 pl-4 font-semibold sm:text-xl text-lg leading-loose">
                  There is an urgent need to expose to Africans what is
                  obtainable in our locality and from our surroundings, as well
                  as showcase African products to the rest of the world. - Uju
                  Uzo-Ojinnaka
                </p>
              </div>
              <div className="">
                <a
                  href="https://www.youtube.com/watch?v=zsj0Tw38qj0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 group w-fit"
                >
                  <Image
                    src="/assets/images/dark-play-btn.svg"
                    width={50}
                    height={50}
                    alt="play-btn"
                    className="object-contain"
                  />
                  <p className="group-hover:text-(--orange) transition-all duration-300 ease-out group-hover:underline">
                    {" "}
                    Watch the Groundnut Story
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </div>
  );
};

export default TheStory;
