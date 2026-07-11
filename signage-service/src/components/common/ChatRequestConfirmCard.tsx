'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import type { IntakePrefill } from './ChatIntakeCard';
import LocationPicker, { type SelectedLocation } from './LocationPicker';
import { trackGoogleAdsLeadConversion } from '@/lib/google-ads';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Props = {
  prefill?: IntakePrefill;
  onSuccess?: (requestNumber: string) => void;
  onEditContact?: () => void;
};

function getConfirmCopy(locale: string) {
  if (locale === 'en') {
    return {
      title: 'Confirm new request',
      successTitle: 'New request registered',
      requestNumberLabel: 'Request number',
      successText: 'Your PR number has been created. You can check the status by link; the portal link prepares long-term access if shown.',
      emailStatus: 'Email',
      phoneStatus: 'Phone',
      nameStatus: 'Name',
      locationStatus: 'Location',
      summaryStatus: 'Request',
      available: 'available',
      missing: 'missing',
      optional: 'optional',
      captured: 'captured',
      describeBriefly: 'briefly describe',
      attachmentsHint: 'Chat files will be linked to this request.',
      emailLabel: 'Email for the request *',
      phoneLabel: 'Phone (optional)',
      emailPlaceholder: 'name@example.com',
      phonePlaceholder: '+49 ...',
      missingEmail: 'Please enter an email address to create the request. Phone is optional for operational contact.',
      invalidEmail: 'Please enter a valid email address. Phone is optional for operational contact.',
      namePlaceholder: 'Your name (optional)',
      locationPlaceholder: 'Address / location (optional)',
      helper: 'The PR number is created with email as the secure return channel. Phone is only a secondary operational contact.',
      submit: 'Send request',
      submitting: 'Sending ...',
      edit: 'Edit details',
      sendError: 'Error while sending.',
      chatRequestTypeFallback: 'Not specified',
      chatRequestPrefix: 'Chat request. Type:',
      statusLink: 'Check status',
      portalLink: 'Prepare customer portal',
    };
  }

  if (locale === 'ru') {
    return {
      title: 'Подтвердить новую заявку',
      successTitle: 'Новая заявка зарегистрирована',
      requestNumberLabel: 'Номер заявки',
      successText: 'PR-номер создан. Статус можно проверить по ссылке; ссылка кабинета подготовит долгосрочный доступ, если она показана.',
      emailStatus: 'Email',
      phoneStatus: 'Телефон',
      nameStatus: 'Имя',
      locationStatus: 'Адрес',
      summaryStatus: 'Задача',
      available: 'есть',
      missing: 'нужен',
      optional: 'необязательно',
      captured: 'описана',
      describeBriefly: 'кратко описать',
      attachmentsHint: 'Файлы из чата будут связаны с этой заявкой.',
      emailLabel: 'Email для заявки *',
      phoneLabel: 'Телефон (необязательно)',
      emailPlaceholder: 'name@example.com',
      phonePlaceholder: '+49 ...',
      missingEmail: 'Укажите email, чтобы создать заявку. Телефон можно оставить дополнительно для связи по работе.',
      invalidEmail: 'Укажите корректный email. Телефон можно оставить дополнительно для связи по работе.',
      namePlaceholder: 'Ваше имя (необязательно)',
      locationPlaceholder: 'Адрес / место (необязательно)',
      helper: 'PR-номер создается с email как безопасным каналом возврата. Телефон остается только дополнительным рабочим контактом.',
      submit: 'Отправить заявку',
      submitting: 'Отправляем ...',
      edit: 'Изменить детали',
      sendError: 'Ошибка при отправке.',
      chatRequestTypeFallback: 'Не указано',
      chatRequestPrefix: 'Заявка из чата. Тип:',
      statusLink: 'Проверить статус',
      portalLink: 'Подготовить личный кабинет',
    };
  }

  if (locale === 'tr') {
    return {
      title: 'Yeni talebi onayla',
      successTitle: 'Yeni talep kaydedildi',
      requestNumberLabel: 'Talep numarasi',
      successText: 'PR numarasi olusturuldu. Durum baglantidan kontrol edilebilir; portal baglantisi varsa uzun sureli erisimi hazirlar.',
      emailStatus: 'E-posta',
      phoneStatus: 'Telefon',
      nameStatus: 'Ad',
      locationStatus: 'Konum',
      summaryStatus: 'Talep',
      available: 'var',
      missing: 'eksik',
      optional: 'istege bagli',
      captured: 'kayitli',
      describeBriefly: 'kisaca acikla',
      attachmentsHint: 'Sohbet dosyalari bu talebe baglanacak.',
      emailLabel: 'Talep icin e-posta *',
      phoneLabel: 'Telefon (istege bagli)',
      emailPlaceholder: 'name@example.com',
      phonePlaceholder: '+49 ...',
      missingEmail: 'Talebi olusturmak icin e-posta girin. Telefon operasyonel iletisim icin istege baglidir.',
      invalidEmail: 'Gecerli bir e-posta girin. Telefon operasyonel iletisim icin istege baglidir.',
      namePlaceholder: 'Adiniz (istege bagli)',
      locationPlaceholder: 'Adres / konum (istege bagli)',
      helper: 'PR numarasi guvenli donus kanali olarak e-posta ile olusturulur. Telefon yalnizca ikincil operasyonel iletisimdir.',
      submit: 'Talebi gonder',
      submitting: 'Gonderiliyor ...',
      edit: 'Detaylari duzenle',
      sendError: 'Gonderirken hata olustu.',
      chatRequestTypeFallback: 'Belirtilmedi',
      chatRequestPrefix: 'Sohbet talebi. Tur:',
      statusLink: 'Durumu kontrol et',
      portalLink: 'Musteri portalini hazirla',
    };
  }

  if (locale === 'pl') {
    return {
      title: 'Potwierdz nowe zgloszenie',
      successTitle: 'Nowe zgloszenie zarejestrowane',
      requestNumberLabel: 'Numer zgloszenia',
      successText: 'Numer PR zostal utworzony. Status mozna sprawdzic przez link; link portalu przygotuje dlugoterminowy dostep, jesli jest pokazany.',
      emailStatus: 'E-mail',
      phoneStatus: 'Telefon',
      nameStatus: 'Imie',
      locationStatus: 'Lokalizacja',
      summaryStatus: 'Zgloszenie',
      available: 'jest',
      missing: 'brak',
      optional: 'opcjonalnie',
      captured: 'opisane',
      describeBriefly: 'krotko opisac',
      attachmentsHint: 'Pliki z chatu zostana polaczone z tym zgloszeniem.',
      emailLabel: 'E-mail do zgloszenia *',
      phoneLabel: 'Telefon (opcjonalnie)',
      emailPlaceholder: 'name@example.com',
      phonePlaceholder: '+49 ...',
      missingEmail: 'Podaj e-mail, aby utworzyc zgloszenie. Telefon jest opcjonalny do kontaktu operacyjnego.',
      invalidEmail: 'Podaj poprawny e-mail. Telefon jest opcjonalny do kontaktu operacyjnego.',
      namePlaceholder: 'Imie (opcjonalnie)',
      locationPlaceholder: 'Adres / lokalizacja (opcjonalnie)',
      helper: 'Numer PR jest tworzony z e-mailem jako bezpiecznym kanalem powrotu. Telefon jest tylko dodatkowym kontaktem operacyjnym.',
      submit: 'Wyslij zgloszenie',
      submitting: 'Wysylanie ...',
      edit: 'Edytuj szczegoly',
      sendError: 'Blad podczas wysylania.',
      chatRequestTypeFallback: 'Nie podano',
      chatRequestPrefix: 'Zgloszenie z chatu. Typ:',
      statusLink: 'Sprawdz status',
      portalLink: 'Przygotuj portal klienta',
    };
  }

  if (locale === 'ar') {
    return {
      title: 'تأكيد طلب جديد',
      successTitle: 'تم تسجيل الطلب الجديد',
      requestNumberLabel: 'رقم الطلب',
      successText: 'تم إنشاء رقم PR. يمكن التحقق من الحالة عبر الرابط؛ ورابط البوابة يجهز الوصول طويل الأمد إذا ظهر.',
      emailStatus: 'البريد الإلكتروني',
      phoneStatus: 'الهاتف',
      nameStatus: 'الاسم',
      locationStatus: 'الموقع',
      summaryStatus: 'الطلب',
      available: 'موجود',
      missing: 'ناقص',
      optional: 'اختياري',
      captured: 'مسجل',
      describeBriefly: 'وصف قصير',
      attachmentsHint: 'سيتم ربط ملفات الدردشة بهذا الطلب.',
      emailLabel: 'البريد الإلكتروني للطلب *',
      phoneLabel: 'الهاتف (اختياري)',
      emailPlaceholder: 'name@example.com',
      phonePlaceholder: '+49 ...',
      missingEmail: 'يرجى إدخال بريد إلكتروني لإنشاء الطلب. الهاتف اختياري للتواصل التشغيلي.',
      invalidEmail: 'يرجى إدخال بريد إلكتروني صالح. الهاتف اختياري للتواصل التشغيلي.',
      namePlaceholder: 'اسمك (اختياري)',
      locationPlaceholder: 'العنوان / الموقع (اختياري)',
      helper: 'يتم إنشاء رقم PR باستخدام البريد الإلكتروني كقناة عودة آمنة. الهاتف جهة اتصال تشغيلية إضافية فقط.',
      submit: 'إرسال الطلب',
      submitting: 'جار الإرسال ...',
      edit: 'تعديل التفاصيل',
      sendError: 'حدث خطأ أثناء الإرسال.',
      chatRequestTypeFallback: 'غير محدد',
      chatRequestPrefix: 'طلب من الدردشة. النوع:',
      statusLink: 'التحقق من الحالة',
      portalLink: 'تجهيز بوابة العميل',
    };
  }

  return {
    title: 'Neue Anfrage bestaetigen',
    successTitle: 'Neue Anfrage registriert',
    requestNumberLabel: 'Anfragenummer',
    successText: 'Ihre PR-Nummer wurde erstellt. Den Status koennen Sie per Link pruefen; der Portal-Link bereitet den langfristigen Zugang vor, falls er angezeigt wird.',
    emailStatus: 'E-Mail',
    phoneStatus: 'Telefon',
    nameStatus: 'Name',
    locationStatus: 'Standort',
    summaryStatus: 'Anliegen',
    available: 'vorhanden',
    missing: 'fehlt',
    optional: 'optional',
    captured: 'erfasst',
    describeBriefly: 'kurz beschreiben',
    attachmentsHint: 'Chat-Dateien werden mit dieser Anfrage verbunden.',
    emailLabel: 'E-Mail fuer die Anfrage *',
    phoneLabel: 'Telefon (optional)',
    emailPlaceholder: 'name@example.com',
    phonePlaceholder: '+49 ...',
    missingEmail: 'Bitte geben Sie eine E-Mail-Adresse an, um die Anfrage zu erstellen. Telefon ist nur ein optionaler Kontakt fuer Rueckfragen.',
    invalidEmail: 'Bitte geben Sie eine gueltige E-Mail-Adresse an. Telefon ist nur ein optionaler Kontakt fuer Rueckfragen.',
    namePlaceholder: 'Ihr Name (optional)',
    locationPlaceholder: 'Adresse / Standort (optional)',
    helper: 'Die PR-Nummer wird mit E-Mail als sicherem Rueckkanal erstellt. Telefon bleibt nur ein zweiter operativer Kontakt.',
    submit: 'Anfrage senden',
    submitting: 'Wird gesendet ...',
    edit: 'Details bearbeiten',
    sendError: 'Fehler beim Senden.',
    chatRequestTypeFallback: 'Nicht angegeben',
    chatRequestPrefix: 'Chat-Anfrage. Typ:',
    statusLink: 'Status pruefen',
    portalLink: 'Kundenportal vorbereiten',
  };
}

