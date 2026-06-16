'use client';

import { useRef, useState, type FormEvent } from 'react';

import LocationPicker, { type SelectedLocation } from '@/components/common/LocationPicker';

type TelegramRequestFormProps = {
  token: string;
  locale: string;
};

type Copy = {
  name: string;
  contact: string;
  issueType: string;
  location: string;
  message: string;
  attach: string;
  submit: string;
  privacy: string;
  successTitle: string;
  successText: string;
  errorGeneric: string;
  issues: string[];
};

const COPY: Record<string, Copy> = {
  de: {
    name: 'Name / Firma',
    contact: 'E-Mail oder Telefon',
    issueType: 'Art der Anfrage',
    location: 'Adresse oder Ort',
    message: 'Was ist passiert?',
    attach: 'Foto oder Video hinzufuegen',
    submit: 'Anfrage senden',
    privacy: 'Die Daten werden von PixelRing zur Bearbeitung Ihrer Anfrage verarbeitet. Telegram wird nur fuer die Fortsetzung des Dialogs genutzt.',
    successTitle: 'Anfrage gesendet',
    successText: 'Wir leiten Sie zurueck zu Telegram.',
    errorGeneric: 'Die Anfrage konnte nicht gesendet werden. Bitte pruefen Sie die Eingaben.',
    issues: ['Reparatur', 'Montage', 'Wartung', 'Lichtwerbung', 'Branding', 'Sonstiges'],
  },
  en: {
    name: 'Name / company',
    contact: 'Email or phone',
    issueType: 'Request type',
    location: 'Address or location',
    message: 'What happened?',
    attach: 'Add photo or video',
    submit: 'Send request',
    privacy: 'PixelRing processes this data for your request. Telegram is used only to continue the conversation.',
    successTitle: 'Request sent',
    successText: 'We are taking you back to Telegram.',
    errorGeneric: 'The request could not be sent. Please check the form.',
    issues: ['Repair', 'Installation', 'Maintenance', 'Illuminated advertising', 'Branding', 'Other'],
  },
  ru: {
    name: 'Имя / компания',
    contact: 'E-mail или телефон',
    issueType: 'Тип заявки',
    location: 'Адрес или место',
    message: 'Что произошло?',
    attach: 'Добавить фото или видео',
    submit: 'Отправить заявку',
    privacy: 'PixelRing обрабатывает эти данные для заявки. Telegram используется только для продолжения диалога.',
    successTitle: 'Заявка отправлена',
    successText: 'Возвращаем вас в Telegram.',
    errorGeneric: 'Не удалось отправить заявку. Проверьте поля формы.',
    issues: ['Ремонт', 'Монтаж', 'Обслуживание', 'Световая реклама', 'Брендинг', 'Другое'],
  },
  tr: {
    name: 'Ad / sirket',
    contact: 'E-posta veya telefon',
    issueType: 'Talep turu',
    location: 'Adres veya konum',
    message: 'Ne oldu?',
    attach: 'Foto veya video ekle',
    submit: 'Talebi gonder',
    privacy: 'PixelRing bu verileri talebiniz icin isler. Telegram yalnizca gorusmeye devam etmek icin kullanilir.',
    successTitle: 'Talep gonderildi',
    successText: 'Sizi Telegrama geri yonlendiriyoruz.',
    errorGeneric: 'Talep gonderilemedi. Lutfen formu kontrol edin.',
    issues: ['Onarim', 'Montaj', 'Bakim', 'Isikli reklam', 'Markalama', 'Diger'],
  },
  pl: {
    name: 'Imie / firma',
    contact: 'E-mail lub telefon',
    issueType: 'Typ zgloszenia',
    location: 'Adres lub lokalizacja',
    message: 'Co sie stalo?',
    attach: 'Dodaj zdjecie lub wideo',
    submit: 'Wyslij zgloszenie',
    privacy: 'PixelRing przetwarza te dane w celu obslugi zgloszenia. Telegram sluzy tylko do kontynuacji rozmowy.',
    successTitle: 'Zgloszenie wyslane',
    successText: 'Przekierowujemy Cie z powrotem do Telegrama.',
    errorGeneric: 'Nie udalo sie wyslac zgloszenia. Sprawdz formularz.',
    issues: ['Naprawa', 'Montaz', 'Serwis', 'Reklama swietlna', 'Branding', 'Inne'],
  },
  ar: {
    name: 'الاسم / الشركة',
    contact: 'البريد الإلكتروني أو الهاتف',
    issueType: 'نوع الطلب',
    location: 'العنوان أو الموقع',
    message: 'ماذا حدث؟',
    attach: 'إضافة صورة أو فيديو',
    submit: 'إرسال الطلب',
    privacy: 'تعالج PixelRing هذه البيانات للطلب. يستخدم Telegram فقط لمتابعة المحادثة.',
    successTitle: 'تم إرسال الطلب',
    successText: 'نعيدك إلى Telegram.',
    errorGeneric: 'تعذر إرسال الطلب. يرجى التحقق من النموذج.',
    issues: ['إصلاح', 'تركيب', 'صيانة', 'إعلان مضيء', 'هوية بصرية', 'أخرى'],
  },
};

function getCopy(locale: string): Copy {
  return COPY[locale] ?? COPY.de;
}

