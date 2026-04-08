'use client';

import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';

import { getLocaleSegment, withLocalePath } from '../../admin-route';

export default function CmsDashboardPage() {
  const router = useRouter();
  const params = useParams();
  const locale = getLocaleSegment(params?.locale);
  return (
    <div>
      <div style={styles.header}>
        <h1 style={styles.title}>CMS Overview</h1>
        <p style={styles.subtitle}>Manage website content, AI intelligence and SEO strategies.</p>
      </div>

      <div style={styles.grid}>
        {/* Card: Content Status */}
        <div 
          onClick={() =>
            router.push(withLocalePath(locale, '/ring-master-config/dashboard/articles'))
          }
          style={{ ...styles.card, cursor: 'pointer' }}
        >
          <div style={styles.cardIcon}>📄</div>
          <h3 style={styles.cardTitle}>Content & Wiki</h3>
          <p style={styles.cardDesc}>
            Manage Typical Symptoms, FAQ and informational pages. Unified source for website and AI.
          </p>
          <div style={styles.stat}>
             <span style={styles.statLabel}>Total Articles:</span>
             <span style={styles.statValue}>—</span>
          </div>
        </div>

        {/* Card: AI Intelligence */}
        <div 
          onClick={() => router.push(withLocalePath(locale, '/ring-master-config/dashboard/ai'))}
          style={{ ...styles.bgCard, cursor: 'pointer' }}
        >
          <div style={styles.cardIcon}>🤖</div>
          <h3 style={styles.cardTitle}>AI Brain Config</h3>
          <p style={styles.cardDesc}>
            Configure System Prompt and Knowledge Base. Model: <strong>GPT-4o mini</strong>
          </p>
          <div style={styles.badge}>Live & Training</div>
        </div>

        {/* Card: SEO / GEO Strategy */}
        <div 
          onClick={() => router.push(withLocalePath(locale, '/ring-master-config/dashboard/seo'))}
          style={{ ...styles.card, cursor: 'pointer' }}
        >
          <div style={styles.cardIcon}>🌍</div>
          <h3 style={styles.cardTitle}>SEO & Keywords</h3>
          <p style={styles.cardDesc}>
            Manage regional keywords and meta-tags to rank in Google and AI-search engines.
          </p>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    marginBottom: '40px',
  },
  title: {
    margin: 0,
    fontSize: '32px',
    fontWeight: 700,
    color: '#fff',
    letterSpacing: '-0.02em',
  },
  subtitle: {
    margin: '8px 0 0',
    fontSize: '15px',
    color: '#888',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
  },
  card: {
    background: '#141414',
    border: '1px solid #222',
    borderRadius: '16px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  bgCard: {
    background: 'linear-gradient(135deg, #1e1b4b 0%, #141414 100%)',
    border: '1px solid #312e81',
    borderRadius: '16px',
    padding: '32px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  cardIcon: {
    fontSize: '32px',
    marginBottom: '8px',
  },
  cardTitle: {
    margin: 0,
    fontSize: '20px',
    fontWeight: 600,
    color: '#fff',
  },
  cardDesc: {
    margin: 0,
    fontSize: '14px',
    color: '#aaa',
    lineHeight: 1.6,
  },
  stat: {
    marginTop: 'auto',
    paddingTop: '20px',
    borderTop: '1px solid #222',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: '13px',
    color: '#666',
  },
  statValue: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#fff',
  },
  badge: {
    marginTop: 'auto',
    alignSelf: 'flex-start',
    padding: '4px 12px',
    fontSize: '11px',
    fontWeight: 700,
    background: '#4c1d95',
    color: '#c4b5fd',
    borderRadius: '20px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  }
};
