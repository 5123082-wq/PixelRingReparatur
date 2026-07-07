'use client';

import { useState } from 'react';

import ChatModal from '@/components/common/ChatModal';
import ContactModal from '@/components/common/ContactModal';

type LeistungenRequestButtonProps = {
  label: string;
  serviceIntent: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'dark-ghost';
  className?: string;
  initialIssueType?: string;
  initialMessage?: string;
  onClick?: () => void;
};

export default function LeistungenRequestButton({
  label,
  serviceIntent,
  variant = 'primary',
  className = '',
  initialIssueType,
  initialMessage,
  onClick,
}: LeistungenRequestButtonProps) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const variantClass =
    variant === 'primary'
      ? 'bg-[#B8643E] text-white shadow-lg shadow-[#B8643E33] hover:bg-[#A65835]'
      : variant === 'secondary'
        ? 'border border-[#B8643E] bg-white text-[#8F4F34] hover:bg-[#FFF4EC]'
        : variant === 'dark-ghost'
          ? 'border border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 hover:shadow-lg'
          : 'border border-[#D9C7BA] bg-white/70 text-[#4E5A5A] hover:border-[#7BA190] hover:text-[#24594D]';

  const handleButtonClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsContactOpen(true);
    }
  };

  return (
    <>
      <button
        type="button"
        data-service-intent={serviceIntent}
        onClick={handleButtonClick}
        className={`inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 text-[15px] font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E] ${variantClass} ${className}`}
      >
        {label}
      </button>
      {!onClick && (
        <>
          <ContactModal
            isOpen={isContactOpen}
            onClose={() => setIsContactOpen(false)}
            onOpenChat={() => setIsChatOpen(true)}
            initialIssueType={initialIssueType}
            initialMessage={initialMessage}
          />
          <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </>
      )}
    </>
  );
}
