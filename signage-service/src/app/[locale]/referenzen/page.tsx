import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { cache } from 'react';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import ReferencesExperience, {
  type GalleryItem,
  type ReportHook,
  type ReferencesBlockVisibility,
  type ReferencesContent,
  type ReferenceCase,
  type ReportRow,
} from '@/components/references/ReferencesExperience';
import { CMS_SESSION_COOKIE_NAME, requireAdminSession } from '@/lib/admin-auth';
import {
  type CmsPageBlock,
  type CmsPagePublicContent,
  getCmsPagePublicationState,
  getDraftCapableCmsPage,
  getGlobalPageCmsContent,
  getBlock,
  getBlockText,
  getBlockObjectList,
} from '@/lib/cms/pages';
import { prisma } from '@/lib/prisma';
import { buildLocaleUrl, buildPublicPageMetadata, buildSiteUrl } from '@/lib/seo';

type Locale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';
type JsonLdObject = Record<string, unknown>;

type LocalizedPageContent = Omit<
  ReferencesContent,
  | 'locale'
  | 'cases'
  | 'galleryItems'
  | 'gallerySectionTitle'
  | 'finalEyebrow'
  | 'reportImage'
  | 'reportImageAlt'
> & {
  metaTitle: string;
  metaDescription: string;
};

const REFERENCES_PAGE_PATH = '/referenzen';
const GALLERY_SECTION_TITLES: Record<Locale, string> = {
  de: 'Galerie der Arbeiten',
  en: 'Work gallery',
  ru: 'Галерея работ',
  tr: 'İş galerisi',
  pl: 'Galeria prac',
  ar: 'معرض الأعمال',
};
const FINAL_CTA_EYEBROWS: Record<Locale, string> = {
  de: 'NEXT STEP',
  en: 'NEXT STEP',
  ru: 'СЛЕДУЮЩИЙ ШАГ',
  tr: 'SONRAKI ADIM',
  pl: 'NASTEPNY KROK',
  ar: 'الخطوة التالية',
};
const REPORT_IMAGE_SRC = '/images/references/references-slogan-signage-v1.webp';
const REPORT_IMAGE_ALTS: Record<Locale, string> = {
  de: 'Gleichmäßig beleuchtete Profilbuchstaben auf einer hellen Fassade',
  en: 'Evenly illuminated channel letters mounted on a light facade',
  ru: 'Равномерно подсвеченные объёмные буквы на светлом фасаде',
  tr: 'Açık renkli cephede eşit şekilde aydınlatılmış kutu harfler',
  pl: 'Równomiernie podświetlone litery przestrzenne na jasnej elewacji',
  ar: 'حروف بارزة مضاءة بشكل متساوٍ على واجهة فاتحة',
};

const getReferencesPublicationState = cache((locale: string) =>
  getCmsPagePublicationState('referenzen', locale)
);

const hasOwnerCmsSession = cache(async (): Promise<boolean> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(CMS_SESSION_COOKIE_NAME)?.value;
  return Boolean(await requireAdminSession(prisma, token, ['OWNER']));
});

function isCmsPreview(value: string | string[] | undefined): boolean {
  const values = Array.isArray(value) ? value : value ? [value] : [];
  return values.includes('1');
}

function getEnabledBlock(
  page: CmsPagePublicContent,
  type: Parameters<typeof getBlock>[1],
  keys: string[]
): CmsPageBlock | null {
  const block = getBlock(page, type, keys);
  return block?.enabled === false ? null : block;
}

const IMAGE_SET = {
  lightbox: '/images/ex-lightbox.png',
  led: '/images/leistungen/hero-led.png',
  ledNatural: '/images/leistungen/hero-led-natural.png',
  neon: '/images/hero-neon.jpg',
  film: '/images/leistungen/hero-branding.png',
  maintenance: '/images/leistungen/hero-maintenance.png',
  mounting: '/images/ex-mounting.png',
  pasternakFacadeLetteringBefore: '/images/references/pasternak-facade-lettering-before.png',
  pasternakFacadeLetteringProcess: '/images/references/pasternak-facade-lettering-process.jpg',
  pasternakFacadeLetteringResult: '/images/references/pasternak-facade-lettering-result.jpg',
  repair: '/images/leistungen/hero-repair.png',
  beforeGeneral: '/images/hero.jpg',
  process: '/images/ex-repair.png',
  dismantling: '/images/ex-dismantling.png',
  business: '/images/business/hero.png',
  design: '/images/ex-design.png',
  ledLettersFacadeBefore: '/generated/referenzen/local-main/led-leuchtbuchstaben-fassade-vorher-teilweise-dunkel.webp',
  ledLettersFacadeAfter: '/generated/referenzen/local-main/led-leuchtbuchstaben-fassade-nachher-gleichmaessig-beleuchtet.webp',
  generatedLedDetail: '/images/references/led-detail.webp',
  generatedLightboxLift: '/images/references/lightbox-lift.webp',
  generatedNeonBench: '/images/references/neon-bench.webp',
  generatedWindowFilm: '/images/references/window-film-install.webp',
  generatedFacadeLine: '/images/references/facade-light-line.webp',
  generatedBranchEvening: '/images/references/branch-evening.webp',
  generatedStorefrontRow: '/images/references/storefront-row.webp',
  generatedCircuitRepair: '/images/references/circuit-repair.webp',
};

const REFERENCES_OG_IMAGE = IMAGE_SET.generatedStorefrontRow;

const BASE_CASES: Array<Pick<ReferenceCase, 'id' | 'beforeImage' | 'afterImage' | 'gallery'>> = [
  {
    id: 'lightbox-facade',
    beforeImage: IMAGE_SET.beforeGeneral,
    afterImage: IMAGE_SET.lightbox,
    gallery: [IMAGE_SET.beforeGeneral, IMAGE_SET.lightbox, IMAGE_SET.repair],
  },
  {
    id: 'led-letters',
    beforeImage: IMAGE_SET.ledLettersFacadeBefore,
    afterImage: IMAGE_SET.ledLettersFacadeAfter,
    gallery: [IMAGE_SET.ledLettersFacadeBefore, IMAGE_SET.ledLettersFacadeAfter],
  },
  {
    id: 'neon-contour',
    beforeImage: IMAGE_SET.process,
    afterImage: IMAGE_SET.neon,
    gallery: [IMAGE_SET.process, IMAGE_SET.neon, IMAGE_SET.maintenance],
  },
  {
    id: 'window-film',
    beforeImage: IMAGE_SET.design,
    afterImage: IMAGE_SET.film,
    gallery: [IMAGE_SET.design, IMAGE_SET.film, IMAGE_SET.mounting],
  },
  {
    id: 'branch-service',
    beforeImage: IMAGE_SET.maintenance,
    afterImage: IMAGE_SET.business,
    gallery: [IMAGE_SET.maintenance, IMAGE_SET.business, IMAGE_SET.repair],
  },
  {
    id: 'mounting-review',
    beforeImage: IMAGE_SET.pasternakFacadeLetteringBefore,
    afterImage: IMAGE_SET.pasternakFacadeLetteringResult,
    gallery: [
      IMAGE_SET.pasternakFacadeLetteringBefore,
      IMAGE_SET.pasternakFacadeLetteringProcess,
      IMAGE_SET.pasternakFacadeLetteringResult,
    ],
  },
];

