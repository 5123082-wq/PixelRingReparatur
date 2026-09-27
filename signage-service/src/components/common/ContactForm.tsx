'use client';

import React, { useId, useRef, useState, useEffect } from 'react';
import { ArrowRightIcon, ChevronDownIcon, PaperClipIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { getRequestReceiptCopy } from '@/lib/request-receipt-copy';
import { trackGoogleAdsLeadConversion } from '@/lib/google-ads';
import {
  CALCULATION_SNAPSHOT_FORM_FIELD,
  serializeCalculationSnapshot,
  type CalculationSnapshot,
} from '@/lib/calculation-snapshot';
import LocationPicker, { type SelectedLocation } from './LocationPicker';
import RequestEmailVerification, { useRequestEmailVerification } from './RequestEmailVerification';
import RequestAccountNotice, { useRequestAccount } from './RequestAccountNotice';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactFormProps {
  onSuccess?: (publicRequestNumber: string) => void;
  variant?: 'light' | 'dark';
  layout?: 'single' | 'two-column';
  dropdownPosition?: 'top' | 'bottom';
  initialIssueType?: string;
  initialMessage?: string;
  calculationSnapshot?: CalculationSnapshot | null;
  containedScroll?: boolean;
  compact?: boolean;
}

const ContactForm = ({
  onSuccess,
  variant = 'light',
  layout = 'single',
  dropdownPosition = 'bottom',
  initialIssueType = '',
  initialMessage = '',
  calculationSnapshot = null,
  containedScroll = false,
  compact = false,
}: ContactFormProps) => {
  const t = useTranslations('ContactModal');
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [publicRequestNumber, setPublicRequestNumber] = useState('');
  const [portalLinked, setPortalLinked] = useState(false);
  const receiptCopy = getRequestReceiptCopy(locale);
  const [errorMessage, setErrorMessage] = useState('');
  const [name, setName] = useState('');
  const [guestEmail, setEmail] = useState('');
  const account = useRequestAccount(guestEmail, locale);
  const email = account.email;
  const verification = useRequestEmailVerification(email, locale, false);
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(initialMessage);
  const [issueType, setIssueType] = useState(initialIssueType);

  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
    }
    if (initialIssueType) {
      setIssueType(initialIssueType);
    }
  }, [initialMessage, initialIssueType]);
  const [location, setLocation] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const formId = useId();
  const nameInputId = `${formId}-contact-name-company`;
  const emailInputId = `${formId}-contact-email`;
  const phoneInputId = `${formId}-contact-phone`;
  const issueTypeInputId = `${formId}-contact-issue-type`;
  const locationInputId = `${formId}-contact-location`;
  const messageInputId = `${formId}-contact-message`;
  const fileInputId = `${formId}-contact-attachments`;

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustHeight();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();
    const cleanMessage = message.trim();
    const cleanIssueType = issueType.trim();
    const cleanLocation = location.trim();

    if (!cleanEmail || !EMAIL_REGEX.test(cleanEmail)) {
      setErrorMessage(t('error_invalid_contact'));
      return;
    }

    if (!cleanMessage) {
      setErrorMessage(t('error_required_message'));
      return;
    }

    setIsSubmitting(true);

    try {
      await account.ensureCurrent();
      if (!account.accountEmail && !await verification.ensureAllowed()) return;
      const formData = new FormData();
      formData.append('name', cleanName);
      formData.append('contact', cleanEmail);
      formData.append('email', cleanEmail);
      formData.append('phone', cleanPhone);
      formData.append('message', cleanMessage);
      formData.append('issueType', cleanIssueType);
      formData.append('location', cleanLocation);
      if (calculationSnapshot) {
        formData.append(
          CALCULATION_SNAPSHOT_FORM_FIELD,
          serializeCalculationSnapshot(calculationSnapshot)
        );
      }
      if (selectedLocation) {
        formData.append('locationLatitude', String(selectedLocation.latitude));
        formData.append('locationLongitude', String(selectedLocation.longitude));
        formData.append('locationSource', selectedLocation.source);
      }

      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      const data = (await response.json()) as {
        error?: string;
        code?: string;
        publicRequestNumber?: string;
        portalLinked?: boolean;
      };

      if (!response.ok) {
        if (data.code === 'verification_required') {
          await account.ensureCurrent();
          verification.requireVerification();
          return;
        }
        const translatedError =
          response.status === 400
            ? t('error_invalid_contact')
            : t('error_generic');
        throw new Error(data.error ? translatedError : t('error_generic'));
      }

      if (!data.publicRequestNumber) {
        throw new Error('Request created without a public number.');
      }

      setPublicRequestNumber(data.publicRequestNumber);
      setPortalLinked(data.portalLinked === true);
      setIsSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setIssueType('');
      setLocation('');
      setSelectedLocation(null);
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      trackGoogleAdsLeadConversion(data.publicRequestNumber);

      if (onSuccess) {
        setTimeout(() => {
          onSuccess(data.publicRequestNumber as string);
        }, 5000);
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : t('error_generic'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const validFiles = Array.from(newFiles).filter(
      (f) => f.size > 0 && f.size <= 20 * 1024 * 1024
    );
    setFiles((prev) => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-8 animate-in fade-in zoom-in duration-500">
        <div className="w-16 h-16 bg-[#B8643E]/10 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-[#B8643E]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[#0E1A2B] mb-2">
          {t('success_title')}
        </h3>
        <div className="w-full max-w-sm rounded-2xl border border-[#B8643E]/20 bg-[#F7F1E8] px-4 py-3 text-center mb-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#72665D] mb-1">
            {t('success_number_label')}
          </p>
          <p className="text-2xl font-black tracking-[0.18em] text-[#0E1A2B]">
            {publicRequestNumber}
          </p>
        </div>
        <p className="text-[#72665D] text-center text-sm">
          {portalLinked ? receiptCopy.linked : receiptCopy.guest}
        </p>
        <Link
          href={portalLinked ? `/portal/requests/${encodeURIComponent(publicRequestNumber)}` : `/status?request=${encodeURIComponent(publicRequestNumber)}`}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-[#B8643E] px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#A65835]"
        >
          {portalLinked ? receiptCopy.open : t('open_status')}
        </Link>

      </div>
    );
  }

  if (compact) {
    const fieldClass = 'w-full rounded-xl border border-[#DFDCD7] bg-[#F8F7F5] px-4 py-2.5 text-base text-[#0E1A2B] outline-none placeholder:text-[#777D86] focus:border-[#B8643E] focus:ring-2 focus:ring-[#B8643E]/20';
    const labelClass = 'mb-1.5 block text-sm font-medium text-[#0E1A2B]';
    return (
      <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-3">
        <RequestAccountNotice email={account.accountEmail} locale={locale} />
        <div>
          <label htmlFor={emailInputId} className={labelClass}>{t('compact.email_label')} <span className="text-[#A55230]">*</span></label>
          <input id={emailInputId} type="email" aria-required="true" autoComplete="email" dir="ltr" value={email} readOnly={Boolean(account.accountEmail)} onChange={(event) => setEmail(event.target.value)} placeholder="name@company.de" className={fieldClass} />
        </div>
        <div>
          <label htmlFor={messageInputId} className={labelClass}>{t('compact.message_label')} <span className="text-[#A55230]">*</span></label>
          <textarea id={messageInputId} ref={textareaRef} rows={3} aria-required="true" value={message} onChange={handleTextChange} placeholder={t('compact.message_placeholder')} className={`${fieldClass} min-h-[96px] resize-y`} />
        </div>
        <div onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(event) => { event.preventDefault(); setIsDragging(false); handleFiles(event.dataTransfer.files); }} className={`rounded-xl ${isDragging ? 'bg-[#B8643E]/10 ring-2 ring-[#B8643E]' : ''}`}>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#F2F3F5] px-4 py-2 text-sm font-medium hover:bg-[#E9EBEF] focus-visible:outline-2 focus-visible:outline-[#B8643E]">
            <PaperClipIcon aria-hidden="true" className="size-5" />{t('compact.attach')}
          </button>
          <input id={fileInputId} type="file" ref={fileInputRef} accept="image/*,video/*" multiple aria-label={t('attach_photo_btn')} className="hidden" onChange={(event) => { handleFiles(event.target.files); event.target.value = ''; }} />
          {files.length > 0 && <ul className="mt-3 space-y-1">
            {files.map((file, index) => <li key={index} className="flex min-w-0 items-center gap-2 text-sm text-[#596273]">
              <span className="min-w-0 flex-1 truncate">{file.name}</span>
              <button type="button" onClick={() => removeFile(index)} aria-label={t('compact.remove_file', { name: file.name })} className="flex size-11 shrink-0 items-center justify-center rounded-lg hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-[#B8643E]"><XMarkIcon aria-hidden="true" className="size-4" /></button>
            </li>)}
          </ul>}
        </div>
        <details className="group border-y border-[#E1E4E9]">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 text-sm text-[#596273] focus-visible:outline-2 focus-visible:outline-[#B8643E] [&::-webkit-details-marker]:hidden">
            {t('compact.optional_details')}<ChevronDownIcon aria-hidden="true" className="size-4 shrink-0 transition-transform group-open:rotate-180" />
          </summary>
          <div className="space-y-4 pb-4">
            <div><label htmlFor={nameInputId} className={labelClass}>{t('field_name_company')}</label><input id={nameInputId} type="text" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} className={fieldClass} /></div>
            <div><label htmlFor={phoneInputId} className={labelClass}>{t('field_phone')}</label><input id={phoneInputId} type="tel" autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} className={fieldClass} /></div>
            <div>
              <label htmlFor={issueTypeInputId} className={labelClass}>{t('field_issue_type')}</label>
              <select id={issueTypeInputId} value={issueType} onChange={(event) => setIssueType(event.target.value)} className={fieldClass}>
                <option value="">{t('field_issue_type')}</option>
                <option value="Repair">{t('issue_repair')}</option><option value="Installation">{t('issue_installation')}</option><option value="Maintenance">{t('issue_maintenance')}</option><option value="Cleaning">{t('issue_cleaning')}</option><option value="IlluminatedValance">{t('issue_illuminated_valance')}</option>
              </select>
            </div>
            <div><label htmlFor={locationInputId} className={labelClass}>{t('field_location')}</label><LocationPicker inputId={locationInputId} ariaLabel={t('field_location')} value={location} onChange={setLocation} onLocationSelect={setSelectedLocation} dropdownPosition="top" className={fieldClass} /></div>
          </div>
        </details>
        {!account.accountEmail && <RequestEmailVerification verification={verification} locale={locale} />}
        {errorMessage && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{errorMessage}</p>}
        <button type="submit" disabled={isSubmitting || (verification.blocked && !account.accountEmail)} aria-busy={isSubmitting} className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl bg-[#0E1A2B] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1A2E47] disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E]">
          {isSubmitting ? t('compact.sending') : (verification.blocked && !account.accountEmail) ? verification.copy.pending : t('submit')}<ArrowRightIcon aria-hidden="true" className="size-5 shrink-0 rtl:rotate-180" />
        </button>
        <p className="text-xs leading-relaxed text-[#596273]">{t('compact.reply_hint')}</p>
      </form>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className={
        containedScroll
          ? 'flex min-h-0 flex-1 flex-col gap-3 overflow-hidden sm:gap-4'
          : 'flex flex-col flex-1 gap-3 sm:gap-4 overflow-visible'
      }
    >
      <div
        className={
          containedScroll
            ? 'flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain pr-1 -mr-1 pb-4 sm:gap-4'
            : 'flex flex-col gap-3 sm:gap-4 pr-1 -mr-1 pb-4 overflow-visible'
        }
      >
        <RequestAccountNotice email={account.accountEmail} locale={locale} dark={variant === 'dark'} />
        {layout === 'two-column' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor={nameInputId} className="sr-only">
                  {t('field_name_company')}
                </label>
                <input
                  id={nameInputId}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder={t('field_name_company')}
                  className={`w-full px-5 sm:px-6 py-3 sm:py-3.5 border rounded-2xl outline-none focus:ring-1 transition-all duration-300 text-[14px] sm:text-[15px] ${
                    variant === 'dark'
                      ? 'bg-white/10 border-white/10 focus:border-[#B8643E] text-white placeholder-white/50 focus:ring-[#B8643E]/50 focus:bg-white/15'
                      : 'bg-[#F7F1E8]/60 border-[#E7DDD3] focus:border-[#B8643E] text-[#0E1A2B] placeholder-[#72665D]/40 focus:ring-[#B8643E]/30 focus:bg-white'
                  }`}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor={emailInputId} className="sr-only">
                  {t('field_email')}
                </label>
                <input
                  id={emailInputId}
                  type="email"
                  aria-required="true"
                  value={email} readOnly={Boolean(account.accountEmail)}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  placeholder={t('field_email')}
                  className={`w-full px-5 sm:px-6 py-3 sm:py-3.5 border rounded-2xl outline-none focus:ring-1 transition-all duration-300 text-[14px] sm:text-[15px] ${
                    variant === 'dark'
                      ? 'bg-white/10 border-white/10 focus:border-[#B8643E] text-white placeholder-white/50 focus:ring-[#B8643E]/50 focus:bg-white/15'
                      : 'bg-[#F7F1E8]/60 border-[#E7DDD3] focus:border-[#B8643E] text-[#0E1A2B] placeholder-[#72665D]/40 focus:ring-[#B8643E]/30 focus:bg-white'
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label htmlFor={phoneInputId} className="sr-only">
                  {t('field_phone')}
                </label>
                <input
                  id={phoneInputId}
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  placeholder={t('field_phone')}
                  className={`w-full px-5 sm:px-6 py-3 sm:py-3.5 border rounded-2xl outline-none focus:ring-1 transition-all duration-300 text-[14px] sm:text-[15px] ${
                    variant === 'dark'
                      ? 'bg-white/10 border-white/10 focus:border-[#B8643E] text-white placeholder-white/50 focus:ring-[#B8643E]/50 focus:bg-white/15'
                      : 'bg-[#F7F1E8]/60 border-[#E7DDD3] focus:border-[#B8643E] text-[#0E1A2B] placeholder-[#72665D]/40 focus:ring-[#B8643E]/30 focus:bg-white'
                  }`}
                />
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor={issueTypeInputId} className="sr-only">
                  {t('field_issue_type') || 'Typ der Anfrage (optional)'}
                </label>
                <select
                  id={issueTypeInputId}
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className={`w-full px-5 sm:px-6 py-3 sm:py-3.5 border rounded-2xl outline-none focus:ring-1 transition-all duration-300 text-[14px] sm:text-[15px] appearance-none cursor-pointer ${
                    variant === 'dark'
                      ? 'bg-white/10 border-white/10 focus:border-[#B8643E] text-white focus:ring-[#B8643E]/50 focus:bg-white/15'
                      : 'bg-[#F7F1E8]/60 border-[#E7DDD3] focus:border-[#B8643E] text-[#0E1A2B] focus:ring-[#B8643E]/30 focus:bg-white'
                  }`}
                  style={{ 
                    backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="none" class="${variant === 'dark' ? 'stroke-white' : 'stroke-black'}" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg>')`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 1rem center',
                    backgroundSize: '1rem'
                  }}
                >
                  <option value="" disabled className={variant === 'dark' ? 'text-black' : ''}>{t('field_issue_type') || 'Typ der Anfrage (optional)'}</option>
                  <option value="Repair" className={variant === 'dark' ? 'text-black' : ''}>{t('issue_repair') || 'Reparatur'}</option>
                  <option value="Installation" className={variant === 'dark' ? 'text-black' : ''}>{t('issue_installation') || 'Montage'}</option>
                  <option value="Maintenance" className={variant === 'dark' ? 'text-black' : ''}>{t('issue_maintenance') || 'Wartung'}</option>
                  <option value="Cleaning" className={variant === 'dark' ? 'text-black' : ''}>{t('issue_cleaning') || 'Reinigung / Pflege'}</option>
                  <option value="IlluminatedValance" className={variant === 'dark' ? 'text-black' : ''}>{t('issue_illuminated_valance') || 'Beleuchtete Markisen-Volants'}</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 z-40 relative">
                <label htmlFor={locationInputId} className="sr-only">
                  {t('field_location') || 'Adresse oder Ort (optional)'}
                </label>
                <LocationPicker
                  inputId={locationInputId}
                  ariaLabel={t('field_location') || 'Adresse oder Ort (optional)'}
                  value={location}
                  onChange={setLocation}
                  onLocationSelect={setSelectedLocation}
                  variant={variant}
                  dropdownPosition={dropdownPosition}
                  placeholder={t('field_location') || 'Adresse oder Ort (optional)'}
                  className={`w-full px-5 sm:px-6 py-3 sm:py-3.5 border rounded-2xl outline-none focus:ring-1 transition-all duration-300 text-[14px] sm:text-[15px] ${
                    variant === 'dark'
                      ? 'bg-white/10 border-white/10 focus:border-[#B8643E] text-white placeholder-white/50 focus:ring-[#B8643E]/50 focus:bg-white/15'
                      : 'bg-[#F7F1E8]/60 border-[#E7DDD3] focus:border-[#B8643E] text-[#0E1A2B] placeholder-[#72665D]/40 focus:ring-[#B8643E]/30 focus:bg-white'
                  }`}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <label htmlFor={nameInputId} className="sr-only">
                {t('field_name_company')}
              </label>
              <input
                id={nameInputId}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                placeholder={t('field_name_company')}
                className={`w-full px-5 sm:px-6 py-3 sm:py-3.5 border rounded-2xl outline-none focus:ring-1 transition-all duration-300 text-[14px] sm:text-[15px] ${
                  variant === 'dark'
                    ? 'bg-white/10 border-white/10 focus:border-[#B8643E] text-white placeholder-white/50 focus:ring-[#B8643E]/50 focus:bg-white/15'
                    : 'bg-[#F7F1E8]/60 border-[#E7DDD3] focus:border-[#B8643E] text-[#0E1A2B] placeholder-[#72665D]/40 focus:ring-[#B8643E]/30 focus:bg-white'
                }`}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor={emailInputId} className="sr-only">
                {t('field_email')}
              </label>
              <input
                id={emailInputId}
                type="email"
                aria-required="true"
                value={email} readOnly={Boolean(account.accountEmail)}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                placeholder={t('field_email')}
                className={`w-full px-5 sm:px-6 py-3 sm:py-3.5 border rounded-2xl outline-none focus:ring-1 transition-all duration-300 text-[14px] sm:text-[15px] ${
                  variant === 'dark'
                    ? 'bg-white/10 border-white/10 focus:border-[#B8643E] text-white placeholder-white/50 focus:ring-[#B8643E]/50 focus:bg-white/15'
                    : 'bg-[#F7F1E8]/60 border-[#E7DDD3] focus:border-[#B8643E] text-[#0E1A2B] placeholder-[#72665D]/40 focus:ring-[#B8643E]/30 focus:bg-white'
                }`}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor={phoneInputId} className="sr-only">
                {t('field_phone')}
              </label>
              <input
                id={phoneInputId}
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
                placeholder={t('field_phone')}
                className={`w-full px-5 sm:px-6 py-3 sm:py-3.5 border rounded-2xl outline-none focus:ring-1 transition-all duration-300 text-[14px] sm:text-[15px] ${
                  variant === 'dark'
                    ? 'bg-white/10 border-white/10 focus:border-[#B8643E] text-white placeholder-white/50 focus:ring-[#B8643E]/50 focus:bg-white/15'
                    : 'bg-[#F7F1E8]/60 border-[#E7DDD3] focus:border-[#B8643E] text-[#0E1A2B] placeholder-[#72665D]/40 focus:ring-[#B8643E]/30 focus:bg-white'
                }`}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor={issueTypeInputId} className="sr-only">
                {t('field_issue_type') || 'Typ der Anfrage (optional)'}
              </label>
              <select
                id={issueTypeInputId}
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className={`w-full px-5 sm:px-6 py-3 sm:py-3.5 border rounded-2xl outline-none focus:ring-1 transition-all duration-300 text-[14px] sm:text-[15px] appearance-none cursor-pointer ${
                  variant === 'dark'
                    ? 'bg-white/10 border-white/10 focus:border-[#B8643E] text-white focus:ring-[#B8643E]/50 focus:bg-white/15'
                    : 'bg-[#F7F1E8]/60 border-[#E7DDD3] focus:border-[#B8643E] text-[#0E1A2B] focus:ring-[#B8643E]/30 focus:bg-white'
                }`}
                style={{ 
                  backgroundImage: `url('data:image/svg+xml;utf8,<svg fill="none" class="${variant === 'dark' ? 'stroke-white' : 'stroke-black'}" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"></path></svg>')`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1rem'
                }}
              >
                <option value="" disabled className={variant === 'dark' ? 'text-black' : ''}>{t('field_issue_type') || 'Typ der Anfrage (optional)'}</option>
                <option value="Repair" className={variant === 'dark' ? 'text-black' : ''}>{t('issue_repair') || 'Reparatur'}</option>
                <option value="Installation" className={variant === 'dark' ? 'text-black' : ''}>{t('issue_installation') || 'Montage'}</option>
                <option value="Maintenance" className={variant === 'dark' ? 'text-black' : ''}>{t('issue_maintenance') || 'Wartung'}</option>
                <option value="Cleaning" className={variant === 'dark' ? 'text-black' : ''}>{t('issue_cleaning') || 'Reinigung / Pflege'}</option>
                <option value="IlluminatedValance" className={variant === 'dark' ? 'text-black' : ''}>{t('issue_illuminated_valance') || 'Beleuchtete Markisen-Volants'}</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 z-40 relative">
              <label htmlFor={locationInputId} className="sr-only">
                {t('field_location') || 'Adresse oder Ort (optional)'}
              </label>
              <LocationPicker
                inputId={locationInputId}
                ariaLabel={t('field_location') || 'Adresse oder Ort (optional)'}
                value={location}
                onChange={setLocation}
                onLocationSelect={setSelectedLocation}
                variant={variant}
                dropdownPosition={dropdownPosition}
                placeholder={t('field_location') || 'Adresse oder Ort (optional)'}
                className={`w-full px-5 sm:px-6 py-3 sm:py-3.5 border rounded-2xl outline-none focus:ring-1 transition-all duration-300 text-[14px] sm:text-[15px] ${
                  variant === 'dark'
                    ? 'bg-white/10 border-white/10 focus:border-[#B8643E] text-white placeholder-white/50 focus:ring-[#B8643E]/50 focus:bg-white/15'
                    : 'bg-[#F7F1E8]/60 border-[#E7DDD3] focus:border-[#B8643E] text-[#0E1A2B] placeholder-[#72665D]/40 focus:ring-[#B8643E]/30 focus:bg-white'
                }`}
              />
            </div>
          </>
        )}

        <div className="flex flex-col gap-1">
          <label htmlFor={messageInputId} className="sr-only">
            {t('field_message')}
          </label>
          <textarea
            id={messageInputId}
            ref={textareaRef}
            rows={2}
            aria-required="true"
            value={message}
            onChange={handleTextChange}
            placeholder={t('field_message')}
            className={`w-full px-5 sm:px-6 py-3 sm:py-3.5 border rounded-2xl outline-none focus:ring-1 transition-all duration-300 resize-none text-[14px] sm:text-[15px] min-h-[80px] ${
              variant === 'dark'
                ? 'bg-white/10 border-white/10 focus:border-[#B8643E] text-white placeholder-white/50 focus:ring-[#B8643E]/50 focus:bg-white/15'
                : 'bg-[#F7F1E8]/60 border-[#E7DDD3] focus:border-[#B8643E] text-[#0E1A2B] placeholder-[#72665D]/40 focus:ring-[#B8643E]/30 focus:bg-white'
            }`}
          />
        </div>

        {files.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {files.map((f, i) => (
              <div key={i} className={`relative flex items-center gap-2 pr-2 pl-3 py-1.5 rounded-full border ${variant === 'dark' ? 'border-white/20 bg-white/5' : 'border-black/10 bg-black/5'}`}>
                <span className={`text-xs truncate max-w-[120px] ${variant === 'dark' ? 'text-white/80' : 'text-[#72665D]'}`}>
                  {f.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  aria-label={`${t('attach_photo_btn')}: ${f.name}`}
                  className="w-5 h-5 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white text-[10px] transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        {!account.accountEmail && <RequestEmailVerification verification={verification} locale={locale} />}
      </div>

      <div
        className={
          containedScroll
            ? `shrink-0 border-t pt-2 pb-[calc(0.25rem+env(safe-area-inset-bottom))] ${
                variant === 'dark' ? 'border-t-white/10 bg-[#0E1A2B]' : 'border-t-black/5 bg-white'
              }`
            : 'mt-auto pt-2 border-t border-t-white/5'
        }
      >
        <div className="flex items-center gap-2 sm:gap-3 mb-3">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files); }}
            className="flex-1 flex"
          >
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`group flex-1 flex items-center justify-center sm:justify-start gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-3.5 border border-dashed rounded-2xl transition-all active:scale-[0.98] ${
                isDragging
                  ? variant === 'dark' ? 'border-[#B8643E] bg-[#B8643E]/20' : 'border-[#B8643E] bg-[#B8643E]/10'
                  : variant === 'dark' ? 'bg-white/5 hover:bg-white/10 border-white/20' : 'bg-[#F7F1E8] hover:bg-[#F0E6D8] border-[#E7DDD3]'
              }`}
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg shadow-sm group-hover:scale-110 transition-transform ${
                  variant === 'dark' ? 'bg-white/10' : 'bg-white'
                }`}
              >
                <svg
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                    variant === 'dark' ? 'text-white' : 'text-[#72665D]'
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span
                className={`hidden xs:inline text-[13px] sm:text-[14px] font-bold whitespace-nowrap ${
                  variant === 'dark' ? 'text-white/80' : 'text-[#72665D]'
                }`}
              >
                {t('attach_photo_btn')}
              </span>
              <input
                id={fileInputId}
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  handleFiles(e.target.files);
                  e.target.value = '';
                }}
                accept="image/*,video/*"
                multiple
                aria-label={t('attach_photo_btn')}
                className="hidden"
              />
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || (verification.blocked && !account.accountEmail)}
            className="group flex-[1.5] flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3.5 sm:py-4 bg-[#0E1A2B] hover:bg-[#1a2e47] text-white rounded-2xl font-bold transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span className="text-[13px] sm:text-[14px]">{(verification.blocked && !account.accountEmail) ? verification.copy.pending : t('submit')}</span>
                <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center bg-white/10 rounded-lg group-hover:translate-x-1 transition-transform">
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </div>
              </>
            )}
          </button>
        </div>

        {errorMessage && (
          <p className="mb-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </p>
        )}

        <p
          className={`text-[10px] sm:text-[11px] leading-relaxed italic border-t pt-2 sm:pt-3 ${
            variant === 'dark'
              ? 'text-white/40 border-white/10'
              : 'text-[#72665D]/60 border-black/5'
          }`}
        >
          {t('form_footer')}
        </p>
      </div>
    </form>
  );
};

export default ContactForm;
