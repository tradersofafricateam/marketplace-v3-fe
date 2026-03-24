"use client";

import Link from "next/link";

import { motion, AnimatePresence } from "framer-motion";

import { useSlider } from "@/lib/hooks/useSlider";
import { mainSlides } from "@/lib/constants/dummyData";

import DotIndicatorWrapper from "../DotIndicatorWrapper/DotIndicatorWrapper";

const MainSlider = ({ autoPlayInterval }: { autoPlayInterval?: number }) => {
  const { current, setCurrent } = useSlider({
    slides: mainSlides,
    autoPlayInterval,
  });

  const slides = mainSlides;

  return (
    <div className="relative rounded-xl overflow-hidden h-full min-h-75 cursor-pointer select-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0 flex items-end p-6"
          style={{ background: slides[current].bgColor }}
        >
          <Link
            href={slides[current]?.href}
            className="absolute inset-0"
            aria-label={slides[current]?.title}
          />

          {/* Background emoji decoration */}
          <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-20 pointer-events-none select-none">
            {slides[current]?.emoji}
          </div>

          {/* Content */}
          <div className="">
            <span
              className="inline-block text-xs font-medium px-3 py-1 rounded-full mb-2"
              style={{
                background: slides[current]?.badgeColor + "33",
                color: slides[current]?.badgeColor,
              }}
            >
              {slides[current].badge}
            </span>
            <h2 className="text-xl font-medium text-white leading-snug drop-shadow-md mb-1">
              {slides[current]?.title}
            </h2>
            <p className="text-sm text-white/80">{slides[current]?.subtitle}</p>
          </div>
        </motion.div>
      </AnimatePresence>
      <DotIndicatorWrapper
        current={current}
        setCurrent={setCurrent}
        slides={slides}
      />
    </div>
  );
};

export default MainSlider;
