'use client';

import React from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate } from 'framer-motion';
import { BentoGridCmsContent } from '@/lib/cms/pages';
import CmsImage from '../common/CmsImage';
import ServiceStamp from '../common/ServiceStamp';

interface BentoGridSectionProps {
  content?: BentoGridCmsContent;
}

interface Step {
  id: number;
  title: string;
  description: string;
  highlight: string;
}

const RESULT_IMAGE_SRC = '/generated/referenzen/agent-facade/facade-repaired-lightbox-after.png';

const BentoCard = ({ step, isAccent, isResult }: { step: Step; isAccent: boolean; isResult?: boolean }) => {
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
      className={`relative group min-h-[320px] rounded-[32px] shadow-2xl shadow-[#0E1A2B05] border border-[#E7DDD3] transition-colors duration-500 md:min-h-[330px] ${
        isAccent ? 'bg-[#B8643E] text-white border-transparent' : 'bg-white text-[#0E1A2B]'
      } ${isResult ? 'mb-16 flex flex-col overflow-visible p-6 md:p-7 lg:mb-0 lg:flex-row lg:gap-6' : 'overflow-hidden p-6 md:p-7'}`}
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

      <div className={`relative z-20 grid h-full min-w-0 grid-rows-[minmax(64px,auto)_minmax(0,1fr)_minmax(54px,auto)] gap-3 md:grid-rows-[minmax(68px,auto)_minmax(0,1fr)_minmax(58px,auto)] ${isResult ? 'lg:flex-1' : ''}`}>
        <div className="flex items-start">
          <h3 className="text-[24px] md:text-[28px] font-bold leading-tight tracking-tight">
            {step.title}
          </h3>
        </div>

        <p className={`self-start text-[15px] leading-[1.45] transition-colors duration-500 ${
          isAccent ? 'text-white/82' : 'text-[#72665D]'
        }`}>
          {step.description}
        </p>

        {step.highlight && (
          <div className={`flex min-h-[54px] items-start border-t pt-3 md:min-h-[58px] ${
            isAccent ? 'border-white/25' : 'border-[#E7DDD3]'
          }`}>
            <p className={`text-[15px] font-extrabold leading-snug ${
              isAccent ? 'text-white' : 'text-[#0E1A2B]'
          }`}>
              {step.highlight}
            </p>
          </div>
        )}
      </div>

      {isResult && (
        <div className="relative z-30 mt-2 min-h-[220px] lg:mt-0 lg:mr-16 lg:w-[34%] lg:shrink-0">
          <div className="relative h-full min-h-[220px] overflow-hidden rounded-[24px] border border-white/15 shadow-2xl shadow-[#0E1A2B]/15">
            <CmsImage
              src={RESULT_IMAGE_SRC}
              alt={step.title}
              fill
              sizes="(min-width: 1024px) 25vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E1A2B]/25 via-transparent to-transparent" />
          </div>
          <ServiceStamp
            idPrefix="bento-result-photo-stamp"
            className="pointer-events-none absolute bottom-0 left-0 z-40 h-32 w-32 -translate-x-1/2 translate-y-1/2 opacity-95 md:h-36 md:w-36"
          />
        </div>
      )}

      {/* Decorative Corner Element */}
      <div className={`absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${
        isAccent ? 'from-white/5 to-transparent' : 'from-[#B8643E]/5 to-transparent'
      }`} style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} />
    </motion.div>
  );
};

const BentoGridSection = ({ content }: BentoGridSectionProps) => {
  const steps = (content?.steps || []).map((cmsStep, idx) => ({
    id: idx + 1,
    title: cmsStep.title || '',
    description: cmsStep.description || '',
    highlight: cmsStep.highlight || '',
  }));
  const topSteps = steps.slice(0, 3);
  const bottomSteps = steps.slice(3, 5);

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
          <h2 className="text-[32px] font-extrabold leading-[1.1] tracking-[0] text-[#0E1A2B] md:text-[42px]">
            {content?.title || 'Wie es funktioniert'}
          </h2>
        </div>

        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-[minmax(0,4fr)_minmax(0,3fr)_minmax(0,3fr)]">
            {topSteps.map((step) => (
              <BentoCard key={step.id} step={step} isAccent={false} />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)]">
            {bottomSteps.map((step) => (
              <BentoCard
                key={step.id}
                step={step}
                isAccent={step.id === 5}
                isResult={step.id === 5}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoGridSection;
