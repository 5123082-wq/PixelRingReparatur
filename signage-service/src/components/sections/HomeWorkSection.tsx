import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { getHomeWorkContent } from '@/lib/content/home-work';

export default function HomeWorkSection({ locale }: { locale: string }) {
  const content = getHomeWorkContent(locale);
  const photos = [
    {
      src: '/images/references/pasternak-facade-lettering-before.png',
      alt: content.beforeAlt,
      caption: content.beforeLabel,
    },
    {
      src: '/images/references/pasternak-facade-lettering-result.jpg',
      alt: content.resultAlt,
      caption: content.resultLabel,
    },
  ];

  return (
    <section id="home-work" aria-labelledby="home-work-title" className="bg-[#EEF3FB] py-8 text-start sm:py-12">
      <div className="pr-site-container">
        <h2 id="home-work-title" className="text-[32px] font-extrabold leading-[1.1] text-[#0E1A2B] md:text-[42px]">
          {content.heading}
        </h2>

        <div className="mt-8 overflow-hidden rounded-[28px] bg-white">
          <div className="grid gap-1 md:grid-cols-2">
            {photos.map((photo) => (
              <figure key={photo.src} className="min-w-0">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 1440px) 664px, (min-width: 768px) 48vw, 100vw"
                    className="object-cover object-[center_45%]"
                  />
                </div>
                <figcaption className="px-6 pb-2 pt-4 text-sm font-medium text-[#4A5568] sm:px-8 lg:px-10">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="px-6 pb-8 pt-5 sm:px-8 sm:pb-10 lg:px-10">
            <h3 className="text-xl font-semibold leading-snug text-[#0E1A2B] sm:text-2xl">{content.title}</h3>
            <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
              <p className="max-w-3xl text-base leading-relaxed text-[#4A5568]">{content.description}</p>
              <Link
                href="/referenzen#recent-work"
                className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start rounded-sm text-sm font-semibold text-[#0E1A2B] underline decoration-[#0E1A2B]/30 underline-offset-4 transition-colors hover:decoration-[#0E1A2B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#B8643E] lg:self-auto"
              >
                {content.linkLabel}
                <span aria-hidden="true" className="rtl:rotate-180">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
