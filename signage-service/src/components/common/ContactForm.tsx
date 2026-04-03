'use client';

import React, { useState, useRef } from 'react';
import { useTranslations } from 'next-intl';

interface ContactFormProps {
  focusField?: 'text' | 'photo' | null;
  onSuccess?: () => void;
  variant?: 'light' | 'dark';
}

const ContactForm = ({ focusField, onSuccess, variant = 'light' }: ContactFormProps) => {
  const t = useTranslations('ContactModal');
  const isDark = variant === 'dark';

  const inputClasses = isDark
    ? "w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-[15px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#B8643E] focus:ring-1 focus:ring-[#B8643E]/30 transition-all"
    : "w-full px-5 py-3.5 bg-[#F7F1E8] border border-[#E7DDD3] rounded-2xl text-[15px] text-[#0E1A2B] placeholder:text-[#72665D]/60 focus:outline-none focus:border-[#B8643E] focus:ring-1 focus:ring-[#B8643E]/30 transition-all";

  const textAreaClasses = isDark
    ? "w-full px-5 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-[15px] text-white placeholder:text-white/40 focus:outline-none focus:border-[#B8643E] focus:ring-1 focus:ring-[#B8643E]/30 transition-all resize-none"
    : "w-full px-5 py-3.5 bg-[#F7F1E8] border border-[#E7DDD3] rounded-2xl text-[15px] text-[#0E1A2B] placeholder:text-[#72665D]/60 focus:outline-none focus:border-[#B8643E] focus:ring-1 focus:ring-[#B8643E]/30 transition-all resize-none";

  const labelClasses = isDark
    ? "flex items-center gap-3 w-full px-5 py-3.5 bg-white/5 border border-dashed border-white/20 rounded-2xl text-[15px] text-white/70 cursor-pointer hover:border-[#B8643E] hover:text-[#B8643E] transition-all"
    : "flex items-center gap-3 w-full px-5 py-3.5 bg-[#F7F1E8] border border-dashed border-[#E7DDD3] rounded-2xl text-[15px] text-[#72665D] cursor-pointer hover:border-[#B8643E] hover:text-[#B8643E] transition-all";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus on the right field when modal opens
  React.useEffect(() => {
    if (focusField === 'photo' && fileInputRef.current) {
      fileInputRef.current.click();
    } else if (focusField === 'text' && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [focusField]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file ? file.name : null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onSuccess?.();
        }, 2500);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-8 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-full bg-[#25D366]/10 flex items-center justify-center">
          <svg className="w-8 h-8 text-[#25D366]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className={`text-[18px] font-bold ${isDark ? 'text-white' : 'text-[#0E1A2B]'}`}>{t('success_title')}</p>
        <p className={`text-[14px] ${isDark ? 'text-white/70' : 'text-[#72665D]'}`}>{t('success_message')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Name */}
      <input
        type="text"
        name="name"
        required
        placeholder={t('field_name')}
        className={inputClasses}
      />

      {/* Contact (phone or email) */}
      <input
        type="text"
        name="contact"
        required
        placeholder={t('field_contact')}
        className={inputClasses}
      />

      {/* Message */}
      <textarea
        name="message"
        ref={textareaRef}
        required
        rows={3}
        placeholder={t('field_message')}
        className={textAreaClasses}
      />

      {/* Photo upload */}
      <div className="relative">
        <input
          type="file"
          name="photo"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="photo-upload"
        />
        <label
          htmlFor="photo-upload"
          className={labelClasses}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          {fileName || t('field_photo')}
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-4 bg-[#B8643E] hover:bg-[#A65835] disabled:bg-[#B8643E]/50 text-white text-[16px] font-bold rounded-2xl shadow-lg shadow-[#B8643E]/20 transition-all flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            {t('submit')}
          </>
        )}
      </button>
    </form>
  );
};

export default ContactForm;
