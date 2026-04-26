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

  const navItems = [
    { name: 'Dashboard', icon: '🏠', path: '/ring-master-config/dashboard' },
    { name: 'Content (Wiki/GEO)', icon: '📄', path: '/ring-master-config/dashboard/articles' },
    { name: 'Page CMS', icon: '🧩', path: '/ring-master-config/dashboard/pages' },
    { name: 'Media Library', icon: '🖼️', path: '/ring-master-config/dashboard/media' },
    { name: 'AI Knowledge', icon: '🤖', path: '/ring-master-config/dashboard/ai' },
  ];

  return (
    <div className="cms-soft-admin flex h-screen w-full bg-black text-zinc-100 font-sans selection:bg-violet-500/30 selection:text-white overflow-hidden">
      <style>{`
        .cms-soft-admin {
          background: #15161c !important;
          color: #f4f5f7;
        }

        .cms-soft-admin aside,
        .cms-soft-admin main,
        .cms-soft-admin header,
        .cms-soft-admin [class*="bg-[#050505]"],
        .cms-soft-admin [class*="bg-[#08080a]"],
        .cms-soft-admin [class*="bg-[#0a0a0c]"],
        .cms-soft-admin [class*="bg-black"] {
          background-color: #171922 !important;
        }

        .cms-soft-admin aside {
          background: #191b24 !important;
        }

        .cms-soft-admin main {
          background: #1b1d26 !important;
        }

        .cms-soft-admin header {
          background: rgba(27, 29, 38, 0.92) !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
        }

        .cms-soft-admin section,
        .cms-soft-admin details,
        .cms-soft-admin [class*="bg-white/[0.02"],
        .cms-soft-admin [class*="bg-white/[0.025"],
        .cms-soft-admin [class*="bg-white/[0.03"],
        .cms-soft-admin [class*="bg-white/[0.04"] {
          background-color: #222530 !important;
        }

        .cms-soft-admin button:not([class*="from-cyan"]):not([class*="from-white"]),
        .cms-soft-admin input,
        .cms-soft-admin select,
        .cms-soft-admin textarea {
          background-color: #242733 !important;
          border-color: rgba(255, 255, 255, 0.16) !important;
        }

        .cms-soft-admin input,
        .cms-soft-admin select,
        .cms-soft-admin textarea {
          color: #f5f6f8 !important;
        }

        .cms-soft-admin input::placeholder,
        .cms-soft-admin textarea::placeholder {
          color: #8f96a3 !important;
        }

        .cms-soft-admin [class*="border-white/"],
        .cms-soft-admin [class*="border-white["] {
          border-color: rgba(255, 255, 255, 0.14) !important;
        }

        .cms-soft-admin [class*="text-zinc-700"],
        .cms-soft-admin [class*="text-zinc-600"] {
          color: #9ca3af !important;
        }

        .cms-soft-admin [class*="text-zinc-500"] {
          color: #b4bac5 !important;
        }

        .cms-soft-admin [class*="text-zinc-400"],
        .cms-soft-admin [class*="text-zinc-300"] {
          color: #d1d5db !important;
        }

        .cms-soft-admin [class*="shadow-2xl"],
        .cms-soft-admin [class*="shadow-["] {
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.22) !important;
        }
      `}</style>
      {/* 1. GLOBAL SIDEBAR (Primary Navigation) */}
      <aside className="w-[240px] bg-[#050505] border-r border-white/[0.08] flex flex-col shrink-0 relative z-50 transition-all">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚙️</span>
            <span className="text-sm font-extrabold text-white tracking-tight uppercase">
              PixelRing CMS
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-3 flex-1">
          {navItems.map((item) => {
            const isActive = isLocalizedRouteActive(pathname, locale, item.path);
            return (
              <button
                key={item.path}
                onClick={() => router.push(withLocalePath(locale, item.path))}
                className={`flex items-center gap-3 px-4 h-[48px] text-[13px] rounded-xl text-left transition-all duration-200 font-semibold ${isActive
                    ? 'bg-gradient-to-br from-cyan-500 via-violet-600 to-pink-500 text-white shadow-[0_4px_15px_rgba(139,92,246,0.25)]'
                    : 'text-zinc-500 hover:bg-white/[0.03] hover:text-zinc-200'
                  }`}
              >
                <span className={`text-base leading-none ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                  {item.icon}
                </span>
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* User Profile / Sidebar Bottom */}
        <div className="p-6 border-t border-white/[0.08] mt-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-500 to-cyan-400 flex items-center justify-center text-white font-bold text-xs">
              A
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-zinc-200 leading-tight">Admin</span>
              <span className="text-[11px] text-zinc-500 font-medium">Superuser</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center gap-2.5 w-full h-[40px] px-3 text-[12px] text-zinc-500 bg-white/[0.03] border border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.06] hover:text-zinc-300 rounded-lg transition-all font-semibold"
          >
            <span>{loggingOut ? '...' : '🚪'}</span>
            {loggingOut ? 'Ending Session...' : 'Exit Config'}
          </button>
        </div>
      </aside>

      {/* 2. MODULE VIEW CONTAINER (Module Sidebar + Content Area will be inside children) */}
      <main className="flex-1 flex min-w-0 bg-[#08080a] relative overflow-hidden">
        {children}
      </main>
    </div>
  );
}
