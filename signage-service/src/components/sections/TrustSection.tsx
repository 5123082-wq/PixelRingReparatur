'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

const TrustSection = () => {
  const t = useTranslations('Trust');
  
  // Custom interface for localized bullet
  interface Bullet {
    title: string;
    description: string;
  }

  // Accessing array from next-intl (using raw or predefined keys)
  const bullets: Bullet[] = [
    { title: t('bullets.0.title'), description: t('bullets.0.description') },
    { title: t('bullets.1.title'), description: t('bullets.1.description') },
    { title: t('bullets.2.title'), description: t('bullets.2.description') },
    { title: t('bullets.3.title'), description: t('bullets.3.description') },
  ];

  return (
    <section className="w-full bg-[#F3E2D5] py-24 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-16 items-start">
        {/* Left Aspect: Heading */}
        <div className="md:w-1/3 flex flex-col gap-6">
          <h2 className="text-[36px] md:text-[44px] font-bold text-[#0E1A2B] leading-tight tracking-tight">
            {t('title')}
          </h2>
          <div className="w-20 h-1 bg-[#C86E4A] rounded-full" />
        </div>

        {/* Right Aspect: Grid of Trust markers */}
        <div className="md:w-2/3 grid sm:grid-cols-2 gap-x-12 gap-y-16">
          {bullets.map((bullet, index) => (
            <div key={index} className="flex flex-col gap-4 group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#C86E4A]/10 flex items-center justify-center text-[#C86E4A] group-hover:bg-[#C86E4A] group-hover:text-white transition-all duration-300 font-bold">
                  {index + 1}
                </div>
                <h3 className="text-[20px] font-bold text-[#0E1A2B]">
                  {bullet.title}
                </h3>
              </div>
              <p className="text-[16px] leading-[1.6] text-[#72665D]">
                {bullet.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