function getPrefillEmail(prefill?: IntakePrefill): string {
  if (prefill?.email?.trim()) return prefill.email;
  if (prefill?.contactMode === 'email' || prefill?.contact?.includes('@')) {
    return prefill.contact ?? '';
  }

  return '';
}

function getPrefillPhone(prefill?: IntakePrefill): string {
  if (prefill?.phone?.trim()) return prefill.phone;
  if (prefill?.contact && prefill.contactMode !== 'email' && !prefill.contact.includes('@')) {
    return prefill.contact;
  }

  return '';
}

export default function ChatRequestConfirmCard({
  prefill,
  onSuccess,
  onEditContact,
}: Props) {
  const locale = useLocale();
  const copy = getConfirmCopy(locale);
  const [email, setEmail] = useState(getPrefillEmail(prefill));
  const [phone, setPhone] = useState(getPrefillPhone(prefill));
  const [name, setName] = useState(prefill?.name ?? '');
  const [location, setLocation] = useState(prefill?.location ?? '');
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [requestNumber, setRequestNumber] = useState('');
  const [portalClaimUrl, setPortalClaimUrl] = useState('');

  const hasEmail = email.trim().length > 0;
  const hasPhone = phone.trim().length > 0;
  const hasName = name.trim().length > 0;
  const hasLocation = location.trim().length > 0;
  const hasSummary = Boolean(prefill?.summary?.trim());
  const shouldShowNameInput = !prefill?.name?.trim();
  const shouldShowLocationInput = !prefill?.location?.trim();

  const saveDraft = async () => {
    const fd = new FormData();
    fd.append('name', name);
    fd.append('contact', email);
    fd.append('email', email);
    fd.append('phone', phone);
    fd.append('customerEmail', email);
    fd.append('customerPhone', phone);
    fd.append('location', location);
    if (selectedLocation) {
      fd.append('locationLatitude', String(selectedLocation.latitude));
      fd.append('locationLongitude', String(selectedLocation.longitude));
      fd.append('locationSource', selectedLocation.source);
    }
    fd.append('issueType', prefill?.issueType ?? '');
    fd.append('summary', prefill?.summary ?? '');
    fd.append('locale', locale);

    await fetch('/api/chat/intake-draft', {
      method: 'POST',
      body: fd,
    }).catch(() => undefined);
  };

  const handleConfirm = async () => {
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();

    if (!cleanEmail) {
      setError(copy.missingEmail);
      return;
    }

    if (!EMAIL_REGEX.test(cleanEmail)) {
      setError(copy.invalidEmail);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const fd = new FormData();
      fd.append('name', name);
      fd.append('contact', cleanEmail);
      fd.append('email', cleanEmail);
      fd.append('phone', cleanPhone);
      fd.append('location', location);
      if (selectedLocation) {
        fd.append('locationLatitude', String(selectedLocation.latitude));
        fd.append('locationLongitude', String(selectedLocation.longitude));
        fd.append('locationSource', selectedLocation.source);
      }
      fd.append(
        'message',
        prefill?.summary
          ? `${copy.chatRequestPrefix} ${prefill.issueType || copy.chatRequestTypeFallback}\n\n${prefill.summary}`
          : `${copy.chatRequestPrefix} ${prefill?.issueType || copy.chatRequestTypeFallback}`
      );
      fd.append('issueType', prefill?.issueType ?? '');
      fd.append('isFromChat', 'true');

      const res = await fetch('/api/contact', { method: 'POST', body: fd });
      const data = await res.json() as { publicRequestNumber?: string; portalClaimUrl?: string; error?: string; code?: string };

      if (!res.ok || !data.publicRequestNumber) {
        if (data.code === 'verification_required' && data.error) {
          throw new Error(data.error);
        }

        if (res.status === 400) {
          throw new Error(copy.invalidEmail);
        }

        throw new Error(copy.sendError);
      }

      setRequestNumber(data.publicRequestNumber);
      setPortalClaimUrl(data.portalClaimUrl ?? '');
      setDone(true);
      trackGoogleAdsLeadConversion(data.publicRequestNumber);
      onSuccess?.(data.publicRequestNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : copy.sendError);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-[20px] border border-[#B8643E]/30 bg-[#FDF7F0] p-4 shadow-sm animate-in fade-in duration-500">
        <p className="text-[13px] font-bold text-[#0E1A2B]">{copy.successTitle}</p>
        <div className="mt-3 rounded-[12px] border border-[#E7DDD3] bg-white px-4 py-3 text-center">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#72665D]">{copy.requestNumberLabel}</p>
          <p className="text-xl font-black tracking-widest text-[#0E1A2B]">{requestNumber}</p>
        </div>
        <p className="mt-3 text-[12px] leading-relaxed text-[#72665D]">
          {copy.successText}
        </p>
        <a
          href={`/${locale}/status?request=${encodeURIComponent(requestNumber)}`}
          className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#B8643E] hover:underline"
        >
          {copy.statusLink} →
        </a>
        {portalClaimUrl && (
          <a
            href={portalClaimUrl}
            className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0E1A2B] hover:underline"
          >
            {copy.portalLink} →
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-[20px] border border-[#B8643E]/20 bg-[#FDF7F0] p-4 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-400">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#B8643E]/10">
          <svg className="h-3.5 w-3.5 text-[#B8643E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-[13px] font-bold text-[#0E1A2B]">{copy.title}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-[12px] bg-white/75 px-3 py-3 text-[12px] text-[#72665D]">
        <p>
          {copy.emailStatus}: <span className="font-semibold text-[#0E1A2B]">{hasEmail ? copy.available : copy.missing}</span>
        </p>
        <p>
          {copy.phoneStatus}: <span className="font-semibold text-[#0E1A2B]">{hasPhone ? copy.available : copy.optional}</span>
        </p>
        <p>
          {copy.nameStatus}: <span className="font-semibold text-[#0E1A2B]">{hasName ? copy.available : copy.optional}</span>
        </p>
        <p>
          {copy.locationStatus}: <span className="font-semibold text-[#0E1A2B]">{hasLocation ? copy.available : copy.optional}</span>
        </p>
        <p>
          {copy.summaryStatus}: <span className="font-semibold text-[#0E1A2B]">{hasSummary ? copy.captured : copy.describeBriefly}</span>
        </p>
        {prefill?.hasSessionAttachments && (
          <p className="col-span-2">{copy.attachmentsHint}</p>
        )}
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-[#72665D]">
            {copy.emailLabel}
          </label>
          <input
            type="email"
            aria-required="true"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={() => void saveDraft()}
            placeholder={copy.emailPlaceholder}
            dir="ltr"
            className="w-full rounded-[12px] border border-[#E7DDD3] bg-white px-3 py-2 text-[13px] text-[#0E1A2B] placeholder-[#72665D]/40 focus:border-[#B8643E] focus:outline-none"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wide text-[#72665D]">
            {copy.phoneLabel}
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={() => void saveDraft()}
            placeholder={copy.phonePlaceholder}
            dir="ltr"
            className="w-full rounded-[12px] border border-[#E7DDD3] bg-white px-3 py-2 text-[13px] text-[#0E1A2B] placeholder-[#72665D]/40 focus:border-[#B8643E] focus:outline-none"
          />
        </div>
      </div>

      {(shouldShowNameInput || shouldShowLocationInput) && (
        <div className="grid gap-2 sm:grid-cols-2">
          {shouldShowNameInput && (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => void saveDraft()}
              placeholder={copy.namePlaceholder}
              className="w-full rounded-[12px] border border-[#E7DDD3] bg-white px-3 py-2 text-[13px] text-[#0E1A2B] placeholder-[#72665D]/40 focus:border-[#B8643E] focus:outline-none"
            />
          )}
          {shouldShowLocationInput && (
            <LocationPicker
              value={location}
              onChange={setLocation}
              onLocationSelect={setSelectedLocation}
              onBlur={() => void saveDraft()}
              placeholder={copy.locationPlaceholder}
              className="w-full rounded-[12px] border border-[#E7DDD3] bg-white px-3 py-2 text-[13px] text-[#0E1A2B] placeholder-[#72665D]/40 focus:border-[#B8643E] focus:outline-none"
            />
          )}
        </div>
      )}

      <p className="rounded-[10px] bg-white/70 px-3 py-2 text-[12px] leading-relaxed text-[#72665D]">
        {copy.helper}
      </p>

      {error && <p className="rounded-[10px] bg-red-50 px-3 py-2 text-[12px] text-red-600">{error}</p>}

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => void handleConfirm()}
          disabled={submitting}
          className="flex-1 rounded-[14px] bg-[#0E1A2B] py-2.5 text-[13px] font-bold text-white transition-all hover:bg-[#1a2e47] active:scale-[0.98] disabled:opacity-50"
        >
          {submitting ? copy.submitting : copy.submit}
        </button>
        <button
          type="button"
          onClick={onEditContact}
          className="rounded-[14px] border border-[#E7DDD3] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#72665D] transition-colors hover:border-[#B8643E]"
        >
          {copy.edit}
        </button>
      </div>
    </div>
  );
}
