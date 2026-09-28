'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { getWorkResultCopy } from '@/lib/work-results/copy';
import type { PublicWorkResult } from '@/lib/work-results/types';

export default function WorkResultView({ result, locale, publicRequestNumber, printVersion = false, preview = false }: {
  result: PublicWorkResult | null; locale: string; publicRequestNumber: string; printVersion?: boolean; preview?: boolean;
}) {
  const copy = getWorkResultCopy(locale);
  const [loaded, setLoaded] = useState<string[]>([]);
  const [failed, setFailed] = useState<string[]>([]);
  const [retry, setRetry] = useState(0);
  const category = { BEFORE: copy.before, PROCESS: copy.process, RESULT: copy.result };
  const date = (value: string) => new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'Europe/Berlin' }).format(new Date(value.length === 10 ? value + 'T12:00:00Z' : value));
  const readyToPrint = !result || result.photos.every((photo) => loaded.includes(photo.id) && !failed.includes(photo.id));
  return (
    <section id="repair-report" dir={locale === 'ar' ? 'rtl' : 'ltr'} className="work-result-view rounded-[22px] border border-[#E5EAF0] bg-white p-5 text-[#172033] shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-black">{copy.title}</h2>
        {result && !preview && (printVersion ?
          <button type="button" disabled={!readyToPrint} onClick={() => window.print()} className="report-controls rounded-xl border px-4 py-2 text-sm font-bold disabled:opacity-40">{copy.print}{!readyToPrint ? ' …' : ''}</button> :
          <Link href={'/portal/requests/' + encodeURIComponent(publicRequestNumber) + '/report/print'} target="_blank" rel="noopener noreferrer" className="report-controls rounded-xl border px-4 py-2 text-sm font-bold">{copy.print}</Link>)}
      </div>
      {!result ? <p className="mt-4 text-sm text-slate-600">{copy.empty}</p> : <>
        {printVersion && <p className="mt-3 font-bold">PixelRing · <span dir="ltr">{publicRequestNumber}</span></p>}
        <p className="mt-3 text-sm"><strong>{copy.date}:</strong> {date(result.completedOn)}</p>
        {result.number > 1 && <p className="mt-1 text-xs text-slate-500">{copy.updated}: {date(result.publishedAt)} · № {result.number}</p>}
        {result.note && <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7">{result.note}</p>}
        {result.items.length > 0 && <dl className="mt-4 grid gap-3">{result.items.map((item, index) => <div key={index} className="break-words">{item.title && <dt className="font-bold">{item.title}</dt>}{item.text && <dd className="mt-1 whitespace-pre-wrap text-sm leading-6">{item.text}</dd>}</div>)}</dl>}
        {failed.length > 0 && <div role="alert" className="report-controls mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900"><p>{copy.imageError}</p><button type="button" className="mt-2 font-bold underline" onClick={() => { setLoaded([]); setFailed([]); setRetry((value) => value + 1); }}>{copy.retry}</button></div>}
        {result.photos.length === 0 ? <p className="mt-4 text-sm text-slate-500">{copy.noPhotos}</p> :
          <div className="report-photos mt-5 grid gap-5 sm:grid-cols-2">
            {result.photos.map((photo) => <figure key={photo.id} className="report-photo min-w-0 overflow-hidden rounded-2xl border border-slate-200">
              <a href={photo.url} target="_blank" rel="noreferrer">
                {/* Private image routes must use the viewer's session, not an image optimizer. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url + (retry ? '?retry=' + retry : '')} alt={photo.caption || category[photo.category]} ref={(element) => {
                  // A private image can finish loading before React hydrates the
                  // print page, so the load event alone is not sufficient.
                  if (element?.complete && element.naturalWidth > 0 && !loaded.includes(photo.id)) {
                    setLoaded((previous) => previous.includes(photo.id) ? previous : [...previous, photo.id]);
                  } else if (element?.complete && !element.naturalWidth && !failed.includes(photo.id)) {
                    setFailed((previous) => previous.includes(photo.id) ? previous : [...previous, photo.id]);
                  }
                }} onLoad={() => { setLoaded((previous) => previous.includes(photo.id) ? previous : [...previous, photo.id]); setFailed((previous) => previous.filter((id) => id !== photo.id)); }} onError={() => setFailed((previous) => previous.includes(photo.id) ? previous : [...previous, photo.id])} className="h-64 w-full bg-slate-50 object-contain" />
              </a>
              <figcaption className="p-3 text-sm"><strong>{category[photo.category]}</strong>{photo.caption && <p className="mt-1 whitespace-pre-wrap break-words">{photo.caption}</p>}</figcaption>
            </figure>)}
          </div>}
      </>}
      {printVersion && <style>{'@media print { .report-controls { display: none !important; } .work-result-view { border: 0; box-shadow: none; padding: 0; } .report-photo { break-inside: avoid; } .report-photos { display: block; } .report-photo { margin: 16px 0; } .report-photo img { height: auto; max-height: 180mm; } @page { margin: 16mm; } }'}</style>}
    </section>
  );
}
