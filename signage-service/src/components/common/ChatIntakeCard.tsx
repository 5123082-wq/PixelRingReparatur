'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { trackGoogleAdsLeadConversion } from '@/lib/google-ads';
import LocationPicker, { type SelectedLocation } from './LocationPicker';

type ContactMode = 'phone' | 'email';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type IntakePrefill = {
  issueType?: string;
  contact?: string;
  contactMode?: ContactMode;
  email?: string;
  phone?: string;
  name?: string;
  location?: string;
  summary?: string;
  hasSessionAttachments?: boolean;
  needsPhoto?: boolean;
  hasKnownSessionContact?: boolean;
};

type Props = {
  prefill?: IntakePrefill;
  onSuccess?: (requestNumber: string) => void;
};

function getChatIntakeCopy(locale: string) {
  if (locale === 'en') {
    return {
      issueTypes: ['Repair', 'Installation', 'New signage', 'Branding', 'Illuminated advertising', 'Maintenance', 'Other'],
      successTitle: 'Request registered successfully',
      requestNumberLabel: 'Your request number',
      successText: 'Your PR number has been created. You can check the status by link; the portal link prepares long-term access if shown.',
      trackStatus: 'Check status',
      portalSetup: 'Set up customer portal access',
      missingEmail: 'Please enter an email address to create the request. Phone is optional for operational contact.',
      invalidEmail: 'Please enter a valid email address. Phone is optional for operational contact.',
      chatRequestTypeFallback: 'Not specified',
      chatRequestPrefix: 'Chat request. Type:',
      sendError: 'Error while sending.',
      formTitle: 'Start service',
      attachmentsHint: 'Files already sent in chat will be attached to this request.',
      photoHint: 'A photo or short video is optional, but it helps with diagnostics.',
      issueTypeLabel: 'Request type',
      issueTypePlaceholder: 'Please choose…',
      emailLabel: 'Email for the request *',
      emailHelp: 'Used to create the PR request and prepare customer portal access.',
      phoneLabel: 'Phone (optional)',
      phoneHelp: 'Only for operational follow-up. It does not replace email for this request.',
      namePlaceholder: 'Your name (optional)',
      locationPlaceholder: 'Address / location (optional)',
      attachMedia: 'Attach photo/video',
      submit: 'Send request →',
    };
  }

  if (locale === 'ru') {
    return {
      issueTypes: ['Ремонт', 'Монтаж', 'Новая вывеска', 'Брендинг', 'Световая реклама', 'Обслуживание', 'Другое'],
      successTitle: 'Заявка зарегистрирована',
      requestNumberLabel: 'Номер заявки',
      successText: 'PR-номер создан. Статус можно проверить по ссылке; ссылка кабинета подготовит долгосрочный доступ, если она показана.',
      trackStatus: 'Проверить статус',
      portalSetup: 'Подготовить личный кабинет',
      missingEmail: 'Укажите email, чтобы создать заявку. Телефон можно оставить дополнительно для связи по работе.',
      invalidEmail: 'Укажите корректный email. Телефон можно оставить дополнительно для связи по работе.',
      chatRequestTypeFallback: 'Не указано',
      chatRequestPrefix: 'Заявка из чата. Тип:',
      sendError: 'Ошибка при отправке.',
      formTitle: 'Запустить сервис',
      attachmentsHint: 'Файлы, уже отправленные в чат, будут прикреплены к этой заявке.',
      photoHint: 'Фото или короткое видео необязательны, но помогают с диагностикой.',
      issueTypeLabel: 'Тип заявки',
      issueTypePlaceholder: 'Выберите…',
      emailLabel: 'Email для заявки *',
      emailHelp: 'Нужен для создания PR-заявки и подготовки доступа в личный кабинет.',
      phoneLabel: 'Телефон (необязательно)',
      phoneHelp: 'Только для оперативной связи. Телефон не заменяет email для этой заявки.',
      namePlaceholder: 'Ваше имя (необязательно)',
      locationPlaceholder: 'Адрес / место (необязательно)',
      attachMedia: 'Прикрепить фото/видео',
      submit: 'Отправить заявку →',
    };
  }

  if (locale === 'tr') {
    return {
      issueTypes: ['Onarim', 'Montaj', 'Yeni tabela', 'Markalama', 'Isikli reklam', 'Bakim', 'Diger'],
      successTitle: 'Talep kaydedildi',
      requestNumberLabel: 'Talep numaraniz',
      successText: 'PR numarasi olusturuldu. Durum baglantidan kontrol edilebilir; portal baglantisi varsa uzun sureli erisimi hazirlar.',
      trackStatus: 'Durumu kontrol et',
      portalSetup: 'Musteri portalini hazirla',
      missingEmail: 'Talebi olusturmak icin e-posta girin. Telefon operasyonel iletisim icin istege baglidir.',
      invalidEmail: 'Gecerli bir e-posta girin. Telefon operasyonel iletisim icin istege baglidir.',
      chatRequestTypeFallback: 'Belirtilmedi',
      chatRequestPrefix: 'Sohbet talebi. Tur:',
      sendError: 'Gonderirken hata olustu.',
      formTitle: 'Servisi baslat',
      attachmentsHint: 'Sohbette gonderilen dosyalar bu talebe eklenecek.',
      photoHint: 'Foto veya kisa video istege baglidir, ancak ariza tespitine yardim eder.',
      issueTypeLabel: 'Talep turu',
      issueTypePlaceholder: 'Lutfen secin…',
      emailLabel: 'Talep icin e-posta *',
      emailHelp: 'PR talebini olusturmak ve musteri portali erisimini hazirlamak icin kullanilir.',
      phoneLabel: 'Telefon (istege bagli)',
      phoneHelp: 'Yalnizca operasyonel iletisim icindir. Bu talepte e-postanin yerine gecmez.',
      namePlaceholder: 'Adiniz (istege bagli)',
      locationPlaceholder: 'Adres / konum (istege bagli)',
      attachMedia: 'Foto/video ekle',
      submit: 'Talebi gonder →',
    };
  }

  if (locale === 'pl') {
    return {
      issueTypes: ['Naprawa', 'Montaz', 'Nowy szyld', 'Branding', 'Reklama swietlna', 'Serwis', 'Inne'],
      successTitle: 'Zgloszenie zarejestrowane',
      requestNumberLabel: 'Numer zgloszenia',
      successText: 'Numer PR zostal utworzony. Status mozna sprawdzic przez link; link portalu przygotuje dlugoterminowy dostep, jesli jest pokazany.',
      trackStatus: 'Sprawdz status',
      portalSetup: 'Przygotuj dostep do portalu',
      missingEmail: 'Podaj e-mail, aby utworzyc zgloszenie. Telefon jest opcjonalny do kontaktu operacyjnego.',
      invalidEmail: 'Podaj poprawny e-mail. Telefon jest opcjonalny do kontaktu operacyjnego.',
      chatRequestTypeFallback: 'Nie podano',
      chatRequestPrefix: 'Zgloszenie z chatu. Typ:',
      sendError: 'Blad podczas wysylania.',
      formTitle: 'Rozpocznij serwis',
      attachmentsHint: 'Pliki wyslane juz w chacie zostana dolaczone do tego zgloszenia.',
      photoHint: 'Zdjecie lub krotkie wideo jest opcjonalne, ale pomaga w diagnostyce.',
      issueTypeLabel: 'Typ zgloszenia',
      issueTypePlaceholder: 'Wybierz…',
      emailLabel: 'E-mail do zgloszenia *',
      emailHelp: 'Sluzy do utworzenia zgloszenia PR i przygotowania dostepu do portalu klienta.',
      phoneLabel: 'Telefon (opcjonalnie)',
      phoneHelp: 'Tylko do kontaktu operacyjnego. Nie zastepuje e-maila w tym zgloszeniu.',
      namePlaceholder: 'Imie (opcjonalnie)',
      locationPlaceholder: 'Adres / lokalizacja (opcjonalnie)',
      attachMedia: 'Dodaj foto/wideo',
      submit: 'Wyslij zgloszenie →',
    };
  }

  if (locale === 'ar') {
    return {
      issueTypes: ['إصلاح', 'تركيب', 'لافتة جديدة', 'هوية بصرية', 'إعلان مضيء', 'صيانة', 'أخرى'],
      successTitle: 'تم تسجيل الطلب',
      requestNumberLabel: 'رقم الطلب',
      successText: 'تم إنشاء رقم PR. يمكن التحقق من الحالة عبر الرابط؛ ورابط البوابة يجهز الوصول طويل الأمد إذا ظهر.',
      trackStatus: 'التحقق من الحالة',
      portalSetup: 'تجهيز بوابة العميل',
      missingEmail: 'يرجى إدخال بريد إلكتروني لإنشاء الطلب. الهاتف اختياري للتواصل التشغيلي.',
      invalidEmail: 'يرجى إدخال بريد إلكتروني صالح. الهاتف اختياري للتواصل التشغيلي.',
      chatRequestTypeFallback: 'غير محدد',
      chatRequestPrefix: 'طلب من الدردشة. النوع:',
      sendError: 'حدث خطأ أثناء الإرسال.',
      formTitle: 'بدء الخدمة',
      attachmentsHint: 'سيتم ربط الملفات المرسلة في الدردشة بهذا الطلب.',
      photoHint: 'الصورة أو الفيديو القصير اختياريان، لكنهما يساعدان في التشخيص.',
      issueTypeLabel: 'نوع الطلب',
      issueTypePlaceholder: 'يرجى الاختيار…',
      emailLabel: 'البريد الإلكتروني للطلب *',
      emailHelp: 'يستخدم لإنشاء طلب PR وتجهيز الوصول إلى بوابة العميل.',
      phoneLabel: 'الهاتف (اختياري)',
      phoneHelp: 'للتواصل التشغيلي فقط. لا يحل محل البريد الإلكتروني لهذا الطلب.',
      namePlaceholder: 'اسمك (اختياري)',
      locationPlaceholder: 'العنوان / الموقع (اختياري)',
      attachMedia: 'إرفاق صورة/فيديو',
      submit: 'إرسال الطلب ←',
    };
  }

  return {
    issueTypes: ['Reparatur', 'Montage', 'Neue Beschilderung', 'Branding', 'Lichterwerbung', 'Wartung', 'Sonstiges'],
    successTitle: 'Anfrage erfolgreich registriert',
    requestNumberLabel: 'Ihre Anfragenummer',
    successText: 'Ihre PR-Nummer wurde erstellt. Den Status koennen Sie per Link pruefen; der Portal-Link bereitet den langfristigen Zugang vor, falls er angezeigt wird.',
    trackStatus: 'Status pruefen',
    portalSetup: 'Kundenportal vorbereiten',
    missingEmail: 'Bitte geben Sie eine E-Mail-Adresse an, um die Anfrage zu erstellen. Telefon ist nur ein optionaler Kontakt fuer Rueckfragen.',
    invalidEmail: 'Bitte geben Sie eine gueltige E-Mail-Adresse an. Telefon ist nur ein optionaler Kontakt fuer Rueckfragen.',
    chatRequestTypeFallback: 'Nicht angegeben',
    chatRequestPrefix: 'Chat-Anfrage. Typ:',
    sendError: 'Fehler beim Senden.',
    formTitle: 'Service starten',
    attachmentsHint: 'Bereits im Chat gesendete Dateien werden mit dieser Anfrage verbunden.',
    photoHint: 'Ein Foto oder kurzes Video ist optional, hilft aber bei der Diagnose.',
    issueTypeLabel: 'Art der Anfrage',
    issueTypePlaceholder: 'Bitte wählen …',
    emailLabel: 'E-Mail fuer die Anfrage *',
    emailHelp: 'Wird fuer die PR-Anfrage und die Vorbereitung des Kundenportal-Zugangs verwendet.',
    phoneLabel: 'Telefon (optional)',
    phoneHelp: 'Nur fuer operative Rueckfragen. Telefon ersetzt die E-Mail fuer diese Anfrage nicht.',
    namePlaceholder: 'Ihr Name (optional)',
    locationPlaceholder: 'Adresse / Standort (optional)',
    attachMedia: 'Foto/Video anhängen',
    submit: 'Anfrage senden →',
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

export default function ChatIntakeCard({ prefill, onSuccess }: Props) {
  const locale = useLocale();
  const copy = getChatIntakeCopy(locale);
  const [email, setEmail] = useState(getPrefillEmail(prefill));
  const [phone, setPhone] = useState(getPrefillPhone(prefill));
  const [name, setName] = useState(prefill?.name ?? '');
  const [location, setLocation] = useState(prefill?.location ?? '');
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [issueType, setIssueType] = useState(prefill?.issueType ?? '');
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [requestNumber, setRequestNumber] = useState('');
  const [portalClaimUrl, setPortalClaimUrl] = useState('');
  const fileRef = React.useRef<HTMLInputElement>(null);

  const saveDraft = async () => {
    const fd = new FormData();
    fd.append('name', name);
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
    fd.append('issueType', issueType);
    fd.append('summary', prefill?.summary ?? '');
    fd.append('locale', locale);

    await fetch('/api/chat/intake-draft', {
      method: 'POST',
      body: fd,
    }).catch(() => undefined);
  };

  if (done) {
    return (
      <div className="rounded-[20px] border border-[#B8643E]/30 bg-[#FDF7F0] p-4 shadow-sm animate-in fade-in duration-500">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-[#B8643E]/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-[#B8643E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-[13px] font-bold text-[#0E1A2B]">{copy.successTitle}</p>
        </div>
        <div className="rounded-[12px] bg-white border border-[#E7DDD3] px-4 py-3 mb-3 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#72665D] mb-1">{copy.requestNumberLabel}</p>
          <p className="text-xl font-black tracking-widest text-[#0E1A2B]">{requestNumber}</p>
        </div>
        <p className="text-[12px] text-[#72665D] leading-relaxed">
          {copy.successText}
        </p>
        <a
          href={`/${locale}/status?request=${encodeURIComponent(requestNumber)}`}
          className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#B8643E] hover:underline"
        >
          {copy.trackStatus} →
        </a>
        {portalClaimUrl && (
          <a
            href={portalClaimUrl}
            className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#0E1A2B] hover:underline"
          >
            {copy.portalSetup} →
          </a>
        )}
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();

    if (!cleanEmail) { setError(copy.missingEmail); return; }
    if (!EMAIL_REGEX.test(cleanEmail)) { setError(copy.invalidEmail); return; }
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
          ? `${copy.chatRequestPrefix} ${issueType || copy.chatRequestTypeFallback}\n\n${prefill.summary}`
          : `${copy.chatRequestPrefix} ${issueType || copy.chatRequestTypeFallback}`
      );
      fd.append('issueType', issueType);
      fd.append('isFromChat', 'true');
      files.forEach(f => fd.append('files', f));

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

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="rounded-[20px] border border-[#B8643E]/20 bg-[#FDF7F0] p-3.5 shadow-sm space-y-2.5 animate-in fade-in slide-in-from-bottom-2 duration-400"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-[#B8643E]/10 flex items-center justify-center">
          <svg className="w-3.5 h-3.5 text-[#B8643E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-[13px] font-bold text-[#0E1A2B]">{copy.formTitle}</p>
      </div>

      {prefill?.hasSessionAttachments && (
        <p className="rounded-[10px] bg-white/70 px-3 py-2 text-[12px] text-[#72665D]">
          {copy.attachmentsHint}
        </p>
      )}

      {prefill?.needsPhoto && (
        <p className="rounded-[10px] bg-white/70 px-3 py-2 text-[12px] text-[#72665D]">
          {copy.photoHint}
        </p>
      )}

      {/* Issue type */}
      <div>
        <label className="text-[11px] font-semibold uppercase tracking-wide text-[#72665D] mb-1 block">{copy.issueTypeLabel}</label>
        <select
          value={issueType}
          onChange={e => setIssueType(e.target.value)}
          className="w-full px-3 py-2 text-[13px] rounded-[12px] border border-[#E7DDD3] bg-white text-[#0E1A2B] focus:outline-none focus:border-[#B8643E] appearance-none"
        >
          <option value="">{copy.issueTypePlaceholder}</option>
          {copy.issueTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wide text-[#72665D] mb-1 block">{copy.emailLabel}</label>
          <input
            type="email"
            aria-required="true"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onBlur={() => void saveDraft()}
            placeholder="name@example.com"
            dir="ltr"
            className="w-full px-3 py-2 text-[13px] rounded-[12px] border border-[#E7DDD3] bg-white text-[#0E1A2B] focus:outline-none focus:border-[#B8643E] placeholder-[#72665D]/40"
          />
          <p className="mt-1 text-[10px] leading-4 text-[#72665D]">{copy.emailHelp}</p>
        </div>
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wide text-[#72665D] mb-1 block">{copy.phoneLabel}</label>
          <input
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            onBlur={() => void saveDraft()}
            placeholder="+49 …"
            dir="ltr"
            className="w-full px-3 py-2 text-[13px] rounded-[12px] border border-[#E7DDD3] bg-white text-[#0E1A2B] focus:outline-none focus:border-[#B8643E] placeholder-[#72665D]/40"
          />
          <p className="mt-1 text-[10px] leading-4 text-[#72665D]">{copy.phoneHelp}</p>
        </div>
      </div>

      {/* Name optional */}
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        onBlur={() => void saveDraft()}
        placeholder={copy.namePlaceholder}
        className="w-full px-3 py-2 text-[13px] rounded-[12px] border border-[#E7DDD3] bg-white text-[#0E1A2B] focus:outline-none focus:border-[#B8643E] placeholder-[#72665D]/40"
      />

      {/* Location optional */}
      <LocationPicker
        value={location}
        onChange={setLocation}
        onLocationSelect={setSelectedLocation}
        onBlur={() => void saveDraft()}
        placeholder={copy.locationPlaceholder}
        className="w-full px-3 py-2 text-[13px] rounded-[12px] border border-[#E7DDD3] bg-white text-[#0E1A2B] focus:outline-none focus:border-[#B8643E] placeholder-[#72665D]/40"
      />

      {/* File attach */}
      <div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 text-[12px] text-[#72665D] hover:text-[#B8643E] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          {copy.attachMedia}
        </button>
        <input ref={fileRef} type="file" accept="image/*,video/*" multiple className="hidden"
          onChange={e => setFiles(prev => [...prev, ...Array.from(e.target.files ?? [])])} />
        {files.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {files.map((f, i) => (
              <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/5 text-[11px] text-[#72665D]">
                {f.name.slice(0, 20)}
                <button type="button" onClick={() => setFiles(p => p.filter((_, j) => j !== i))} className="text-black/40 hover:text-black/70">×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-[12px] text-red-600 rounded-[10px] bg-red-50 px-3 py-2">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-2.5 rounded-[14px] bg-[#0E1A2B] hover:bg-[#1a2e47] text-white text-[13px] font-bold transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {submitting
          ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          : copy.submit}
      </button>
    </form>
  );
}