const CONTENT: Record<Locale, LocalizedPageContent> = {
  de: {
    metaTitle: 'Referenzen für Schilder-Reparatur & Werbetechnik | PixelRing',
    metaDescription:
      'Ausgewählte Referenzen von PixelRing: Leuchtkästen, LED-Buchstaben, Neon, Folien, Fassadenmontage und Filialservice ohne private Kundendaten.',
    badge: 'Referenzen',
    heroTitle: 'Unsere Arbeiten',
    heroIntro:
      'Diese Beispiele zeigen, was defekt war, was PixelRing geprüft und umgesetzt hat und wie die Werbeanlage danach wieder wirkt. Ohne Kundennamen, genaue Adressen oder interne CRM-Daten.',
    heroPrimaryCta: 'Arbeiten ansehen',
    heroSecondaryCta: 'Ähnlichen Fall starten',
    heroTags: ['LED-Service', 'Leuchtkästen', 'Neon', 'Folien', 'Fassaden', 'Filialservice'],
    heroNoteTitle: 'Proof statt Galerie',
    heroNoteText:
      'Jede Referenz ist als kurzer Reparaturbericht gedacht: Ausgangszustand, Arbeitsschritt, Ergebnis. Der Fokus bleibt auf Ausfuehrung und Vertrauen.',
    recentEyebrow: 'Ausgewaehlte Arbeiten',
    recentTitle: 'Visuelles Ergebnis und Arbeitsumfang',
    recentIntro:
      'Jede Karte zeigt den Standort vor und nach der Arbeit. Im Bericht stehen Problem, ausgefuehrte Arbeiten und Ergebnis.',
    reportTitle: 'Ein Schild darf nicht müde aussehen',
    reportIntro:
      'Dunkle Buchstaben, Flackern, ein verschmutzter Leuchtkasten oder lose Folie sind nicht nur ein Defekt. Für Menschen auf der Straße wirkt der Standort schnell geschlossen, vernachlässigt oder unsicher.',
    reportHooks: [
      { id: 'seconds', title: 'Passanten entscheiden in Sekunden.', text: 'Laut FedEx Office betraten 76% der Befragten ein unbekanntes Geschäft wegen seiner Beschilderung; 68% kauften etwas, weil ein Schild ihre Aufmerksamkeit gewann. Wenn das Licht ausfällt, verliert der Standort diesen ersten Moment.' },
      { id: 'trust', title: 'Schlechtes Licht kostet Vertrauen.', text: '52% der Menschen gehen weniger gern in ein Geschäft mit schlecht gemachten Schildern. Die Sign Research Foundation nennt Fälle, in denen gezielte Updates der Außenbeschilderung bis zu 16% mehr Wochenumsatz brachten.' },
    ],
    reports: [
      { id: 'r1', type: 'LED-Buchstaben', issue: 'Einzelne Elemente waren dunkel, die Wortmarke wirkte unvollstaendig.', outcome: 'Module ersetzt, Helligkeit angeglichen, Lesbarkeit wiederhergestellt.' },
      { id: 'r2', type: 'Leuchtkasten', issue: 'Unregelmaessige Ausleuchtung und verschmutzte Innenflächen.', outcome: 'Innen gereinigt, LED-Strecke geprüft, Lichtfeld stabilisiert.' },
      { id: 'r3', type: 'Folierung', issue: 'Kanten lösten sich, Farben wirkten nicht mehr markengerecht.', outcome: 'Untergrund vorbereitet und Sichtfläche neu foliert.' },
      { id: 'r4', type: 'Filialservice', issue: 'Mehrere kleine Mängel lagen verteilt ueber Standorte vor.', outcome: 'Ein Servicebericht mit priorisierten nächsten Schritten erstellt.' },
    ],
    galleryEyebrow: 'Projektvideo',
    galleryTitle: 'Arbeit im Projekt',
    galleryIntro:
      'Ein kurzer Clip zeigt Montage, Ausführung und die Wirkung der Lichtwerbung direkt am Standort.',
    galleryPromoEyebrow: 'Fotogalerie',
    galleryPromoTitle: 'Details realisierter Arbeiten',
    galleryPromoText:
      'Fotos zeigen Materialien, Verarbeitung und Ergebnisse aus Reparatur, Montage und Branding.',
    galleryPromoCta: 'Fotos ansehen',
    galleryPromoHref: '#gallery',
    typeBandLines: ['Repair evidence', 'LED · Neon · Folie · Montage', 'Ein Partner. Ein Auftrag. Ein Ergebnis.'],
    finalTitle: 'Zeigen Sie uns Ihr Schild, Ihre Fassade oder Ihr Werbeelement.',
    finalText:
      'Ein Foto reicht oft für die erste Einschätzung. PixelRing prüft den sichtbaren Zustand und klaert den nächsten sinnvollen Schritt.',
    finalCta: 'Service starten',
    modalProblemLabel: 'Ausgangslage',
    modalWorkLabel: 'Umsetzung',
    modalResultLabel: 'Ergebnis',
    modalBeforeLabel: 'Vorher ansehen',
    modalCta: 'Ähnlichen Fall starten',
    viewerAllLabel: 'Alle',
    viewerCloseLabel: 'Schliessen',
  },
  en: {
    metaTitle: 'References for Sign Repair & Visual Service | PixelRing',
    metaDescription:
      'Selected PixelRing references: lightboxes, LED letters, neon, window film, facade mounting, and branch service without private customer data.',
    badge: 'References',
    heroTitle: 'Our work',
    heroIntro:
      'These examples show what was wrong, what PixelRing checked and repaired, and how the advertising element looked after service. No customer names, exact addresses, or internal CRM data.',
    heroPrimaryCta: 'View work',
    heroSecondaryCta: 'Start a similar case',
    heroTags: ['LED service', 'Lightboxes', 'Neon', 'Films', 'Facades', 'Branch service'],
    heroNoteTitle: 'Proof, not a vanity gallery',
    heroNoteText:
      'Every reference is shaped like a short repair report: initial state, work performed, outcome. The focus stays on execution and trust.',
    recentEyebrow: 'Selected work',
    recentTitle: 'Visual result and work summary',
    recentIntro:
      'Each card shows the site before and after. The report lists the issue, completed work, and result.',
    reportTitle: 'A sign should not look tired',
    reportIntro:
      'Dark letters, flickering light, a dirty lightbox, or peeling window film are not just defects. To someone passing by, they can make a location feel closed, neglected, or unreliable.',
    reportHooks: [
      { id: 'seconds', title: 'People decide in seconds.', text: 'FedEx Office found that 76% of consumers entered a store they had never visited because of its signs, and 68% bought a product or service because a sign caught their eye. If the light fails, the business loses that first chance.' },
      { id: 'trust', title: 'Bad light weakens trust.', text: '52% of people are less willing to enter a store with poorly made signage. Sign Research Foundation cites cases where targeted exterior sign updates produced up to 16% higher weekly sales.' },
    ],
    reports: [
      { id: 'r1', type: 'LED letters', issue: 'Several elements were dark and the wordmark looked incomplete.', outcome: 'Modules replaced, brightness matched, readability restored.' },
      { id: 'r2', type: 'Lightbox', issue: 'Uneven lighting and dirty internal surfaces.', outcome: 'Interior cleaned, LED path checked, light field stabilized.' },
      { id: 'r3', type: 'Window film', issue: 'Edges lifted and colors no longer matched the brand.', outcome: 'Surface prepared and the visible area wrapped again.' },
      { id: 'r4', type: 'Branch service', issue: 'Several small defects were spread across locations.', outcome: 'One service report created with prioritized next steps.' },
    ],
    galleryEyebrow: 'Project video',
    galleryTitle: 'Work on site',
    galleryIntro:
      'A short clip shows installation, execution, and the effect of illuminated signage at the location.',
    galleryPromoEyebrow: 'Photo gallery',
    galleryPromoTitle: 'Details from completed work',
    galleryPromoText:
      'Photos show materials, workmanship, and results from repair, installation, and branding.',
    galleryPromoCta: 'View photos',
    galleryPromoHref: '#gallery',
    typeBandLines: ['Repair evidence', 'LED · Neon · Film · Mounting', 'One partner. One request. One result.'],
    finalTitle: 'Show us your sign, facade, or advertising element.',
    finalText:
      'A photo is often enough for the first assessment. PixelRing checks the visible condition and clarifies the next useful step.',
    finalCta: 'Start service',
    modalProblemLabel: 'Initial state',
    modalWorkLabel: 'Work done',
    modalResultLabel: 'Outcome',
    modalBeforeLabel: 'View before',
    modalCta: 'Start a similar case',
    viewerAllLabel: 'All',
    viewerCloseLabel: 'Close',
  },
  ru: {
    metaTitle: 'Примеры работ по ремонту вывесок | PixelRing',
    metaDescription:
      'Выбранные примеры PixelRing: световые короба, LED-буквы, неон, пленка, фасадный монтаж и сервис филиалов без раскрытия частных данных клиентов.',
    badge: 'Примеры работ',
    heroTitle: 'Наши работы',
    heroIntro:
      'На этой странице показано, что было неисправно, что PixelRing проверил и восстановил, и как рекламный элемент стал выглядеть после работы. Без имен клиентов, точных адресов и CRM-данных.',
    heroPrimaryCta: 'Смотреть работы',
    heroSecondaryCta: 'Начать похожий случай',
    heroTags: ['LED-сервис', 'Световые короба', 'Неон', 'Пленки', 'Фасады', 'Сервис сетей'],
    heroNoteTitle: 'Доказательство, а не витрина',
    heroNoteText:
      'Каждый пример оформлен как короткий ремонтный отчет: исходное состояние, выполненная работа, результат. Фокус на исполнении и доверии.',
    recentEyebrow: 'Выбранные работы',
    recentTitle: 'Визуальный результат и список работ',
    recentIntro:
      'Каждая карточка показывает объект до и после. Внутри указан краткий отчет: проблема, выполненные работы и результат.',
    reportTitle: 'Вывеска не должна выглядеть уставшей',
    reportIntro:
      'Потухшие буквы, мерцание, грязный световой короб или отклеенная пленка — это не просто дефект. Для человека с улицы это быстрый сигнал: место выглядит закрытым, заброшенным или неаккуратным.',
    reportHooks: [
      { id: 'seconds', title: 'Прохожий решает за секунды.', text: 'В исследовании FedEx Office 76% людей заходили в незнакомый магазин из-за вывески, а 68% покупали товар или услугу, потому что знак привлек внимание. Если свет не работает, бизнес теряет этот первый шанс.' },
      { id: 'trust', title: 'Плохой свет бьет по доверию.', text: '52% людей менее охотно заходят в место с плохо сделанной вывеской. По данным Sign Research Foundation, обновление наружной вывески в отдельных кейсах давало до 16% роста недельных продаж.' },
    ],
    reports: [
      { id: 'r1', type: 'LED-буквы', issue: 'Отдельные элементы не горели, название выглядело неполным.', outcome: 'Модули заменены, яркость выровнена, читаемость восстановлена.' },
      { id: 'r2', type: 'Световой короб', issue: 'Подсветка была неравномерной, внутри заметны загрязнения.', outcome: 'Внутренняя часть очищена, LED-линия проверена, свет стабилизирован.' },
      { id: 'r3', type: 'Витринная пленка', issue: 'Края отходили, цвет больше не соответствовал бренду.', outcome: 'Поверхность подготовлена и видимая зона оклеена заново.' },
      { id: 'r4', type: 'Сервис филиалов', issue: 'Мелкие дефекты копились на нескольких объектах.', outcome: 'Собран единый отчет с приоритетом следующих работ.' },
    ],
    galleryEyebrow: 'Видео проекта',
    galleryTitle: 'Работа на объекте',
    galleryIntro:
      'Короткий ролик показывает монтаж, выполнение работ и результат световой рекламы непосредственно на объекте.',
    galleryPromoEyebrow: 'Фотогалерея',
    galleryPromoTitle: 'Детали выполненных работ',
    galleryPromoText:
      'Фотографии показывают материалы, качество исполнения и результаты ремонта, монтажа и брендинга.',
    galleryPromoCta: 'Смотреть фотографии',
    galleryPromoHref: '#gallery',
    typeBandLines: ['Repair evidence', 'LED · Neon · Folie · Montage', 'Один партнер. Одна заявка. Один результат.'],
    finalTitle: 'Покажите нам вывеску, фасад или рекламный элемент.',
    finalText:
      'Для первичной оценки часто достаточно фотографии. PixelRing проверит видимое состояние и предложит следующий разумный шаг.',
    finalCta: 'Запустить сервис',
    modalProblemLabel: 'Исходное состояние',
    modalWorkLabel: 'Что сделано',
    modalResultLabel: 'Результат',
    modalBeforeLabel: 'Показать before',
    modalCta: 'Начать похожий случай',
    viewerAllLabel: 'Все',
    viewerCloseLabel: 'Закрыть',
  },
  tr: {
    metaTitle: 'Tabela Onarımı Referansları | PixelRing',
    metaDescription:
      'PixelRing seçili referansları: ışıklı kutular, LED harfler, neon, vitrin filmi, cephe montajı ve şube servisi. Özel müşteri verisi paylaşılmaz.',
    badge: 'Referanslar',
    heroTitle: 'Çalışmalarımız',
    heroIntro:
      'Bu örnekler neyin bozuk olduğunu, PixelRing’in neyi kontrol edip onardığını ve reklam unsurunun servis sonrası nasıl göründüğünü gösterir. Müşteri adı, tam adres veya CRM verisi yoktur.',
    heroPrimaryCta: 'İşleri görüntüle',
    heroSecondaryCta: 'Benzer işlem başlat',
    heroTags: ['LED servis', 'Işıklı kutular', 'Neon', 'Filmler', 'Cepheler', 'Şube servisi'],
    heroNoteTitle: 'Galeri değil, kanıt',
    heroNoteText:
      'Her referans kısa bir onarım raporu gibi kurulur: başlangıç durumu, yapılan iş, sonuç. Odak uygulama ve güven üzerindedir.',
    recentEyebrow: 'Seçili işler',
    recentTitle: 'Görsel sonuç ve iş özeti',
    recentIntro:
      'Her kart lokasyonu önce ve sonra gösterir. Raporda sorun, yapılan işler ve sonuç yer alır.',
    reportTitle: 'Tabela yorgun görünmemeli',
    reportIntro:
      'Sönmüş harfler, titreyen ışık, kirli bir ışıklı kutu veya kalkmış film sadece teknik arıza değildir. Sokaktan bakan biri için işletme kapalı, bakımsız veya güvensiz görünebilir.',
    reportHooks: [
      { id: 'seconds', title: 'İnsanlar saniyeler içinde karar verir.', text: 'FedEx Office araştırmasına göre tüketicilerin %76’sı tabelası sayesinde daha önce gitmediği bir mağazaya girdi; %68’i de dikkatini çeken bir tabela nedeniyle ürün veya hizmet satın aldı. Işık çalışmıyorsa işletme bu ilk şansı kaybeder.' },
      { id: 'trust', title: 'Kötü ışık güveni zayıflatır.', text: 'İnsanların %52’si kötü yapılmış tabelası olan bir yere girmeye daha az isteklidir. Sign Research Foundation, dış tabela güncellemelerinin bazı örneklerde haftalık satışları %16’ya kadar artırdığını bildirir.' },
    ],
    reports: [
      { id: 'r1', type: 'LED harfler', issue: 'Bazı elemanlar karanlıktı ve marka yazısı eksik görünüyordu.', outcome: 'Modüller değiştirildi, parlaklık eşitlendi, okunabilirlik geri geldi.' },
      { id: 'r2', type: 'Işıklı kutu', issue: 'Işık dağılımı düzensizdi ve iç yüzey kirliydi.', outcome: 'İç bölüm temizlendi, LED hattı kontrol edildi, ışık alanı stabilize edildi.' },
      { id: 'r3', type: 'Vitrin filmi', issue: 'Kenarlar kalkmıştı ve renkler markaya uygun değildi.', outcome: 'Yüzey hazırlandı ve görünür alan yeniden kaplandı.' },
      { id: 'r4', type: 'Şube servisi', issue: 'Küçük arızalar farklı lokasyonlara dağılmıştı.', outcome: 'Öncelikli adımları olan tek servis raporu oluşturuldu.' },
    ],
    galleryEyebrow: 'Proje videosu',
    galleryTitle: 'Sahada çalışma',
    galleryIntro:
      'Kısa video, montajı, uygulamayı ve ışıklı reklamın lokasyondaki etkisini gösterir.',
    galleryPromoEyebrow: 'Fotoğraf galerisi',
    galleryPromoTitle: 'Tamamlanan işlerden detaylar',
    galleryPromoText:
      'Fotoğraflar onarım, montaj ve markalama çalışmalarındaki malzemeleri, işçiliği ve sonuçları gösterir.',
    galleryPromoCta: 'Fotoğrafları görüntüle',
    galleryPromoHref: '#gallery',
    typeBandLines: ['Repair evidence', 'LED · Neon · Film · Montaj', 'Tek ortak. Tek talep. Tek sonuç.'],
    finalTitle: 'Tabelanızı, cephenizi veya reklam unsurunuzu gösterin.',
    finalText:
      'İlk değerlendirme için çoğu zaman bir fotoğraf yeterlidir. PixelRing görünen durumu kontrol eder ve sonraki mantıklı adımı netleştirir.',
    finalCta: 'Servisi başlat',
    modalProblemLabel: 'Başlangıç durumu',
    modalWorkLabel: 'Yapılan iş',
    modalResultLabel: 'Sonuç',
    modalBeforeLabel: 'Öncesini gör',
    modalCta: 'Benzer işlem başlat',
    viewerAllLabel: 'Tümü',
    viewerCloseLabel: 'Kapat',
  },
  pl: {
    metaTitle: 'Realizacje napraw szyldów i reklam | PixelRing',
    metaDescription:
      'Wybrane realizacje PixelRing: kasetony, litery LED, neon, folie, montaż elewacyjny i obsługa sieci bez ujawniania prywatnych danych klientów.',
    badge: 'Realizacje',
    heroTitle: 'Nasze realizacje',
    heroIntro:
      'Te przykłady pokazują, co było uszkodzone, co PixelRing sprawdził i naprawił oraz jak element reklamowy wyglądał po usłudze. Bez nazw klientów, dokładnych adresów i danych CRM.',
    heroPrimaryCta: 'Zobacz prace',
    heroSecondaryCta: 'Rozpocznij podobną sprawę',
    heroTags: ['Serwis LED', 'Kasetony', 'Neon', 'Folie', 'Elewacje', 'Serwis sieci'],
    heroNoteTitle: 'Dowód, nie galeria',
    heroNoteText:
      'Każda realizacja ma formę krótkiego raportu: stan wyjściowy, wykonana praca, efekt. Liczy się wykonanie i zaufanie.',
    recentEyebrow: 'Wybrane prace',
    recentTitle: 'Efekt wizualny i zakres prac',
    recentIntro:
      'Każda karta pokazuje obiekt przed i po pracy. W raporcie są problem, wykonane prace i efekt.',
    reportTitle: 'Szyld nie powinien wyglądać na zmęczony',
    reportIntro:
      'Zgaszone litery, migające światło, brudny kaseton albo odklejająca się folia to nie tylko usterka. Dla osoby z ulicy lokal może wyglądać na zamknięty, zaniedbany albo mało wiarygodny.',
    reportHooks: [
      { id: 'seconds', title: 'Ludzie decydują w kilka sekund.', text: 'Według FedEx Office 76% konsumentów weszło do nieznanego sklepu dzięki jego oznakowaniu, a 68% kupiło produkt lub usługę, bo szyld przyciągnął uwagę. Jeśli światło nie działa, firma traci tę pierwszą szansę.' },
      { id: 'trust', title: 'Złe światło osłabia zaufanie.', text: '52% osób mniej chętnie wchodzi do miejsca ze źle wykonaną reklamą. Sign Research Foundation podaje przypadki, w których celowa aktualizacja zewnętrznego szyldu dawała do 16% wzrostu tygodniowej sprzedaży.' },
    ],
    reports: [
      { id: 'r1', type: 'Litery LED', issue: 'Część elementów była ciemna, a znak wyglądał na niepełny.', outcome: 'Wymieniono moduły, wyrównano jasność, przywrócono czytelność.' },
      { id: 'r2', type: 'Kaseton', issue: 'Nierówne światło i zabrudzone powierzchnie wewnętrzne.', outcome: 'Wnętrze oczyszczono, tor LED sprawdzono, pole świetlne ustabilizowano.' },
      { id: 'r3', type: 'Folia witrynowa', issue: 'Krawędzie odchodziły, kolory nie pasowały już do marki.', outcome: 'Przygotowano podłoże i ponownie oklejono widoczną powierzchnię.' },
      { id: 'r4', type: 'Serwis sieci', issue: 'Kilka małych usterek było rozproszonych po lokalizacjach.', outcome: 'Utworzono jeden raport z priorytetami kolejnych działań.' },
    ],
    galleryEyebrow: 'Wideo projektu',
    galleryTitle: 'Praca na miejscu',
    galleryIntro:
      'Krótki film pokazuje montaż, wykonanie i efekt reklamy świetlnej bezpośrednio w obiekcie.',
    galleryPromoEyebrow: 'Galeria zdjęć',
    galleryPromoTitle: 'Detale zrealizowanych prac',
    galleryPromoText:
      'Zdjęcia pokazują materiały, jakość wykonania i rezultaty napraw, montażu oraz brandingu.',
    galleryPromoCta: 'Zobacz zdjęcia',
    galleryPromoHref: '#gallery',
    typeBandLines: ['Repair evidence', 'LED · Neon · Folia · Montaż', 'Jeden partner. Jedno zgłoszenie. Jeden wynik.'],
    finalTitle: 'Pokaż nam swój szyld, fasadę lub element reklamowy.',
    finalText:
      'Do pierwszej oceny często wystarczy zdjęcie. PixelRing sprawdzi widoczny stan i ustali kolejny rozsądny krok.',
    finalCta: 'Rozpocznij serwis',
    modalProblemLabel: 'Stan wyjściowy',
    modalWorkLabel: 'Wykonano',
    modalResultLabel: 'Efekt',
    modalBeforeLabel: 'Zobacz przed',
    modalCta: 'Rozpocznij podobną sprawę',
    viewerAllLabel: 'Wszystkie',
    viewerCloseLabel: 'Zamknij',
  },
  ar: {
    metaTitle: 'مراجع إصلاح اللوحات والإعلانات | PixelRing',
    metaDescription:
      'نماذج مختارة من أعمال PixelRing: صناديق مضيئة، حروف LED، نيون، أفلام واجهات، تثبيت واجهات وخدمة فروع بدون كشف بيانات العملاء الخاصة.',
    badge: 'الأعمال المنجزة',
    heroTitle: 'أعمالنا',
    heroIntro:
      'تعرض هذه الأمثلة ما كان معطلاً، وما فحصته PixelRing ونفذته، وكيف أصبح العنصر الإعلاني بعد الخدمة. لا أسماء عملاء، لا عناوين دقيقة، ولا بيانات CRM داخلية.',
    heroPrimaryCta: 'عرض الأعمال',
    heroSecondaryCta: 'ابدأ حالة مشابهة',
    heroTags: ['خدمة LED', 'صناديق مضيئة', 'نيون', 'أفلام', 'واجهات', 'خدمة الفروع'],
    heroNoteTitle: 'إثبات عمل لا معرض فقط',
    heroNoteText:
      'كل مرجع مكتوب كتقرير إصلاح قصير: الحالة الأولية، العمل المنفذ، والنتيجة. التركيز على التنفيذ والثقة.',
    recentEyebrow: 'أعمال مختارة',
    recentTitle: 'النتيجة المرئية وملخص العمل',
    recentIntro:
      'تعرض كل بطاقة الموقع قبل العمل وبعده. يوضح التقرير المشكلة والعمل المنفذ والنتيجة.',
    reportTitle: 'يجب ألا تبدو اللافتة متعبة',
    reportIntro:
      'الحروف المطفأة، الوميض، الصندوق المضيء المتسخ أو الفيلم المتقشر ليست مجرد أعطال. بالنسبة لمن يمر في الشارع قد يبدو المكان مغلقاً أو مهملاً أو غير موثوق.',
    reportHooks: [
      { id: 'seconds', title: 'الناس يقررون خلال ثوانٍ.', text: 'وجدت دراسة FedEx Office أن 76% من المستهلكين دخلوا متجراً لم يزوروه من قبل بسبب لافتته، وأن 68% اشتروا منتجاً أو خدمة لأن اللافتة جذبت انتباههم. إذا تعطل الضوء، يخسر الموقع هذه الفرصة الأولى.' },
      { id: 'trust', title: 'الإضاءة السيئة تضعف الثقة.', text: '52% من الناس أقل استعداداً لدخول مكان ذي لافتة رديئة التنفيذ. وتشير Sign Research Foundation إلى حالات رفعت فيها تحديثات الواجهة الخارجية المبيعات الأسبوعية حتى 16%.' },
    ],
    reports: [
      { id: 'r1', type: 'حروف LED', issue: 'بعض العناصر كانت مطفأة وكان اسم العلامة غير مكتمل.', outcome: 'تم تبديل الوحدات، توحيد السطوع، واستعادة الوضوح.' },
      { id: 'r2', type: 'صندوق مضيء', issue: 'إضاءة غير متساوية وأسطح داخلية متسخة.', outcome: 'تم تنظيف الداخل، فحص مسار LED، وتثبيت مجال الإضاءة.' },
      { id: 'r3', type: 'فيلم واجهة', issue: 'الحواف بدأت تنفصل والألوان لم تعد مناسبة للعلامة.', outcome: 'تم تحضير السطح وتغليف المنطقة المرئية من جديد.' },
      { id: 'r4', type: 'خدمة فروع', issue: 'عدة أعطال صغيرة موزعة على مواقع مختلفة.', outcome: 'تم إعداد تقرير خدمة واحد مع خطوات ذات أولوية.' },
    ],
    galleryEyebrow: 'فيديو المشروع',
    galleryTitle: 'العمل في الموقع',
    galleryIntro:
      'يعرض مقطع قصير التركيب والتنفيذ وتأثير الإعلان المضيء مباشرة في الموقع.',
    galleryPromoEyebrow: 'معرض الصور',
    galleryPromoTitle: 'تفاصيل من الأعمال المنفذة',
    galleryPromoText:
      'تعرض الصور المواد وجودة التنفيذ ونتائج الإصلاح والتركيب والهوية البصرية.',
    galleryPromoCta: 'عرض الصور',
    galleryPromoHref: '#gallery',
    typeBandLines: ['Repair evidence', 'LED · Neon · Film · Mounting', 'شريك واحد. طلب واحد. نتيجة واحدة.'],
    finalTitle: 'أرنا لوحتك أو واجهتك أو العنصر الإعلاني لديك.',
    finalText:
      'غالباً تكفي صورة واحدة للتقييم الأولي. تفحص PixelRing الحالة الظاهرة وتوضح الخطوة العملية التالية.',
    finalCta: 'ابدأ الخدمة',
    modalProblemLabel: 'الحالة الأولية',
    modalWorkLabel: 'العمل المنفذ',
    modalResultLabel: 'النتيجة',
    modalBeforeLabel: 'عرض قبل الإصلاح',
    modalCta: 'ابدأ حالة مشابهة',
    viewerAllLabel: 'الكل',
    viewerCloseLabel: 'إغلاق',
  },
};

