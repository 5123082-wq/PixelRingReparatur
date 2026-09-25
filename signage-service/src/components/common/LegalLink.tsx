'use client';

import type { ComponentProps } from 'react';
import { useLocale } from 'next-intl';

export default function LegalLink(props: ComponentProps<'a'>) {
  const locale = useLocale();

  function rememberLocale() {
    // Keep the original language when moving between German legal documents.
    if (/^\/de\/(?:impressum|privacy)\/?$/.test(window.location.pathname)) return;

    // Only the interface language is retained, for this browser session.
    try {
      document.cookie = `pixelring_legal_navigation_locale=${encodeURIComponent(locale)}; Path=/; SameSite=Lax${window.location.protocol === 'https:' ? '; Secure' : ''}`;
    } catch {
      // The German document remains accessible when browser storage is disabled.
    }
  }

  // A document navigation sends the saved locale without reusing a prefetched page.
  return (
    <a
      {...props}
      onPointerDown={rememberLocale}
      onClick={rememberLocale}
      hrefLang="de"
    />
  );
}
