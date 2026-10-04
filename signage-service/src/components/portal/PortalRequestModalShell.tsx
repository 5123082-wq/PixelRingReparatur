'use client';

import { useLayoutEffect, type MouseEvent, type ReactNode } from 'react';

import { useRouter } from '@/i18n/routing';

export default function PortalRequestModalShell({ children }: { children: ReactNode }) {
  const router = useRouter();

  useLayoutEffect(() => {
    const body = document.body;
    const root = document.documentElement;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const originalStyle = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
      rootOverflow: root.style.overflow,
      rootScrollBehavior: root.style.scrollBehavior,
    };
    const scrollbarWidth = window.innerWidth - root.clientWidth;
    const paddingRight = window.getComputedStyle(body).paddingRight;

    // Fix the background in place on iOS while the dialog scrolls independently.
    body.style.position = 'fixed';
    body.style.top = `${-scrollY}px`;
    body.style.left = `${-scrollX}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `calc(${paddingRight} + ${scrollbarWidth}px)`;
    root.style.overflow = 'hidden';

    return () => {
      body.style.position = originalStyle.position;
      body.style.top = originalStyle.top;
      body.style.left = originalStyle.left;
      body.style.width = originalStyle.width;
      body.style.overflow = originalStyle.overflow;
      body.style.paddingRight = originalStyle.paddingRight;
      root.style.overflow = originalStyle.rootOverflow;
      root.style.scrollBehavior = 'auto';
      window.scrollTo(scrollX, scrollY);
      root.style.scrollBehavior = originalStyle.rootScrollBehavior;
    };
  }, []);

  function closeModal() {
    router.push('/portal');
  }

  function closeOnBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F1C2B]/25 p-2 text-[#172033] backdrop-blur-[3px] sm:p-6"
      onClick={closeOnBackdropClick}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          closeModal();
        }
      }}
    >
      {children}
    </div>
  );
}