const CASE_COPY: Record<Locale, Array<Omit<ReferenceCase, 'beforeImage' | 'afterImage' | 'gallery'>>> = {
  de: [
    { id: 'lightbox-facade', title: 'LED-Lightbox an der Fassade', category: 'Leuchtkasten', problem: 'Ein Teil des Lichtfelds blieb dunkel, der Eingang wirkte abends vernachlässigt.', work: 'Stromversorgung geprüft, beschädigte LED-Elemente ersetzt, Innenfläche gereinigt und Helligkeit angeglichen.', result: 'Die Fassade wirkt abends wieder aktiv und gut sichtbar.', defaultText: 'Gleichmäßige Ausleuchtung für bessere Abendwirkung.', beforeText: 'Vorher: dunkle Bereiche und ein sichtbar gealterter Kasten.' },
    { id: 'led-letters', title: 'LED-Buchstaben an der Shop-Fassade', category: 'LED-Buchstaben', problem: 'Die Hauptbeschriftung an der Fassade blieb dunkel: Das Signetelement war sichtbar, die Buchstaben aber nicht.', work: 'Stromversorgung und Verbindungen geprüft, LED-Module wieder in Betrieb genommen und die sichtbare Helligkeit abgestimmt.', result: 'Die Fassadenbeschriftung ist abends wieder vollständig lesbar.', defaultText: 'Die Fassadenbeschriftung ist abends wieder klar sichtbar.', beforeText: 'Vorher: die Hauptbeschriftung an der Fassade leuchtete nicht.', beforeAlt: 'Vor der Reparatur: Shop-Fassade mit LED-Buchstaben, deren Hauptbeschriftung nicht leuchtet', afterAlt: 'Nach der Reparatur: Shop-Fassade mit wiederhergestellter Beleuchtung der LED-Buchstaben am Abend', galleryAlts: ['Vor der Reparatur: Shop-Fassade mit dunkler Hauptbeschriftung', 'Nach der Reparatur: Shop-Fassade mit hell leuchtenden LED-Buchstaben'] },
    { id: 'neon-contour', title: 'Neon-Konturlicht', category: 'Neon', problem: 'Teile der Kontur flackerten oder schalteten nach dem Aufwärmen ab.', work: 'Instabilen Abschnitt eingegrenzt, Kontakt wiederhergestellt und Abendbetrieb geprüft.', result: 'Der warme Konturverlauf ist wieder ohne sichtbare Aussetzer.', defaultText: 'Warmer Konturverlauf ohne sichtbare Aussetzer.', beforeText: 'Vorher: Flackern und unterbrochene Lichtlinie.' },
    { id: 'window-film', title: 'Schaufenster-Folierung', category: 'Folien', problem: 'Die Folie war ausgeblichen und löste sich an den Kanten.', work: 'Alte Schicht entfernt, Untergrund vorbereitet und neue Markenfläche aufgebracht.', result: 'Die Fläche wirkt wieder wie ein gepflegter Teil des Standorts.', defaultText: 'Aktualisierte Sichtfläche statt provisorischer Wirkung.', beforeText: 'Vorher: gelöste Kanten und verblasste Markenfarbe.' },
    { id: 'branch-service', title: 'Service für mehrere Standorte', category: 'Filialservice', problem: 'Mängel lagen verteilt vor und wurden nicht gemeinsam priorisiert.', work: 'Zustand zusammengeführt, akute und planbare Arbeiten getrennt und als Servicebericht strukturiert.', result: 'Das Team erhielt eine klare Reihenfolge für die nächsten Schritte.', defaultText: 'Mehrere Standorte in einem verständlichen Servicebild.', beforeText: 'Vorher: Einzelfälle ohne Gesamtüberblick.' },
    { id: 'mounting-review', title: 'Fassadenbeschriftung für Restaurant Pasternak', category: 'Fassadenbeschriftung', problem: 'Die bestehende Beschriftung der Restaurantfassade sollte im vorhandenen Erscheinungsbild erneuert werden.', work: 'Die neue Beschriftung wurde mit einer passgenauen Schablone vorbereitet und anschließend direkt auf die Fassade lackiert.', result: 'Das Schriftbild wirkt wieder sauber und einheitlich.', defaultText: 'Präzise Schablonenlackierung für ein klares, einheitliches Schriftbild.', beforeText: 'Vorher: bestehende Fassadenbeschriftung vor der Erneuerung.', beforeAlt: 'Fassadenbeschriftung von Restaurant Pasternak vor der Erneuerung', afterAlt: 'Fertig lackierte Fassadenbeschriftung von Restaurant Pasternak', galleryAlts: ['Fassadenbeschriftung von Restaurant Pasternak vor der Erneuerung', 'Schablonenlackierung der Fassadenbeschriftung von Restaurant Pasternak während der Ausführung', 'Fertig lackierte Fassadenbeschriftung von Restaurant Pasternak'] },
  ],
  en: [
    { id: 'lightbox-facade', title: 'Facade LED lightbox', category: 'Lightbox', problem: 'Part of the light field stayed dark and the entrance looked neglected at night.', work: 'Power supply checked, damaged LED elements replaced, interior cleaned, brightness balanced.', result: 'The facade looks active and visible again after dark.', defaultText: 'Even lighting restored for stronger evening visibility.', beforeText: 'Vorher: dark areas and a visibly tired lightbox.' },
    { id: 'led-letters', title: 'LED letters on a shop facade', category: 'LED letters', problem: 'The main facade lettering stayed dark: the symbol was visible, but the letters were not illuminated.', work: 'Power supply and connections were checked, LED modules were restored, and the visible brightness was matched.', result: 'The facade lettering is fully readable again in the evening.', defaultText: 'The facade lettering is clearly visible again after dark.', beforeText: 'Before: the main facade lettering did not light up.', beforeAlt: 'Before repair: shop facade with LED letters where the main lettering is not illuminated', afterAlt: 'After repair: shop facade with restored illumination of LED letters in the evening', galleryAlts: ['Before repair: shop facade with dark main lettering', 'After repair: shop facade with brightly illuminated LED letters'] },
    { id: 'neon-contour', title: 'Neon contour light', category: 'Neon', problem: 'Sections flickered or switched off after warming up.', work: 'Unstable section isolated, contact restored, evening operation checked.', result: 'The warm contour line runs without visible gaps.', defaultText: 'Warm contour light without visible dropouts.', beforeText: 'Vorher: flicker and interrupted light line.' },
    { id: 'window-film', title: 'Storefront film', category: 'Films', problem: 'The film had faded and started lifting at the edges.', work: 'Old layer removed, substrate prepared, new branded surface applied.', result: 'The surface looks like a maintained part of the location again.', defaultText: 'Updated visible surface instead of a temporary look.', beforeText: 'Vorher: lifted edges and faded brand color.' },
    { id: 'branch-service', title: 'Multi-location service', category: 'Branch service', problem: 'Defects were spread across locations and not prioritized together.', work: 'Condition consolidated, urgent and planned work separated, report structured.', result: 'The team received a clear order for next steps.', defaultText: 'Several locations combined into one clear service view.', beforeText: 'Vorher: isolated issues without a shared overview.' },
    { id: 'mounting-review', title: 'Facade lettering for Restaurant Pasternak', category: 'Facade lettering', problem: 'The existing lettering on the restaurant facade needed renewal within the established visual design.', work: 'The new lettering was prepared with a precise stencil and then painted directly onto the facade.', result: 'The lettering now looks clean and visually consistent again.', defaultText: 'Precise stencil painting for clear, consistent facade lettering.', beforeText: 'Before: existing facade lettering before renewal.', beforeAlt: 'Restaurant Pasternak facade lettering before renewal', afterAlt: 'Finished painted facade lettering at Restaurant Pasternak', galleryAlts: ['Restaurant Pasternak facade lettering before renewal', 'Stencil painting of Restaurant Pasternak facade lettering during the work', 'Finished painted facade lettering at Restaurant Pasternak'] },
  ],
  ru: [
    { id: 'lightbox-facade', title: 'LED-lightbox фасада', category: 'Световой короб', problem: 'Часть светового поля не горела, вход вечером выглядел заброшенным.', work: 'Проверили питание, заменили поврежденные LED-элементы, очистили внутреннюю поверхность и выровняли яркость.', result: 'Фасад снова выглядит активным и заметным вечером.', defaultText: 'Равномерная подсветка восстановлена для вечерней видимости.', beforeText: 'ДО: темные зоны и визуально уставший короб.' },
    { id: 'led-letters', title: 'LED-буквы на фасаде магазина', category: 'Объемные буквы', problem: 'На фасаде не светилась основная надпись: знак был виден, но буквы оставались темными и вывеска теряла читаемость вечером.', work: 'Проверили питание и соединения, восстановили работу LED-модулей и выровняли визуальную яркость элементов.', result: 'Фасадная надпись снова читается целиком, а вход выглядит активным и заметным в темное время.', defaultText: 'Фасадная надпись снова ярко читается вечером.', beforeText: 'ДО: часть фасадной надписи не светилась.', beforeAlt: 'До ремонта: фасад магазина с объемными LED-буквами, где основная надпись не светится', afterAlt: 'После ремонта: фасад магазина с восстановленной подсветкой объемных LED-букв вечером', galleryAlts: ['До ремонта: фасад магазина с темной основной надписью', 'После ремонта: фасад магазина с ярко подсвеченными объемными LED-буквами'] },
    { id: 'neon-contour', title: 'Неоновый контур', category: 'Неон', problem: 'Секции мерцали или отключались после прогрева.', work: 'Нашли нестабильный участок, восстановили контакт и проверили работу вечером.', result: 'Теплый контур снова работает без заметных провалов.', defaultText: 'Теплый контур без заметных разрывов.', beforeText: 'ДО: мерцание и разорванная линия света.' },
    { id: 'window-film', title: 'Витринная пленка', category: 'Пленки', problem: 'Пленка выгорела и начала отходить по краям.', work: 'Сняли старый слой, подготовили основание и нанесли новую брендированную поверхность.', result: 'Витрина снова выглядит как ухоженная часть действующей точки.', defaultText: 'Обновленная поверхность без ощущения временного ремонта.', beforeText: 'ДО: отходящие края и выцветший цвет бренда.' },
    { id: 'branch-service', title: 'Сервис нескольких точек', category: 'Сервис филиалов', problem: 'Дефекты были разбросаны по объектам и не имели общего приоритета.', work: 'Собрали состояние в один отчет, разделили срочные и плановые работы.', result: 'Команда получила понятный порядок следующих действий.', defaultText: 'Несколько объектов сведены в один понятный обзор.', beforeText: 'ДО: отдельные проблемы без общей картины.' },
    { id: 'mounting-review', title: 'Фасадная надпись для ресторана Pasternak', category: 'Фасадная надпись', problem: 'Существующую надпись на фасаде ресторана нужно было обновить, сохранив её привычный визуальный образ.', work: 'Новую надпись подготовили с точным трафаретом, а затем нанесли краской непосредственно на фасад.', result: 'Надпись снова выглядит чисто и цельно.', defaultText: 'Точная окраска по трафарету для чёткой и единой фасадной надписи.', beforeText: 'До: исходная фасадная надпись перед обновлением.', beforeAlt: 'Фасадная надпись ресторана Pasternak до обновления', afterAlt: 'Готовая окрашенная фасадная надпись ресторана Pasternak', galleryAlts: ['Фасадная надпись ресторана Pasternak до обновления', 'Окраска по трафарету фасадной надписи ресторана Pasternak во время работ', 'Готовая окрашенная фасадная надпись ресторана Pasternak'] },
  ],
  tr: [
    { id: 'lightbox-facade', title: 'Cephe LED ışıklı kutu', category: 'Işıklı kutu', problem: 'Işık alanının bir bölümü karanlıktı ve giriş akşamları bakımsız görünüyordu.', work: 'Güç kaynağı kontrol edildi, hasarlı LED elemanları değiştirildi, iç yüzey temizlendi ve parlaklık dengelendi.', result: 'Cephe akşamları tekrar aktif ve görünür hale geldi.', defaultText: 'Akşam görünürlüğü için eşit aydınlatma geri geldi.', beforeText: 'Vorher: karanlık bölgeler ve yıpranmış görünen kutu.' },
    { id: 'led-letters', title: 'Mağaza cephesinde LED harfler', category: 'LED harfler', problem: 'Cephedeki ana yazı karanlık kaldı: sembol görünüyordu, ancak harfler aydınlanmıyordu.', work: 'Güç beslemesi ve bağlantılar kontrol edildi, LED modülleri yeniden çalıştırıldı ve görünen parlaklık dengelendi.', result: 'Cephe yazısı akşam saatlerinde yeniden tamamen okunabilir hale geldi.', defaultText: 'Cephe yazısı akşam yeniden net görünüyor.', beforeText: 'Öncesi: cephedeki ana yazı yanmıyordu.', beforeAlt: 'Onarım öncesi: ana yazısı yanmayan LED harfli mağaza cephesi', afterAlt: 'Onarım sonrası: akşam LED harf aydınlatması geri gelen mağaza cephesi', galleryAlts: ['Onarım öncesi: ana yazısı karanlık mağaza cephesi', 'Onarım sonrası: parlak LED harflerle aydınlanan mağaza cephesi'] },
    { id: 'neon-contour', title: 'Neon kontur ışığı', category: 'Neon', problem: 'Bazı bölümler titriyor veya ısındıktan sonra kapanıyordu.', work: 'Dengesiz bölüm bulundu, kontak onarıldı ve akşam çalışma modu kontrol edildi.', result: 'Sıcak kontur çizgisi görünür kesinti olmadan çalışıyor.', defaultText: 'Sıcak kontur ışığı görünür kesinti olmadan çalışıyor.', beforeText: 'Vorher: titreme ve kesintili ışık çizgisi.' },
    { id: 'window-film', title: 'Vitrin filmi', category: 'Filmler', problem: 'Film solmuştu ve kenarlardan kalkmaya başlamıştı.', work: 'Eski katman söküldü, zemin hazırlandı ve yeni markalı yüzey uygulandı.', result: 'Yüzey tekrar bakımlı bir lokasyon parçası gibi görünüyor.', defaultText: 'Geçici görünüm yerine yenilenmiş vitrin yüzeyi.', beforeText: 'Vorher: kalkmış kenarlar ve solmuş marka rengi.' },
    { id: 'branch-service', title: 'Çok lokasyonlu servis', category: 'Şube servisi', problem: 'Kusurlar lokasyonlara dağılmıştı ve birlikte önceliklendirilmiyordu.', work: 'Durum tek raporda toplandı, acil ve planlı işler ayrıldı.', result: 'Ekip sonraki adımlar için net bir sıra aldı.', defaultText: 'Birden fazla lokasyon tek servis görünümünde toplandı.', beforeText: 'Vorher: ortak görünümü olmayan ayrı sorunlar.' },
    { id: 'mounting-review', title: 'Restaurant Pasternak için cephe yazısı', category: 'Cephe yazısı', problem: 'Restoran cephesindeki mevcut yazının, yerleşik görsel kimlik korunarak yenilenmesi gerekiyordu.', work: 'Yeni yazı hassas bir şablonla hazırlandı ve ardından doğrudan cepheye boyandı.', result: 'Yazı yeniden temiz ve bütünlüklü görünüyor.', defaultText: 'Net ve tutarlı cephe yazısı için hassas şablon boyaması.', beforeText: 'Önce: yenileme öncesi mevcut cephe yazısı.', beforeAlt: 'Restaurant Pasternak cephe yazısı yenileme öncesinde', afterAlt: 'Restaurant Pasternak için tamamlanmış boyalı cephe yazısı', galleryAlts: ['Restaurant Pasternak cephe yazısı yenileme öncesinde', 'Restaurant Pasternak cephe yazısının çalışma sırasında şablonla boyanması', 'Restaurant Pasternak için tamamlanmış boyalı cephe yazısı'] },
  ],
  pl: [
    { id: 'lightbox-facade', title: 'Kaseton LED na fasadzie', category: 'Kaseton', problem: 'Część pola świetlnego była ciemna, a wejście wieczorem wyglądało na zaniedbane.', work: 'Sprawdzono zasilanie, wymieniono uszkodzone elementy LED, oczyszczono wnętrze i wyrównano jasność.', result: 'Fasada znów wygląda aktywnie i jest dobrze widoczna po zmroku.', defaultText: 'Równe światło przywrócone dla lepszej widoczności wieczorem.', beforeText: 'Vorher: ciemne obszary i wyraźnie zużyty kaseton.' },
    { id: 'led-letters', title: 'Litery LED na fasadzie sklepu', category: 'Litery LED', problem: 'Główny napis na fasadzie pozostawał ciemny: znak był widoczny, ale litery nie świeciły.', work: 'Sprawdzono zasilanie i połączenia, przywrócono pracę modułów LED i wyrównano widoczną jasność.', result: 'Napis na fasadzie jest znów w pełni czytelny wieczorem.', defaultText: 'Napis na fasadzie jest znów dobrze widoczny wieczorem.', beforeText: 'Przed: główny napis na fasadzie nie świecił.', beforeAlt: 'Przed naprawą: fasada sklepu z literami LED, których główny napis nie świeci', afterAlt: 'Po naprawie: fasada sklepu z przywróconym podświetleniem liter LED wieczorem', galleryAlts: ['Przed naprawą: fasada sklepu z ciemnym głównym napisem', 'Po naprawie: fasada sklepu z jasno świecącymi literami LED'] },
    { id: 'neon-contour', title: 'Kontur neonowy', category: 'Neon', problem: 'Części konturu migały lub wyłączały się po nagrzaniu.', work: 'Zlokalizowano niestabilny odcinek, przywrócono kontakt i sprawdzono pracę wieczorem.', result: 'Ciepła linia konturu działa bez widocznych przerw.', defaultText: 'Ciepła linia neonowa bez widocznych przerw.', beforeText: 'Vorher: migotanie i przerwana linia światła.' },
    { id: 'window-film', title: 'Folia witrynowa', category: 'Folie', problem: 'Folia wyblakła i zaczęła odchodzić na krawędziach.', work: 'Usunięto starą warstwę, przygotowano podłoże i nałożono nową powierzchnię brandową.', result: 'Witryna znów wygląda jak zadbana część działającego punktu.', defaultText: 'Odnowiona powierzchnia zamiast tymczasowego wyglądu.', beforeText: 'Vorher: odchodzące krawędzie i wyblakły kolor marki.' },
    { id: 'branch-service', title: 'Serwis wielu lokalizacji', category: 'Serwis sieci', problem: 'Usterki były rozproszone i nie miały wspólnego priorytetu.', work: 'Zebrano stan w jednym raporcie, oddzielono prace pilne od planowych.', result: 'Zespół otrzymał jasną kolejność następnych działań.', defaultText: 'Kilka lokalizacji połączonych w jeden obraz serwisowy.', beforeText: 'Vorher: osobne problemy bez wspólnego przeglądu.' },
    { id: 'mounting-review', title: 'Napis na fasadzie restauracji Pasternak', category: 'Napis na fasadzie', problem: 'Istniejący napis na fasadzie restauracji wymagał odnowienia z zachowaniem dotychczasowego wyglądu.', work: 'Nowy napis przygotowano przy użyciu precyzyjnego szablonu, a następnie pomalowano bezpośrednio na fasadzie.', result: 'Napis ponownie wygląda czysto i spójnie.', defaultText: 'Precyzyjne malowanie szablonowe dla czytelnego, spójnego napisu na fasadzie.', beforeText: 'Przed: istniejący napis na fasadzie przed odnowieniem.', beforeAlt: 'Napis na fasadzie restauracji Pasternak przed odnowieniem', afterAlt: 'Gotowy malowany napis na fasadzie restauracji Pasternak', galleryAlts: ['Napis na fasadzie restauracji Pasternak przed odnowieniem', 'Malowanie szablonowe napisu na fasadzie restauracji Pasternak podczas prac', 'Gotowy malowany napis na fasadzie restauracji Pasternak'] },
  ],
  ar: [
    { id: 'lightbox-facade', title: 'صندوق LED مضيء على الواجهة', category: 'صندوق مضيء', problem: 'بقي جزء من مساحة الإضاءة مطفأً وكان المدخل يبدو مهملاً في المساء.', work: 'تم فحص التغذية، تبديل عناصر LED المتضررة، تنظيف الداخل، وتوحيد السطوع.', result: 'أصبحت الواجهة نشطة وواضحة مرة أخرى في المساء.', defaultText: 'إضاءة متساوية عادت لتحسين الرؤية المسائية.', beforeText: 'Vorher: مناطق مظلمة وصندوق يبدو قديماً.' },
    { id: 'led-letters', title: 'حروف LED على واجهة متجر', category: 'حروف LED', problem: 'بقي النص الرئيسي على الواجهة غير مضاء: كان الرمز ظاهراً، لكن الحروف لم تكن مضاءة.', work: 'تم فحص التغذية والتوصيلات، إعادة تشغيل وحدات LED، وتوحيد السطوع المرئي.', result: 'أصبح نص الواجهة مقروءاً بالكامل مرة أخرى في المساء.', defaultText: 'نص الواجهة واضح مرة أخرى في المساء.', beforeText: 'قبل: النص الرئيسي على الواجهة لم يكن مضاءً.', beforeAlt: 'قبل الإصلاح: واجهة متجر بحروف LED لا يضيء نصها الرئيسي', afterAlt: 'بعد الإصلاح: واجهة متجر مع استعادة إضاءة حروف LED في المساء', galleryAlts: ['قبل الإصلاح: واجهة متجر بنص رئيسي مظلم', 'بعد الإصلاح: واجهة متجر بحروف LED مضاءة بوضوح'] },
    { id: 'neon-contour', title: 'إضاءة نيون محيطية', category: 'نيون', problem: 'كانت بعض المقاطع تومض أو تنطفئ بعد التسخين.', work: 'تم تحديد المقطع غير المستقر، إصلاح التلامس، وفحص التشغيل المسائي.', result: 'عاد خط النيون الدافئ دون انقطاعات ظاهرة.', defaultText: 'خط ضوء دافئ دون انقطاعات واضحة.', beforeText: 'Vorher: وميض وخط ضوئي متقطع.' },
    { id: 'window-film', title: 'فيلم واجهة متجر', category: 'أفلام', problem: 'بهت الفيلم وبدأ ينفصل عند الحواف.', work: 'أزيلت الطبقة القديمة، تم تحضير السطح، وتطبيق سطح جديد مطابق للهوية.', result: 'عادت الواجهة لتبدو كجزء مصان من الموقع.', defaultText: 'سطح مرئي محدث بدلاً من مظهر مؤقت.', beforeText: 'Vorher: حواف منفصلة ولون علامة باهت.' },
    { id: 'branch-service', title: 'خدمة عدة مواقع', category: 'خدمة الفروع', problem: 'كانت العيوب موزعة على المواقع ولم يتم ترتيبها ضمن أولوية واحدة.', work: 'تم جمع الحالة في تقرير واحد وفصل الأعمال العاجلة عن المخططة.', result: 'حصل الفريق على ترتيب واضح للخطوات التالية.', defaultText: 'عدة مواقع ضمن صورة خدمة واحدة واضحة.', beforeText: 'Vorher: مشاكل منفصلة بلا نظرة عامة مشتركة.' },
    { id: 'mounting-review', title: 'كتابة الواجهة لمطعم Pasternak', category: 'كتابة الواجهة', problem: 'احتاجت الكتابة القائمة على واجهة المطعم إلى تجديد مع الحفاظ على طابعها البصري المعتاد.', work: 'جُهزت الكتابة الجديدة بقالب دقيق ثم طُليت مباشرة على الواجهة.', result: 'أصبحت الكتابة تبدو نظيفة ومتناسقة من جديد.', defaultText: 'طلاء دقيق بالقالب لكتابة واجهة واضحة ومتناسقة.', beforeText: 'قبل: كتابة الواجهة القائمة قبل التجديد.', beforeAlt: 'كتابة واجهة مطعم Pasternak قبل التجديد', afterAlt: 'كتابة واجهة مطعم Pasternak النهائية بعد الطلاء', galleryAlts: ['كتابة واجهة مطعم Pasternak قبل التجديد', 'طلاء كتابة واجهة مطعم Pasternak بالقالب أثناء التنفيذ', 'كتابة واجهة مطعم Pasternak النهائية بعد الطلاء'] },
  ],
};

