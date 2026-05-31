'use client';

import React, { useEffect } from 'react';
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
  formTitle = 'Instandsetzung anfragen',
  reassuringLabel = 'Einschätzung & Lösung',
  formIntro = 'Geben Sie Ihre Kontaktdaten an, um das Ticket für diesen Defekt direkt in unser System einzustellen.',
}: LeistungenProblemDrawerProps) {
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
        <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#0E1A2B]/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="relative w-full max-w-[480px] h-full bg-[#0D1B2A]/95 backdrop-blur-3xl border-l border-white/10 shadow-2xl flex flex-col z-10 text-white"
          >
            {/* Technical grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.02] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, white 1.5px, transparent 1.5px)',
                backgroundSize: '36px 36px'
              }}
            />

            {/* Glowing spot */}
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#B8643E]/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />

            {/* Header */}
            <div className="relative flex items-center justify-between gap-4 border-b border-white/10 p-5 sm:p-6 z-10">
              <div className="ltr:text-left rtl:text-right">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#B8643E]">
                  Pixel Ring Service-Info
                </span>
                <h3 className="mt-1 text-xl sm:text-2xl font-black text-white leading-tight">
                  {title}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-white transition-colors"
                aria-label={closeLabel}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content Area (Scrollable) */}
            <div className="relative flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col gap-6 z-10 scrollbar-thin">
              {/* Reassuring Text / Advice */}
              <div className="rounded-2xl border border-[#B8643E]/20 bg-[#B8643E]/5 p-4 text-white/90">
                <h4 className="text-[11px] font-black uppercase tracking-[0.15em] text-[#B8643E] mb-2">
                  {reassuringLabel}
                </h4>
                <p className="text-[14px] leading-relaxed font-medium">
                  {reassuringText}
                </p>
              </div>

              {/* Form Section */}
              <div className="flex flex-col gap-4">
                <div className="border-t border-white/10 pt-5 ltr:text-left rtl:text-right">
                  <h4 className="text-[16px] font-extrabold text-white tracking-tight mb-1">
                    {formTitle}
                  </h4>
                  <p className="text-[13px] text-white/60">
                    {formIntro}
                  </p>
                </div>

                <div className="flex-1">
                  <ContactForm
                    variant="dark"
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
