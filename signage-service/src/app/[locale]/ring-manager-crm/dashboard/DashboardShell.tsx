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

  const navItems = [
    { name: 'Заявки', icon: '📋', path: '/ring-manager-crm/dashboard' },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30 selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900/50 backdrop-blur-xl border-r border-zinc-800/50 flex flex-col p-6 shrink-0 relative z-10 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-3 px-2 mb-10">
          <span className="text-2xl drop-shadow-md">📦</span>
          <span className="text-lg font-bold text-white tracking-tight bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
            PixelRing CRM
          </span>
        </div>

        <nav className="flex flex-col gap-1.5 flex-1">
          {navItems.map((item) => {
            const isActive = isLocalizedRouteActive(pathname, locale, item.path);
            return (
              <button
                key={item.path}
                onClick={() => router.push(withLocalePath(locale, item.path))}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl text-left transition-all duration-300 font-medium ${
                  isActive
                    ? 'bg-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.3)] text-white'
                    : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
                }`}
              >
                <span className="text-[16px] leading-none opacity-90">{item.icon}</span>
                {item.name}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-zinc-800/50">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-zinc-500 bg-zinc-900/40 border border-zinc-800/80 hover:border-red-900/50 hover:bg-red-950/30 hover:text-red-400 rounded-xl transition-all shadow-sm text-left font-medium group"
          >
            <span className="text-[16px] leading-none opacity-80 group-hover:opacity-100">🚪</span>
            {loggingOut ? 'Выход...' : 'Выход'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 md:p-12 overflow-y-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-900/40 via-zinc-950 to-zinc-950 max-h-screen relative">
        <div className="max-w-[1400px] mx-auto w-full relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
}