function getContent(locale: string): ReferencesContent & { metaTitle: string; metaDescription: string } {
  const safeLocale = (locale in CONTENT ? locale : 'de') as Locale;
  const text = CONTENT[safeLocale];
  const caseCopy = CASE_COPY[safeLocale];
  const cases = BASE_CASES.map((base) => ({
    ...base,
    ...caseCopy.find((item) => item.id === base.id)!,
  }));

  const galleryItems = [
    { id: 'g-lightbox', title: cases[0].title, category: cases[0].category, image: IMAGE_SET.lightbox, description: cases[0].result },
    { id: 'g-led', title: cases[1].title, category: cases[1].category, image: cases[1].afterImage, imageAlt: cases[1].afterAlt, description: cases[1].result },
    { id: 'g-neon', title: cases[2].title, category: cases[2].category, image: IMAGE_SET.neon, description: cases[2].result },
    { id: 'g-film', title: cases[3].title, category: cases[3].category, image: IMAGE_SET.film, description: cases[3].result },
    { id: 'g-branches', title: cases[4].title, category: cases[4].category, image: IMAGE_SET.business, description: cases[4].result },
    { id: 'g-mounting', title: cases[5].title, category: cases[5].category, image: IMAGE_SET.mounting, description: cases[5].result },
    { id: 'g-before', title: text.modalBeforeLabel, category: 'Before', image: IMAGE_SET.beforeGeneral, description: cases[0].problem },
    { id: 'g-process', title: text.modalWorkLabel, category: 'Service', image: IMAGE_SET.process, description: cases[2].work },
    { id: 'g-filial-maintenance-wide', title: cases[4].title, category: cases[4].category, image: IMAGE_SET.maintenance, description: cases[4].result },
    { id: 'g-led-detail', title: cases[1].title, category: cases[1].category, image: IMAGE_SET.generatedLedDetail, description: cases[1].work },
    { id: 'g-lightbox-lift', title: cases[0].title, category: cases[0].category, image: IMAGE_SET.generatedLightboxLift, description: cases[0].work },
    { id: 'g-neon-bench', title: cases[2].title, category: cases[2].category, image: IMAGE_SET.generatedNeonBench, description: cases[2].work },
    { id: 'g-window-film-install', title: cases[3].title, category: cases[3].category, image: IMAGE_SET.generatedWindowFilm, description: cases[3].work },
    { id: 'g-facade-light-line', title: cases[5].title, category: cases[5].category, image: IMAGE_SET.generatedFacadeLine, description: cases[5].work },
    { id: 'g-branch-evening', title: cases[4].title, category: cases[4].category, image: IMAGE_SET.generatedBranchEvening, description: cases[4].result },
    { id: 'g-storefront-row', title: cases[4].title, category: cases[4].category, image: IMAGE_SET.generatedStorefrontRow, description: cases[4].result },
    { id: 'g-circuit-repair', title: text.modalWorkLabel, category: 'Service', image: IMAGE_SET.generatedCircuitRepair, description: cases[0].work },
  ];

  return {
    locale: safeLocale,
    gallerySectionTitle: GALLERY_SECTION_TITLES[safeLocale],
    finalEyebrow: FINAL_CTA_EYEBROWS[safeLocale],
    ...text,
    reportImage: REPORT_IMAGE_SRC,
    reportImageAlt: REPORT_IMAGE_ALTS[safeLocale],
    cases,
    galleryItems,
  };
}

