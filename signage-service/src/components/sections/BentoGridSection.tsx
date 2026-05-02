'use client';

import React from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { BentoGridCmsContent } from '@/lib/cms/pages';

interface BentoGridSectionProps {
  content?: BentoGridCmsContent;
}

interface Step {
  id: number;
  title: string;
  description: string;
  className: string;
}

const BentoCard = ({ step, isAccent }: { step: Step; isAccent: boolean }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Parallax for the number
  const numberX = useSpring(useMotionValue(0), { stiffness: 100, damping: 30 });
  const numberY = useSpring(useMotionValue(0), { stiffness: 100, damping: 30 });

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    
    mouseX.set(x);
    mouseY.set(y);

    // Calculate parallax (inverse movement)
    const px = (x / width - 0.5) * -40;
    const py = (y / height - 0.5) * -40;
    numberX.set(px);
    numberY.set(py);
  }

  function handleMouseLeave() {
    numberX.set(0);
    numberY.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative group p-8 rounded-[32px] shadow-2xl shadow-[#0E1A2B05] border border-[#E7DDD3] overflow-hidden flex flex-col justify-between gap-8 transition-colors duration-500 ${
        isAccent ? 'bg-[#B8643E] text-white border-transparent' : 'bg-white text-[#0E1A2B]'
      } ${step.className}`}
    >
      {/* Dynamic Spotlight */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[32px] opacity-0 group-hover:opacity-100 transition duration-300 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              ${isAccent ? 'rgba(255, 255, 255, 0.12)' : 'rgba(184, 100, 62, 0.08)'},
              transparent 80%
            )
          `,
        }}
      />

      {/* Large Outlined Parallax Number */}
      <motion.div
        style={{ x: numberX, y: numberY }}
        className="absolute -top-6 -right-6 select-none pointer-events-none z-0"
      >
        <span 
          className="text-[160px] font-black leading-none opacity-10 transition-opacity duration-700 group-hover:opacity-20"
          style={{ 
            WebkitTextStroke: `1.5px ${isAccent ? 'white' : '#0E1A2B'}`,
            color: 'transparent'
          }}
        >
          {step.id}
        </span>
      </motion.div>

      <div className="flex flex-col gap-4 relative z-20">
        <h3 className="text-[24px] md:text-[28px] font-bold leading-tight tracking-tight">
          {step.title}
        </h3>
      </div>

      <p className={`text-[15px] leading-[1.5] relative z-20 transition-colors duration-500 ${
        isAccent ? 'text-white/80' : 'text-[#72665D]'
      }`}>
        {step.description}
      </p>

      {/* Decorative Corner Element */}
      <div className={`absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${
        isAccent ? 'from-white/5 to-transparent' : 'from-[#B8643E]/5 to-transparent'
      }`} style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />
    </motion.div>
  );
};

const BentoGridSection = ({ content }: BentoGridSectionProps) => {
  const getCardClass = (idx: number, total: number): string => {
    if (idx === 0) return 'md:col-span-2 lg:col-span-2';
    if (total === 5 && idx === 3) return 'md:col-span-2 lg:col-span-3';
    if (idx === total - 1 && total !== 5) return 'md:col-span-2 lg:col-span-3';
    return '';
  };

  const steps = (content?.steps || []).map((cmsStep, idx) => ({
    id: idx + 1,
    title: cmsStep.title || '',
    description: cmsStep.description || '',
    className: getCardClass(idx, content?.steps?.length || 0),
  }));

  return (
    <section className="w-full bg-[#F7F1E8] py-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <div className="w-8 h-[2px] bg-[#B8643E]" />
            <span className="text-[#B8643E] font-bold tracking-[0.2em] uppercase text-[12px]">Process</span>
          </motion.div>
          <h2 className="text-[36px] md:text-[42px] font-black text-[#0E1A2B] leading-[1.1] tracking-tight">
            {content?.title || 'Wie es funktioniert'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <BentoCard 
              key={step.id} 
              step={step} 
              isAccent={step.className.includes('lg:col-span-3')} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoGridSection;
