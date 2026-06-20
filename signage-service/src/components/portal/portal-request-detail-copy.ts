import type {
  PortalCustomerAttachmentStatus,
  PortalDocumentType,
} from '@/lib/portal/types';

type PortalLocale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';
type PortalDocumentStatus = 'available' | 'planned' | 'locked';
export type PortalChatAuthorRole = 'CUSTOMER' | 'SYSTEM' | 'OPERATOR';

export type PortalRequestDetailCopy = {
  back: string;
  task: string;
  requestFallback: string;
  details: string;
  description: string;
  address: string;
  requestContactPerson: string;
  requestContactDetails: string;
  portalAccountOwner: string;
  pixelringResponsible: string;
  created: string;
  updated: string;
  result: string;
  noResult: string;
  files: string;
  noFiles: string;
  nextStep: string;
  photoReport: string;
  customerData: string;
  timeline: string;
  notSpecified: string;
  serviceTeam: string;
  close: string;
  portalSubtitle: string;
  edit: string;
  cancel: string;
  save: string;
  saving: string;
  saved: string;
  unchanged: string;
  saveError: string;
  name: string;
  email: string;
  phone: string;
  documentTypes: Record<PortalDocumentType, string>;
  documentStatuses: Record<PortalDocumentStatus, string>;
  attachmentStatuses: Record<PortalCustomerAttachmentStatus, string>;
  chat: {
    authors: Record<PortalChatAuthorRole, string>;
    supportTitle: string;
    online: string;
    newRequest: string;
    empty: string;
    loading: string;
    attachTitle: string;
    voiceTitle: string;
    placeholder: string;
    unavailable: string;
    photoFallback: string;
    attachmentFallback: string;
    attachmentReceived: string;
  };
  messageForm: {
    label: string;
    placeholder: string;
    attachmentNote: string;
    sending: string;
    send: string;
    saved: string;
    error: string;
  };
};

const DOCUMENT_TYPES = {
  de: {
    REPORT: 'Bericht',
    WARRANTY: 'Garantie',
    DOCUMENT: 'Dokument',
    OFFER: 'Angebot',
    INVOICE: 'Rechnung',
  },
  en: {
    REPORT: 'Report',
    WARRANTY: 'Warranty',
    DOCUMENT: 'Document',
    OFFER: 'Offer',
    INVOICE: 'Invoice',
  },
  ru: {
    REPORT: 'Отчет',
    WARRANTY: 'Гарантия',
    DOCUMENT: 'Документ',
    OFFER: 'Предложение',
    INVOICE: 'Счет',
  },
  tr: {
    REPORT: 'Rapor',
    WARRANTY: 'Garanti',
    DOCUMENT: 'Belge',
    OFFER: 'Teklif',
    INVOICE: 'Fatura',
  },
  pl: {
    REPORT: 'Raport',
    WARRANTY: 'Gwarancja',
    DOCUMENT: 'Dokument',
    OFFER: 'Oferta',
    INVOICE: 'Faktura',
  },
  ar: {
    REPORT: 'تقرير',
    WARRANTY: 'ضمان',
    DOCUMENT: 'مستند',
    OFFER: 'عرض',
    INVOICE: 'فاتورة',
  },
} satisfies Record<PortalLocale, Record<PortalDocumentType, string>>;

const DOCUMENT_STATUSES = {
  de: {
    available: 'Verfuegbar',
    planned: 'Geplant',
    locked: 'Gesperrt',
  },
  en: {
    available: 'Available',
    planned: 'Planned',
    locked: 'Locked',
  },
  ru: {
    available: 'Доступно',
    planned: 'Запланировано',
    locked: 'Закрыто',
  },
  tr: {
    available: 'Kullanılabilir',
    planned: 'Planlandı',
    locked: 'Kilitli',
  },
  pl: {
    available: 'Dostępne',
    planned: 'Planowane',
    locked: 'Zablokowane',
  },
  ar: {
    available: 'متاح',
    planned: 'مخطط',
    locked: 'مقفل',
  },
} satisfies Record<PortalLocale, Record<PortalDocumentStatus, string>>;

const ATTACHMENT_STATUSES = {
  de: {
    received: 'Empfangen',
    reviewed: 'Geprueft',
    needs_more_context: 'Weitere Angaben noetig',
  },
  en: {
    received: 'Received',
    reviewed: 'Reviewed',
    needs_more_context: 'More context needed',
  },
  ru: {
    received: 'Получено',
    reviewed: 'Проверено',
    needs_more_context: 'Нужны детали',
  },
  tr: {
    received: 'Alındı',
    reviewed: 'Kontrol edildi',
    needs_more_context: 'Ek bilgi gerekli',
  },
  pl: {
    received: 'Odebrane',
    reviewed: 'Sprawdzone',
    needs_more_context: 'Wymaga uzupełnienia',
  },
  ar: {
    received: 'تم الاستلام',
    reviewed: 'تمت المراجعة',
    needs_more_context: 'يحتاج إلى تفاصيل إضافية',
  },
} satisfies Record<PortalLocale, Record<PortalCustomerAttachmentStatus, string>>;

