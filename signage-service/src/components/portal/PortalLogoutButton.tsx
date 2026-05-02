'use client';

import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function PortalLogoutButton() {
  const t = useTranslations('Portal');
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function logout() {
    setIsLoggingOut(true);
    try {
      await fetch('/api/portal/demo-auth', { method: 'DELETE' });
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={isLoggingOut}
      className="h-11 rounded-2xl border border-[#D0D5DD] bg-white px-4 text-[14px] font-black text-[#344054] transition hover:border-[#B8643E] hover:text-[#B8643E] disabled:opacity-60"
    >
      {isLoggingOut ? t('logoutLoading') : t('logout')}
    </button>
  );
}
