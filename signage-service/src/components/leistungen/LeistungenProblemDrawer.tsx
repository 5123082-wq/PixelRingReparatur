'use client';

import React, { useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContactForm from '../common/ContactForm';

interface LeistungenProblemDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  reassuringText: string;
  initialMessage: string;
  initialIssueType: string;
  closeLabel?: string;
  serviceInfoLabel?: string;
  formTitle?: string;
  reassuringLabel?: string;
  formIntro?: string;
}

export default function LeistungenProblemDrawer({
  isOpen,
  onClose,
  title,
  reassuringText,
  initialMessage,
  initialIssueType,
  closeLabel = 'Schließen',
  serviceInfoLabel = 'PixelRing Service-Info',
  formTitle = 'Instandsetzung anfragen',
  reassuringLabel = 'Einschätzung & Lösung',
  formIntro = 'Geben Sie Ihre Kontaktdaten an, um das Ticket für diesen Defekt direkt in unser System einzustellen.',
}: LeistungenProblemDrawerProps) {
  const titleId = useId();

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden p-2 sm:p-4 md:p-5">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0E1A2B]/52 backdrop-blur-md"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: 'calc(100% + 24px)' }}
            animate={{ x: 0 }}
            exit={{ x: 'calc(100% + 24px)' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="relative z-10 flex h-full w-full max-w-[620px] flex-col overflow-hidden rounded-[24px] border border-[#E7DDD3] bg-[#FFFDF9] text-[#0E1A2B] shadow-[0_28px_90px_rgba(14,26,43,0.28)] sm:rounded-[28px]"
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[#B8643E]" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#F7F1E8] to-transparent" />

            {/* Header */}
            <div className="relative z-10 flex items-start justify-between gap-4 border-b border-[#E7DDD3] bg-white/72 p-5 backdrop-blur-xl sm:p-6">
              <div className="ltr:text-left rtl:text-right">
                <span className="text-[10px] font-black uppercase tracking-[0.18em] text-[#B8643E]">
                  {serviceInfoLabel}
                </span>
                <h3 id={titleId} className="mt-1 text-[24px] font-black leading-[1.05] tracking-[0] text-[#0E1A2B] sm:text-[30px]">
                  {title}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-[#D9C7BA] bg-white text-[#526174] transition-colors hover:border-[#B8643E] hover:text-[#0E1A2B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E]"
                aria-label={closeLabel}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content Area (Scrollable) */}
            <div className="relative z-10 flex flex-1 flex-col gap-6 overflow-y-auto p-5 sm:p-6">
              {/* Reassuring Text / Advice */}
              <div className="rounded-[20px] border border-[#E7DDD3] bg-white p-4 text-[#344253] shadow-[0_12px_32px_rgba(14,26,43,0.06)] sm:p-5">
                <h4 className="mb-2 text-[11px] font-black uppercase tracking-[0.14em] text-[#B8643E]">
                  {reassuringLabel}
                </h4>
                <p className="text-[15px] font-semibold leading-7">
                  {reassuringText}
                </p>
              </div>

              {/* Form Section */}
              <div className="flex flex-col gap-4">
                <div className="border-t border-[#E7DDD3] pt-5 ltr:text-left rtl:text-right">
                  <h4 className="mb-1 text-[18px] font-extrabold tracking-[0] text-[#0E1A2B]">
                    {formTitle}
                  </h4>
                  <p className="text-[14px] font-medium leading-6 text-[#526174]">
                    {formIntro}
                  </p>
                </div>

                <div className="flex-1">
                  <ContactForm
                    variant="light"
                    layout="single"
                    dropdownPosition="bottom"
                    initialIssueType={initialIssueType}
                    initialMessage={initialMessage}
                    onSuccess={() => {
                      setTimeout(() => {
                        onClose();
                      }, 4000);
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
