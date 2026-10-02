'use client';
import { useCallback, useEffect, useRef } from 'react';
import { portalFetch, usePortalResource } from './PortalLiveProvider';
import { getDocumentCopy } from '@/lib/case-documents/copy';
import type { CustomerDocument } from '@/lib/case-documents/types';
export default function CaseDocuments({ publicRequestNumber, locale, initialDocuments }: { publicRequestNumber: string; locale: string; initialDocuments?: CustomerDocument[] }) {
  const scrolledTarget = useRef<string | null>(null);
  const copy = getDocumentCopy(locale);
  const endpoint = '/api/portal/requests/' + encodeURIComponent(publicRequestNumber) + '/documents';
  const loader = useCallback(() => portalFetch<CustomerDocument[]>(endpoint), [endpoint]);
  const resource = usePortalResource('documents:' + publicRequestNumber, initialDocuments ?? null, loader);
  const documents = resource.data; const error = resource.error; const load = resource.reload;
  useEffect(() => {
    if (!documents) return;
    const target = window.location.hash.slice(1);
    if (target.startsWith('document-') && scrolledTarget.current !== target) {
      const element = document.getElementById(target);
      if (element) { element.scrollIntoView({ block: 'nearest' }); scrolledTarget.current = target; }
    }
  }, [documents]);
  return <section id="case-documents" dir={locale === 'ar' ? 'rtl' : undefined} className="rounded-[22px] border border-[#E5EAF0] bg-white p-4 shadow-sm">
    <h2 className="text-base font-semibold text-[#172033]">{copy.heading}</h2>
    {error ? <div role="alert" className="mt-3 text-sm text-red-700"><p>{copy.error}</p><button type="button" onClick={load} className="mt-2 rounded-lg border px-3 py-2">{copy.retry}</button></div> : !documents ? <p role="status" className="mt-3 text-sm text-[#667085]">{copy.loading}</p> : documents.length === 0 ? <p className="mt-3 text-sm text-[#667085]">{copy.empty}</p> : <div className="mt-4 space-y-3">
      {documents.map((row) => <article id={'document-' + row.id} key={row.id} className="min-w-0 space-y-2 rounded-xl border border-[#E5EAF0] p-4">
        <p className="text-xs text-[#667085]">{copy.types[row.type]} · {new Date(row.publishedAt!).toLocaleDateString(locale)}</p>
        <h3 className="break-words text-sm font-semibold text-[#172033]">{row.title}</h3>
        {row.comment && <p className="whitespace-pre-wrap break-words text-sm text-[#475467]">{row.comment}</p>}
        <div className="flex flex-wrap gap-2"><a href={endpoint + '/' + row.id} target="_blank" rel="noopener noreferrer" className="rounded-xl bg-[#172033] px-4 py-2 text-sm font-semibold text-white">{copy.open}</a><a href={endpoint + '/' + row.id + '?download=1'} className="rounded-xl border border-[#D0D5DD] px-4 py-2 text-sm font-semibold text-[#172033]">{copy.download}</a></div>
      </article>)}
    </div>}
  </section>;
}
