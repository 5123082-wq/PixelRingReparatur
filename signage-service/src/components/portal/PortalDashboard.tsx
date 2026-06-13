'use client';

import type {
  PortalAsset,
  PortalDemoOrganization,
  PortalDocument,
  PortalObject,
  PortalRequest,
} from '@/lib/portal/types';
import { Link, useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';
import { useMemo, useState, type FormEvent } from 'react';
import LocationPicker, { type SelectedLocation } from '@/components/common/LocationPicker';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import Logo from '@/components/common/Logo';

type TabKey =
  | 'overview'
  | 'requests'
  | 'reports'
  | 'new-request';

type PortalLocale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';
type PortalActionType = 'APPROVE_ESTIMATE' | 'CONFIRM_VISIT_WINDOW' | 'UPLOAD_MISSING_PHOTO';

const statusTone = {
  UNDER_REVIEW: 'bg-amber-100 text-amber-800 border-amber-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200',
  WAITING_FOR_CUSTOMER: 'bg-orange-100 text-orange-800 border-orange-200',
  COMPLETED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  PLANNED: 'bg-slate-100 text-slate-700 border-slate-200',
};

const assetTone = {
  OK: 'bg-emerald-100 text-emerald-800',
  WATCH: 'bg-amber-100 text-amber-800',
  SERVICE_NEEDED: 'bg-red-100 text-red-800',
  WARRANTY: 'bg-blue-100 text-blue-800',
};

type PortalCopy = {
  navLabel: string;
  nav: Record<TabKey, string>;
  portalLabel: string;
  newRequest: string;
  activeRequests: string;
  needsAction: string;
  photoReports: string;
  noPhotoReports: string;
  open: string;
  report: string;
  overviewIntro: string;
  overviewTitle: (name: string) => string;
  subtitles: Record<TabKey, string>;
  conciergeTitle: string;
  conciergeBody: (count: number) => string;
  openActions: string;
  remindLater: string;
  requestNumber: string;
  requestTitle: string;
  requestObject: string;
  requestStatus: string;
  nextStep: string;
  updated: string;
  actionCount: (count: number) => string;
  latestReports: string;
  reportsIntro: string;
  requestFallbackTitle: string;
  futureHiddenNote: string;
  siteLink: string;
  howItWorks: string;
  requestCreated: string;
  requestConnected: string;
  requestProcessing: string;
  actionTitles: Record<PortalActionType, string>;
  emptyState: {
    eyebrow: string;
    title: string;
    description: string;
    checkExisting: string;
    activeRequestsMeta: string;
    photoReportsMeta: string;
    accountLabel: string;
    accountMeta: string;
    nextStepTitle: string;
    startNewTitle: string;
    startNewBody: string;
    findExistingTitle: string;
    findExistingBody: string;
  };
  newRequestForm: {
    title: string;
    categories: { title: string; description: string }[];
    categoryLabel: string;
    locationLabel: string;
    locationPlaceholder: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    contactLabel: string;
    securityLabel: string;
    connectedSecurity: string;
    demoSecurity: string;
    submitLoading: string;
    submit: string;
    submitDisabled: string;
    filesLater: string;
    connectedNote: string;
    demoNote: string;
    demoError: string;
    genericError: string;
    createdFeedback: (publicRequestNumber: string) => string;
  };
};

const PORTAL_COPY: Record<PortalLocale, PortalCopy> = {
  de: {
    navLabel: 'Portal',
    nav: {
      overview: 'Uebersicht',
      requests: 'Meine Anfragen',
      reports: 'Fotoberichte',
      'new-request': 'Neue Anfrage',
    },
    portalLabel: 'Kundenportal',
    newRequest: 'Neue Anfrage',
    activeRequests: 'Aktive Anfragen',
    needsAction: 'Erfordert Aktion',
    photoReports: 'Fotoberichte',
    noPhotoReports: 'Noch keine Fotoberichte freigegeben.',
    open: 'Oeffnen',
    report: 'Bericht',
    overviewIntro: 'Ihre Anfragen, naechsten Schritte und freigegebenen Fotoberichte auf einen Blick.',
    overviewTitle: (name) => `Guten Tag, ${name}.`,
    subtitles: {
      overview: 'Status, offene Aufgaben und aktuelle Unterlagen ohne interne CRM-Details.',
      requests: 'Alle mit diesem Konto verbundenen Anfragen mit Kundenstatus und naechstem Schritt.',
      reports: 'Freigegebene Fotoberichte und kundenfaehige Ergebnisdokumente zu Ihren Anfragen.',
      'new-request': 'Starten Sie eine neue Reparatur-, Montage- oder Serviceanfrage direkt aus dem Portal.',
    },
    conciergeTitle: 'Was braucht Ihre Aufmerksamkeit?',
    conciergeBody: (count) =>
      count > 0
        ? `${count} Vorgang wartet auf Ihre Rueckmeldung.`
        : 'Aktuell wartet keine Anfrage auf Ihre Rueckmeldung.',
    openActions: 'Aktionen anzeigen',
    remindLater: 'Spaeter ansehen',
    requestNumber: 'PR-Nummer',
    requestTitle: 'Anfrage',
    requestObject: 'Ort / Objekt',
    requestStatus: 'Status',
    nextStep: 'Naechster Schritt',
    updated: 'Aktualisiert',
    actionCount: (count) => `${count} offen`,
    latestReports: 'Aktuelle Fotoberichte',
    reportsIntro: 'Fotoberichte erscheinen hier, sobald PixelRing sie fuer eine Anfrage freigibt.',
    requestFallbackTitle: 'Anfrage wird geprueft',
    futureHiddenNote: 'Objekte, Mitarbeiter, Rechnungen und weitere B2B-Funktionen sind fuer spaetere Ausbaustufen ausgeblendet.',
    siteLink: 'Zur Website',
    howItWorks: 'So laeuft es',
    requestCreated: 'Sie beschreiben den Bedarf und erhalten eine PR-Nummer.',
    requestConnected: 'Die Anfrage bleibt mit diesem verifizierten Portal-Konto verbunden.',
    requestProcessing: 'PixelRing prueft die Details und aktualisiert Status, Dateien und Nachrichten im Anfrageverlauf.',
    actionTitles: {
      APPROVE_ESTIMATE: 'Kostenschaetzung pruefen',
      CONFIRM_VISIT_WINDOW: 'Terminfenster bestaetigen',
      UPLOAD_MISSING_PHOTO: 'Foto ergaenzen',
    },
    emptyState: {
      eyebrow: 'Konto bereit',
      title: 'Ihr Kundenportal ist eingerichtet.',
      description: 'Es sind noch keine Anfragen mit diesem Konto verbunden. Sie koennen eine neue Anfrage starten oder eine bestehende PR-Nummer ueber die Statuspruefung verifizieren.',
      checkExisting: 'Bestehende Anfrage pruefen',
      activeRequestsMeta: 'Noch keine Anfrage verbunden',
      photoReportsMeta: 'Nach der ersten Anfrage sichtbar',
      accountLabel: 'Konto',
      accountMeta: 'Verified E-Mail aktiv',
      nextStepTitle: 'Naechster sinnvoller Schritt',
      startNewTitle: 'Neue Anfrage aus dem Konto starten',
      startNewBody: 'Fuer Reparatur, Diagnose, Wartung oder eine neue Servicefrage.',
      findExistingTitle: 'Bestehende Anfrage finden',
      findExistingBody: 'PR-Nummer plus Telefon oder E-Mail pruefen, ohne private Daten nur per Nummer zu oeffnen.',
    },
    newRequestForm: {
      title: 'Neue Anfrage starten',
      categories: [
        { title: 'Reparatur', description: 'Leuchtet nicht, flackert, defekt' },
        { title: 'Wartung', description: 'Pruefung, Reinigung, vorbeugender Service' },
        { title: 'Montage', description: 'Neue Montage oder Umbau' },
        { title: 'Garantie', description: 'Rueckfrage zu ausgefuehrten Arbeiten' },
      ],
      categoryLabel: 'Kategorie',
      locationLabel: 'Standort oder Objekt',
      locationPlaceholder: 'Adresse oder Objektname',
      descriptionLabel: 'Beschreibung',
      descriptionPlaceholder: 'Was ist passiert, wo ist das Problem sichtbar, was soll PixelRing pruefen?',
      contactLabel: 'Kontakt',
      securityLabel: 'Sicherheit',
      connectedSecurity: 'Wird mit diesem Portal-Konto verbunden',
      demoSecurity: 'Demo-Vorschau ohne Speichern',
      submitLoading: 'Wird erstellt ...',
      submit: 'Anfrage erstellen',
      submitDisabled: 'Nur mit verifiziertem Konto',
      filesLater: 'Dateien folgen spaeter',
      connectedNote: 'Die Anfrage erhaelt sofort eine PR-Nummer und wird nur mit diesem verifizierten Portal-Konto verbunden.',
      demoNote: 'Demo-Daten bleiben read-only. Neue Anfragen werden erst mit einer echten Portal-Session gespeichert.',
      demoError: 'Diese Demo-Vorschau speichert keine neuen Anfragen. Melden Sie sich mit einem verifizierten Portal-Konto an.',
      genericError: 'Die Anfrage konnte nicht erstellt werden.',
      createdFeedback: (publicRequestNumber) => `Anfrage ${publicRequestNumber} wurde erstellt.`,
    },
  },
  en: {
    navLabel: 'Portal',
    nav: {
      overview: 'Overview',
      requests: 'My requests',
      reports: 'Photo reports',
      'new-request': 'New request',
    },
    portalLabel: 'Customer portal',
    newRequest: 'New request',
    activeRequests: 'Active requests',
    needsAction: 'Action required',
    photoReports: 'Photo reports',
    noPhotoReports: 'No photo reports have been released yet.',
    open: 'Open',
    report: 'Report',
    overviewIntro: 'Your requests, next steps, and released photo reports in one place.',
    overviewTitle: (name) => `Hello, ${name}.`,
    subtitles: {
      overview: 'Statuses, open tasks, and current documents without internal CRM details.',
      requests: 'All requests connected to this account with customer status and next step.',
      reports: 'Released photo reports and customer-ready result documents for your requests.',
      'new-request': 'Create a new repair, installation, or service request directly from the portal.',
    },
    conciergeTitle: 'What needs your attention?',
    conciergeBody: (count) =>
      count > 0
        ? `${count} item is waiting for your reply.`
        : 'No request is currently waiting for your reply.',
    openActions: 'Show actions',
    remindLater: 'Review later',
    requestNumber: 'PR number',
    requestTitle: 'Request',
    requestObject: 'Location / object',
    requestStatus: 'Status',
    nextStep: 'Next step',
    updated: 'Updated',
    actionCount: (count) => `${count} open`,
    latestReports: 'Latest photo reports',
    reportsIntro: 'Photo reports appear here once PixelRing releases them for a request.',
    requestFallbackTitle: 'Request is being reviewed',
    futureHiddenNote: 'Objects, employees, invoices, and extended B2B functions are hidden until later stages.',
    siteLink: 'Website',
    howItWorks: 'How it works',
    requestCreated: 'You describe the task and receive a PR number.',
    requestConnected: 'The request stays linked to this verified portal account.',
    requestProcessing: 'PixelRing checks the details and updates status, files, and messages in the request history.',
    actionTitles: {
      APPROVE_ESTIMATE: 'Review estimate',
      CONFIRM_VISIT_WINDOW: 'Confirm technician window',
      UPLOAD_MISSING_PHOTO: 'Add missing photo',
    },
    emptyState: {
      eyebrow: 'Account ready',
      title: 'Your customer portal is set up.',
      description: 'No requests are connected to this account yet. You can start a new request or verify an existing PR number through the status check.',
      checkExisting: 'Check existing request',
      activeRequestsMeta: 'No request connected yet',
      photoReportsMeta: 'Visible after the first request',
      accountLabel: 'Account',
      accountMeta: 'Verified email active',
      nextStepTitle: 'Next useful step',
      startNewTitle: 'Start a new request from this account',
      startNewBody: 'For repair, diagnostics, maintenance, or a new service question.',
      findExistingTitle: 'Find existing request',
      findExistingBody: 'Check PR number plus phone or email, without opening private data by number alone.',
    },
    newRequestForm: {
      title: 'Start a new request',
      categories: [
        { title: 'Repair', description: 'Not lighting, flickering, defective' },
        { title: 'Maintenance', description: 'Inspection, cleaning, preventive service' },
        { title: 'Installation', description: 'New installation or rebuild' },
        { title: 'Warranty', description: 'Follow-up on completed work' },
      ],
      categoryLabel: 'Category',
      locationLabel: 'Location or object',
      locationPlaceholder: 'Address or object name',
      descriptionLabel: 'Description',
      descriptionPlaceholder: 'What happened, where is the problem visible, what should PixelRing check?',
      contactLabel: 'Contact',
      securityLabel: 'Security',
      connectedSecurity: 'Connected to this portal account',
      demoSecurity: 'Demo preview without saving',
      submitLoading: 'Creating ...',
      submit: 'Create request',
      submitDisabled: 'Verified account only',
      filesLater: 'Files can follow later',
      connectedNote: 'The request receives a PR number immediately and is linked only to this verified portal account.',
      demoNote: 'Demo data stays read-only. New requests are saved only with a real portal session.',
      demoError: 'This demo preview does not save new requests. Please sign in with a verified portal account.',
      genericError: 'The request could not be created.',
      createdFeedback: (publicRequestNumber) => `Request ${publicRequestNumber} was created.`,
    },
  },
  ru: {
    navLabel: 'Кабинет',
    nav: {
      overview: 'Обзор',
      requests: 'Мои заявки',
      reports: 'Фотоотчеты',
      'new-request': 'Новая заявка',
    },
    portalLabel: 'Клиентский портал',
    newRequest: 'Новая заявка',
    activeRequests: 'Активные заявки',
    needsAction: 'Требует действия',
    photoReports: 'Фотоотчеты',
    noPhotoReports: 'Фотоотчеты пока не опубликованы.',
    open: 'Открыть',
    report: 'Отчет',
    overviewIntro: 'Ваши заявки, следующие шаги и опубликованные фотоотчеты в одном месте.',
    overviewTitle: (name) => `Добрый день, ${name}.`,
    subtitles: {
      overview: 'Статусы, открытые действия и клиентские материалы без внутренних CRM-деталей.',
      requests: 'Все заявки, привязанные к этому аккаунту, с клиентским статусом и следующим шагом.',
      reports: 'Опубликованные фотоотчеты и клиентские документы по вашим заявкам.',
      'new-request': 'Создайте новую заявку на ремонт, монтаж или сервис прямо из кабинета.',
    },
    conciergeTitle: 'Что требует внимания?',
    conciergeBody: (count) =>
      count > 0
        ? `${count} действие ожидает вашего ответа.`
        : 'Сейчас ни одна заявка не ожидает вашего ответа.',
    openActions: 'Показать действия',
    remindLater: 'Посмотреть позже',
    requestNumber: 'PR-номер',
    requestTitle: 'Заявка',
    requestObject: 'Адрес / объект',
    requestStatus: 'Статус',
    nextStep: 'Следующий шаг',
    updated: 'Обновлено',
    actionCount: (count) => `${count} открыто`,
    latestReports: 'Последние фотоотчеты',
    reportsIntro: 'Фотоотчеты появятся здесь, когда PixelRing опубликует их по заявке.',
    requestFallbackTitle: 'Заявка проверяется',
    futureHiddenNote: 'Объекты, сотрудники, счета и расширенные B2B-функции скрыты до следующих этапов.',
    siteLink: 'На сайт',
    howItWorks: 'Как это работает',
    requestCreated: 'Вы описываете задачу и получаете PR-номер.',
    requestConnected: 'Заявка остается привязанной к этому подтвержденному аккаунту.',
    requestProcessing: 'PixelRing проверяет детали и обновляет статус, файлы и сообщения в истории заявки.',
    actionTitles: {
      APPROVE_ESTIMATE: 'Согласовать смету',
      CONFIRM_VISIT_WINDOW: 'Подтвердить приезд техника',
      UPLOAD_MISSING_PHOTO: 'Добавить недостающее фото',
    },
    emptyState: {
      eyebrow: 'Аккаунт готов',
      title: 'Ваш клиентский кабинет настроен.',
      description: 'К этому аккаунту пока не привязаны заявки. Вы можете создать новую заявку или проверить существующий PR-номер через статус.',
      checkExisting: 'Проверить существующую заявку',
      activeRequestsMeta: 'Заявки пока не привязаны',
      photoReportsMeta: 'Появятся после первой заявки',
      accountLabel: 'Аккаунт',
      accountMeta: 'Подтвержденный email активен',
      nextStepTitle: 'Следующий разумный шаг',
      startNewTitle: 'Создать новую заявку из аккаунта',
      startNewBody: 'Для ремонта, диагностики, обслуживания или нового сервисного вопроса.',
      findExistingTitle: 'Найти существующую заявку',
      findExistingBody: 'Проверить PR-номер вместе с телефоном или email, не открывая приватные данные только по номеру.',
    },
    newRequestForm: {
      title: 'Создать новую заявку',
      categories: [
        { title: 'Ремонт', description: 'Не светится, мигает, неисправно' },
        { title: 'Обслуживание', description: 'Проверка, чистка, профилактический сервис' },
        { title: 'Монтаж', description: 'Новый монтаж или переделка' },
        { title: 'Гарантия', description: 'Вопрос по выполненным работам' },
      ],
      categoryLabel: 'Категория',
      locationLabel: 'Адрес или объект',
      locationPlaceholder: 'Адрес или название объекта',
      descriptionLabel: 'Описание',
      descriptionPlaceholder: 'Что произошло, где видна проблема, что PixelRing должен проверить?',
      contactLabel: 'Контакт',
      securityLabel: 'Безопасность',
      connectedSecurity: 'Будет привязано к этому аккаунту',
      demoSecurity: 'Demo-preview без сохранения',
      submitLoading: 'Создаем...',
      submit: 'Создать заявку',
      submitDisabled: 'Только с подтвержденным аккаунтом',
      filesLater: 'Файлы можно добавить позже',
      connectedNote: 'Заявка сразу получит PR-номер и будет привязана только к этому подтвержденному аккаунту.',
      demoNote: 'Demo-данные остаются read-only. Новые заявки сохраняются только с настоящей portal-сессией.',
      demoError: 'Этот demo-preview не сохраняет новые заявки. Войдите с подтвержденным аккаунтом портала.',
      genericError: 'Не удалось создать заявку.',
      createdFeedback: (publicRequestNumber) => `Заявка ${publicRequestNumber} создана.`,
    },
  },
  tr: {
    navLabel: 'Portal',
    nav: {
      overview: 'Genel bakış',
      requests: 'Taleplerim',
      reports: 'Foto raporları',
      'new-request': 'Yeni talep',
    },
    portalLabel: 'Müşteri portalı',
    newRequest: 'Yeni talep',
    activeRequests: 'Aktif talepler',
    needsAction: 'İşlem gerekli',
    photoReports: 'Foto raporları',
    noPhotoReports: 'Henüz foto raporu yayınlanmadı.',
    open: 'Aç',
    report: 'Rapor',
    overviewIntro: 'Talepleriniz, sonraki adımlarınız ve yayınlanan foto raporlarınız tek yerde.',
    overviewTitle: (name) => `Merhaba, ${name}.`,
    subtitles: {
      overview: 'Dahili CRM detayları olmadan durumlar, açık görevler ve güncel belgeler.',
      requests: 'Bu hesaba bağlı tüm talepler, müşteri durumu ve sonraki adım.',
      reports: 'Talepleriniz için yayınlanan foto raporları ve müşteri belgeleri.',
      'new-request': 'Portaldan doğrudan yeni onarım, montaj veya servis talebi oluşturun.',
    },
    conciergeTitle: 'Neye dikkat gerekiyor?',
    conciergeBody: (count) =>
      count > 0
        ? `${count} işlem yanıtınızı bekliyor.`
        : 'Şu anda yanıtınızı bekleyen talep yok.',
    openActions: 'İşlemleri göster',
    remindLater: 'Sonra bak',
    requestNumber: 'PR numarası',
    requestTitle: 'Talep',
    requestObject: 'Adres / obje',
    requestStatus: 'Durum',
    nextStep: 'Sonraki adım',
    updated: 'Güncellendi',
    actionCount: (count) => `${count} açık`,
    latestReports: 'Son foto raporları',
    reportsIntro: 'PixelRing bir talep için rapor yayınladığında foto raporları burada görünür.',
    requestFallbackTitle: 'Talep inceleniyor',
    futureHiddenNote: 'Objeler, çalışanlar, faturalar ve gelişmiş B2B işlevleri sonraki aşamalara kadar gizlidir.',
    siteLink: 'Web sitesi',
    howItWorks: 'Nasıl çalışır',
    requestCreated: 'Görevi açıklarsınız ve PR numarası alırsınız.',
    requestConnected: 'Talep bu doğrulanmış portal hesabına bağlı kalır.',
    requestProcessing: 'PixelRing detayları kontrol eder ve talep geçmişinde durum, dosyalar ve mesajları günceller.',
    actionTitles: {
      APPROVE_ESTIMATE: 'Teklifi incele',
      CONFIRM_VISIT_WINDOW: 'Teknisyen saatini onayla',
      UPLOAD_MISSING_PHOTO: 'Eksik fotoğraf ekle',
    },
    emptyState: {
      eyebrow: 'Hesap hazır',
      title: 'Müşteri portalınız hazır.',
      description: 'Bu hesaba henüz talep bağlı değil. Yeni talep oluşturabilir veya mevcut PR numarasını durum kontrolünden doğrulayabilirsiniz.',
      checkExisting: 'Mevcut talebi kontrol et',
      activeRequestsMeta: 'Henüz bağlı talep yok',
      photoReportsMeta: 'İlk talepten sonra görünür',
      accountLabel: 'Hesap',
      accountMeta: 'Doğrulanmış e-posta aktif',
      nextStepTitle: 'Sonraki mantıklı adım',
      startNewTitle: 'Bu hesaptan yeni talep oluştur',
      startNewBody: 'Onarım, teşhis, bakım veya yeni servis sorusu için.',
      findExistingTitle: 'Mevcut talebi bul',
      findExistingBody: 'Özel verileri sadece numarayla açmadan PR numarası ve telefon veya e-posta ile kontrol edin.',
    },
    newRequestForm: {
      title: 'Yeni talep başlat',
      categories: [
        { title: 'Onarım', description: 'Yanmıyor, titriyor, arızalı' },
        { title: 'Bakım', description: 'Kontrol, temizlik, önleyici servis' },
        { title: 'Montaj', description: 'Yeni montaj veya tadilat' },
        { title: 'Garanti', description: 'Tamamlanan işlerle ilgili soru' },
      ],
      categoryLabel: 'Kategori',
      locationLabel: 'Adres veya obje',
      locationPlaceholder: 'Adres veya obje adı',
      descriptionLabel: 'Açıklama',
      descriptionPlaceholder: 'Ne oldu, sorun nerede görünüyor, PixelRing neyi kontrol etmeli?',
      contactLabel: 'İletişim',
      securityLabel: 'Güvenlik',
      connectedSecurity: 'Bu portal hesabına bağlanacak',
      demoSecurity: 'Kaydetmeden demo önizleme',
      submitLoading: 'Oluşturuluyor...',
      submit: 'Talep oluştur',
      submitDisabled: 'Yalnızca doğrulanmış hesap',
      filesLater: 'Dosyalar daha sonra eklenebilir',
      connectedNote: 'Talep hemen bir PR numarası alır ve yalnızca bu doğrulanmış portal hesabına bağlanır.',
      demoNote: 'Demo verileri read-only kalır. Yeni talepler yalnızca gerçek portal oturumuyla kaydedilir.',
      demoError: 'Bu demo önizleme yeni talep kaydetmez. Doğrulanmış portal hesabıyla giriş yapın.',
      genericError: 'Talep oluşturulamadı.',
      createdFeedback: (publicRequestNumber) => `${publicRequestNumber} talebi oluşturuldu.`,
    },
  },
  pl: {
    navLabel: 'Portal',
    nav: {
      overview: 'Przegląd',
      requests: 'Moje zgłoszenia',
      reports: 'Raporty foto',
      'new-request': 'Nowe zgłoszenie',
    },
    portalLabel: 'Portal klienta',
    newRequest: 'Nowe zgłoszenie',
    activeRequests: 'Aktywne zgłoszenia',
    needsAction: 'Wymaga działania',
    photoReports: 'Raporty foto',
    noPhotoReports: 'Nie opublikowano jeszcze raportów foto.',
    open: 'Otwórz',
    report: 'Raport',
    overviewIntro: 'Twoje zgłoszenia, następne kroki i opublikowane raporty foto w jednym miejscu.',
    overviewTitle: (name) => `Dzień dobry, ${name}.`,
    subtitles: {
      overview: 'Statusy, otwarte zadania i aktualne dokumenty bez wewnętrznych danych CRM.',
      requests: 'Wszystkie zgłoszenia połączone z tym kontem, ze statusem klienta i następnym krokiem.',
      reports: 'Opublikowane raporty foto i dokumenty klienta dotyczące Twoich zgłoszeń.',
      'new-request': 'Utwórz nowe zgłoszenie naprawy, montażu lub serwisu bezpośrednio z portalu.',
    },
    conciergeTitle: 'Co wymaga uwagi?',
    conciergeBody: (count) =>
      count > 0
        ? `${count} sprawa czeka na Twoją odpowiedź.`
        : 'Żadne zgłoszenie nie czeka teraz na Twoją odpowiedź.',
    openActions: 'Pokaż działania',
    remindLater: 'Sprawdź później',
    requestNumber: 'Numer PR',
    requestTitle: 'Zgłoszenie',
    requestObject: 'Adres / obiekt',
    requestStatus: 'Status',
    nextStep: 'Następny krok',
    updated: 'Zaktualizowano',
    actionCount: (count) => `${count} otwarte`,
    latestReports: 'Ostatnie raporty foto',
    reportsIntro: 'Raporty foto pojawią się tutaj, gdy PixelRing opublikuje je dla zgłoszenia.',
    requestFallbackTitle: 'Zgłoszenie jest sprawdzane',
    futureHiddenNote: 'Obiekty, pracownicy, faktury i rozszerzone funkcje B2B są ukryte do kolejnych etapów.',
    siteLink: 'Strona',
    howItWorks: 'Jak to działa',
    requestCreated: 'Opisujesz zadanie i otrzymujesz numer PR.',
    requestConnected: 'Zgłoszenie pozostaje połączone z tym zweryfikowanym kontem.',
    requestProcessing: 'PixelRing sprawdza szczegóły i aktualizuje status, pliki oraz wiadomości w historii zgłoszenia.',
    actionTitles: {
      APPROVE_ESTIMATE: 'Sprawdź kosztorys',
      CONFIRM_VISIT_WINDOW: 'Potwierdź termin technika',
      UPLOAD_MISSING_PHOTO: 'Dodaj brakujące zdjęcie',
    },
    emptyState: {
      eyebrow: 'Konto gotowe',
      title: 'Twój portal klienta jest skonfigurowany.',
      description: 'Do tego konta nie są jeszcze podłączone zgłoszenia. Możesz utworzyć nowe zgłoszenie albo zweryfikować istniejący numer PR przez sprawdzenie statusu.',
      checkExisting: 'Sprawdź istniejące zgłoszenie',
      activeRequestsMeta: 'Brak podłączonych zgłoszeń',
      photoReportsMeta: 'Widoczne po pierwszym zgłoszeniu',
      accountLabel: 'Konto',
      accountMeta: 'Zweryfikowany email aktywny',
      nextStepTitle: 'Następny sensowny krok',
      startNewTitle: 'Utwórz nowe zgłoszenie z konta',
      startNewBody: 'Dla naprawy, diagnozy, konserwacji lub nowego pytania serwisowego.',
      findExistingTitle: 'Znajdź istniejące zgłoszenie',
      findExistingBody: 'Sprawdź numer PR wraz z telefonem lub emailem, bez otwierania prywatnych danych samym numerem.',
    },
    newRequestForm: {
      title: 'Rozpocznij nowe zgłoszenie',
      categories: [
        { title: 'Naprawa', description: 'Nie świeci, migocze, uszkodzone' },
        { title: 'Serwis', description: 'Kontrola, czyszczenie, serwis zapobiegawczy' },
        { title: 'Montaż', description: 'Nowy montaż lub przebudowa' },
        { title: 'Gwarancja', description: 'Pytanie o wykonane prace' },
      ],
      categoryLabel: 'Kategoria',
      locationLabel: 'Adres lub obiekt',
      locationPlaceholder: 'Adres lub nazwa obiektu',
      descriptionLabel: 'Opis',
      descriptionPlaceholder: 'Co się stało, gdzie widać problem, co PixelRing ma sprawdzić?',
      contactLabel: 'Kontakt',
      securityLabel: 'Bezpieczeństwo',
      connectedSecurity: 'Zostanie połączone z tym kontem portalowym',
      demoSecurity: 'Podgląd demo bez zapisu',
      submitLoading: 'Tworzenie...',
      submit: 'Utwórz zgłoszenie',
      submitDisabled: 'Tylko ze zweryfikowanym kontem',
      filesLater: 'Pliki można dodać później',
      connectedNote: 'Zgłoszenie od razu otrzyma numer PR i będzie połączone tylko z tym zweryfikowanym kontem.',
      demoNote: 'Dane demo pozostają read-only. Nowe zgłoszenia są zapisywane tylko z prawdziwą sesją portalu.',
      demoError: 'Ten podgląd demo nie zapisuje nowych zgłoszeń. Zaloguj się zweryfikowanym kontem portalu.',
      genericError: 'Nie udało się utworzyć zgłoszenia.',
      createdFeedback: (publicRequestNumber) => `Zgłoszenie ${publicRequestNumber} zostało utworzone.`,
    },
  },
  ar: {
    navLabel: 'البوابة',
    nav: {
      overview: 'نظرة عامة',
      requests: 'طلباتي',
      reports: 'تقارير الصور',
      'new-request': 'طلب جديد',
    },
    portalLabel: 'بوابة العميل',
    newRequest: 'طلب جديد',
    activeRequests: 'طلبات نشطة',
    needsAction: 'يتطلب إجراء',
    photoReports: 'تقارير الصور',
    noPhotoReports: 'لم يتم نشر أي تقارير صور بعد.',
    open: 'فتح',
    report: 'تقرير',
    overviewIntro: 'طلباتك والخطوات التالية وتقارير الصور المنشورة في مكان واحد.',
    overviewTitle: (name) => `مرحبا، ${name}.`,
    subtitles: {
      overview: 'الحالات والمهام المفتوحة والمستندات الحالية بدون تفاصيل CRM داخلية.',
      requests: 'كل الطلبات المرتبطة بهذا الحساب مع حالة العميل والخطوة التالية.',
      reports: 'تقارير الصور المنشورة ومستندات النتائج الخاصة بطلباتك.',
      'new-request': 'أنشئ طلب إصلاح أو تركيب أو خدمة جديدا مباشرة من البوابة.',
    },
    conciergeTitle: 'ما الذي يحتاج إلى انتباهك؟',
    conciergeBody: (count) =>
      count > 0
        ? `${count} إجراء ينتظر ردك.`
        : 'لا يوجد طلب ينتظر ردك حاليا.',
    openActions: 'عرض الإجراءات',
    remindLater: 'لاحقا',
    requestNumber: 'رقم PR',
    requestTitle: 'الطلب',
    requestObject: 'العنوان / الموقع',
    requestStatus: 'الحالة',
    nextStep: 'الخطوة التالية',
    updated: 'تم التحديث',
    actionCount: (count) => `${count} مفتوح`,
    latestReports: 'أحدث تقارير الصور',
    reportsIntro: 'تظهر تقارير الصور هنا عندما ينشرها PixelRing لطلب معين.',
    requestFallbackTitle: 'الطلب قيد المراجعة',
    futureHiddenNote: 'المواقع والموظفون والفواتير ووظائف B2B الموسعة مخفية حتى المراحل التالية.',
    siteLink: 'الموقع',
    howItWorks: 'كيف يعمل',
    requestCreated: 'تصف المهمة وتحصل على رقم PR.',
    requestConnected: 'يبقى الطلب مرتبطا بهذا الحساب المؤكد.',
    requestProcessing: 'يفحص PixelRing التفاصيل ويحدث الحالة والملفات والرسائل في سجل الطلب.',
    actionTitles: {
      APPROVE_ESTIMATE: 'مراجعة التقدير',
      CONFIRM_VISIT_WINDOW: 'تأكيد موعد الفني',
      UPLOAD_MISSING_PHOTO: 'إضافة الصورة الناقصة',
    },
    emptyState: {
      eyebrow: 'الحساب جاهز',
      title: 'تم إعداد بوابة العميل الخاصة بك.',
      description: 'لا توجد طلبات مرتبطة بهذا الحساب بعد. يمكنك إنشاء طلب جديد أو التحقق من رقم PR موجود عبر فحص الحالة.',
      checkExisting: 'تحقق من طلب موجود',
      activeRequestsMeta: 'لا توجد طلبات مرتبطة بعد',
      photoReportsMeta: 'تظهر بعد أول طلب',
      accountLabel: 'الحساب',
      accountMeta: 'البريد الإلكتروني المؤكد نشط',
      nextStepTitle: 'الخطوة المفيدة التالية',
      startNewTitle: 'إنشاء طلب جديد من الحساب',
      startNewBody: 'للإصلاح أو التشخيص أو الصيانة أو سؤال خدمة جديد.',
      findExistingTitle: 'العثور على طلب موجود',
      findExistingBody: 'تحقق من رقم PR مع الهاتف أو البريد الإلكتروني، بدون فتح بيانات خاصة بالرقم وحده.',
    },
    newRequestForm: {
      title: 'بدء طلب جديد',
      categories: [
        { title: 'إصلاح', description: 'لا يضيء، يومض، معطل' },
        { title: 'صيانة', description: 'فحص، تنظيف، خدمة وقائية' },
        { title: 'تركيب', description: 'تركيب جديد أو تعديل' },
        { title: 'ضمان', description: 'استفسار حول أعمال منفذة' },
      ],
      categoryLabel: 'الفئة',
      locationLabel: 'العنوان أو الموقع',
      locationPlaceholder: 'العنوان أو اسم الموقع',
      descriptionLabel: 'الوصف',
      descriptionPlaceholder: 'ماذا حدث، أين تظهر المشكلة، ما الذي يجب على PixelRing فحصه؟',
      contactLabel: 'جهة الاتصال',
      securityLabel: 'الأمان',
      connectedSecurity: 'سيتم ربطه بهذا الحساب',
      demoSecurity: 'معاينة demo بدون حفظ',
      submitLoading: 'جار الإنشاء...',
      submit: 'إنشاء الطلب',
      submitDisabled: 'الحساب المؤكد فقط',
      filesLater: 'يمكن إضافة الملفات لاحقا',
      connectedNote: 'يحصل الطلب على رقم PR مباشرة ويرتبط فقط بهذا الحساب المؤكد.',
      demoNote: 'تبقى بيانات demo للقراءة فقط. يتم حفظ الطلبات الجديدة فقط مع جلسة بوابة حقيقية.',
      demoError: 'معاينة demo هذه لا تحفظ طلبات جديدة. سجل الدخول بحساب بوابة مؤكد.',
      genericError: 'تعذر إنشاء الطلب.',
      createdFeedback: (publicRequestNumber) => `تم إنشاء الطلب ${publicRequestNumber}.`,
    },
  },
};

function copyForLocale(locale: string): PortalCopy {
  if (Object.prototype.hasOwnProperty.call(PORTAL_COPY, locale)) {
    return PORTAL_COPY[locale as PortalLocale];
  }

  return PORTAL_COPY.de;
}

function getNavItems(copy: PortalCopy): { key: TabKey; icon: string; label: string }[] {
  return [
    { key: 'overview', icon: '▦', label: copy.nav.overview },
    { key: 'requests', icon: '☷', label: copy.nav.requests },
    { key: 'reports', icon: '▧', label: copy.nav.reports },
    { key: 'new-request', icon: '+', label: copy.nav['new-request'] },
  ];
}

function safeRequestTitle(request: PortalRequest, fallback: string): string {
  const title = request.title?.trim() || '';
  if (!title) return fallback;

  const lower = title.toLowerCase();
  const unsafeMarkers = ['[silent]', 'please communicate', 'ignore previous', 'system prompt', 'developer message'];
  if (unsafeMarkers.some((marker) => lower.includes(marker))) {
    return `${fallback} ${request.publicRequestNumber}`;
  }

  return title.length > 96 ? `${title.slice(0, 93)}...` : title;
}

export default function PortalDashboard({
  organization,
  canCreateRequests = false,
}: {
  organization: PortalDemoOrganization;
  canCreateRequests?: boolean;
}) {
  const t = useTranslations('Portal');
  const locale = useLocale();
  const copy = copyForLocale(locale);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const activeRequests = organization.requests.filter((request) => request.status !== 'COMPLETED');
  const reportDocuments = organization.documents.filter((document) => document.type === 'REPORT');
  const availableReports = reportDocuments.filter((document) => document.status === 'available');
  const navItems = getNavItems(copy);

  const objectsById = useMemo(() => {
    return new Map(organization.objects.map((object) => [object.id, object]));
  }, [organization.objects]);

  async function logout() {
    setIsLoggingOut(true);
    try {
      await fetch('/api/portal/auth/logout', { method: 'POST' });
      await fetch('/api/portal/demo-auth', { method: 'DELETE' });
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#EEF2F6] text-[#0F1C2B]">
      <div className="grid min-h-screen lg:grid-cols-[232px_1fr]">
        <aside className="border-b border-white/10 bg-[#0D1B2A] text-white lg:h-screen lg:overflow-y-auto lg:border-b-0">
          <div className="flex min-h-full flex-col p-3">
            <Link href="/" aria-label="PixelRing Website" className="mb-4 inline-flex w-fit rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E7B792]">
              <Logo isDark={false} compact className="origin-left" />
            </Link>

            <div className="rounded-xl border border-white/10 bg-white/[0.055] p-3">
              <strong className="block text-[13px]">{organization.name}</strong>
              <span className="mt-1 block text-[11px] leading-4 text-white/55">{t('planLabel', { plan: organization.plan })} · verified email</span>
            </div>

            <nav className="mt-4 grid gap-1" aria-label={copy.navLabel}>
              {navItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveTab(item.key)}
                  className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-start text-[12px] font-bold transition ${
                    activeTab === item.key
                      ? 'bg-[#C46E43] text-white shadow-sm'
                      : 'text-white/62 hover:bg-white/[0.07] hover:text-white'
                  }`}
                >
                  <span className="flex h-4 w-4 items-center justify-center text-[11px]">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-4 grid gap-3 lg:mt-auto">
              <div className="rounded-xl border border-white/10 bg-white/[0.045] p-3 text-[11px] leading-5 text-white/50">
                {copy.futureHiddenNote}
              </div>
              <button
                type="button"
                onClick={logout}
                disabled={isLoggingOut}
                className="flex w-full items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[12px] font-black text-white/58 transition hover:border-[#C46E43]/60 hover:bg-white/[0.08] hover:text-white disabled:opacity-60"
              >
                {isLoggingOut ? t('logoutLoading') : t('logout')}
              </button>
            </div>
          </div>
        </aside>

        <section className="min-w-0 lg:h-screen lg:overflow-y-auto">
          <div className="mx-auto max-w-none p-3 sm:p-4 lg:p-5">
            <header className="mb-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#B8643E]">{copy.portalLabel}</p>
                <h1 className="mt-1 text-[22px] font-black leading-tight sm:text-[28px]">{pageTitle(activeTab, organization.name, copy)}</h1>
                <p className="mt-1 max-w-3xl text-[13px] text-[#6F665D]">{pageSubtitle(activeTab, copy)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/"
                  className="rounded-lg border border-[#DCE3EA] bg-white px-3 py-2 text-[12px] font-black text-[#6F665D] shadow-sm transition hover:border-[#C46E43] hover:text-[#B8643E]"
                >
                  {copy.siteLink}
                </Link>
                <LanguageSwitcher />
                <button
                  type="button"
                  onClick={() => setActiveTab('new-request')}
                  className="rounded-lg bg-[#C46E43] px-3 py-2 text-[12px] font-black text-white shadow-sm transition hover:bg-[#AA5934]"
                >
                  + {copy.newRequest}
                </button>
              </div>
            </header>

            {activeTab === 'overview' && (
              <Overview
                copy={copy}
                organization={organization}
                activeRequests={activeRequests}
                reportDocuments={availableReports}
                objectsById={objectsById}
                onTabChange={setActiveTab}
              />
            )}
            {activeTab === 'requests' && <RequestsTable copy={copy} requests={organization.requests} objectsById={objectsById} onTabChange={setActiveTab} />}
            {activeTab === 'reports' && (
              <DocumentCards
                title={copy.photoReports}
                documents={reportDocuments}
                emptyLabel={copy.noPhotoReports}
                intro={copy.reportsIntro}
              />
            )}
            {activeTab === 'new-request' && <NewRequestForm organization={organization} canCreateRequests={canCreateRequests} />}
          </div>
        </section>
      </div>
    </main>
  );
}

function pageTitle(activeTab: TabKey, organizationName: string, copy: PortalCopy) {
  if (activeTab === 'overview') {
    return copy.overviewTitle(organizationName);
  }

  return copy.nav[activeTab];
}

function pageSubtitle(activeTab: TabKey, copy: PortalCopy) {
  return copy.subtitles[activeTab];
}

function Overview({
  copy,
  organization,
  activeRequests,
  reportDocuments,
  objectsById,
  onTabChange,
}: {
  copy: PortalCopy;
  organization: PortalDemoOrganization;
  activeRequests: PortalRequest[];
  reportDocuments: PortalDocument[];
  objectsById: Map<string, PortalObject>;
  onTabChange: (tab: TabKey) => void;
}) {
  const waitingActions = organization.requiredActions.slice(0, 3);
  const completedRequests = organization.requests.filter((request) => request.status === 'COMPLETED');

  if (organization.requests.length === 0) {
    return <EmptyPortalOverview copy={copy} onTabChange={onTabChange} />;
  }

  return (
    <div className="grid min-w-0 gap-3">
      <section className="min-w-0 rounded-xl bg-[#0D1B2A] p-4 text-white shadow-sm">
        <h2 className="text-[15px] font-black">{copy.conciergeTitle}</h2>
        <p className="mt-2 max-w-5xl text-[13px] leading-6 text-white/72">
          {copy.conciergeBody(waitingActions.length)}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => onTabChange('requests')} className="rounded-lg bg-[#C46E43] px-3 py-2 text-[12px] font-black text-white">
            {copy.openActions}
          </button>
          <button type="button" className="rounded-lg bg-white/10 px-3 py-2 text-[12px] font-black text-white">
            {copy.remindLater}
          </button>
        </div>
      </section>

      <div className="grid min-w-0 gap-3 md:grid-cols-3">
        <MetricCard label={copy.activeRequests} value={activeRequests.length} meta={copy.actionCount(waitingActions.length)} />
        <MetricCard label={copy.photoReports} value={reportDocuments.length} meta={copy.reportsIntro} />
        <MetricCard label={copy.requestStatus} value={completedRequests.length} meta={copy.subtitles.requests} />
      </div>

      <div className="grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid min-w-0 gap-3">
          <ActionList copy={copy} organization={organization} objectsById={objectsById} />
          <RequestsTable copy={copy} requests={activeRequests.slice(0, 3)} objectsById={objectsById} compact onTabChange={onTabChange} />
        </div>
        <aside className="grid min-w-0 content-start gap-3">
          <TimelineCard
            title={copy.nextStep}
            items={activeRequests.slice(0, 3).map((request) => [
              request.publicRequestNumber,
              request.nextStep || copy.subtitles.requests,
            ] as const)}
          />
          <DocumentCards
            title={copy.latestReports}
            documents={reportDocuments.slice(0, 3)}
            emptyLabel={copy.noPhotoReports}
            compact
          />
        </aside>
      </div>
    </div>
  );
}

function EmptyPortalOverview({ copy, onTabChange }: { copy: PortalCopy; onTabChange: (tab: TabKey) => void }) {
  return (
    <div className="grid gap-5">
      <section className="rounded-2xl bg-[#0D1B2A] p-6 text-white shadow-sm">
        <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#F6C7A7]">
          {copy.emptyState.eyebrow}
        </p>
        <h2 className="mt-3 max-w-3xl text-[28px] font-black leading-tight">
          {copy.emptyState.title}
        </h2>
        <p className="mt-3 max-w-4xl text-[15px] leading-7 text-white/72">
          {copy.emptyState.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => onTabChange('new-request')}
            className="rounded-xl bg-[#C46E43] px-4 py-3 text-[14px] font-black text-white"
          >
            {copy.newRequest}
          </button>
          <Link
            href="/status"
            className="rounded-xl bg-white/10 px-4 py-3 text-[14px] font-black text-white transition hover:bg-white/15"
          >
            {copy.emptyState.checkExisting}
          </Link>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label={copy.activeRequests} value={0} meta={copy.emptyState.activeRequestsMeta} />
        <MetricCard label={copy.photoReports} value={0} meta={copy.emptyState.photoReportsMeta} />
        <MetricCard label={copy.emptyState.accountLabel} value={1} meta={copy.emptyState.accountMeta} />
      </div>

      <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
        <h2 className="text-[20px] font-black">{copy.emptyState.nextStepTitle}</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <button
            type="button"
            onClick={() => onTabChange('new-request')}
            className="rounded-2xl border border-[#EFE6DC] bg-[#FFFDFC] p-4 text-left transition hover:border-[#C46E43]/60"
          >
            <strong className="block text-[16px]">{copy.emptyState.startNewTitle}</strong>
            <span className="mt-1 block text-[13px] leading-5 text-[#7B7168]">
              {copy.emptyState.startNewBody}
            </span>
          </button>
          <Link
            href="/status"
            className="rounded-2xl border border-[#EFE6DC] bg-[#FFFDFC] p-4 text-left transition hover:border-[#C46E43]/60"
          >
            <strong className="block text-[16px]">{copy.emptyState.findExistingTitle}</strong>
            <span className="mt-1 block text-[13px] leading-5 text-[#7B7168]">
              {copy.emptyState.findExistingBody}
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}

function MetricCard({ label, value, meta }: { label: string; value: number; meta: string }) {
  return (
    <div className="min-w-0 rounded-xl border border-[#DCE3EA] bg-white p-4 shadow-sm">
      <div className="text-[24px] font-black leading-none text-[#0F1C2B]">{value}</div>
      <div className="mt-2 text-[10px] font-black uppercase tracking-[0.14em] text-[#6F665D]">{label}</div>
      <p className="mt-1 text-[12px] text-[#7B7168]">{meta}</p>
    </div>
  );
}

function ActionList({
  copy,
  organization,
  objectsById,
}: {
  copy: PortalCopy;
  organization: PortalDemoOrganization;
  objectsById: Map<string, PortalObject>;
}) {
  const t = useTranslations('Portal');

  return (
    <section className="min-w-0 rounded-xl border border-[#DCE3EA] bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-[17px] font-black">{copy.needsAction}</h2>
        <span className="rounded-full bg-[#FFF3E8] px-2.5 py-1 text-[11px] font-black text-[#A85F23]">{copy.actionCount(organization.requiredActions.length)}</span>
      </div>
      <div className="grid gap-2.5">
        {organization.requiredActions.length === 0 && (
          <p className="rounded-xl border border-[#E5EAF0] bg-[#FFFDFC] p-3 text-[13px] text-[#6F665D]">
            {copy.conciergeBody(0)}
          </p>
        )}
        {organization.requiredActions.map((action) => {
          const request = organization.requests.find((item) => item.id === action.requestId);
          if (!request) return null;

          return (
            <Link
              key={action.id}
              href={`/portal/requests/${request.publicRequestNumber}`}
              className="grid gap-2 rounded-xl border border-[#E5EAF0] bg-[#FFFDFC] p-3 transition hover:border-[#C46E43]/50 md:grid-cols-[1fr_auto] md:items-center"
            >
              <div>
                <h3 className="text-[14px] font-black">{actionTitle(action.type, copy)}</h3>
                <p className="mt-1 text-[12px] text-[#6F665D]">
                  {request.publicRequestNumber} · {objectsById.get(request.objectId)?.name} · {action.description}
                </p>
              </div>
              <span className="w-fit rounded-lg bg-[#F2E1D5] px-3 py-1.5 text-[11px] font-black text-[#A45531]">
                {t('detail.previewOnly')}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function actionTitle(type: string, copy: PortalCopy) {
  if (type === 'APPROVE_ESTIMATE' || type === 'CONFIRM_VISIT_WINDOW' || type === 'UPLOAD_MISSING_PHOTO') {
    return copy.actionTitles[type];
  }

  return copy.actionTitles.UPLOAD_MISSING_PHOTO;
}

function RequestsTable({
  copy,
  requests,
  objectsById,
  compact = false,
  onTabChange,
}: {
  copy: PortalCopy;
  requests: PortalRequest[];
  objectsById: Map<string, PortalObject>;
  compact?: boolean;
  onTabChange: (tab: TabKey) => void;
}) {
  const t = useTranslations('Portal');

  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-[#DCE3EA] bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-[17px] font-black">{compact ? copy.activeRequests : copy.nav.requests}</h2>
        {!compact && (
          <button type="button" onClick={() => onTabChange('new-request')} className="rounded-lg bg-[#C46E43] px-3 py-2 text-[12px] font-black text-white">
            + {copy.newRequest}
          </button>
        )}
      </div>
      <div className="min-w-0 overflow-x-auto">
        <table className="min-w-[760px] w-full border-collapse text-left text-[12px]">
          <thead>
            <tr className="border-b border-[#E5EAF0] text-[10px] font-black uppercase tracking-[0.14em] text-[#7B7168]">
              <th className="py-2 pe-3">{copy.requestNumber}</th>
              <th className="py-2 pe-3">{copy.requestTitle}</th>
              <th className="py-2 pe-3">{copy.requestObject}</th>
              <th className="py-2 pe-3">{copy.requestStatus}</th>
              <th className="py-2 pe-3">{copy.nextStep}</th>
              <th className="py-2" />
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-b border-[#EEF2F6] align-top last:border-0">
                <td className="py-3 pe-3 font-mono font-black text-[#0F1C2B]">{request.publicRequestNumber}</td>
                <td className="py-3 pe-3 font-bold">{safeRequestTitle(request, copy.requestFallbackTitle)}</td>
                <td className="py-3 pe-3 text-[#6F665D]">{objectsById.get(request.objectId)?.name}</td>
                <td className="py-3 pe-3">
                  <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-black ${statusTone[request.status]}`}>
                    {t(`requestStatus.${request.status}`)}
                  </span>
                </td>
                <td className="py-3 pe-3 text-[#6F665D]">{request.nextStep}</td>
                <td className="py-3">
                  {request.status === 'COMPLETED' ? (
                    <button type="button" onClick={() => onTabChange('reports')} className="rounded-lg border border-[#DCE3EA] px-3 py-1.5 text-[11px] font-black">
                      {copy.report}
                    </button>
                  ) : (
                    <Link href={`/portal/requests/${request.publicRequestNumber}`} className="inline-flex rounded-lg bg-[#F2E1D5] px-3 py-1.5 text-[11px] font-black text-[#A45531]">
                      {copy.open}
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function NewRequestForm({
  organization,
  canCreateRequests,
}: {
  organization: PortalDemoOrganization;
  canCreateRequests: boolean;
}) {
  const locale = useLocale();
  const copy = copyForLocale(locale);
  const router = useRouter();
  const formCopy = copy.newRequestForm;
  const [issueType, setIssueType] = useState(formCopy.categories[0]?.title ?? '');
  const [serviceLocation, setServiceLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canCreateRequests) {
      setError(formCopy.demoError);
      return;
    }

    setIsSubmitting(true);
    setFeedback('');
    setError('');

    try {
      const response = await fetch('/api/portal/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueType,
          serviceLocation,
          serviceLatitude: selectedLocation?.latitude ?? null,
          serviceLongitude: selectedLocation?.longitude ?? null,
          serviceLocationSource: selectedLocation?.source ?? null,
          message,
        }),
      });
      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        redirectTo?: string;
        publicRequestNumber?: string;
        message?: string;
      } | null;

      if (!response.ok || !data?.success) {
        throw new Error(data?.message || formCopy.genericError);
      }

      setFeedback(formCopy.createdFeedback(data.publicRequestNumber || ''));
      router.push(data.redirectTo || '/portal');
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : formCopy.genericError);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
      <form id="new-request" onSubmit={submitRequest} className="scroll-mt-6 rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-[20px] font-black">{formCopy.title}</h2>
        <div className="mb-5 grid gap-3 md:grid-cols-3">
          {formCopy.categories.map((category) => (
            <button
              key={category.title}
              type="button"
              onClick={() => setIssueType(category.title)}
              className={`rounded-2xl border p-4 text-left transition ${
                issueType === category.title
                  ? 'border-[#C46E43] bg-[#FFF3E8]'
                  : 'border-[#EFE6DC] bg-[#FFFDFC] hover:border-[#C46E43]/60'
              }`}
            >
              <strong className="block text-[16px]">{category.title}</strong>
              <span className="mt-1 block text-[13px] text-[#7B7168]">{category.description}</span>
            </button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-[12px] font-black text-[#6F665D]">{formCopy.categoryLabel}</span>
            <input
              value={issueType}
              onChange={(event) => setIssueType(event.target.value)}
              disabled={isSubmitting || !canCreateRequests}
              className="h-12 w-full rounded-xl border border-[#E3D8CA] bg-[#FBF8F3] px-3 text-[14px] font-semibold text-[#0F1C2B] outline-none transition focus:border-[#C46E43] disabled:opacity-60"
              maxLength={80}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-[12px] font-black text-[#6F665D]">{formCopy.locationLabel}</span>
            <LocationPicker
              value={serviceLocation}
              onChange={setServiceLocation}
              onLocationSelect={setSelectedLocation}
              disabled={isSubmitting || !canCreateRequests}
              maxLength={500}
              placeholder={formCopy.locationPlaceholder}
              className="h-12 w-full rounded-xl border border-[#E3D8CA] bg-[#FBF8F3] px-3 text-[14px] font-semibold text-[#0F1C2B] outline-none transition focus:border-[#C46E43] disabled:opacity-60"
            />
          </label>
          <div className="md:col-span-2">
            <label className="block">
              <span className="mb-1 block text-[12px] font-black text-[#6F665D]">{formCopy.descriptionLabel}</span>
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                disabled={isSubmitting || !canCreateRequests}
                required
                minLength={5}
                maxLength={4000}
                placeholder={formCopy.descriptionPlaceholder}
                className="min-h-[150px] w-full rounded-xl border border-[#E3D8CA] bg-[#FBF8F3] px-3 py-3 text-[14px] font-semibold leading-6 text-[#0F1C2B] outline-none transition focus:border-[#C46E43] disabled:opacity-60"
              />
            </label>
          </div>
          <DemoField label={formCopy.contactLabel} value={organization.demoEmail} />
          <DemoField
            label={formCopy.securityLabel}
            value={canCreateRequests ? formCopy.connectedSecurity : formCopy.demoSecurity}
          />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={isSubmitting || !canCreateRequests}
            className="rounded-xl bg-[#C46E43] px-4 py-3 text-[14px] font-black text-white transition hover:bg-[#AA5934] disabled:opacity-60"
          >
            {isSubmitting ? formCopy.submitLoading : canCreateRequests ? formCopy.submit : formCopy.submitDisabled}
          </button>
          <button type="button" disabled className="rounded-xl border border-[#E3D8CA] bg-white px-4 py-3 text-[14px] font-black text-[#7B7168] opacity-70">
            {formCopy.filesLater}
          </button>
        </div>
        {feedback && <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-bold text-emerald-800">{feedback}</p>}
        {error && <p className="mt-4 rounded-xl border border-[#F2C5BB] bg-[#FFF1EF] px-4 py-3 text-[13px] font-bold text-[#A94732]">{error}</p>}
        <p className="mt-4 text-[12px] text-[#7B7168]">
          {canCreateRequests
            ? formCopy.connectedNote
            : formCopy.demoNote}
        </p>
      </form>
      <TimelineCard
        title={copy.howItWorks}
        items={[
          ['PR-Nummer', copy.requestCreated],
          ['Portal-Konto', copy.requestConnected],
          ['PixelRing', copy.requestProcessing],
        ]}
      />
    </div>
  );
}

function DemoField({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-black text-[#6F665D]">{label}</span>
      <div className={`min-h-11 rounded-xl border border-[#E3D8CA] bg-[#FBF8F3] px-3 py-3 text-[14px] ${muted ? 'text-[#A49A91]' : 'text-[#0F1C2B]'}`}>
        {value}
      </div>
    </label>
  );
}

function ObjectsWorkspace({
  organization,
  selectedObject,
  onSelectObject,
  onTabChange,
}: {
  organization: PortalDemoOrganization;
  selectedObject?: PortalObject;
  onSelectObject: (objectId: string) => void;
  onTabChange: (tab: TabKey) => void;
}) {
  if (!selectedObject) return null;

  return (
    <div className="grid gap-5">
      <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <DemoField label="Сеть / организация" value={organization.name} />
          <DemoField label="Город" value="Все города" />
          <DemoField label="Формат точки" value="Все форматы" />
          <DemoField label="Финансовый риск" value="Любой" />
        </div>
      </section>
      <div className="grid gap-5 xl:grid-cols-[430px_1fr]">
        <section className="grid content-start gap-4">
          {organization.objects.map((object) => {
            const assets = organization.assets.filter((asset) => asset.objectId === object.id);
            const requests = organization.requests.filter((request) => request.objectId === object.id);
            const needsAttention = assets.filter((asset) => asset.status === 'SERVICE_NEEDED' || asset.status === 'WATCH').length;

            return (
              <button
                key={object.id}
                type="button"
                onClick={() => onSelectObject(object.id)}
                className={`rounded-2xl border bg-white p-4 text-left shadow-sm transition ${
                  selectedObject.id === object.id ? 'border-[#C46E43]' : 'border-[#E3D8CA] hover:border-[#C46E43]/60'
                }`}
              >
                <div className="mb-4 h-28 rounded-xl bg-gradient-to-br from-[#0D1B2A] via-[#263A4D] to-[#C46E43]" />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[18px] font-black">{object.name}</h3>
                    <p className="mt-1 text-[13px] text-[#6F665D]">{object.address}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-black ${needsAttention ? 'bg-[#FFF3E8] text-[#A85F23]' : 'bg-emerald-100 text-emerald-800'}`}>
                    {needsAttention ? 'Needs attention' : 'On track'}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  <MiniStat label="Активы" value={String(assets.length)} />
                  <MiniStat label="Заявки" value={String(requests.length)} />
                  <MiniStat label="YTD" value="demo" />
                  <MiniStat label="Риск" value={needsAttention ? String(needsAttention) : 'OK'} />
                </div>
              </button>
            );
          })}
        </section>
        <ObjectPassport organization={organization} object={selectedObject} onTabChange={onTabChange} />
      </div>
    </div>
  );
}

function ObjectPassport({
  organization,
  object,
  onTabChange,
}: {
  organization: PortalDemoOrganization;
  object: PortalObject;
  onTabChange: (tab: TabKey) => void;
}) {
  const assets = organization.assets.filter((asset) => asset.objectId === object.id);
  const requests = organization.requests.filter((request) => request.objectId === object.id);
  const contacts = organization.contacts.filter((contact) => object.responsibleContactIds.includes(contact.id));
  const attentionAssets = assets.filter((asset) => asset.status === 'SERVICE_NEEDED' || asset.status === 'WATCH');
  const groupedAssets = groupAssetsByCategory(assets);

  return (
    <section className="rounded-2xl border border-[#E3D8CA] bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-[#EFE6DC] p-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-[24px] font-black">{object.name}</h2>
          <p className="mt-1 text-[14px] text-[#6F665D]">{object.address} · {object.purpose}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => onTabChange('new-request')} className="rounded-xl bg-[#C46E43] px-4 py-2.5 text-[13px] font-black text-white">Заявка по объекту</button>
          <button type="button" className="rounded-xl border border-[#E3D8CA] px-4 py-2.5 text-[13px] font-black">Экспорт preview</button>
        </div>
      </div>
      <div className="grid gap-5 p-5 xl:grid-cols-[330px_1fr]">
        <aside className="grid content-start gap-4">
          <InfoCard title="Budget watch" value="Demo YTD" body="Расходы, счета и лимиты показываются как preview до финансового контура." />
          <InfoList title="Ответственные" rows={contacts.map((contact) => [contact.name, `${contact.role} · ${contact.email}`])} />
          <InfoList title="Доступ и ограничения" rows={[['Рабочее окно', object.accessNotes], ['Город', object.city], ['Доступ', 'Только verified portal session']]} />
          <InfoList title="Управленческая сводка" rows={[['Активов всего', String(assets.length)], ['Требуют внимания', String(attentionAssets.length)], ['Открытые заявки', String(requests.length)], ['Гарантии', String(organization.documents.filter((doc) => doc.type === 'WARRANTY').length)]]} />
          <InfoList title="Ремонты и сервис" rows={requests.map((request) => [request.title, `${request.openedAt} · ${request.publicRequestNumber}`])} />
        </aside>
        <div className="grid gap-4">
          <section className="rounded-2xl border border-[#EFE6DC] bg-[#FBF8F3] p-4">
            <h3 className="text-[18px] font-black">Состав объекта</h3>
            <p className="mt-1 text-[13px] text-[#6F665D]">Категории раскрываются как в прототипе. Фильтры пока read-only.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_190px_170px_auto] md:items-end">
              <DemoField label="Сквозной поиск" value="меню, баннер, PSU, униформа..." muted />
              <DemoField label="Категория" value="Все категории" />
              <DemoField label="Статус" value="Любой" />
              <button type="button" className="rounded-xl border border-[#E3D8CA] bg-white px-4 py-3 text-[13px] font-black">Фильтр</button>
            </div>
          </section>
          <div className="grid gap-3">
            {Object.entries(groupedAssets).map(([category, categoryAssets], index) => (
              <details key={category} className="rounded-2xl border border-[#EFE6DC] bg-white p-4" open={index === 0}>
                <summary className="cursor-pointer text-[16px] font-black">
                  {category} · {categoryAssets.length}
                </summary>
                <div className="mt-3 grid gap-2">
                  {categoryAssets.map((asset) => (
                    <div key={asset.id} className="grid gap-2 rounded-xl bg-[#FBF8F3] p-3 md:grid-cols-[1fr_150px_130px_auto] md:items-center">
                      <div>
                        <strong>{asset.name}</strong>
                        <p className="text-[12px] text-[#7B7168]">{asset.id} · {asset.type}</p>
                      </div>
                      <span className="text-[13px] text-[#6F665D]">{asset.type}</span>
                      <span className={`w-fit rounded-full px-3 py-1 text-[11px] font-black ${assetTone[asset.status]}`}>
                        {asset.status}
                      </span>
                      <button type="button" className="rounded-xl border border-[#E3D8CA] bg-white px-3 py-2 text-[12px] font-black">Открыть</button>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <MiniStat label="Риск простоя" value={attentionAssets.length ? 'Средний' : 'Низкий'} />
            <MiniStat label="Сезонная готовность" value="72%" />
            <MiniStat label="Следующая экономия" value="Preview" />
          </div>
        </div>
      </div>
    </section>
  );
}

function AssetInventory({
  organization,
  objectsById,
}: {
  organization: PortalDemoOrganization;
  objectsById: Map<string, PortalObject>;
}) {
  const t = useTranslations('Portal');
  const categories = [
    ['Наружная реклама', 'Фасадные вывески, световые буквы, короба, крышные установки.'],
    ['Внутренняя реклама', 'Навигация, интерьерные таблички, POS-дисплеи, менюборды.'],
    ['Наклейки и баннеры', 'Window graphics, сезонные баннеры, промо-плакаты и пленки.'],
    ['Меню и печать', 'Меню, тейбл-тенты, листовки, сертификаты, брендированные материалы.'],
    ['Одежда персонала', 'Фартуки, футболки, бейджи, вышивка, брендирование формы.'],
  ];

  return (
    <div className="grid gap-5">
      <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-5">
          <DemoField label="Торговая точка" value="Все объекты" />
          <DemoField label="Категория" value="Все категории" />
          <DemoField label="Тип оборудования" value="Все типы" />
          <DemoField label="Состояние" value="Любое" />
          <button type="button" className="self-end rounded-xl border border-[#E3D8CA] px-4 py-3 text-[13px] font-black">Найти</button>
        </div>
      </section>
      <div className="grid gap-3 md:grid-cols-5">
        {categories.map(([title, body]) => (
          <div key={title} className="rounded-2xl border border-[#E3D8CA] bg-white p-4 shadow-sm">
            <strong className="block text-[15px]">{title}</strong>
            <span className="mt-2 block text-[13px] leading-5 text-[#7B7168]">{body}</span>
          </div>
        ))}
      </div>
      <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-[#EFE6DC] text-[11px] font-black uppercase tracking-[0.14em] text-[#7B7168]">
                <th className="py-3 pe-4">Актив</th>
                <th className="py-3 pe-4">Объект</th>
                <th className="py-3 pe-4">Категория / тип</th>
                <th className="py-3 pe-4">Сервисная логика</th>
                <th className="py-3 pe-4">Состояние</th>
                <th className="py-3">Последний сервис</th>
              </tr>
            </thead>
            <tbody>
              {organization.assets.map((asset) => (
                <tr key={asset.id} className="border-b border-[#F1E9DF] align-top last:border-0">
                  <td className="py-4 pe-4 font-black">{asset.name}<div className="text-[12px] font-normal text-[#7B7168]">{asset.id}</div></td>
                  <td className="py-4 pe-4">{objectsById.get(asset.objectId)?.name}</td>
                  <td className="py-4 pe-4">{asset.category} · {asset.type}</td>
                  <td className="py-4 pe-4 text-[#6F665D]">{asset.serviceRelevance}</td>
                  <td className="py-4 pe-4"><span className={`rounded-full px-3 py-1 text-[11px] font-black ${assetTone[asset.status]}`}>{t(`assetStatus.${asset.status}`)}</span></td>
                  <td className="py-4">{asset.lastServiceAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function MaintenancePanel({
  organization,
  objectsById,
}: {
  organization: PortalDemoOrganization;
  objectsById: Map<string, PortalObject>;
}) {
  const planned = organization.assets.filter((asset) => asset.status === 'WATCH' || asset.status === 'SERVICE_NEEDED' || asset.status === 'WARRANTY');

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {planned.map((asset, index) => (
        <section key={asset.id} className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
          <span className="rounded-full bg-[#FFF3E8] px-3 py-1 text-[12px] font-black text-[#A85F23]">{index === 0 ? '30.04' : index === 1 ? '03.05' : 'Quarterly'}</span>
          <h2 className="mt-4 text-[18px] font-black">{objectsById.get(asset.objectId)?.name}</h2>
          <p className="mt-2 text-[14px] leading-6 text-[#6F665D]">{asset.serviceRelevance}</p>
        </section>
      ))}
    </div>
  );
}

function WarrantyPanel({
  organization,
  warrantyDocuments,
  objectsById,
}: {
  organization: PortalDemoOrganization;
  warrantyDocuments: PortalDocument[];
  objectsById: Map<string, PortalObject>;
}) {
  return (
    <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full text-left text-[14px]">
          <thead>
            <tr className="border-b border-[#EFE6DC] text-[11px] font-black uppercase tracking-[0.14em] text-[#7B7168]">
              <th className="py-3 pe-4">Объект</th>
              <th className="py-3 pe-4">Работа</th>
              <th className="py-3 pe-4">Действует до</th>
              <th className="py-3 pe-4">Статус</th>
              <th className="py-3" />
            </tr>
          </thead>
          <tbody>
            {warrantyDocuments.map((document) => {
              const request = organization.requests.find((item) => item.id === document.requestId);
              return (
                <tr key={document.id} className="border-b border-[#F1E9DF] last:border-0">
                  <td className="py-4 pe-4">{objectsById.get(request?.objectId || '')?.name || document.relatedTo}</td>
                  <td className="py-4 pe-4 font-black">{document.title}</td>
                  <td className="py-4 pe-4">{document.issuedAt}</td>
                  <td className="py-4 pe-4"><span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-black text-emerald-800">{document.status}</span></td>
                  <td className="py-4"><button type="button" className="rounded-xl border border-[#E3D8CA] px-4 py-2 text-[13px] font-black">Документ</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function OffersPanel({ documents }: { documents: PortalDocument[] }) {
  return (
    <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full text-left text-[14px]">
          <thead>
            <tr className="border-b border-[#EFE6DC] text-[11px] font-black uppercase tracking-[0.14em] text-[#7B7168]">
              <th className="py-3 pe-4">Документ</th>
              <th className="py-3 pe-4">Заявка</th>
              <th className="py-3 pe-4">Сумма</th>
              <th className="py-3 pe-4">Статус</th>
              <th className="py-3" />
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.id} className="border-b border-[#F1E9DF] last:border-0">
                <td className="py-4 pe-4 font-black">{document.title}<div className="text-[12px] font-normal text-[#7B7168]">{document.description}</div></td>
                <td className="py-4 pe-4">{document.relatedTo}</td>
                <td className="py-4 pe-4">Preview</td>
                <td className="py-4 pe-4"><span className="rounded-full bg-[#FFF3E8] px-3 py-1 text-[11px] font-black text-[#A85F23]">{document.status}</span></td>
                <td className="py-4"><button type="button" className="rounded-xl bg-[#C46E43] px-4 py-2 text-[13px] font-black text-white">Согласовать</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[12px] text-[#7B7168]">Кнопки согласования пока preview-only и ничего не сохраняют.</p>
    </section>
  );
}

function BillingPreview({ invoices }: { invoices: PortalDocument[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <PreviewCard tag="Future" title="Online payment" body="Появится только после утверждения платежного и юридического контура." />
      {invoices.map((invoice) => (
        <PreviewCard key={invoice.id} tag={invoice.status} title={invoice.title} body={invoice.description || invoice.relatedTo} />
      ))}
      <PreviewCard tag="Акт" title="Service report preview" body="Акты и счета остаются preview до отдельного решения по billing." />
    </div>
  );
}

function DocumentsTable({ documents }: { documents: PortalDocument[] }) {
  const t = useTranslations('Portal');

  return (
    <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full text-left text-[14px]">
          <thead>
            <tr className="border-b border-[#EFE6DC] text-[11px] font-black uppercase tracking-[0.14em] text-[#7B7168]">
              <th className="py-3 pe-4">Название</th>
              <th className="py-3 pe-4">Тип</th>
              <th className="py-3 pe-4">Связано с</th>
              <th className="py-3 pe-4">Дата</th>
              <th className="py-3" />
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.id} className="border-b border-[#F1E9DF] last:border-0">
                <td className="py-4 pe-4 font-black">{document.title}</td>
                <td className="py-4 pe-4">{t(`documentType.${document.type}`)}</td>
                <td className="py-4 pe-4">{document.relatedTo}</td>
                <td className="py-4 pe-4">{document.issuedAt}</td>
                <td className="py-4"><button type="button" className="rounded-xl border border-[#E3D8CA] px-4 py-2 text-[13px] font-black">PDF</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TeamPreview({ organization }: { organization: PortalDemoOrganization }) {
  return (
    <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
      <div className="mb-4 flex justify-end">
        <button type="button" className="rounded-xl bg-[#C46E43] px-4 py-2.5 text-[13px] font-black text-white">Пригласить</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full text-left text-[14px]">
          <thead>
            <tr className="border-b border-[#EFE6DC] text-[11px] font-black uppercase tracking-[0.14em] text-[#7B7168]">
              <th className="py-3 pe-4">Пользователь</th>
              <th className="py-3 pe-4">Роль</th>
              <th className="py-3 pe-4">Доступ</th>
              <th className="py-3">Статус</th>
            </tr>
          </thead>
          <tbody>
            {organization.contacts.map((contact, index) => (
              <tr key={contact.id} className="border-b border-[#F1E9DF] last:border-0">
                <td className="py-4 pe-4 font-black">{contact.name}<div className="text-[12px] font-normal text-[#7B7168]">{contact.email}</div></td>
                <td className="py-4 pe-4">{index === 0 ? 'Owner' : contact.role}</td>
                <td className="py-4 pe-4">{index === 0 ? 'Все объекты, документы, согласования' : 'Заявки, объекты, фотоотчеты'}</td>
                <td className="py-4"><span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-black text-emerald-800">Verified</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[12px] text-[#7B7168]">Invites/RBAC отключены до отдельного этапа portal identity.</p>
    </section>
  );
}

function SettingsPreview({ organization }: { organization: PortalDemoOrganization }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <InfoList
        title="Аккаунт"
        rows={[
          ['Email', `${organization.demoEmail} · verified`],
          ['Вход', 'HTTP-only portal session'],
          ['Язык', `${organization.languagePreference.toUpperCase()} canonical · RU review copy`],
        ]}
      />
      <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
        <h2 className="text-[20px] font-black">Privacy</h2>
        <div className="mt-4 grid gap-2">
          {['Запросить экспорт данных', 'Исправить контактные данные', 'Запросить удаление данных'].map((label) => (
            <button key={label} type="button" className="rounded-xl border border-[#E3D8CA] px-4 py-3 text-left text-[14px] font-black">
              {label}
            </button>
          ))}
        </div>
        <p className="mt-4 text-[12px] text-[#7B7168]">Privacy workflows preview-only: реальные export/deletion процессы не выполняются.</p>
      </section>
    </div>
  );
}

function UpcomingEvents({
  organization,
  objectsById,
}: {
  organization: PortalDemoOrganization;
  objectsById: Map<string, PortalObject>;
}) {
  const items = organization.requiredActions.map((action) => {
    const request = organization.requests.find((item) => item.id === action.requestId);
    return [
      action.dueLabel,
      request ? `${request.publicRequestNumber} · ${objectsById.get(request.objectId)?.name}` : action.description,
    ] as const;
  });

  return <TimelineCard title="Ближайшие события" items={items} />;
}

function TimelineCard({ title, items }: { title: string; items: readonly (readonly [string, string])[] }) {
  return (
    <section className="min-w-0 rounded-xl border border-[#DCE3EA] bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-[17px] font-black">{title}</h2>
      <div className="grid gap-3">
        {items.map(([heading, body], index) => (
          <div key={`${heading}-${index}`} className="grid grid-cols-[24px_1fr] gap-2.5">
            <span className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-black ${index === 0 ? 'bg-[#C46E43] text-white' : 'bg-[#EFE6DC] text-[#6F665D]'}`}>
              {index + 1}
            </span>
            <div>
              <h3 className="text-[13px] font-black">{heading}</h3>
              <p className="mt-1 text-[12px] leading-5 text-[#6F665D]">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ObjectHealth({ organization }: { organization: PortalDemoOrganization }) {
  return (
    <section className="rounded-xl border border-[#DCE3EA] bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-[17px] font-black">Здоровье объектов</h2>
      <div className="grid gap-3">
        {organization.objects.map((object) => {
          const assets = organization.assets.filter((asset) => asset.objectId === object.id);
          const attention = assets.filter((asset) => asset.status === 'SERVICE_NEEDED' || asset.status === 'WATCH').length;
          const score = Math.max(42, 92 - attention * 18);
          return (
            <div key={object.id}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <strong className="text-[13px]">{object.name}</strong>
                <span className="rounded-full bg-[#FFF3E8] px-2.5 py-0.5 text-[10px] font-black text-[#A85F23]">{score}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#EFE6DC]">
                <span className="block h-full rounded-full bg-[#C46E43]" style={{ width: `${score}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function DocumentCards({
  title,
  documents,
  emptyLabel,
  intro,
  compact = false,
}: {
  title: string;
  documents: PortalDocument[];
  emptyLabel: string;
  intro?: string;
  compact?: boolean;
}) {
  const t = useTranslations('Portal');

  return (
    <section className="rounded-xl border border-[#DCE3EA] bg-white p-4 shadow-sm">
      <h2 className="mb-3 text-[17px] font-black">{title}</h2>
      {intro && <p className="mb-3 text-[13px] leading-6 text-[#6F665D]">{intro}</p>}
      {documents.length === 0 ? (
        <p className="text-[12px] text-[#7B7168]">{emptyLabel}</p>
      ) : (
        <div className={`grid gap-2.5 ${compact ? '' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
          {documents.map((document) => (
            <article key={document.id} className="rounded-xl border border-[#E5EAF0] bg-[#FFFDFC] p-3">
              <span className="rounded-full bg-[#EEF3FB] px-2.5 py-0.5 text-[10px] font-black text-[#42526B]">{t(`documentType.${document.type}`)}</span>
              <h3 className="mt-2 text-[13px] font-black">{document.title}</h3>
              <p className="mt-1 text-[12px] leading-5 text-[#6F665D]">{document.description || document.relatedTo}</p>
              <button type="button" className="mt-3 rounded-lg border border-[#DCE3EA] px-3 py-1.5 text-[11px] font-black">PDF preview</button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function PreviewCard({ tag, title, body }: { tag: string; title: string; body: string }) {
  return (
    <article className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
      <span className="rounded-full bg-[#FFF3E8] px-3 py-1 text-[11px] font-black text-[#A85F23]">{tag}</span>
      <h2 className="mt-4 text-[18px] font-black">{title}</h2>
      <p className="mt-2 text-[14px] leading-6 text-[#6F665D]">{body}</p>
    </article>
  );
}

function InfoCard({ title, value, body }: { title: string; value: string; body: string }) {
  return (
    <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
      <span className="rounded-full bg-[#FFF3E8] px-3 py-1 text-[11px] font-black text-[#A85F23]">{title}</span>
      <h3 className="mt-3 text-[22px] font-black">{value}</h3>
      <p className="mt-2 text-[13px] leading-5 text-[#6F665D]">{body}</p>
    </section>
  );
}

function InfoList({ title, rows }: { title: string; rows: readonly (readonly [string, string])[] }) {
  return (
    <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
      <h2 className="text-[20px] font-black">{title}</h2>
      <div className="mt-4 grid gap-3">
        {rows.map(([label, value]) => (
          <div key={`${label}-${value}`} className="flex items-start justify-between gap-4 border-b border-[#F1E9DF] pb-3 last:border-0 last:pb-0">
            <span className="text-[13px] text-[#7B7168]">{label}</span>
            <strong className="max-w-[65%] text-right text-[13px]">{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#FBF8F3] p-3">
      <span className="block text-[11px] font-bold text-[#7B7168]">{label}</span>
      <strong className="mt-1 block text-[15px]">{value}</strong>
    </div>
  );
}

function groupAssetsByCategory(assets: PortalAsset[]) {
  return assets.reduce<Record<string, PortalAsset[]>>((groups, asset) => {
    if (!groups[asset.category]) groups[asset.category] = [];
    groups[asset.category].push(asset);
    return groups;
  }, {});
}

const parkedFuturePortalModules = [
  ObjectsWorkspace,
  AssetInventory,
  MaintenancePanel,
  WarrantyPanel,
  OffersPanel,
  BillingPreview,
  DocumentsTable,
  TeamPreview,
  SettingsPreview,
  UpcomingEvents,
  ObjectHealth,
];

void parkedFuturePortalModules;
