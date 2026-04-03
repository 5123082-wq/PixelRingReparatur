'use client';

import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

const ExcellenceCarousel = () => {
  const t = useTranslations('Excellence');

  const items = [
    {
      title: t('items.0.title'),
      tag: t('items.0.tag'),
      description: t('items.0.description'),
      image: '/images/ex-mounting.png',
    },
    {
      title: t('items.1.title'),
      tag: t('items.1.tag'),
      description: t('items.1.description'),
      image: '/images/ex-repair.png',
    },
    {
      title: t('items.2.title'),
      tag: t('items.2.tag'),
      description: t('items.2.description'),
      image: '/images/ex-maintenance.png',
    },
  ];

  return (
    <section className="w-full bg-[#F4EDE4] py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col gap-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-4">
            <h2 className="text-[40px] md:text-[48px] font-bold text-[#0E1A2B] leading-tight">
              {t('title')}
            </h2>
            <p className="text-[18px] text-[#72665D] max-w-xl">
              {t('subtitle')}
            </p>
          </div>
          <div className="flex gap-4">
            {/* Carousel navigation placeholders */}
            <div className="w-12 h-12 rounded-full border border-[#E7DDD3] flex items-center justify-center cursor-pointer hover:bg-white transition-all">
              <svg className="w-6 h-6 text-[#0E1A2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <div className="w-12 h-12 rounded-full border border-[#0E1A2B] flex items-center justify-center cursor-pointer hover:bg-white transition-all">
              <svg className="w-6 h-6 text-[#0E1A2B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex gap-8 overflow-x-auto pb-8 snap-x no-scrollbar">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[350px] md:w-[400px] h-[600px] relative rounded-[40px] overflow-hidden snap-start group shadow-2xl shadow-[#0E1A2B10]"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E1A2BCC] via-[#0E1A2B20] to-transparent" />
              
              <div className="absolute bottom-0 left-0 p-10 flex flex-col gap-4 text-white">
                <span className="self-start px-4 py-1 bg-[#B8643E] rounded-full text-[12px] font-bold uppercase tracking-wider">
                  #{item.tag}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[28px] font-bold leading-tight">
                    {item.title}
                  </h3>
                  <p className="text-[16px] text-white/80 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExcellenceCarousel;
