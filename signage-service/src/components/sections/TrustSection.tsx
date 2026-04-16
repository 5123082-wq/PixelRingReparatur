'use client';

import { useTranslations } from 'next-intl';
import { TrustCmsContent } from '@/lib/cms/pages';

const TrustSection = ({ content }: { content?: TrustCmsContent }) => {
  const t = useTranslations('Trust');

  type FeatureIconType = 'reinraum' | 'doc' | 'audit';

  const FeatureIcon = ({ type }: { type: FeatureIconType }) => {
    const icons = {
      reinraum: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 12L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M12 12L3 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      doc: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M14 2V8H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 13H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M16 17H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
      audit: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    };
    return icons[type] || null;
  };

  const stats = [
    {
      id: 1,
      value: content?.stats?.[0]?.value ?? t('stats.turnaround.value'),
      label: content?.stats?.[0]?.label ?? t('stats.turnaround.label'),
      desc: content?.stats?.[0]?.description ?? t('stats.turnaround.description'),
    },
    {
      id: 2,
      value: content?.stats?.[1]?.value ?? t('stats.warranty.value'),
      label: content?.stats?.[1]?.label ?? t('stats.warranty.label'),
      desc: content?.stats?.[1]?.description ?? t('stats.warranty.description'),
    },
    {
      id: 3,
      value: content?.stats?.[2]?.value ?? t('stats.hardware.value'),
      label: content?.stats?.[2]?.label ?? t('stats.hardware.label'),
      desc: content?.stats?.[2]?.description ?? t('stats.hardware.description'),
    },
    {
      id: 4,
      value: content?.stats?.[3]?.value ?? t('stats.rating.value'),
      label: content?.stats?.[3]?.label ?? t('stats.rating.label'),
      desc: content?.stats?.[3]?.description ?? t('stats.rating.description'),
    },
  ];

  const featureItems: Array<{
    key: string;
    icon: FeatureIconType;
  }> = [
    { key: content?.features?.[0]?.label ?? t('feature1'), icon: 'reinraum' },
    { key: content?.features?.[1]?.label ?? t('feature2'), icon: 'doc' },
    { key: content?.features?.[2]?.label ?? t('feature3'), icon: 'audit' },
  ];

  return (
    <section className="w-full bg-[#1A1A1A] py-32 px-6 overflow-hidden relative">
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 opacity-[0.03] bg-[length:32px_32px]" 
           style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)' }} />

      <div className="max-w-7xl mx-auto flex flex-col gap-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-6">
            <h2 className="text-[44px] md:text-[56px] font-bold text-white leading-[1.1]">
              {content?.titleStart ?? t('title_start')} <br />
              <span className="text-[#B8643E]">{content?.titleAccent ?? t('title_accent')}</span> <br />
              {content?.titleEnd ?? t('title_end')}
            </h2>
            <div className="w-24 h-1 bg-[#EEF3FB]/20 rounded-full my-2" />
            <p className="text-[18px] text-white/60 leading-relaxed max-w-lg">
              {content?.description ?? t('description')}
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {featureItems.map((feature, index) => (
              <div 
                key={feature.key}
                className="flex items-center gap-5 p-5 bg-white rounded-2xl shadow-sm border border-black/[0.03] hover:shadow-md transition-all duration-300 group cursor-default"
              >
                <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-[#B8643E0A] text-[#B8643E] rounded-xl group-hover:bg-[#B8643E] group-hover:text-white transition-colors">
                  <FeatureIcon type={feature.icon} />
                </div>
                <span className="text-[18px] font-semibold text-[#0E1A2B]">
                  {feature.key}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Stats Grid Card */}
        <div className="w-full flex flex-col">
          <div className="bg-white rounded-[40px] shadow-2xl shadow-[#0E1A2B08] border border-black/[0.04] p-10 md:p-14 h-full flex flex-col justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {stats.map((stat) => (
                <div key={stat.id} className="flex flex-col gap-3">
                  <div className="text-[44px] md:text-[52px] font-bold text-[#B8643E] leading-none tracking-tight">
                    {stat.value}
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[14px] font-black text-[#0E1A2B] tracking-widest uppercase">
                      {stat.label}
                    </h3>
                    <p className="text-[15px] leading-[1.5] text-[#718096]">
                      {stat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Subtle Decorative Gradient */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-[#B8643E05] to-transparent rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />
    </section>
  );
};

export default TrustSection;
