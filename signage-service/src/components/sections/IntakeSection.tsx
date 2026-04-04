'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import ContactModal from '../common/ContactModal';
import ChatModal from '../common/ChatModal';

const IntakeSection = () => {
  const t = useTranslations('Intake');
  const [modalOpen, setModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const methods = [
    {
      id: 'text',
      title: t('methods.0.title'),
      label: t('methods.0.label'),
      focus: 'text' as const,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
    },
    {
      id: 'photo',
      title: t('methods.1.title'),
      label: t('methods.1.label'),
      focus: 'photo' as const,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: 'voice',
      title: t('methods.2.title'),
      label: t('methods.2.label'),
      focus: 'text' as const,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
      ),
    },
    {
      id: 'messenger',
      title: t('methods.3.title'),
      label: t('methods.3.label'),
      focus: null,
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
  ];

  const handleCardClick = () => {
    setModalOpen(true);
  };

  return (
    <>
      <section className="w-full bg-[#F7F1E8] py-24 px-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-12 text-center">
          <div className="flex flex-col gap-4 items-center">
            <h2 className="text-[40px] md:text-[48px] font-bold text-[#0E1A2B] leading-tight">
              {t('title')}
            </h2>
            <p className="text-[18px] text-[#72665D] max-w-2xl leading-[1.6]">
              {t('description')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {methods.map((method) => (
              <div
                key={method.id}
                onClick={() => handleCardClick()}
                className="bg-white p-8 rounded-[40px] shadow-xl shadow-[#0E1A2B08] border border-[#E7DDD3] hover:border-[#B8643E] hover:translate-y-[-8px] transition-all duration-300 cursor-pointer flex flex-col items-center text-center gap-6 group"
              >
                <div className="w-16 h-16 rounded-3xl bg-[#EED8C8] flex items-center justify-center text-[#B8643E] group-hover:bg-[#B8643E] group-hover:text-white transition-all duration-300">
                  {method.icon}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[20px] font-bold text-[#0E1A2B]">
                    {method.title}
                  </h3>
                  <p className="text-[14px] text-[#72665D]">
                    {method.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onOpenChat={() => setChatOpen(true)}
      />
      <ChatModal
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </>
  );
};

export default IntakeSection;
