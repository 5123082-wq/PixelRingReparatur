import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  locales: ['de', 'en', 'ru', 'tr', 'pl', 'ar'],
  defaultLocale: 'de'
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
