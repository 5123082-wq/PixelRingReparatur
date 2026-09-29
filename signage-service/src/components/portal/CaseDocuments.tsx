'use client';
import { useCallback, useEffect, useState } from 'react';
import { getDocumentCopy } from '@/lib/case-documents/copy';
import type { CustomerDocument } from '@/lib/case-documents/types';
export default function CaseDocuments({ publicRequestNumber, locale }: { publicRequestNumber: string; locale: string }) {
  const [documents, setDocuments] = useState<CustomerDocument[] | null>(null);
  const [error, setError] = useState(false);
  const copy = getDocumentCopy(locale);
  const endpoint = '/api/portal/requests/' + encodeURIComponent(publicRequestNumber) + '/documents';
  const load = useCallback(async () => {
    try {
      const response = await fetch(endpoint, { cache: 'no-store' });
      if (!response.ok) throw new Error();
      setDocuments(await response.json()); setError(false);
    } catch { setDocuments(null); setError(true); }
  }, [endpoint]);
  useEffect(() => {
    void load();
    const refresh = () => { if (document.visibilityState === 'visible') void load(); };
    window.addEventListener('focus', refresh);
    const timer = window.setInterval(refresh, 30_000);
    return () => { window.removeEventListener('focus', refresh); window.clearInterval(timer); };
  }, [load]);
  return <section id="case-documents" dir={locale === 'ar' ? 'rtl' : undefined} className="rounded-[22px] border border-[#E5EAF0] bg-white p-4 shadow-sm">
    <h2 className="text-base font-semibold text-[#172033]">{copy.heading}</h2>
    {error ? <div role="alert" className="mt-3 text-sm text-red-700"><p>{copy.error}</p><button type="button" onClick={load} className="mt-2 rounded-lg border px-3 py-2">{copy.retry}</button></div> : !documents ? <p role="status" className="mt-3 text-sm text-[#667085]">{copy.loading}</p> : documents.length === 0 ? <p className="mt-3 text-sm text-[#667085]">{copy.empty}</p> : <div className="mt-4 space-y-3">
      {documents.map((row) => <article key={row.id} className="min-w-0 space-y-2 rounded-xl border border-[#E5EAF0] p-4">
        <p className="text-xs text-[#667085]">{copy.types[row.type]} · {new Date(row.publishedAt!).toLocaleDateString(locale)}</p>
        <h3 className="break-words text-sm font-semibold text-[#172033]">{row.title}</h3>
        {row.comment && <p className="whitespace-pre-wrap break-words text-sm text-[#475467]">{row.comment}</p>}
        <div className="flex flex-wrap gap-2"><a href={endpoint + '/' + row.id} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-[#172033] px-4 py-2 text-sm font-semibold text-white">{copy.open}</a><a href={endpoint + '/' + row.id + '?download=1'} className="rounded-xl border border-[#D0D5DD] px-4 py-2 text-sm font-semibold text-[#172033]">{copy.download}</a></div>
      </article>)}
    </div>}
  </section>;
}
