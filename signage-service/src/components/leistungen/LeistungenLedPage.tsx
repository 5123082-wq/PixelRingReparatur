import Image from 'next/image';
import { Link } from '@/i18n/routing';
import SectionEyebrow from '@/components/common/SectionEyebrow';
import HeroBreadcrumbs from '@/components/common/HeroBreadcrumbs';
import LeistungenFooterCTA from '@/components/sections/LeistungenFooterCTA';
import { getLedVisualCopy, type LedLocale } from '@/lib/content/led-modernization';
import LeistungenLedLightbox from './LeistungenLedLightbox';
import LeistungenRequestButton from './LeistungenRequestButton';
import styles from './LeistungenLedPage.module.css';

type LedPageContent = {
  heroEyebrow: string; intent: string; primaryCta: string;
  process: Array<{ title: string; text: string }>;
  faqTitle: string; faqs: Array<{ question: string; answer: string }>;
  decisionGuide?: { eyebrow: string; options: Array<{ title: string; text: string; tag: string }>; noteText: string };
  problemLinks?: { eyebrow: string; links: Array<{ title: string; text: string; tag: string; href: string }> };
  nextStep?: { servicesTitle: string; links: Array<{ title: string; text: string; tag: string; href: string }> };
  finalHeadline: string; finalText: string;
};

const HERO_IMAGE = '/images/leistungen/lichtwerbung-led-modernisierung-lichtkasten-led-module.webp';
const SERVICE_IMAGES = [HERO_IMAGE, '/images/references/led-detail.webp', '/images/leistungen/repair-proof/led-leuchtbuchstaben-bildungszentrum-berlin-fassade-nachher.webp'];

export default function LeistungenLedPage({ locale, content, breadcrumbs }: {
  locale: LedLocale;
  content: LedPageContent;
  breadcrumbs: Array<{ label: string; href?: string }>;
}) {
  const copy = getLedVisualCopy(locale);
  const requestProps = { label: content.primaryCta, serviceIntent: content.intent, initialMessage: content.heroEyebrow };
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <Image src={HERO_IMAGE} alt={copy.photoAlt} fill loading="eager" fetchPriority="high" sizes="100vw" className={styles.heroImage} />
        <div className={styles.heroShade} aria-hidden="true" />
        <div className={`pr-site-container ${styles.heroInner}`}>
          <HeroBreadcrumbs items={breadcrumbs} position="static" />
          <div className={styles.heroCopy}>
            <div className={styles.heroAccent} aria-hidden="true" />
            <h1>{copy.title}</h1>
            <p>{copy.intro}</p>
            <div className={styles.heroActions}>
              <LeistungenRequestButton {...requestProps} />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="pr-site-container">
          <div className={styles.servicesHeading}><SectionEyebrow className="mb-4">{copy.servicesEyebrow}</SectionEyebrow><h2>{copy.servicesTitle}</h2></div>
          <div className={styles.serviceGrid}>
            {copy.services.map((service, i) => <article key={service.title}>
              <div className={styles.serviceImage}><Image src={SERVICE_IMAGES[i]} alt={service.alt} fill sizes="(max-width: 700px) 100vw, 33vw" /></div>
              <h3>{service.title}</h3><p>{service.text}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section id="led-explore" className={styles.demoSection}>
        <div className="pr-site-container">
          <div className={styles.sectionHeading}>
            <div><p className={styles.demoEyebrow}>{copy.demoEyebrow}</p><h2>{copy.demoTitle}</h2></div>
            <p>{copy.demoIntro}</p>
          </div>
          <p className={styles.demoHint}>{copy.demoHint}</p>
          <LeistungenLedLightbox copy={{ stages: copy.stages, stageTitles: copy.stageTitles, stageTexts: copy.stageTexts, layers: copy.layers, sign: copy.sign, demoNote: copy.demoNote }} />
        </div>
      </section>

      {content.decisionGuide && <section className={`${styles.section} ${styles.decision}`}>
        <div className="pr-site-container">
          <SectionEyebrow className="mb-4">{content.decisionGuide.eyebrow}</SectionEyebrow><h2>{copy.decisionTitle}</h2>
          <div className={styles.decisionGrid}>{content.decisionGuide.options.map(option => <article key={option.tag}>
            <span>{option.tag}</span><h3>{option.title}</h3><p>{option.text}</p>
          </article>)}</div>
          <p className={styles.decisionNote}>{content.decisionGuide.noteText}</p>
        </div>
      </section>}

      <section className={styles.section}>
        <div className={`pr-site-container ${styles.processGrid}`}>
          <div className={styles.processIntro}>
            <h2>{copy.processTitle}</h2><p>{copy.requestHint}</p>
            <LeistungenRequestButton {...requestProps} />
          </div>
          <div className={styles.processList}>{content.process.map((step, i) => <article key={step.title}>
            <span>0{i + 1}</span><div><h3>{step.title}</h3><p>{step.text}</p></div>
          </article>)}</div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.faq}`}>
        <div className="pr-site-container">
          <div className={styles.faqGrid}>
            <div><h2>{content.faqTitle}</h2><p className={styles.faqIntro}>{copy.faqIntro}</p></div>
            <div>{content.faqs.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
          </div>
          {content.problemLinks && <div className={styles.related}><h3>{content.problemLinks.eyebrow}</h3>
            <div className={styles.relatedLinks}>{content.problemLinks.links.map(link => (
              <Link key={link.href} href={link.href} className={styles.relatedCard}>
                <span className={styles.relatedCardTop}><span className={styles.relatedTag}>{link.tag}</span><span className={styles.relatedArrow} aria-hidden="true">→</span></span>
                <h4>{link.title}</h4><p>{link.text}</p>
              </Link>
            ))}</div>
          </div>}
          {content.nextStep && <div className={styles.related}><h3>{content.nextStep.servicesTitle}</h3>
            <div className={`${styles.relatedLinks} ${styles.relatedServices}`}>{content.nextStep.links.map(link => (
              <Link key={link.href} href={link.href} className={styles.relatedCard}>
                <span className={styles.relatedCardTop}><span className={styles.relatedTag}>{link.tag}</span><span className={styles.relatedArrow} aria-hidden="true">→</span></span>
                <h4>{link.title}</h4><p>{link.text}</p>
              </Link>
            ))}</div>
          </div>}
        </div>
      </section>
      <LeistungenFooterCTA locale={locale} finalHeadline={content.finalHeadline} finalText={copy.requestHint} requestTitle={copy.processTitle} requestText={copy.requestHint} requestCta={content.primaryCta} serviceIntent={content.intent} initialMessage={content.heroEyebrow} imageSrc={HERO_IMAGE} imageAlt={copy.photoAlt} />
    </div>
  );
}
