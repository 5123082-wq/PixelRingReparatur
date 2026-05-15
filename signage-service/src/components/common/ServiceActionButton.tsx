'use client';

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SITE_CONFIG } from '@/lib/site-config';

type ServiceActionButtonProps = {
  label: string;
  onOpenContact: () => void;
  onOpenChat: () => void;
  className?: string;
};

const actionItems = [
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    kind: 'link' as const,
    href: SITE_CONFIG.messengers.whatsapp,
    className: 'text-[#25D366]',
    icon: (
      <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </svg>
    ),
  },
  {
    key: 'telegram',
    label: 'Telegram',
    kind: 'link' as const,
    href: SITE_CONFIG.messengers.telegram,
    className: 'text-[#0088CC]',
    icon: (
      <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0Zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635Z" />
      </svg>
    ),
  },
  {
    key: 'chat',
    label: 'Chat',
    kind: 'button' as const,
    className: 'text-[#B8643E]',
    icon: (
      <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7.5 9.25h9M7.5 13h5.75M12 21a9 9 0 1 0-8.1-5.08L3 21l5.08-.9A8.96 8.96 0 0 0 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function ServiceActionButton({
  label,
  onOpenContact,
  onOpenChat,
  className = '',
}: ServiceActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const closeIfFocusLeaves = (event: React.FocusEvent<HTMLDivElement>) => {
    const nextTarget = event.relatedTarget;
    if (!nextTarget || !event.currentTarget.contains(nextTarget as Node)) {
      setIsOpen(false);
    }
  };

  return (
    <motion.div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocusCapture={() => setIsOpen(true)}
      onBlurCapture={closeIfFocusLeaves}
      initial={false}
      animate={{ width: isOpen ? 342 : 188 }}
      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
      className={`relative hidden h-11 shrink-0 overflow-visible rounded-full lg:inline-flex ${className}`}
    >
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="service-action-rail"
            aria-hidden={!isOpen}
            initial={{ width: 0, opacity: 0, x: 26, scaleX: 0.88 }}
            animate={{ width: 168, opacity: 1, x: 0, scaleX: 1 }}
            exit={{ width: 0, opacity: 0, x: 26, scaleX: 0.88 }}
            transition={{ type: 'spring', stiffness: 420, damping: 36 }}
            className="absolute inset-y-0 left-0 z-10 origin-right overflow-hidden rounded-full border border-white/55 bg-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),inset_0_-12px_28px_rgba(255,255,255,0.18),0_14px_34px_rgba(14,26,43,0.12)] backdrop-blur-2xl"
          >
            <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-br from-white/70 via-white/22 to-white/5" />
            <div className="pointer-events-none absolute inset-x-5 top-1 h-px bg-white/80" />
            <div className="relative z-10 flex h-full items-center gap-2 pl-2 pr-8">
              {actionItems.map((item) => {
                const content = (
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-full border border-white/65 bg-white/32 shadow-[inset_0_1px_0_rgba(255,255,255,0.82),0_8px_18px_rgba(14,26,43,0.10)] backdrop-blur-xl transition-transform duration-200 hover:scale-105 ${item.className}`}
                  >
                    {item.icon}
                  </span>
                );

                if (item.kind === 'link') {
                  return (
                    <a
                      key={item.key}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-white/30"
                    >
                      {content}
                    </a>
                  );
                }

                return (
                  <button
                    key={item.key}
                    type="button"
                    aria-label={item.label}
                    onClick={onOpenChat}
                    className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-white/30"
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={onOpenContact}
        className="absolute inset-y-0 right-0 z-20 flex w-[188px] items-center justify-center whitespace-nowrap rounded-full bg-[#B8643E] px-5 text-[16px] font-medium text-[#FFFDF9] shadow-lg shadow-[#B8643E33] outline-none transition-colors hover:bg-[#A65835] focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#B8643E] active:scale-[0.98]"
      >
        {label}
      </button>
    </motion.div>
  );
}
