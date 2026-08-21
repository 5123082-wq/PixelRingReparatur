const DEFAULT_SERVICE_PATH = '/leistungen' as const;

export const PROBLEM_ARTICLE_SERVICE_PATHS = {
  'werbeanlage-leuchtet-nicht': '/leistungen/werbeanlagen-reparatur',
  'werbeanlage-flackert': '/leistungen/lichtwerbung-led-modernisierung',
  'led-leuchtet-ungleichmaessig': '/leistungen/lichtwerbung-led-modernisierung',
  'buchstabe-leuchtet-nicht': '/leistungen/werbeanlagen-reparatur',
  'werbeanlage-schaltet-nach-regen-ab': '/leistungen/werbeanlagen-reparatur',
  'folie-loest-sich': '/leistungen/druckprodukte-branding-werbematerialien',
  'folie-ist-ausgeblichen': '/leistungen/druckprodukte-branding-werbematerialien',
  'werbeanlage-wackelt': '/leistungen/montage-demontage-werbeanlagen',
  'dringende-reparatur-werbeanlage': '/leistungen/werbeanlagen-reparatur',
} as const;

type ProblemArticleSlug = keyof typeof PROBLEM_ARTICLE_SERVICE_PATHS;
type MappedServicePath = (typeof PROBLEM_ARTICLE_SERVICE_PATHS)[ProblemArticleSlug];
type ServicePath = MappedServicePath | typeof DEFAULT_SERVICE_PATH;
type ContextLinkKind = 'hub' | 'service' | 'references';
type ContextLinkLocale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';

type ContextLinkCopy = {
  eyebrow: string;
  title: string;
  description: string;
  navLabel: string;
  linkEyebrows: Record<ContextLinkKind, string>;
  hubLabel: string;
  referencesLabel: string;
  serviceLabels: Record<ServicePath, string>;
};

export type ProblemArticleContextLink = {
  kind: ContextLinkKind;
  href: string;
  eyebrow: string;
  label: string;
};

export type ProblemArticleContextLinks = {
  direction: 'ltr' | 'rtl';
  eyebrow: string;
  title: string;
  description: string;
  navLabel: string;
  links: ProblemArticleContextLink[];
};

const SUPPORTED_LOCALES: ContextLinkLocale[] = ['de', 'en', 'ru', 'tr', 'pl', 'ar'];

