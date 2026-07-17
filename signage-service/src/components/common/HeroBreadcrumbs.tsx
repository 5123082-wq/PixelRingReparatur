'use client';

import { Link } from '@/i18n/routing';

type HeroBreadcrumbItem = {
  label: string;
  href?: string;
};

type HeroBreadcrumbsProps = {
  items: HeroBreadcrumbItem[];
  position?: 'absolute' | 'static';
  surface?: 'media' | 'light' | 'dark';
};

const surfaceStyles = {
  media: {
    list: 'border border-white/10 bg-[#0E1A2B]/88 text-white shadow-[0_16px_40px_rgba(0,0,0,0.26)]',
    link: 'text-white/82 hover:text-white focus-visible:ring-[#E2A07C]',
    current: 'text-white',
    separator: 'text-white/54',
  },
  light: {
    list: 'border border-[#D9C4AE]/70 bg-[#FFF8EF]/78 text-[#172235] shadow-[0_14px_34px_rgba(83,57,37,0.13)]',
    link: 'text-[#516071] hover:text-[#0E1A2B] focus-visible:ring-[#B8643E]',
    current: 'text-[#0E1A2B]',
    separator: 'text-[#8A6A59]',
  },
  dark: {
    list: 'border border-white/12 bg-white/10 text-white shadow-[0_16px_40px_rgba(0,0,0,0.22)]',
    link: 'text-white/80 hover:text-white focus-visible:ring-[#E2A07C]',
    current: 'text-white',
    separator: 'text-white/52',
  },
};

export default function HeroBreadcrumbs({
  items,
  position = 'absolute',
  surface = 'media',
}: HeroBreadcrumbsProps) {
  if (items.length === 0) {
    return null;
  }

  const styles = surfaceStyles[surface];

  return (
    <nav
      aria-label="Breadcrumb"
      className={
        position === 'absolute'
          ? 'absolute inset-x-0 top-6 z-10'
          : 'relative z-10 mb-6 px-0'
      }
    >
      <div
        className={
          position === 'absolute'
            ? 'pr-site-container flex justify-start rtl:justify-end'
            : 'flex w-full justify-start rtl:justify-end'
        }
      >
        <ol className={`flex max-w-full items-center gap-2 overflow-x-auto rounded-[6px] px-4 py-3 text-[14px] font-medium backdrop-blur-md sm:px-5 sm:text-[15px] ${styles.list}`}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li
                key={`${item.label}-${index}`}
                className={`flex items-center gap-2 ${isLast ? 'min-w-0' : 'shrink-0'}`}
              >
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className={`transition focus:outline-none focus-visible:ring-2 ${styles.link}`}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={`block truncate font-semibold ${styles.current}`}>
                    {item.label}
                  </span>
                )}
                {!isLast && (
                  <span aria-hidden="true" className={`${styles.separator} rtl:rotate-180`}>
                    ›
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
