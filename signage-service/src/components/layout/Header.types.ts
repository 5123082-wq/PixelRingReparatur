export type HeaderLink = {
  label: string;
  href: string;
};

export type HeaderContent = {
  servicePill?: string | null;
  bookLabel?: string | null;
  links?: HeaderLink[];
  accountStatusLabel?: string | null;
  accountStatusHref?: string | null;
  requestLabel?: string | null;
  requestHref?: string | null;
};

export type NavLink = {
  name: string;
  href: string;
};

export type NavMenuLink = {
  label: string;
  href: string;
};

export type HeaderLocale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';