export default function TelegramRequestForm({ token, locale }: TelegramRequestFormProps) {
  const copy = getCopy(locale);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [issueType, setIssueType] = useState('');
  const [location, setLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const validFiles = Array.from(fileList).filter((file) => file.size > 0 && file.size <= 20 * 1024 * 1024);
    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, currentIndex) => currentIndex !== index));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.set('token', token);
      formData.set('name', name);
      formData.set('contact', contact);
      formData.set('issueType', issueType);
      formData.set('location', location);
      formData.set('message', message);
      if (selectedLocation) {
        formData.set('locationLatitude', String(selectedLocation.latitude));
        formData.set('locationLongitude', String(selectedLocation.longitude));
        formData.set('locationSource', selectedLocation.source);
      }
      files.forEach((file) => formData.append('files', file));

      const response = await fetch('/api/telegram/intake/submit', {
        method: 'POST',
        body: formData,
      });
      const data = (await response.json().catch(() => null)) as {
        error?: string;
        returnPath?: string;
        telegramReturnUrl?: string;
      } | null;

      if (!response.ok) {
        throw new Error(data?.error || copy.errorGeneric);
      }

      setIsSuccess(true);
      window.setTimeout(() => {
        window.location.assign(data?.returnPath || data?.telegramReturnUrl || '/');
      }, 700);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : copy.errorGeneric);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-[28px] border border-[#E7DDD3] bg-white p-8 text-center shadow-[0_24px_70px_rgba(14,26,43,0.12)]">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#B8643E]/10 text-2xl font-black text-[#B8643E]">
          ✓
        </div>
        <h2 className="text-2xl font-black text-[#0E1A2B]">{copy.successTitle}</h2>
        <p className="mt-3 text-sm leading-6 text-[#72665D]">{copy.successText}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[28px] border border-[#E7DDD3] bg-white p-4 shadow-[0_24px_70px_rgba(14,26,43,0.12)] sm:p-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder={copy.name}
          autoComplete="name"
          className="min-h-12 rounded-2xl border border-[#E7DDD3] bg-[#F7F1E8]/60 px-4 text-[15px] text-[#0E1A2B] outline-none transition focus:border-[#B8643E] focus:bg-white"
        />
        <input
          required
          value={contact}
          onChange={(event) => setContact(event.target.value)}
          placeholder={copy.contact}
          autoComplete="off"
          className="min-h-12 rounded-2xl border border-[#E7DDD3] bg-[#F7F1E8]/60 px-4 text-[15px] text-[#0E1A2B] outline-none transition focus:border-[#B8643E] focus:bg-white"
        />
        <select
          value={issueType}
          onChange={(event) => setIssueType(event.target.value)}
          className="min-h-12 rounded-2xl border border-[#E7DDD3] bg-[#F7F1E8]/60 px-4 text-[15px] text-[#0E1A2B] outline-none transition focus:border-[#B8643E] focus:bg-white"
        >
          <option value="">{copy.issueType}</option>
          {copy.issues.map((issue) => (
            <option key={issue} value={issue}>{issue}</option>
          ))}
        </select>
        <div className="relative z-20">
          <LocationPicker
            value={location}
            onChange={setLocation}
            onLocationSelect={setSelectedLocation}
            placeholder={copy.location}
            ariaLabel={copy.location}
            variant="light"
            dropdownPosition="bottom"
            className="min-h-12 w-full rounded-2xl border border-[#E7DDD3] bg-[#F7F1E8]/60 px-4 text-[15px] text-[#0E1A2B] outline-none transition focus:border-[#B8643E] focus:bg-white"
          />
        </div>
      </div>

      <textarea
        required
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder={copy.message}
        rows={5}
        className="mt-3 min-h-32 w-full resize-none rounded-2xl border border-[#E7DDD3] bg-[#F7F1E8]/60 px-4 py-3 text-[15px] text-[#0E1A2B] outline-none transition focus:border-[#B8643E] focus:bg-white"
      />

      {files.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {files.map((file, index) => (
            <span key={`${file.name}-${index}`} className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#E7DDD3] bg-[#F7F1E8] px-3 py-1.5 text-xs font-semibold text-[#72665D]">
              <span className="max-w-[180px] truncate">{file.name}</span>
              <button type="button" onClick={() => removeFile(index)} className="text-[#B8643E]" aria-label={file.name}>
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="min-h-12 flex-1 rounded-2xl border border-dashed border-[#D7C8BA] bg-[#F7F1E8] px-4 text-sm font-bold text-[#72665D] transition hover:bg-[#F0E6D8]"
        >
          {copy.attach}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={(event) => {
            handleFiles(event.target.files);
            event.target.value = '';
          }}
          className="hidden"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-12 flex-[1.3] rounded-2xl bg-[#0E1A2B] px-5 text-sm font-black text-white transition hover:bg-[#1A2E47] disabled:opacity-60"
        >
          {isSubmitting ? '...' : copy.submit}
        </button>
      </div>

      {errorMessage && (
        <p className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <p className="mt-4 border-t border-[#E7DDD3] pt-3 text-[11px] leading-5 text-[#72665D]">
        {copy.privacy}
      </p>
    </form>
  );
}
