'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import LeistungenRequestButton from './LeistungenRequestButton';
import ContactModal from '../common/ContactModal';
import ChatModal from '../common/ChatModal';

type HeroSlide = {
  id: string;
  title: string;
  description: string;
  image: string;
  cta: string;
};

type LeistungenHeroProps = {
  slides: HeroSlide[];
  locale: string;
};

export default function LeistungenHero({ slides }: Omit<LeistungenHeroProps, 'locale'>) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    // Pause autoplay if any modal is open
    if (isContactOpen || isChatOpen) return;

    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [nextSlide, isContactOpen, isChatOpen]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
  };

  return (
    <section className="relative h-[600px] w-full overflow-hidden bg-[#0E1A2B] md:h-[700px]">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.5 },
          }}
          className="absolute inset-0"
        >
          <div className="relative h-full w-full">
            <Image
              src={slides[currentIndex].image}
              alt={slides[currentIndex].title}
              fill
              priority
              className="object-cover opacity-60"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0E1A2B] via-[#0E1A2B]/40 to-transparent rtl:bg-gradient-to-l" />
            
            <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="max-w-3xl"
              >
                <h1 className="text-[40px] font-extrabold leading-[1.1] text-white sm:text-[56px] lg:text-[72px]">
                  {slides[currentIndex].title}
                </h1>
                <p className="mt-6 text-[18px] leading-relaxed text-white/80 sm:text-[22px]">
                  {slides[currentIndex].description}
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <LeistungenRequestButton
                    label={slides[currentIndex].cta}
                    serviceIntent="diagnose"
                    className="!min-h-[56px] !px-8 !text-[16px]"
                    onClick={() => setIsContactOpen(true)}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute bottom-10 right-4 z-20 flex gap-3 sm:right-10 rtl:left-4 rtl:right-auto sm:rtl:left-10">
        <button
          onClick={prevSlide}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20"
          aria-label="Previous slide"
        >
          <svg className="h-6 w-6 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md transition-all hover:bg-white/20"
          aria-label="Next slide"
        >
          <svg className="h-6 w-6 rtl:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-4 z-20 flex gap-2 sm:left-10 rtl:left-auto rtl:right-4 sm:rtl:right-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`h-1.5 transition-all duration-300 ${
              currentIndex === index ? 'w-8 bg-[#B8643E]' : 'w-4 bg-white/30 hover:bg-white/50'
            } rounded-full`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Modals are rendered here, outside the keyed AnimatePresence, so they persist during slide changes */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        onOpenChat={() => setIsChatOpen(true)}
      />
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />
    </section>
  );
}
