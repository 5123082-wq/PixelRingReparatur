'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from '@/i18n/routing';
import type { NavLink, NavMenuLink } from './Header.types';
import { isExactNavPath } from './headerNavUtils';

type DesktopNavMode = 'full' | 'floating';

function DesktopNavLink({
  link,
  isActive,
  pathname,
  menuLinks,
  isMenuOpen = false,
  onMenuOpen,
  onMenuClose,
  mode = 'full',
}: {
  link: NavLink;
  isActive: boolean;
  pathname: string;
  menuLinks?: NavMenuLink[];
  isMenuOpen?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  mode?: DesktopNavMode;
}) {
  const hasMenu = Boolean(menuLinks?.length);
  const triggerClassName = `relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[15px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8643E]/40 ${
    isActive
      ? 'font-semibold text-[#0E1A2B]'
      : 'font-medium text-[#72665D] hover:bg-white/24 hover:text-[#B8643E] focus-visible:bg-white/24'
  }`;

  const triggerContent = (
    <>
      {isActive && (
        <motion.span
          className="pr-nav-glass-accent absolute inset-0 rounded-full border"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
      <span className="relative z-10">{link.name}</span>
      {hasMenu && (
        <svg
          className={`relative z-10 h-3.5 w-3.5 text-[#8C7A6E] transition-transform duration-200 ${
            isMenuOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      )}
    </>
  );

  return (
    <div
      className="relative"
      onPointerEnter={() => {
        if (hasMenu) {
          onMenuOpen?.();
        }
      }}
      onPointerLeave={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          onMenuClose?.();
        }
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          onMenuClose?.();
        }
      }}
    >
      {hasMenu ? (
        <Link
          href={link.href}
          aria-current={isActive ? 'page' : undefined}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          onFocus={onMenuOpen}
          className={triggerClassName}
        >
          {triggerContent}
        </Link>
      ) : (
        <Link
          href={link.href}
          aria-current={isActive ? 'page' : undefined}
          className={triggerClassName}
        >
          {triggerContent}
        </Link>
      )}

      {hasMenu && isMenuOpen && (
        <div
          role="menu"
          aria-label={link.name}
          className={`pr-nav-glass pr-nav-glass-floating absolute left-1/2 top-full z-[70] w-[330px] -translate-x-1/2 rounded-[18px] border p-2 ${
            mode === 'floating' ? 'mt-4' : 'mt-3'
          }`}
        >
          <div className="absolute -top-5 left-0 h-5 w-full" />
          {menuLinks!.map((item) => {
            const isMenuItemActive = isExactNavPath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                role="menuitem"
                aria-current={isMenuItemActive ? 'page' : undefined}
                className={`flex items-center justify-between gap-3 rounded-[12px] px-3.5 py-3 text-[14px] font-semibold transition-colors ${
                  isMenuItemActive
                    ? 'text-[#0E1A2B]'
                    : 'text-[#6F625A] hover:text-[#B8643E] focus-visible:text-[#B8643E] focus-visible:outline-none'
                }`}
              >
                <span>{item.label}</span>
                <svg
                  className="h-3.5 w-3.5 shrink-0 text-[#B8643E]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function DesktopNavItems({
  navLinks,
  activeNavHref,
  pathname,
  servicesMenuLinks,
  mode,
}: {
  navLinks: NavLink[];
  activeNavHref: string | null;
  pathname: string;
  servicesMenuLinks: NavMenuLink[];
  mode: DesktopNavMode;
}) {
  const [openMenuHref, setOpenMenuHref] = useState<string | null>(null);

  return (
    <>
      {navLinks.map((link) => {
        const menuLinks = link.href === '/leistungen' ? servicesMenuLinks : undefined;

        return (
          <DesktopNavLink
            key={`${mode}-${link.name}`}
            link={link}
            isActive={activeNavHref === link.href}
            pathname={pathname}
            menuLinks={menuLinks}
            isMenuOpen={openMenuHref === link.href}
            onMenuOpen={menuLinks ? () => setOpenMenuHref(link.href) : undefined}
            onMenuClose={menuLinks ? () => setOpenMenuHref(null) : undefined}
            mode={mode}
          />
        );
      })}
    </>
  );
}

export default function DesktopNav({
  isScrolled,
  navLinks,
  activeNavHref,
  pathname,
  servicesMenuLinks,
}: {
  isScrolled: boolean;
  navLinks: NavLink[];
  activeNavHref: string | null;
  pathname: string;
  servicesMenuLinks: NavMenuLink[];
}) {
  const [isDesktopNavOpen, setIsDesktopNavOpen] = useState(false);
  const desktopNavAreaRef = useRef<HTMLDivElement>(null);
  const desktopNavCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFloatingNavOpen = isScrolled && isDesktopNavOpen;

  const clearDesktopNavCloseTimeout = useCallback(() => {
    if (desktopNavCloseTimeoutRef.current) {
      clearTimeout(desktopNavCloseTimeoutRef.current);
      desktopNavCloseTimeoutRef.current = null;
    }
  }, []);

  const openDesktopNav = useCallback(() => {
    clearDesktopNavCloseTimeout();
    setIsDesktopNavOpen(true);
  }, [clearDesktopNavCloseTimeout]);

  const scheduleDesktopNavClose = useCallback(() => {
    clearDesktopNavCloseTimeout();
    desktopNavCloseTimeoutRef.current = setTimeout(() => {
      setIsDesktopNavOpen(false);
      desktopNavCloseTimeoutRef.current = null;
    }, 160);
  }, [clearDesktopNavCloseTimeout]);

  useEffect(() => {
    return () => {
      clearDesktopNavCloseTimeout();
    };
  }, [clearDesktopNavCloseTimeout]);

  useEffect(() => {
    if (!isScrolled) {
      clearDesktopNavCloseTimeout();
    }
  }, [clearDesktopNavCloseTimeout, isScrolled]);

  useEffect(() => {
    if (!isFloatingNavOpen) {
      return;
    }

    const containsPoint = (element: Element, x: number, y: number) => {
      const rect = element.getBoundingClientRect();
      return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    };

    const handlePointerMove = (event: PointerEvent) => {
      const navArea = desktopNavAreaRef.current;

      if (!navArea) {
        scheduleDesktopNavClose();
        return;
      }

      const isInsideNavArea = containsPoint(navArea, event.clientX, event.clientY);
      const isInsideLocalMenu = Array.from(navArea.querySelectorAll('[role="menu"]')).some((menu) =>
        containsPoint(menu, event.clientX, event.clientY)
      );

      if (isInsideNavArea || isInsideLocalMenu) {
        clearDesktopNavCloseTimeout();
        return;
      }

      scheduleDesktopNavClose();
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, [clearDesktopNavCloseTimeout, isFloatingNavOpen, scheduleDesktopNavClose]);

  return (
    <div className="hidden lg:block relative">
      <AnimatePresence initial={false}>
        {!isScrolled && (
          <motion.nav
            key="desktop-nav-row"
            initial={false}
            animate={{ height: 48, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: 'easeInOut' }}
            className="relative z-30 flex items-center justify-center gap-5 overflow-visible border-t border-[#E7DDD3]/70 py-1.5"
          >
            <DesktopNavItems
              navLinks={navLinks}
              activeNavHref={activeNavHref}
              pathname={pathname}
              servicesMenuLinks={servicesMenuLinks}
              mode="full"
            />
          </motion.nav>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isScrolled && (
          <div className="absolute inset-x-0 top-0 flex justify-center pointer-events-none">
            <motion.div
              key="scrolled-notch"
              ref={desktopNavAreaRef}
              onMouseEnter={openDesktopNav}
              onMouseLeave={(event) => {
                if (!event.currentTarget.contains(document.activeElement)) {
                  scheduleDesktopNavClose();
                }
              }}
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  scheduleDesktopNavClose();
                }
              }}
              className={`pointer-events-auto ${isFloatingNavOpen ? 'w-[920px]' : 'w-[192px]'} flex h-[86px] justify-center`}
            >
              <motion.div
                onMouseEnter={openDesktopNav}
                onMouseMove={openDesktopNav}
                initial={{ y: -40, opacity: 0 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  width: isFloatingNavOpen ? 880 : 192,
                  height: isFloatingNavOpen ? 56 : 24,
                }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                className={`pr-nav-glass relative flex items-center justify-center border border-t-0 rounded-b-[20px] outline-none transition-[background-color,border-color,box-shadow] duration-200 group ${
                  isFloatingNavOpen ? 'overflow-visible pr-nav-glass-floating' : 'overflow-hidden'
                }`}
              >
                {!isFloatingNavOpen && (
                  <motion.div
                    key="chevron"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center"
                  >
                    <svg
                      className="h-4 w-4 text-[#72665D] transition-transform duration-300 group-hover:translate-y-0.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </motion.div>
                )}

                <AnimatePresence mode="wait">
                  {isFloatingNavOpen && (
                    <motion.nav
                      key="expanded-links"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: 0.15, delay: 0.1 } }}
                      exit={{ opacity: 0, transition: { duration: 0.06 } }}
                      className="flex items-center justify-center gap-5 px-8"
                    >
                      <DesktopNavItems
                        navLinks={navLinks}
                        activeNavHref={activeNavHref}
                        pathname={pathname}
                        servicesMenuLinks={servicesMenuLinks}
                        mode="floating"
                      />
                    </motion.nav>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
