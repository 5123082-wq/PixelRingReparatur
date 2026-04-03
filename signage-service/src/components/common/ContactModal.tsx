'use client';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import MessengerButtons from './MessengerButtons';
import ContactForm from './ContactForm';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  focusField?: 'text' | 'photo' | null;
}

const ContactModal = ({ isOpen, onClose, focusField = null }: ContactModalProps) => {
  const t = useTranslations('ContactModal');

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl animate-in slide-in-from-bottom-4 duration-300 z-10">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 ltr:right-5 rtl:left-5 w-10 h-10 flex items-center justify-center rounded-full bg-[#F7F1E8] hover:bg-[#E7DDD3] text-[#72665D] transition-colors z-20"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="p-8 pt-10 flex flex-col gap-8">
          {/* Title */}
          <div className="flex flex-col gap-2 ltr:pr-10 rtl:pl-10">
            <h3 className="text-[24px] font-bold text-[#0E1A2B]">
              {t('title')}
            </h3>
            <p className="text-[15px] text-[#72665D]">
              {t('subtitle')}
            </p>
          </div>

          {/* Messenger buttons */}
          <div className="flex flex-col gap-3">
            <p className="text-[13px] font-bold text-[#72665D] uppercase tracking-[1.2px]">
              {t('messenger_label')}
            </p>
            <MessengerButtons />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-[#E7DDD3]" />
            <span className="text-[13px] font-bold text-[#72665D] uppercase tracking-[1.2px]">
              {t('divider')}
            </span>
            <div className="flex-1 h-px bg-[#E7DDD3]" />
          </div>

          {/* Contact Form */}
          <ContactForm focusField={focusField} onSuccess={onClose} />
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
