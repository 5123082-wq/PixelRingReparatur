'use client';

import { useState } from 'react';

import ChatModal from '@/components/common/ChatModal';
import ContactModal from '@/components/common/ContactModal';

type ProblemRequestButtonProps = {
  label: string;
  problemIntent: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
};

export default function ProblemRequestButton({
  label,
  problemIntent,
  variant = 'primary',
  className = '',
}: ProblemRequestButtonProps) {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const variantClass =
    variant === 'primary'
      ? 'bg-[#B8643E] text-white shadow-lg shadow-[#B8643E33] hover:bg-[#A65835]'
      : variant === 'secondary'
        ? 'border border-[#B8643E] bg-white text-[#8F4F34] hover:bg-[#FFF4EC]'
        : 'border border-[#D9C7BA] bg-white/75 text-[#4E5A5A] hover:border-[#7BA190] hover:text-[#24594D]';

  return (
    <>
      <button
        type="button"
        data-problem-intent={problemIntent}
        onClick={() => setIsContactOpen(true)}
        className={`inline-flex min-h-12 items-center justify-center rounded-full px-5 py-3 text-[15px] font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8643E] ${variantClass} ${className}`}
      >
        {label}
      </button>
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        onOpenChat={() => setIsChatOpen(true)}
      />
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