const DETAIL_COPY: Record<PortalLocale, PortalRequestDetailCopy> = {
  de: {
    back: 'Zurueck zum Portal',
    task: 'Anfrage',
    requestFallback: 'Anfrage',
    details: 'Details',
    description: 'Urspruengliche Beschreibung',
    address: 'Adresse / Objekt',
    requestContactPerson: 'Kontaktperson zur Anfrage',
    requestContactDetails: 'Kontaktdaten zur Anfrage',
    portalAccountOwner: 'Portal-Konto / Inhaber',
    pixelringResponsible: 'PixelRing Ansprechpartner',
    created: 'Erstellt',
    updated: 'Aktualisiert',
    result: 'Ergebnis der Arbeiten',
    noResult: 'Noch kein Ergebnis freigegeben. PixelRing ergaenzt diesen Bereich nach Abschluss oder Zwischenstand.',
    files: 'Ihre Fotos und Dateien',
    noFiles: 'Noch keine Fotos oder Dateien fuer diese Anfrage.',
    nextStep: 'Naechster Schritt',
    photoReport: 'Fotobericht PixelRing',
    customerData: 'Ihre Angaben',
    timeline: 'Statusverlauf',
    notSpecified: 'Noch nicht angegeben',
    serviceTeam: 'PixelRing Service-Team',
    close: 'Zum Portal',
    portalSubtitle: 'Kundenportal',
    edit: 'Bearbeiten',
    cancel: 'Abbrechen',
    save: 'Speichern',
    saving: 'Speichert ...',
    saved: 'Daten wurden gespeichert.',
    unchanged: 'Keine Aenderung erkannt.',
    saveError: 'Die Daten konnten nicht gespeichert werden.',
    name: 'Kontaktperson',
    email: 'E-Mail',
    phone: 'Telefon',
    documentTypes: DOCUMENT_TYPES.de,
    documentStatuses: DOCUMENT_STATUSES.de,
    attachmentStatuses: ATTACHMENT_STATUSES.de,
    chat: {
      authors: {
        CUSTOMER: 'Sie',
        OPERATOR: 'PixelRing',
        SYSTEM: 'Assistent',
      },
      supportTitle: 'Technischer Support',
      online: 'Online',
      newRequest: 'Neue Anfrage',
      empty: 'Beschreiben Sie Ihr Anliegen oder senden Sie ein Foto.',
      loading: 'Laden ...',
      attachTitle: 'Foto/Video anhaengen',
      voiceTitle: 'Sprachnachricht (demnaechst)',
      placeholder: 'Ihre Nachricht ...',
      unavailable: 'Chat ist derzeit nicht verfuegbar.',
      photoFallback: 'Foto',
      attachmentFallback: 'Anhang',
      attachmentReceived: 'Datei empfangen',
    },
    messageForm: {
      label: 'Nachricht an PixelRing',
      placeholder: 'Schreiben Sie eine Rueckfrage oder ergaenzende Information zu dieser Anfrage.',
      attachmentNote: 'Dateianhaenge folgen in einem separaten sicheren Schritt.',
      sending: 'Wird gesendet ...',
      send: 'Nachricht senden',
      saved: 'Nachricht wurde gespeichert.',
      error: 'Die Nachricht konnte nicht gesendet werden.',
    },
  },
  en: {
    back: 'Back to portal',
    task: 'Request',
    requestFallback: 'Request',
    details: 'Details',
    description: 'Original description',
    address: 'Address / object',
    requestContactPerson: 'Request contact',
    requestContactDetails: 'Request contact details',
    portalAccountOwner: 'Portal account / owner',
    pixelringResponsible: 'PixelRing contact',
    created: 'Created',
    updated: 'Updated',
    result: 'Work result',
    noResult: 'No result has been released yet. PixelRing will add this section after completion or an interim update.',
    files: 'Your photos and files',
    noFiles: 'No photos or files yet for this request.',
    nextStep: 'Next step',
    photoReport: 'PixelRing photo report',
    customerData: 'Your details',
    timeline: 'Status history',
    notSpecified: 'Not provided yet',
    serviceTeam: 'PixelRing service team',
    close: 'To portal',
    portalSubtitle: 'Customer portal',
    edit: 'Edit',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving ...',
    saved: 'Details saved.',
    unchanged: 'No change detected.',
    saveError: 'The details could not be saved.',
    name: 'Contact person',
    email: 'Email',
    phone: 'Phone',
    documentTypes: DOCUMENT_TYPES.en,
    documentStatuses: DOCUMENT_STATUSES.en,
    attachmentStatuses: ATTACHMENT_STATUSES.en,
    chat: {
      authors: {
        CUSTOMER: 'You',
        OPERATOR: 'PixelRing',
        SYSTEM: 'Assistant',
      },
      supportTitle: 'Technical support',
      online: 'Online',
      newRequest: 'New request',
      empty: 'Describe your issue or send a photo.',
      loading: 'Loading ...',
      attachTitle: 'Attach photo/video',
      voiceTitle: 'Voice message (coming soon)',
      placeholder: 'Your message ...',
      unavailable: 'Chat is currently unavailable.',
      photoFallback: 'Photo',
      attachmentFallback: 'Attachment',
      attachmentReceived: 'File received',
    },
    messageForm: {
      label: 'Message to PixelRing',
      placeholder: 'Write a question or additional information for this request.',
      attachmentNote: 'File attachments follow in a separate secure step.',
      sending: 'Sending ...',
      send: 'Send message',
      saved: 'Message saved.',
      error: 'The message could not be sent.',
    },
  },
  ru: {
    back: 'Назад в кабинет',
    task: 'Заявка',
    requestFallback: 'Заявка',
    details: 'Данные заявки',
    description: 'Первоначальное описание',
    address: 'Адрес / объект',
    requestContactPerson: 'Контакт по заявке',
    requestContactDetails: 'Контакты по заявке',
    portalAccountOwner: 'Владелец портала / аккаунт',
    pixelringResponsible: 'Ответственный PixelRing',
    created: 'Создана',
    updated: 'Обновлена',
    result: 'Результат работ',
    noResult: 'Результат пока не добавлен. PixelRing заполнит этот блок после выполнения работ или промежуточного отчета.',
    files: 'Ваши фото и файлы',
    noFiles: 'По этой заявке пока нет фото или файлов.',
    nextStep: 'Следующий шаг',
    photoReport: 'Фотоотчет PixelRing',
    customerData: 'Ваши данные',
    timeline: 'История статусов',
    notSpecified: 'Пока не указано',
    serviceTeam: 'Сервисная команда PixelRing',
    close: 'В портал',
    portalSubtitle: 'Клиентский портал',
    edit: 'Редактировать',
    cancel: 'Отмена',
    save: 'Сохранить',
    saving: 'Сохранение ...',
    saved: 'Данные сохранены.',
    unchanged: 'Изменений нет.',
    saveError: 'Не удалось сохранить данные.',
    name: 'Контактное лицо',
    email: 'E-mail',
    phone: 'Телефон',
    documentTypes: DOCUMENT_TYPES.ru,
    documentStatuses: DOCUMENT_STATUSES.ru,
    attachmentStatuses: ATTACHMENT_STATUSES.ru,
    chat: {
      authors: {
        CUSTOMER: 'Вы',
        OPERATOR: 'PixelRing',
        SYSTEM: 'Ассистент',
      },
      supportTitle: 'Техническая поддержка',
      online: 'Онлайн',
      newRequest: 'Новая заявка',
      empty: 'Опишите вопрос или отправьте фото.',
      loading: 'Загрузка ...',
      attachTitle: 'Прикрепить фото/видео',
      voiceTitle: 'Голосовое сообщение (скоро)',
      placeholder: 'Ваше сообщение ...',
      unavailable: 'Чат сейчас недоступен.',
      photoFallback: 'Фото',
      attachmentFallback: 'Вложение',
      attachmentReceived: 'Файл получен',
    },
    messageForm: {
      label: 'Сообщение в PixelRing',
      placeholder: 'Напишите вопрос или дополнительную информацию по этой заявке.',
      attachmentNote: 'Файлы добавляются отдельным безопасным шагом.',
      sending: 'Отправка ...',
      send: 'Отправить сообщение',
      saved: 'Сообщение сохранено.',
      error: 'Не удалось отправить сообщение.',
    },
  },
  tr: {
    back: 'Portala dön',
    task: 'Talep',
    requestFallback: 'Talep',
    details: 'Detaylar',
    description: 'İlk açıklama',
    address: 'Adres / obje',
    requestContactPerson: 'Talep iletişim kişisi',
    requestContactDetails: 'Talep iletişim bilgileri',
    portalAccountOwner: 'Portal hesabı / sahibi',
    pixelringResponsible: 'PixelRing yetkilisi',
    created: 'Oluşturuldu',
    updated: 'Güncellendi',
    result: 'İş sonucu',
    noResult: 'Henüz sonuç paylaşılmadı. PixelRing tamamlandıktan sonra veya ara güncellemede bu alanı doldurur.',
    files: 'Fotoğraflarınız ve dosyalarınız',
    noFiles: 'Bu talep için henüz fotoğraf veya dosya yok.',
    nextStep: 'Sonraki adım',
    photoReport: 'PixelRing foto raporu',
    customerData: 'Bilgileriniz',
    timeline: 'Durum geçmişi',
    notSpecified: 'Henüz belirtilmedi',
    serviceTeam: 'PixelRing servis ekibi',
    close: 'Portala git',
    portalSubtitle: 'Müşteri portalı',
    edit: 'Düzenle',
    cancel: 'İptal',
    save: 'Kaydet',
    saving: 'Kaydediliyor ...',
    saved: 'Bilgiler kaydedildi.',
    unchanged: 'Değişiklik yok.',
    saveError: 'Bilgiler kaydedilemedi.',
    name: 'İletişim kişisi',
    email: 'E-posta',
    phone: 'Telefon',
    documentTypes: DOCUMENT_TYPES.tr,
    documentStatuses: DOCUMENT_STATUSES.tr,
    attachmentStatuses: ATTACHMENT_STATUSES.tr,
    chat: {
      authors: {
        CUSTOMER: 'Siz',
        OPERATOR: 'PixelRing',
        SYSTEM: 'Asistan',
      },
      supportTitle: 'Teknik destek',
      online: 'Çevrimiçi',
      newRequest: 'Yeni talep',
      empty: 'Sorununuzu açıklayın veya fotoğraf gönderin.',
      loading: 'Yükleniyor ...',
      attachTitle: 'Foto/video ekle',
      voiceTitle: 'Sesli mesaj (yakında)',
      placeholder: 'Mesajınız ...',
      unavailable: 'Sohbet şu anda kullanılamıyor.',
      photoFallback: 'Fotoğraf',
      attachmentFallback: 'Ek',
      attachmentReceived: 'Dosya alındı',
    },
    messageForm: {
      label: 'PixelRing mesajı',
      placeholder: 'Bu taleple ilgili soru veya ek bilgi yazın.',
      attachmentNote: 'Dosya ekleri ayrı bir güvenli adımda eklenir.',
      sending: 'Gönderiliyor ...',
      send: 'Mesaj gönder',
      saved: 'Mesaj kaydedildi.',
      error: 'Mesaj gönderilemedi.',
    },
  },
  pl: {
    back: 'Wróć do portalu',
    task: 'Zgłoszenie',
    requestFallback: 'Zgłoszenie',
    details: 'Szczegóły',
    description: 'Pierwotny opis',
    address: 'Adres / obiekt',
    requestContactPerson: 'Osoba kontaktowa zgłoszenia',
    requestContactDetails: 'Dane kontaktowe zgłoszenia',
    portalAccountOwner: 'Konto portalu / właściciel',
    pixelringResponsible: 'Kontakt PixelRing',
    created: 'Utworzono',
    updated: 'Zaktualizowano',
    result: 'Wynik prac',
    noResult: 'Wynik nie został jeszcze udostępniony. PixelRing doda tę sekcję po zakończeniu lub aktualizacji pośredniej.',
    files: 'Twoje zdjęcia i pliki',
    noFiles: 'Brak zdjęć lub plików dla tego zgłoszenia.',
    nextStep: 'Następny krok',
    photoReport: 'Raport zdjęciowy PixelRing',
    customerData: 'Twoje dane',
    timeline: 'Historia statusu',
    notSpecified: 'Jeszcze nie podano',
    serviceTeam: 'Zespół serwisowy PixelRing',
    close: 'Do portalu',
    portalSubtitle: 'Portal klienta',
    edit: 'Edytuj',
    cancel: 'Anuluj',
    save: 'Zapisz',
    saving: 'Zapisywanie ...',
    saved: 'Dane zapisane.',
    unchanged: 'Nie wykryto zmian.',
    saveError: 'Nie udało się zapisać danych.',
    name: 'Osoba kontaktowa',
    email: 'E-mail',
    phone: 'Telefon',
    documentTypes: DOCUMENT_TYPES.pl,
    documentStatuses: DOCUMENT_STATUSES.pl,
    attachmentStatuses: ATTACHMENT_STATUSES.pl,
    chat: {
      authors: {
        CUSTOMER: 'Ty',
        OPERATOR: 'PixelRing',
        SYSTEM: 'Asystent',
      },
      supportTitle: 'Wsparcie techniczne',
      online: 'Online',
      newRequest: 'Nowe zgłoszenie',
      empty: 'Opisz problem albo wyślij zdjęcie.',
      loading: 'Ładowanie ...',
      attachTitle: 'Dodaj zdjęcie/wideo',
      voiceTitle: 'Wiadomość głosowa (wkrótce)',
      placeholder: 'Twoja wiadomość ...',
      unavailable: 'Czat jest teraz niedostępny.',
      photoFallback: 'Zdjęcie',
      attachmentFallback: 'Załącznik',
      attachmentReceived: 'Plik odebrany',
    },
    messageForm: {
      label: 'Wiadomość do PixelRing',
      placeholder: 'Napisz pytanie lub dodatkową informację do tego zgłoszenia.',
      attachmentNote: 'Załączniki zostaną dodane w osobnym bezpiecznym kroku.',
      sending: 'Wysyłanie ...',
      send: 'Wyślij wiadomość',
      saved: 'Wiadomość zapisana.',
      error: 'Nie udało się wysłać wiadomości.',
    },
  },
  ar: {
    back: 'العودة إلى البوابة',
    task: 'الطلب',
    requestFallback: 'الطلب',
    details: 'التفاصيل',
    description: 'الوصف الأصلي',
    address: 'العنوان / الموقع',
    requestContactPerson: 'جهة الاتصال للطلب',
    requestContactDetails: 'بيانات الاتصال للطلب',
    portalAccountOwner: 'حساب البوابة / المالك',
    pixelringResponsible: 'مسؤول PixelRing',
    created: 'تم الإنشاء',
    updated: 'تم التحديث',
    result: 'نتيجة العمل',
    noResult: 'لم يتم نشر نتيجة بعد. سيضيف PixelRing هذا القسم بعد الانتهاء أو عند وجود تحديث مرحلي.',
    files: 'صورك وملفاتك',
    noFiles: 'لا توجد صور أو ملفات لهذا الطلب بعد.',
    nextStep: 'الخطوة التالية',
    photoReport: 'تقرير صور PixelRing',
    customerData: 'بياناتك',
    timeline: 'سجل الحالة',
    notSpecified: 'لم يتم تحديده بعد',
    serviceTeam: 'فريق خدمة PixelRing',
    close: 'إلى البوابة',
    portalSubtitle: 'بوابة العميل',
    edit: 'تعديل',
    cancel: 'إلغاء',
    save: 'حفظ',
    saving: 'جار الحفظ ...',
    saved: 'تم حفظ البيانات.',
    unchanged: 'لا توجد تغييرات.',
    saveError: 'تعذر حفظ البيانات.',
    name: 'جهة الاتصال',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    documentTypes: DOCUMENT_TYPES.ar,
    documentStatuses: DOCUMENT_STATUSES.ar,
    attachmentStatuses: ATTACHMENT_STATUSES.ar,
    chat: {
      authors: {
        CUSTOMER: 'أنت',
        OPERATOR: 'PixelRing',
        SYSTEM: 'المساعد',
      },
      supportTitle: 'الدعم الفني',
      online: 'متصل',
      newRequest: 'طلب جديد',
      empty: 'صف المشكلة أو أرسل صورة.',
      loading: 'جار التحميل ...',
      attachTitle: 'إرفاق صورة/فيديو',
      voiceTitle: 'رسالة صوتية (قريبا)',
      placeholder: 'رسالتك ...',
      unavailable: 'الدردشة غير متاحة حاليا.',
      photoFallback: 'صورة',
      attachmentFallback: 'مرفق',
      attachmentReceived: 'تم استلام الملف',
    },
    messageForm: {
      label: 'رسالة إلى PixelRing',
      placeholder: 'اكتب سؤالا أو معلومات إضافية حول هذا الطلب.',
      attachmentNote: 'تتم إضافة الملفات في خطوة آمنة منفصلة.',
      sending: 'جار الإرسال ...',
      send: 'إرسال الرسالة',
      saved: 'تم حفظ الرسالة.',
      error: 'تعذر إرسال الرسالة.',
    },
  },
};

export function getPortalRequestDetailCopy(locale: string): PortalRequestDetailCopy {
  if (Object.prototype.hasOwnProperty.call(DETAIL_COPY, locale)) {
    return DETAIL_COPY[locale as PortalLocale];
  }

  return DETAIL_COPY.de;
}
