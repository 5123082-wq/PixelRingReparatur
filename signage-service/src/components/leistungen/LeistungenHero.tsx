'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CmsImage from '../common/CmsImage';
import HeroBreadcrumbs from '../common/HeroBreadcrumbs';

type HeroSlide = {
  id: string;
  title: string;
  description: string;
  image: string;
  imageAlt?: string;
  fallbackSrc?: string;
  cta: string;
};

type LeistungenHeroProps = {
  slides: HeroSlide[];
  breadcrumbs?: {
    label: string;
    href?: string;
  }[];
};

export default function LeistungenHero({ slides, breadcrumbs = [] }: LeistungenHeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [nextSlide, slides.length]);

  const variants = {
    enter: {
      opacity: 0,
    },
    center: {
      zIndex: 1,
      opacity: 1,
    },
    exit: {
      zIndex: 0,
      opacity: 0,
    },
  };

  return (
    <section className="relative h-[520px] w-full overflow-hidden bg-[#0E1A2B] sm:h-[500px] lg:h-[560px]">
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIndex}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            opacity: { duration: 0.7 },
          }}
          className="absolute inset-0"
        >
          <div className="relative h-full w-full">
            <CmsImage
              src={slides[currentIndex].image}
              fallbackSrc={slides[currentIndex].fallbackSrc}
              alt={slides[currentIndex].imageAlt || slides[currentIndex].title}
              fill
              priority
              className="object-cover opacity-85"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E1A2B]/80 via-[#0E1A2B]/25 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0E1A2B]/45 via-[#0E1A2B]/10 to-transparent rtl:bg-gradient-to-l" />

            <HeroBreadcrumbs items={breadcrumbs} />

            <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-12 sm:px-6 sm:pb-14 min-[1328px]:px-0 lg:pb-16">
              <motion.div
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.65 }}
                className="max-w-[760px]"
              >
                <div className="mb-4 h-1 w-20 bg-[#B8643E]" />
                <h1 className="text-[36px] font-extrabold leading-[1.05] text-white sm:text-[52px] lg:text-[60px]">
                  {slides[currentIndex].title}
                </h1>
                <p className="mt-5 max-w-[680px] text-[16px] font-semibold leading-relaxed text-white/88 sm:text-[18px]">
                  {slides[currentIndex].description}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
