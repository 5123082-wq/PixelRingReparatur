'use client';

import type { MouseEvent, ReactNode } from 'react';

import { useRouter } from '@/i18n/routing';

export default function PortalRequestModalShell({ children }: { children: ReactNode }) {
  const router = useRouter();

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
