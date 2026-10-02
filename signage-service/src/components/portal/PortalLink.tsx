'use client';
import { Link, useRouter } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { type ComponentProps } from 'react';
const prefetched = new Set<string>();
export function clearPortalPrefetch() { prefetched.clear(); }
export default function PortalLink(props: ComponentProps<typeof Link>) {
  const router = useRouter(); const locale = useLocale();

  const prefetch = () => { if (typeof props.href !== 'string' || !props.href.startsWith('/portal/requests/')) return;
    const key = locale + ':' + props.href; if (!prefetched.has(key)) { prefetched.add(key); router.prefetch(props.href); } };
  return <Link {...props} prefetch={false} onMouseEnter={event => { props.onMouseEnter?.(event); prefetch(); }} onFocus={event => { props.onFocus?.(event); prefetch(); }} />;
}
