'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import LocationPicker from './LocationPicker';

interface ContactFormProps {
  onSuccess?: (publicRequestNumber: string) => void;
  variant?: 'light' | 'dark';
}

const ContactForm = ({ onSuccess, variant = 'light' }: ContactFormProps) => {
  const t = useTranslations('ContactModal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [publicRequestNumber, setPublicRequestNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [issueType, setIssueType] = useState('');
  const [location, setLocation] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('contact', contact);
      formData.append('message', message);
      formData.append('issueType', issueType);
      formData.append('location', location);

      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      const data = (await response.json()) as {
        error?: string;
        publicRequestNumber?: string;
      };

      if (!response.ok) {
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
      setIsSuccess(true);
      setName('');
      setContact('');
      setMessage('');
      setIssueType('');
      setLocation('');
      setFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

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
          {t('success_message')}
        </p>
        <Link
          href={`/status?request=${encodeURIComponent(publicRequestNumber)}`}
          className="mt-4 inline-flex items-center justify-center rounded-full bg-[#B8643E] px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#A65835]"
        >
          {t('open_status')}
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col flex-1 gap-3 sm:gap-4 overflow-hidden"
    >
      <div className="flex flex-col gap-3 sm:gap-4 overflow-y-auto pr-1 -mr-1 pb-4">
        <div className="flex flex-col gap-1">
          <input
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
          <input
            type="text"
            required
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            autoComplete="off"
            placeholder={t('field_contact')}
            className={`w-full px-5 sm:px-6 py-3 sm:py-3.5 border rounded-2xl outline-none focus:ring-1 transition-all duration-300 text-[14px] sm:text-[15px] ${
              variant === 'dark'
                ? 'bg-white/10 border-white/10 focus:border-[#B8643E] text-white placeholder-white/50 focus:ring-[#B8643E]/50 focus:bg-white/15'
                : 'bg-[#F7F1E8]/60 border-[#E7DDD3] focus:border-[#B8643E] text-[#0E1A2B] placeholder-[#72665D]/40 focus:ring-[#B8643E]/30 focus:bg-white'
            }`}
          />
        </div>

        <div className="flex flex-col gap-1">
          <select
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
          </select>
        </div>

        <div className="flex flex-col gap-1 z-40 relative">
          <LocationPicker
            value={location}
            onChange={setLocation}
            variant={variant}
            placeholder={t('field_location') || 'Adresse oder Ort (optional)'}
            className={`w-full px-5 sm:px-6 py-3 sm:py-3.5 border rounded-2xl outline-none focus:ring-1 transition-all duration-300 text-[14px] sm:text-[15px] ${
              variant === 'dark'
                ? 'bg-white/10 border-white/10 focus:border-[#B8643E] text-white placeholder-white/50 focus:ring-[#B8643E]/50 focus:bg-white/15'
                : 'bg-[#F7F1E8]/60 border-[#E7DDD3] focus:border-[#B8643E] text-[#0E1A2B] placeholder-[#72665D]/40 focus:ring-[#B8643E]/30 focus:bg-white'
            }`}
          />
        </div>

        <div className="flex flex-col gap-1">
          <textarea
            ref={textareaRef}
            rows={2}
            required
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
                  className="w-5 h-5 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white text-[10px] transition-colors"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto pt-2 border-t border-t-white/5">
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
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  handleFiles(e.target.files);
                  e.target.value = '';
                }}
                accept="image/*,video/*"
                multiple
                className="hidden"
              />
            </button>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="group flex-[1.5] flex items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-3.5 sm:py-4 bg-[#0E1A2B] hover:bg-[#1a2e47] text-white rounded-2xl font-bold transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span className="text-[13px] sm:text-[14px]">{t('submit')}</span>
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
