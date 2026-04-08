'use client';

import { useRouter, usePathname, useParams } from 'next/navigation';
import { useState } from 'react';

import {
  getLocaleSegment,
  isLocalizedRouteActive,
  withLocalePath,
} from '../../admin-route';
import { adminFetch } from '@/lib/admin-fetch';

export default function CrmDashboardShell({
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

    await adminFetch('/api/admin/auth', { method: 'DELETE' });

    router.push(withLocalePath(locale, '/ring-manager-crm'));
  }

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.brand}>
          <span style={{ fontSize: '24px' }}>📦</span>
          <span style={styles.brandText}>PixelRing CRM</span>
        </div>

        <nav style={styles.nav}>
          <button
            onClick={() => router.push(withLocalePath(locale, '/ring-manager-crm/dashboard'))}
            style={{
              ...styles.navItem,
              ...(isLocalizedRouteActive(
                pathname,
                locale,
                '/ring-manager-crm/dashboard'
              )
                ? styles.navItemActive
                : {}),
            }}
          >
            📋 Заявки
          </button>
        </nav>

        <div style={styles.sidebarFooter}>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            style={styles.logoutBtn}
          >
            {loggingOut ? '...' : '🚪 Выход'}
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
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  sidebar: {
    width: '220px',
    background: '#111',
    borderRight: '1px solid #222',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 12px',
    flexShrink: 0,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    marginBottom: '24px',
  },
  brandText: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '0.02em',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    flex: 1,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    fontSize: '14px',
    color: '#999',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left' as const,
    transition: 'all 0.15s',
  },
  navItemActive: {
    background: '#1a1a1a',
    color: '#fff',
  },
  sidebarFooter: {
    borderTop: '1px solid #222',
    paddingTop: '12px',
  },
  logoutBtn: {
    width: '100%',
    padding: '10px 12px',
    fontSize: '13px',
    color: '#666',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'left' as const,
  },
  main: {
    flex: 1,
    padding: '32px',
    overflowY: 'auto' as const,
  },
};
