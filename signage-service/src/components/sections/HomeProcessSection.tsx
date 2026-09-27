import { getHomeProcessContent } from '@/lib/content/home-process';

export default function HomeProcessSection({ locale }: { locale: string }) {
  const content = getHomeProcessContent(locale);

  return (
    <section id="home-process" aria-labelledby="home-process-title" className="bg-[#EEF3FB] py-8 text-start sm:py-12">
      <div className="pr-site-container">
        <div className="rounded-[28px] bg-white px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="max-w-3xl">
            <h2 id="home-process-title" className="text-[32px] font-extrabold leading-[1.1] text-[#0E1A2B] md:text-[42px]">
              {content.title}
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#4A5568]">{content.intro}</p>
          </div>

          <ol className="mt-8 grid md:mt-10 md:grid-cols-3">
            {content.steps.map((step, index) => (
              <li key={step.title} className="min-w-0 border-t border-[#0E1A2B]/10 py-6 first:border-0 first:pt-0 last:pb-0 md:border-s md:border-t-0 md:px-7 md:py-0 md:first:ps-0 md:last:pe-0">
                <span aria-hidden="true" className="text-sm font-semibold tabular-nums text-[#B8643E]">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 text-xl font-semibold leading-snug text-[#0E1A2B]">{step.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-[#4A5568]">{step.description}</p>
              </li>
            ))}
          </ol>

          <ul className="mt-8 grid gap-6 border-t border-[#0E1A2B]/10 pt-7 md:mt-10 md:grid-cols-3 md:gap-0 md:pt-8">
            {content.principles.map((principle) => (
              <li key={principle.title} className="min-w-0 md:px-7 md:first:ps-0 md:last:pe-0">
                <h3 className="text-base font-semibold leading-snug text-[#0E1A2B]">{principle.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#4A5568]">{principle.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