function buildReferencesPageJsonLd(
  content: ReferencesContent & { metaTitle: string; metaDescription: string },
  canonicalUrl: string,
  primaryImage: string | null
): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': `${canonicalUrl}#webpage`,
    url: canonicalUrl,
    inLanguage: content.locale,
    name: content.metaTitle,
    description: content.metaDescription,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${buildSiteUrl('/')}#website`,
      name: 'PixelRing Reparatur',
      url: buildSiteUrl('/'),
    },
    about: {
      '@type': 'Organization',
      '@id': `${buildSiteUrl('/')}#organization`,
      name: 'PixelRing Reparatur',
      url: buildSiteUrl('/'),
    },
    ...(primaryImage
      ? {
          primaryImageOfPage: {
            '@type': 'ImageObject',
            url: buildSiteUrl(primaryImage),
          },
        }
      : {}),
  };
}

type ReferencesPageSource =
  | { kind: 'cms'; page: CmsPagePublicContent; preview: boolean }
  | { kind: 'fallback'; page: null; preview: false }
  | { kind: 'blocked'; page: null; preview: false };

const getReferencesPreviewPage = cache((locale: string) =>
  getDraftCapableCmsPage('referenzen', locale)
);

async function resolveReferencesPageSource(
  locale: string,
  previewRequested: boolean
): Promise<ReferencesPageSource> {
  if (previewRequested && (await hasOwnerCmsSession())) {
    const previewPage = await getReferencesPreviewPage(locale);
    return previewPage
      ? { kind: 'cms', page: previewPage, preview: true }
      : { kind: 'blocked', page: null, preview: false };
  }

  const state = await getReferencesPublicationState(locale);
  if (state.kind === 'published') {
    return { kind: 'cms', page: state.page, preview: false };
  }

  if (state.kind === 'missing' || state.kind === 'unavailable') {
    return { kind: 'fallback', page: null, preview: false };
  }

  return { kind: 'blocked', page: null, preview: false };
}

