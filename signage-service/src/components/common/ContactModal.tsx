'use client';

import React, { Activity, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocale, useTranslations } from 'next-intl';
import { ArrowRightIcon, ChatBubbleOvalLeftEllipsisIcon, EnvelopeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import ContactForm from './ContactForm';
import Logo from '../common/Logo';
import { SITE_CONFIG } from '@/lib/site-config';
import type { CalculationSnapshot } from '@/lib/calculation-snapshot';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: () => void;
  initialIssueType?: string;
  initialMessage?: string;
  calculationSnapshot?: CalculationSnapshot | null;
}

const ContactModal = ({
  isOpen,
  onClose,
  onOpenChat,
  initialIssueType,
  initialMessage,
  calculationSnapshot,
}: ContactModalProps) => {
  const t = useTranslations('ContactModal');
  const locale = useLocale();
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => { closeRef.current = onClose; }, [onClose]);
  const [hasOpened, setHasOpened] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [viewportFrame, setViewportFrame] = useState({ height: '100svh', offsetTop: '0px' });
  const previousBodyOverflowRef = useRef<string | null>(null);

  useEffect(() => {
    let renderTimer: ReturnType<typeof setTimeout> | null = null;
    let closeTimer: ReturnType<typeof setTimeout> | null = null;

    if (isOpen) {
      renderTimer = setTimeout(() => { setIsRendered(true); setHasOpened(true); }, 0);
      if (previousBodyOverflowRef.current === null) {
        previousBodyOverflowRef.current = document.body.style.overflow;
      }
      document.body.style.overflow = 'hidden';
    } else {
      closeTimer = setTimeout(() => setIsRendered(false), 300);
      if (previousBodyOverflowRef.current !== null) {
        document.body.style.overflow = previousBodyOverflowRef.current;
        previousBodyOverflowRef.current = null;
      }
      return () => {
        if (closeTimer) {
          clearTimeout(closeTimer);
        }
        if (renderTimer) {
          clearTimeout(renderTimer);
        }
      };
    }
    return () => {
      if (renderTimer) {
        clearTimeout(renderTimer);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (previousBodyOverflowRef.current !== null) {
        document.body.style.overflow = previousBodyOverflowRef.current;
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const updateViewportFrame = () => {
      const viewport = window.visualViewport;
      setViewportFrame({
        height: `${Math.round(viewport?.height ?? window.innerHeight)}px`,
        offsetTop: `${Math.round(viewport?.offsetTop ?? 0)}px`,
      });
    };

    updateViewportFrame();
    window.visualViewport?.addEventListener('resize', updateViewportFrame);
    window.visualViewport?.addEventListener('scroll', updateViewportFrame);
    window.addEventListener('resize', updateViewportFrame);

    return () => {
      window.visualViewport?.removeEventListener('resize', updateViewportFrame);
      window.visualViewport?.removeEventListener('scroll', updateViewportFrame);
      window.removeEventListener('resize', updateViewportFrame);
      setViewportFrame({ height: '100svh', offsetTop: '0px' });
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const dialog = dialogRef.current;
    dialog?.focus({ preventScroll: true });
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeRef.current();
      }
      if (event.key !== 'Tab' || !dialog) return;
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), summary, [tabindex="0"]'
      )).filter((element) => element.getClientRects().length > 0 && !element.closest('[inert]'));
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (dialog?.contains(document.activeElement)) trigger?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const portalRoot = typeof document === 'undefined' ? null : document.body;
  if ((!hasOpened && !isOpen) || !portalRoot) return null;
  const linkClass = 'inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-sm font-medium text-[#0E1A2B] transition-colors hover:bg-[#F5F3F0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E]';

  return createPortal(
    <Activity mode={isOpen || isRendered ? 'visible' : 'hidden'}>
      <div
        dir={locale === 'ar' ? 'rtl' : 'ltr'}
        inert={!isOpen}
        className={`fixed inset-x-0 z-[10000] flex items-center justify-center p-2 sm:p-6 transition-opacity duration-200 motion-reduce:transition-none ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ top: viewportFrame.offsetTop, height: viewportFrame.height }}
      >
        <div className="absolute inset-0 bg-[#0E1A2B]/40 backdrop-blur-md" onClick={onClose} />
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="relative max-h-full w-full max-w-[1040px] overflow-y-auto overscroll-contain rounded-[28px] bg-white text-start text-[#0E1A2B] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] outline-none sm:rounded-[36px]"
        >
          <button type="button" onClick={onClose} aria-label={t('compact.close')} className="absolute end-3 top-3 z-10 flex size-11 items-center justify-center rounded-full bg-black/5 hover:bg-black/10 focus-visible:outline-2 focus-visible:outline-[#B8643E] sm:end-5 sm:top-5">
            <XMarkIcon aria-hidden="true" className="size-5" />
          </button>
          <div className="grid md:grid-cols-[1.62fr_1fr]">
            <section className="min-w-0 px-5 pb-6 pt-6 sm:px-10 sm:pb-5 sm:pt-5">
              <Logo compact className="mb-4 pe-10 [&>svg]:size-9" />
              <h2 id={titleId} className="text-[28px] font-bold leading-tight tracking-tight sm:text-[30px]">{t('compact.title')}</h2>
              <p className="mb-3 mt-2 text-[15px] leading-relaxed text-[#596273] sm:text-base">{t('compact.intro')}</p>
              <ContactForm compact initialIssueType={initialIssueType} initialMessage={initialMessage} calculationSnapshot={calculationSnapshot} />
            </section>
            <aside className="flex min-w-0 flex-col border-t border-[#E7E3DE] bg-[#F7F3ED] px-5 py-6 sm:px-8 md:border-t-0 md:pb-8 md:pt-24">
              <ChatBubbleOvalLeftEllipsisIcon aria-hidden="true" className="mb-4 size-10 text-[#B8643E] md:mb-5 md:size-12" />
              <h3 className="max-w-[280px] text-[24px] font-bold leading-tight tracking-tight md:text-[28px]">{t('compact.assistant_title')}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[#596273] md:text-base">{t('compact.assistant_description')}</p>
              <p className="mb-5 mt-6 text-sm leading-relaxed text-[#596273]">{t('compact.assistant_hint')}</p>
              <button type="button" onClick={() => { onClose(); onOpenChat(); }} className="inline-flex min-h-12 items-center justify-center gap-3 rounded-2xl border border-[#B8643E] px-4 py-3 text-sm font-semibold text-[#A55230] transition-colors hover:bg-[#B8643E]/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E]">
                {t('compact.assistant_action')}<ArrowRightIcon aria-hidden="true" className="size-5 shrink-0 rtl:rotate-180" />
              </button>
              <p className="mt-6 text-sm leading-relaxed text-[#596273] md:mt-auto md:pt-10">{t('compact.human_service')}</p>
            </aside>
          </div>
          <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-[#E7E3DE] px-5 py-3 sm:px-10">
            <p className="text-sm text-[#596273]">{t('compact.other_channels')}</p>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <a href={SITE_CONFIG.messengers.whatsapp} target="_blank" rel="noopener noreferrer" className={linkClass}>
                <span className="text-[#22A957]"><svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg></span>WhatsApp
              </a>
              <a href={SITE_CONFIG.messengers.telegram} target="_blank" rel="noopener noreferrer" className={linkClass}>
                <span className="text-[#0088CC]"><svg aria-hidden="true" className="size-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg></span>Telegram
              </a>
              <a href={`mailto:${SITE_CONFIG.company.email}`} className={linkClass}>
                <EnvelopeIcon aria-hidden="true" className="size-5" />{t('compact.email_channel')}
              </a>
            </div>
          </footer>
        </div>
      </div>
    </Activity>,
    portalRoot
  );
};

export default ContactModal;
