'use client';

import { useRouter, usePathname, useParams } from 'next/navigation';
import { useState } from 'react';

import {
  getLocaleSegment,
  isLocalizedRouteActive,
  withLocalePath,
} from '../../admin-route';
import { adminFetch } from '@/lib/admin-fetch';

type IconName = 'dashboard' | 'content' | 'pages' | 'media' | 'ai' | 'settings' | 'logout' | 'collapse';

const NAV_ITEMS: Array<{ name: string; icon: IconName; path: string }> = [
  { name: 'Dashboard', icon: 'dashboard', path: '/ring-master-config/dashboard' },
  { name: 'Content (Wiki/GEO)', icon: 'content', path: '/ring-master-config/dashboard/articles' },
  { name: 'Page CMS', icon: 'pages', path: '/ring-master-config/dashboard/pages' },
  { name: 'Media Library', icon: 'media', path: '/ring-master-config/dashboard/media' },
  { name: 'AI Knowledge', icon: 'ai', path: '/ring-master-config/dashboard/ai' },
];

function CmsIcon({ name, className = '' }: { name: IconName; className?: string }) {
  const sharedProps = {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    strokeWidth: 1.8,
    viewBox: '0 0 24 24',
    'aria-hidden': true,
  };

  switch (name) {
    case 'dashboard':
      return (
        <svg {...sharedProps}>
          <path d="M4 5.5A1.5 1.5 0 0 1 5.5 4h4A1.5 1.5 0 0 1 11 5.5v4A1.5 1.5 0 0 1 9.5 11h-4A1.5 1.5 0 0 1 4 9.5z" />
          <path d="M13 5.5A1.5 1.5 0 0 1 14.5 4h4A1.5 1.5 0 0 1 20 5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4A1.5 1.5 0 0 1 13 9.5z" />
          <path d="M4 14.5A1.5 1.5 0 0 1 5.5 13h4a1.5 1.5 0 0 1 1.5 1.5v4A1.5 1.5 0 0 1 9.5 20h-4A1.5 1.5 0 0 1 4 18.5z" />
          <path d="M13 14.5a1.5 1.5 0 0 1 1.5-1.5h4a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a1.5 1.5 0 0 1-1.5-1.5z" />
        </svg>
      );
    case 'content':
      return (
        <svg {...sharedProps}>
          <path d="M7 3.75h7.25L19 8.5v11.75H7a2 2 0 0 1-2-2V5.75a2 2 0 0 1 2-2z" />
          <path d="M14 4v5h5" />
          <path d="M8.5 13h7" />
          <path d="M8.5 16.5h5" />
        </svg>
      );
    case 'pages':
      return (
        <svg {...sharedProps}>
          <path d="M8 4.5h8A2.5 2.5 0 0 1 18.5 7v10a2.5 2.5 0 0 1-2.5 2.5H8A2.5 2.5 0 0 1 5.5 17V7A2.5 2.5 0 0 1 8 4.5z" />
          <path d="M8.75 8.5h6.5" />
          <path d="M8.75 12h6.5" />
          <path d="M8.75 15.5h3.5" />
        </svg>
      );
    case 'media':
      return (
        <svg {...sharedProps}>
          <path d="M5.5 5h13A1.5 1.5 0 0 1 20 6.5v11A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-11A1.5 1.5 0 0 1 5.5 5z" />
          <path d="m4.5 16 4.25-4.25 3 3 2-2L19.5 18" />
          <path d="M15.5 9.25h.01" />
        </svg>
      );
    case 'ai':
      return (
        <svg {...sharedProps}>
          <path d="M12 3.5v3" />
          <path d="M12 17.5v3" />
          <path d="M4.5 12h3" />
          <path d="M16.5 12h3" />
          <path d="M8.25 8.25 6.1 6.1" />
          <path d="m17.9 17.9-2.15-2.15" />
          <path d="m15.75 8.25 2.15-2.15" />
          <path d="M6.1 17.9 8.25 15.75" />
          <path d="M10 9.25h4L12.65 12 14 14.75h-4L11.35 12z" />
        </svg>
      );
    case 'settings':
      return (
        <svg {...sharedProps}>
          <path d="M12 8.25a3.75 3.75 0 1 1 0 7.5 3.75 3.75 0 0 1 0-7.5z" />
          <path d="M12 2.75v2.5" />
          <path d="M12 18.75v2.5" />
          <path d="M4.5 4.5 6.25 6.25" />
          <path d="m17.75 17.75 1.75 1.75" />
          <path d="M2.75 12h2.5" />
          <path d="M18.75 12h2.5" />
          <path d="m4.5 19.5 1.75-1.75" />
          <path d="m17.75 6.25 1.75-1.75" />
        </svg>
      );
    case 'logout':
      return (
        <svg {...sharedProps}>
          <path d="M10 6H6.75A1.75 1.75 0 0 0 5 7.75v8.5A1.75 1.75 0 0 0 6.75 18H10" />
          <path d="M14 8.5 17.5 12 14 15.5" />
          <path d="M17.5 12H9.5" />
        </svg>
      );
    case 'collapse':
      return (
        <svg {...sharedProps}>
          <path d="M15 6 9 12l6 6" />
        </svg>
      );
    default:
      return null;
  }
}

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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await adminFetch('/api/cms/auth', { method: 'DELETE' });
    router.push(withLocalePath(locale, '/ring-master-config'));
  }

  return (
    <div className="cms-soft-admin flex h-screen w-full bg-[#14171f] text-slate-100 font-sans selection:bg-sky-500/25 selection:text-white overflow-hidden">
      <style>{`
        .cms-soft-admin {
          background: #14171f !important;
          color: #f5f7fb;
        }

        .cms-soft-admin aside,
        .cms-soft-admin main,
        .cms-soft-admin header,
        .cms-soft-admin [class*="bg-[#050505]"],
        .cms-soft-admin [class*="bg-[#08080a]"],
        .cms-soft-admin [class*="bg-[#0a0a0c]"],
        .cms-soft-admin [class*="bg-black"] {
          background-color: #171b24 !important;
        }

        .cms-soft-admin aside {
          background: #111720 !important;
        }

        .cms-soft-admin main {
          background: #171b24 !important;
        }

        .cms-soft-admin header {
          background: rgba(23, 27, 36, 0.92) !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
        }

        .cms-soft-admin section,
        .cms-soft-admin details,
        .cms-soft-admin [class*="bg-white/[0.02"],
        .cms-soft-admin [class*="bg-white/[0.025"],
        .cms-soft-admin [class*="bg-white/[0.03"],
        .cms-soft-admin [class*="bg-white/[0.04"] {
          background-color: #202632 !important;
        }

        .cms-soft-admin button:not(.cms-nav-button):not(.cms-sidebar-action):not([class*="from-cyan"]):not([class*="from-white"]),
        .cms-soft-admin input,
        .cms-soft-admin select,
        .cms-soft-admin textarea {
          background-color: #222936 !important;
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
      <aside className={`${isSidebarCollapsed ? 'w-[72px]' : 'w-[220px]'} bg-[#111720] border-r border-white/[0.08] flex flex-col shrink-0 relative z-50 transition-[width] duration-200 ease-out`}>
        <div className={`${isSidebarCollapsed ? 'px-3 py-4' : 'px-4 py-5'} border-b border-white/[0.06]`}>
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between gap-3'}`}>
            <div className={`flex min-w-0 items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'}`}>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-sky-400/15 bg-sky-400/10 text-sky-200">
                <CmsIcon name="settings" className="h-[18px] w-[18px]" />
              </span>
              {!isSidebarCollapsed && (
                <span className="truncate text-[13px] font-extrabold text-white tracking-tight uppercase">
                  PixelRing CMS
                </span>
              )}
            </div>
            {!isSidebarCollapsed && (
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(true)}
                className="cms-sidebar-action flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-400 transition hover:border-sky-300/30 hover:bg-sky-300/10 hover:text-sky-100"
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
              >
                <CmsIcon name="collapse" className="h-4 w-4" />
              </button>
            )}
            {isSidebarCollapsed && (
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(false)}
                className="cms-sidebar-action absolute right-[-13px] top-5 flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.12] bg-[#1c2430] text-slate-300 shadow-lg transition hover:border-sky-300/40 hover:text-sky-100"
                aria-label="Expand sidebar"
                title="Expand sidebar"
              >
                <span className="rotate-180">
                  <CmsIcon name="collapse" className="h-4 w-4" />
                </span>
              </button>
            )}
          </div>
        </div>

        <nav className={`flex flex-col gap-1 ${isSidebarCollapsed ? 'px-3 py-4' : 'px-3 py-4'} flex-1`}>
          {NAV_ITEMS.map((item) => {
            const isDashboardRoot = item.path === '/ring-master-config/dashboard';
            const isActive = isLocalizedRouteActive(pathname, locale, item.path, isDashboardRoot);
            return (
              <button
                key={item.path}
                onClick={() => router.push(withLocalePath(locale, item.path))}
                className={`cms-nav-button group flex h-[42px] items-center rounded-lg border text-left text-[13px] font-semibold transition-all duration-150 ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-3 px-3'} ${isActive
                    ? 'border-sky-300/25 bg-sky-300/12 text-white shadow-[inset_3px_0_0_rgba(125,211,252,0.75)]'
                    : 'border-transparent bg-transparent text-slate-400 hover:border-white/[0.07] hover:bg-white/[0.045] hover:text-slate-100'
                  }`}
                aria-current={isActive ? 'page' : undefined}
                aria-label={item.name}
                title={isSidebarCollapsed ? item.name : undefined}
              >
                <CmsIcon
                  name={item.icon}
                  className={`h-[18px] w-[18px] shrink-0 ${isActive ? 'text-sky-200' : 'text-slate-500 group-hover:text-slate-300'}`}
                />
                {!isSidebarCollapsed && (
                  <span className="min-w-0 truncate">
                    {item.name}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile / Sidebar Bottom */}
        <div className={`${isSidebarCollapsed ? 'px-3 py-4' : 'p-4'} border-t border-white/[0.08] mt-auto`}>
          <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center mb-3' : 'gap-3 mb-4'}`}>
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-300/15 bg-emerald-300/10 text-xs font-bold text-emerald-100">
              A
            </div>
            {!isSidebarCollapsed && (
              <div className="flex min-w-0 flex-col">
                <span className="truncate text-[13px] font-bold text-slate-100 leading-tight">Admin</span>
                <span className="truncate text-[11px] text-slate-500 font-medium">Superuser</span>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className={`cms-sidebar-action flex h-[38px] w-full items-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-[12px] font-semibold text-slate-400 transition-all hover:border-white/[0.14] hover:bg-white/[0.06] hover:text-slate-100 disabled:cursor-wait disabled:opacity-70 ${isSidebarCollapsed ? 'justify-center px-0' : 'gap-2.5 px-3'}`}
            aria-label={loggingOut ? 'Ending Session' : 'Exit Config'}
            title={isSidebarCollapsed ? (loggingOut ? 'Ending Session' : 'Exit Config') : undefined}
          >
            <CmsIcon name="logout" className="h-4 w-4 shrink-0" />
            {!isSidebarCollapsed && (loggingOut ? 'Ending Session...' : 'Exit Config')}
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