function getItemText(item: Record<string, unknown>, field: string): string {
  const value = item[field];
  return typeof value === 'string' ? value.trim() : '';
}

function getCmsText(block: CmsPageBlock | null, field: string): string {
  return block ? getBlockText(block, field) ?? '' : '';
}

function getCmsTextWithLegacyFallback(
  block: CmsPageBlock | null,
  field: string,
  fallback: string
): string {
  if (!block || Object.prototype.hasOwnProperty.call(block, field)) {
    return getCmsText(block, field);
  }

  return fallback;
}

function getCmsItems(block: CmsPageBlock | null): Record<string, unknown>[] {
  return block ? getBlockObjectList(block, 'items') ?? [] : [];
}

function mapReferenceCases(items: Record<string, unknown>[]): ReferenceCase[] {
  return items
    .map((item, index) => {
      const galleryPairs = [1, 2, 3].flatMap((slot) => {
        const image = getItemText(item, `galleryImage${slot}`);
        if (!image) return [];

        return [
          {
            image,
            alt: getItemText(item, `galleryAlt${slot}`),
          },
        ];
      });

      return {
        id: getItemText(item, 'id') || `reference-${index + 1}`,
        title: getItemText(item, 'title'),
        category: getItemText(item, 'category'),
        problem: getItemText(item, 'problem'),
        work: getItemText(item, 'work'),
        result: getItemText(item, 'result'),
        beforeImage: getItemText(item, 'beforeImage'),
        afterImage: getItemText(item, 'afterImage'),
        beforeAlt: getItemText(item, 'beforeAlt'),
        afterAlt: getItemText(item, 'afterAlt'),
        defaultText: getItemText(item, 'defaultText'),
        beforeText: getItemText(item, 'beforeText'),
        gallery: galleryPairs.map((pair) => pair.image),
        galleryAlts: galleryPairs.map((pair) => pair.alt),
      };
    })
    .filter(
      (item) =>
        item.title &&
        item.category &&
        item.beforeImage &&
        item.afterImage
    );
}

