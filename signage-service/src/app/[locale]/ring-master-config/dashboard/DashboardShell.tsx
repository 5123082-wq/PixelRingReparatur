'use client';

import { useRouter, usePathname, useParams } from 'next/navigation';
import { useState } from 'react';

import {
  getLocaleSegment,
  isLocalizedRouteActive,
  withLocalePath,
} from '../../admin-route';
import { adminFetch } from '@/lib/admin-fetch';

export default function CmsDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const locale = getLocaleSegment(params?.locale);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await adminFetch('/api/cms/auth', { method: 'DELETE' });
    router.push(withLocalePath(locale, '/ring-master-config'));
  }

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <span style={{ fontSize: '24px' }}>⚙️</span>
          <span style={styles.brandText}>PixelRing CMS</span>
        </div>

        <nav style={styles.nav}>
          <button
            onClick={() => router.push(withLocalePath(locale, '/ring-master-config/dashboard'))}
            style={{
              ...styles.navItem,
              ...(isLocalizedRouteActive(
                pathname,
                locale,
                '/ring-master-config/dashboard'
              )
                ? styles.navItemActive
                : {}),
            }}
          >
            🏠 Dashboard
          </button>
          
          <button
            onClick={() =>
              router.push(
                withLocalePath(locale, '/ring-master-config/dashboard/articles')
              )
            }
            style={{
              ...styles.navItem,
              ...(isLocalizedRouteActive(
                pathname,
                locale,
                '/ring-master-config/dashboard/articles'
              )
                ? styles.navItemActive
                : {}),
            }}
          >
            📄 Content (Wiki/GEO)
          </button>

          <button
            onClick={() =>
              router.push(
                withLocalePath(locale, '/ring-master-config/dashboard/pages')
              )
            }
            style={{
              ...styles.navItem,
              ...(isLocalizedRouteActive(
                pathname,
                locale,
                '/ring-master-config/dashboard/pages'
              )
                ? styles.navItemActive
                : {}),
            }}
          >
            🧩 Page CMS
          </button>

          <button
            onClick={() =>
              router.push(
                withLocalePath(locale, '/ring-master-config/dashboard/media')
              )
            }
            style={{
              ...styles.navItem,
              ...(isLocalizedRouteActive(
                pathname,
                locale,
                '/ring-master-config/dashboard/media'
              )
                ? styles.navItemActive
                : {}),
            }}
          >
            🖼️ Media Library
          </button>

          <button
            onClick={() => router.push(withLocalePath(locale, '/ring-master-config/dashboard/ai'))}
            style={{
              ...styles.navItem,
              ...(isLocalizedRouteActive(
                pathname,
                locale,
                '/ring-master-config/dashboard/ai'
              )
                ? styles.navItemActive
                : {}),
            }}
          >
            🤖 AI Knowledge
          </button>
        </nav>

        <div style={styles.sidebarFooter}>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={styles.logoutBtn}
          >
            {loggingOut ? '...' : '🚪 Exit Config'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
    background: '#0a0a0a',
    color: '#e5e5e5',
    fontFamily: "'Inter', sans-serif",
  },
  sidebar: {
    width: '240px',
    background: '#111',
    borderRight: '1px solid #222',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px',
    flexShrink: 0,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 12px',
    marginBottom: '32px',
  },
  brandText: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '0.02em',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 14px',
    fontSize: '14px',
    color: '#888',
    background: 'transparent',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  navItemActive: {
    background: '#8b5cf6', // Violet accent
    color: '#fff',
    fontWeight: 600,
  },
  sidebarFooter: {
    borderTop: '1px solid #222',
    paddingTop: '16px',
  },
  logoutBtn: {
    width: '100%',
    padding: '12px 14px',
    fontSize: '13px',
    color: '#555',
    background: 'transparent',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    textAlign: 'left' as const,
  },
  main: {
    flex: 1,
    padding: '40px',
    overflowY: 'auto' as const,
  },
};