const CONTEXT_LINK_COPY: Record<ContextLinkLocale, ContextLinkCopy> = {
  de: {
    eyebrow: 'Passende nächste Schritte',
    title: 'Vom Problem zur passenden Lösung',
    description: 'Vertiefen Sie die Diagnose, prüfen Sie die passende Leistung oder sehen Sie Ergebnisse aus ausgeführten Arbeiten.',
    navLabel: 'Weiterführende Links zu Problemwissen, Leistung und Referenzen',
    linkEyebrows: {
      hub: 'Probleme & Lösungen',
      service: 'Passende Leistung',
      references: 'Referenzen & Nachweise',
    },
    hubLabel: 'Weitere Probleme und sichere nächste Schritte ansehen',
    referencesLabel: 'Ergebnisse aus realen Servicefällen ansehen',
    serviceLabels: {
      '/leistungen': 'Alle passenden Leistungen vergleichen',
      '/leistungen/werbeanlagen-reparatur': 'Die passende Reparaturleistung für Werbeanlagen ansehen',
      '/leistungen/lichtwerbung-led-modernisierung': 'LED-Beleuchtung prüfen oder modernisieren lassen',
      '/leistungen/druckprodukte-branding-werbematerialien': 'Folie und Branding fachgerecht erneuern',
      '/leistungen/montage-demontage-werbeanlagen': 'Befestigung, Montage und Demontage prüfen',
    },
  },
  en: {
    eyebrow: 'Relevant next steps',
    title: 'Move from the problem to the right solution',
    description: 'Continue the diagnosis, review the relevant service, or see evidence from completed work.',
    navLabel: 'Further links to problem guidance, services, and references',
    linkEyebrows: {
      hub: 'Problems & solutions',
      service: 'Relevant service',
      references: 'References & evidence',
    },
    hubLabel: 'Explore more sign problems and safe next steps',
    referencesLabel: 'See evidence from completed service work',
    serviceLabels: {
      '/leistungen': 'Compare all relevant services',
      '/leistungen/werbeanlagen-reparatur': 'Review the relevant sign repair service',
      '/leistungen/lichtwerbung-led-modernisierung': 'Review LED diagnostics and modernization',
      '/leistungen/druckprodukte-branding-werbematerialien': 'Explore film renewal and branding support',
      '/leistungen/montage-demontage-werbeanlagen': 'Review installation and mounting support',
    },
  },
  ru: {
    eyebrow: 'Подходящие следующие шаги',
    title: 'От проблемы к подходящему решению',
    description: 'Уточните диагностику, изучите подходящую услугу или посмотрите подтверждённые примеры выполненных работ.',
    navLabel: 'Дополнительные ссылки на проблемы, услуги и примеры работ',
    linkEyebrows: {
      hub: 'Проблемы и решения',
      service: 'Подходящая услуга',
      references: 'Примеры и подтверждения',
    },
    hubLabel: 'Посмотреть другие неисправности и безопасные действия',
    referencesLabel: 'Посмотреть примеры выполненных сервисных работ',
    serviceLabels: {
      '/leistungen': 'Сравнить подходящие услуги',
      '/leistungen/werbeanlagen-reparatur': 'Перейти к ремонту рекламных конструкций',
      '/leistungen/lichtwerbung-led-modernisierung': 'Изучить диагностику и модернизацию LED-подсветки',
      '/leistungen/druckprodukte-branding-werbematerialien': 'Узнать об обновлении плёнки и брендинга',
      '/leistungen/montage-demontage-werbeanlagen': 'Узнать о монтаже и проверке креплений',
    },
  },
  tr: {
    eyebrow: 'Uygun sonraki adımlar',
    title: 'Sorundan uygun çözüme ilerleyin',
    description: 'Teşhisi derinleştirin, ilgili hizmeti inceleyin veya tamamlanan işlerden örnekleri görün.',
    navLabel: 'Sorun bilgisi, hizmetler ve referanslar için ek bağlantılar',
    linkEyebrows: {
      hub: 'Sorunlar ve çözümler',
      service: 'Uygun hizmet',
      references: 'Referanslar ve örnekler',
    },
    hubLabel: 'Diğer tabela sorunlarını ve güvenli adımları inceleyin',
    referencesLabel: 'Tamamlanan servis işlerinden örnekleri görün',
    serviceLabels: {
      '/leistungen': 'Uygun hizmetleri karşılaştırın',
      '/leistungen/werbeanlagen-reparatur': 'İlgili tabela onarım hizmetini inceleyin',
      '/leistungen/lichtwerbung-led-modernisierung': 'LED teşhis ve modernizasyonunu inceleyin',
      '/leistungen/druckprodukte-branding-werbematerialien': 'Folyo yenileme ve markalama desteğini inceleyin',
      '/leistungen/montage-demontage-werbeanlagen': 'Montaj ve sabitleme desteğini inceleyin',
    },
  },
  pl: {
    eyebrow: 'Dopasowane kolejne kroki',
    title: 'Od problemu do odpowiedniego rozwiązania',
    description: 'Pogłęb diagnozę, sprawdź odpowiednią usługę lub zobacz przykłady wykonanych prac.',
    navLabel: 'Dodatkowe linki do porad, usług i referencji',
    linkEyebrows: {
      hub: 'Problemy i rozwiązania',
      service: 'Odpowiednia usługa',
      references: 'Referencje i realizacje',
    },
    hubLabel: 'Sprawdź inne problemy i bezpieczne kolejne kroki',
    referencesLabel: 'Zobacz przykłady wykonanych prac serwisowych',
    serviceLabels: {
      '/leistungen': 'Porównaj odpowiednie usługi',
      '/leistungen/werbeanlagen-reparatur': 'Sprawdź odpowiednią usługę naprawy reklamy',
      '/leistungen/lichtwerbung-led-modernisierung': 'Sprawdź diagnostykę i modernizację oświetlenia LED',
      '/leistungen/druckprodukte-branding-werbematerialien': 'Sprawdź odnowienie folii i wsparcie brandingowe',
      '/leistungen/montage-demontage-werbeanlagen': 'Sprawdź montaż i kontrolę mocowań',
    },
  },
  ar: {
    eyebrow: 'الخطوات التالية المناسبة',
    title: 'انتقل من المشكلة إلى الحل المناسب',
    description: 'تعمّق في التشخيص أو راجع الخدمة المناسبة أو شاهد أمثلة من الأعمال المنفذة.',
    navLabel: 'روابط إضافية إلى إرشادات المشكلات والخدمات والمراجع',
    linkEyebrows: {
      hub: 'المشكلات والحلول',
      service: 'الخدمة المناسبة',
      references: 'نماذج الأعمال',
    },
    hubLabel: 'استعرض مشكلات أخرى وخطوات آمنة تالية',
    referencesLabel: 'شاهد أمثلة من أعمال الخدمة المنفذة',
    serviceLabels: {
      '/leistungen': 'قارن بين الخدمات المناسبة',
      '/leistungen/werbeanlagen-reparatur': 'اطّلع على خدمة إصلاح اللوحات المناسبة',
      '/leistungen/lichtwerbung-led-modernisierung': 'اطّلع على تشخيص إضاءة LED وتحديثها',
      '/leistungen/druckprodukte-branding-werbematerialien': 'اطّلع على تجديد الأفلام ودعم الهوية البصرية',
      '/leistungen/montage-demontage-werbeanlagen': 'اطّلع على خدمات التركيب وفحص التثبيت',
    },
  },
};

function resolveLocale(locale: string): ContextLinkLocale {
  return SUPPORTED_LOCALES.includes(locale as ContextLinkLocale)
    ? (locale as ContextLinkLocale)
    : 'en';
}

export function getProblemArticleServicePath(articleSlug: string): ServicePath {
  return PROBLEM_ARTICLE_SERVICE_PATHS[articleSlug as ProblemArticleSlug] ?? DEFAULT_SERVICE_PATH;
}

export function buildProblemArticleContextLinks(
  locale: string,
  articleSlug: string
): ProblemArticleContextLinks {
  const resolvedLocale = resolveLocale(locale);
  const copy = CONTEXT_LINK_COPY[resolvedLocale];
  const servicePath = getProblemArticleServicePath(articleSlug);
  const localePrefix = `/${resolvedLocale}`;

  return {
    direction: resolvedLocale === 'ar' ? 'rtl' : 'ltr',
    eyebrow: copy.eyebrow,
    title: copy.title,
    description: copy.description,
    navLabel: copy.navLabel,
    links: [
      {
        kind: 'hub',
        href: `${localePrefix}/probleme-loesungen`,
        eyebrow: copy.linkEyebrows.hub,
        label: copy.hubLabel,
      },
      {
        kind: 'service',
        href: `${localePrefix}${servicePath}`,
        eyebrow: copy.linkEyebrows.service,
        label: copy.serviceLabels[servicePath],
      },
      {
        kind: 'references',
        href: `${localePrefix}/referenzen`,
        eyebrow: copy.linkEyebrows.references,
        label: copy.referencesLabel,
      },
    ],
  };
}