function mapReportHooks(items: Record<string, unknown>[]): ReportHook[] {
  return items
    .map((item, index) => ({
      id: getItemText(item, 'id') || `report-hook-${index + 1}`,
      title: getItemText(item, 'title'),
      text: getItemText(item, 'text'),
    }))
    .filter((item) => item.title && item.text);
}

function mapReportRows(items: Record<string, unknown>[]): ReportRow[] {
  return items
    .map((item, index) => ({
      id: getItemText(item, 'id') || `report-${index + 1}`,
      type: getItemText(item, 'type'),
      issue: getItemText(item, 'issue'),
      outcome: getItemText(item, 'outcome'),
    }))
    .filter((item) => item.type && item.issue && item.outcome);
}

function mapGalleryItems(items: Record<string, unknown>[]): GalleryItem[] {
  return items
    .map((item, index) => ({
      id: getItemText(item, 'id') || `gallery-${index + 1}`,
      title: getItemText(item, 'title'),
      category: getItemText(item, 'category'),
      image: getItemText(item, 'image'),
      imageAlt: getItemText(item, 'imageAlt'),
      description: getItemText(item, 'description'),
    }))
    .filter((item) => item.title && item.category && item.image);
}

function buildCmsReferencesContent(
  staticContent: ReferencesContent & { metaTitle: string; metaDescription: string },
  page: CmsPagePublicContent
): ReferencesContent & { metaTitle: string; metaDescription: string } {
  const heroBlock = getEnabledBlock(page, 'hero', ['heroBlock', 'hero']);
  const recentIntroBlock = getEnabledBlock(page, 'textSection', ['recentIntroBlock']);
  const casesBlock = getEnabledBlock(page, 'cardList', ['casesBlock', 'cases']);
  const reportIntroBlock = getEnabledBlock(page, 'textSection', ['reportIntroBlock']);
  const reportHooksBlock = getEnabledBlock(page, 'cardList', ['reportHooksBlock']);
  const reportsBlock = getEnabledBlock(page, 'cardList', ['reportsBlock']);
  const galleryIntroBlock = getEnabledBlock(page, 'textSection', ['galleryIntroBlock']);
  const galleryItemsBlock = getEnabledBlock(page, 'cardList', ['galleryItemsBlock']);
  const promoBlock = getEnabledBlock(page, 'cta', ['promoBlock']);
  const typeBandLinesBlock = getEnabledBlock(page, 'cardList', ['typeBandLinesBlock']);
  const finalCtaBlock = getEnabledBlock(page, 'cta', ['finalCtaBlock']);
  const labelsBlock = getEnabledBlock(page, 'labels', ['labelsBlock']);
  const blockVisibility: ReferencesBlockVisibility = {
    hero: Boolean(heroBlock),
    recentIntro: Boolean(recentIntroBlock),
    cases: Boolean(casesBlock),
    reportIntro: Boolean(reportIntroBlock),
    reportHooks: Boolean(reportHooksBlock),
    reports: Boolean(reportsBlock),
    galleryIntro: Boolean(galleryIntroBlock),
    galleryItems: Boolean(galleryItemsBlock),
    promo: Boolean(promoBlock),
    typeBand: Boolean(typeBandLinesBlock),
    finalCta: Boolean(finalCtaBlock),
  };

  const heroTags = getCmsText(heroBlock, 'tags')
    .split('|||')
    .map((tag) => tag.trim())
    .filter(Boolean);
  const heroSlides = [1, 2, 3, 4, 5]
    .map((slot) => getCmsText(heroBlock, `heroImage${slot}`))
    .filter(Boolean);
  const cmsMetaTitle = page.seoTitle?.trim() || page.title.trim();
  const cmsMetaDescription =
    page.seoDescription?.trim() ||
    getCmsText(heroBlock, 'intro') ||
    getCmsText(recentIntroBlock, 'description') ||
    page.title.trim();

  return {
    locale: staticContent.locale,
    metaTitle: cmsMetaTitle,
    metaDescription: cmsMetaDescription,
    badge: getCmsText(heroBlock, 'badge'),
    heroTitle: getCmsText(heroBlock, 'title'),
    heroIntro: getCmsText(heroBlock, 'intro'),
    heroPrimaryCta: getCmsText(heroBlock, 'ctaPrimary'),
    heroSecondaryCta: getCmsText(heroBlock, 'ctaSecondary'),
    heroTags,
    heroNoteTitle: getCmsText(heroBlock, 'subtitle'),
    heroNoteText: getCmsText(heroBlock, 'description'),
    recentEyebrow: getCmsText(recentIntroBlock, 'pretitle'),
    recentTitle: getCmsText(recentIntroBlock, 'title'),
    recentIntro: getCmsText(recentIntroBlock, 'description'),
    reportTitle: getCmsText(reportIntroBlock, 'title'),
    reportIntro: getCmsText(reportIntroBlock, 'description'),
    reportImage: getCmsTextWithLegacyFallback(
      reportIntroBlock,
      'image',
      staticContent.reportImage
    ),
    reportImageAlt: getCmsTextWithLegacyFallback(
      reportIntroBlock,
      'imageAlt',
      staticContent.reportImageAlt
    ),
    reportHooks: mapReportHooks(getCmsItems(reportHooksBlock)),
    reports: mapReportRows(getCmsItems(reportsBlock)),
    galleryEyebrow: getCmsText(galleryIntroBlock, 'pretitle'),
    gallerySectionTitle: getCmsText(galleryIntroBlock, 'sectionTitle'),
    galleryTitle: getCmsText(galleryIntroBlock, 'title'),
    galleryIntro: getCmsText(galleryIntroBlock, 'description'),
    galleryItems: mapGalleryItems(getCmsItems(galleryItemsBlock)),
    galleryPromoEyebrow: getCmsText(promoBlock, 'badge'),
    galleryPromoTitle: getCmsText(promoBlock, 'title'),
    galleryPromoText: getCmsText(promoBlock, 'description'),
    galleryPromoCta: getCmsText(promoBlock, 'primaryLabel'),
    galleryPromoHref: getCmsText(promoBlock, 'requestHref'),
    typeBandLines: getCmsItems(typeBandLinesBlock)
      .map((item) => getItemText(item, 'text'))
      .filter(Boolean),
    finalEyebrow: getCmsText(finalCtaBlock, 'badge'),
    finalTitle: getCmsText(finalCtaBlock, 'title'),
    finalText: getCmsText(finalCtaBlock, 'description'),
    finalCta: getCmsText(finalCtaBlock, 'primaryLabel'),
    modalProblemLabel: getCmsText(labelsBlock, 'modalProblemLabel'),
    modalWorkLabel: getCmsText(labelsBlock, 'modalWorkLabel'),
    modalResultLabel: getCmsText(labelsBlock, 'modalResultLabel'),
    modalBeforeLabel: getCmsText(labelsBlock, 'modalBeforeLabel'),
    modalCta: getCmsText(labelsBlock, 'modalCta'),
    viewerAllLabel: getCmsText(labelsBlock, 'viewerAllLabel'),
    viewerCloseLabel: getCmsText(labelsBlock, 'viewerCloseLabel'),
    cases: mapReferenceCases(getCmsItems(casesBlock)),
    heroSlides,
    blockVisibility,
  };
}

