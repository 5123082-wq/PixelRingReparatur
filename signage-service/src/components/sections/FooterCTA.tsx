'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

const FooterCTA = () => {
  const t = useTranslations('FooterCTA');

  const channels = [
    { id: 'whatsapp', name: t('channels.0.name'), icon: '💬' },
    { id: 'telegram', name: t('channels.1.name'), icon: '✈️' },
    { id: 'chat', name: t('channels.2.name'), icon: '👩‍💻' },
    { id: 'email', name: t('channels.3.name'), icon: '✉️' },
  ];

  return (
    <section className="w-full bg-gradient-to-br from-[#0040a1] to-[#0056d2] py-24 px-6 relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-10 left-10 w-64 h-64 border border-white rounded-full" />
        <div className="absolute bottom-20 right-20 w-96 h-96 border border-white rounded-full opacity-50" />
      </div>

      <div className="max-w-4xl mx-auto flex flex-col gap-12 text-center text-white relative z-10">
        <div className="flex flex-col gap-4">
          <h2 className="text-[40px] md:text-[48px] font-bold leading-tight tracking-tight">
            {t('title')}
          </h2>
          <p className="text-[20px] text-white/80 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
          {channels.map((channel) => (
            <div
              key={channel.id}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] hover:bg-white/10 hover:translate-y-[-8px] transition-all duration-300 cursor-pointer flex flex-col items-center gap-4 group"
            >
              <div className="text-3xl grayscale group-hover:grayscale-0 transition-all">
                {channel.icon}
              </div>
              <span className="text-[16px] font-bold tracking-wide">
                {channel.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FooterCTA;
