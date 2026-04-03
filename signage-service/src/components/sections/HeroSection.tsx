'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import ContactModal from '../common/ContactModal';

const HeroSection = () => {
  const t = useTranslations('HomePage');
  const [modalOpen, setModalOpen] = useState(false);
  const [focusField, setFocusField] = useState<'text' | 'photo' | null>(null);

  const openModal = (focus: 'text' | 'photo' | null = null) => {
    setFocusField(focus);
    setModalOpen(true);
  };

  return (
    <>
      <section className="relative w-full min-h-[600px] bg-[#F6F0E9] pt-24 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left Content */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-[48px] md:text-[56px] leading-[1.1] font-bold text-[#0E1A2B] tracking-tight">
                {t('title')}
              </h1>
              <p className="text-[18px] md:text-[20px] leading-[1.6] text-[#72665D] max-w-lg">
                {t('description')}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => openModal('text')}
                className="px-8 py-4 bg-[#C86E4A] hover:bg-[#B05B3A] text-white text-[18px] font-medium rounded-full shadow-lg shadow-[#0040a133] transition-all"
              >
                {t('cta_primary')}
              </button>
              <button
                onClick={() => openModal('photo')}
                className="px-8 py-4 bg-transparent border border-[#C86E4A] text-[#C86E4A] hover:bg-[#F3E2D5] text-[18px] font-medium rounded-full transition-all"
              >
                {t('cta_secondary')}
              </button>
            </div>

            <p className="text-[14px] text-[#72665D] opacity-75 italic">
              {t('trust_badge')}
            </p>
          </div>

          {/* Right Image/Graphic */}
          <div className="relative aspect-square md:aspect-auto md:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/images/hero.jpg"
              alt="Hero Signage Repair"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0E1A2B20] to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#F3E2D5] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none" />
      </section>

      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        focusField={focusField}
      />
    </>
  );
};

export default HeroSection;