function getReferencesPrimaryImage(content: ReferencesContent): string | null {
  if (content.blockVisibility?.hero !== false && content.heroSlides?.[0]) {
    return content.heroSlides[0];
  }

  if (content.blockVisibility?.galleryItems !== false && content.galleryItems[0]?.image) {
    return content.galleryItems[0].image;
  }

  if (content.blockVisibility?.reportIntro !== false && content.reportImage) {
    return content.reportImage;
  }

  if (content.blockVisibility?.cases !== false && content.cases[0]?.afterImage) {
    return content.cases[0].afterImage;
  }

  return null;
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ cmsPreview?: string | string[] }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const query = await searchParams;
  const source = await resolveReferencesPageSource(locale, isCmsPreview(query.cmsPreview));
  const staticContent = getContent(locale);
  const page = source.kind === 'cms' ? source.page : null;
  const content = page ? buildCmsReferencesContent(staticContent, page) : staticContent;
  const title = content.metaTitle;
  const description = content.metaDescription;
  const image = page ? getReferencesPrimaryImage(content) ?? undefined : REFERENCES_OG_IMAGE;

  const metadata = buildPublicPageMetadata({
    locale,
    path: REFERENCES_PAGE_PATH,
    canonicalUrl: page?.canonicalUrl,
    title,
    description,
    image,
    imageAlt: content.heroTitle || title,
  });

  if (source.kind === 'cms' && source.preview) {
    metadata.robots = { index: false, follow: false };
  }

  if (source.kind === 'blocked') {
    metadata.robots = { index: false, follow: false };
  }

  return metadata;
}

export default async function ReferenzenPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ cmsPreview?: string | string[] }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  const source = await resolveReferencesPageSource(locale, isCmsPreview(query.cmsPreview));

  if (source.kind === 'blocked') {
    notFound();
  }

  const globalCms = await getGlobalPageCmsContent(locale);
  const staticContent = getContent(locale);
  const page = source.kind === 'cms' ? source.page : null;
  const content = page ? buildCmsReferencesContent(staticContent, page) : staticContent;
  const canonicalUrl = page?.canonicalUrl
    ? buildSiteUrl(page.canonicalUrl)
    : buildLocaleUrl(content.locale, REFERENCES_PAGE_PATH);
  const primaryImage = page ? getReferencesPrimaryImage(content) : REFERENCES_OG_IMAGE;
  const jsonLd = buildReferencesPageJsonLd(content, canonicalUrl, primaryImage);

  return (
    <div className={`min-h-screen bg-white ${content.locale === 'ar' ? 'rtl' : 'ltr'}`} dir={content.locale === 'ar' ? 'rtl' : 'ltr'}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      <Header content={globalCms?.header} />
      <ReferencesExperience content={content} />
      <Footer content={globalCms?.footer} />
    </div>
  );
}
