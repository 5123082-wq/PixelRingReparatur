'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { adminFetch } from '@/lib/admin-fetch';
import { DOCUMENT_TYPES, MAX_DOCUMENT_BYTES, type CustomerDocument, type DocumentType } from '@/lib/case-documents/types';
import { getDocumentCopy } from '@/lib/case-documents/copy';
const copy = getDocumentCopy('ru');
const field = 'mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white focus:border-indigo-400 outline-none disabled:opacity-50';
const button = 'min-h-11 rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-white hover:border-indigo-400 focus-visible:outline-2 focus-visible:outline-indigo-400 disabled:opacity-40';
const errorText: Record<string, string> = {
  file_type: 'Выберите PDF-файл.', file_size: 'Размер PDF должен быть не больше 4 МБ.',
  invalid_input: 'Проверьте тип, название и комментарий.', portal_required: 'Сначала подключите клиенту личный кабинет для этой заявки. Документ сохранён как черновик.',
  request_number_required: 'Сначала присвойте заявке номер.', not_found: 'Документ недоступен или у вас нет доступа к заявке.',
  rate_limited: 'Слишком много действий. Повторите через минуту.', upload_conflict: 'Выберите файл заново и повторите загрузку.',
};
async function read(response: Response): Promise<CustomerDocument> {
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(errorText[data?.error] || 'Не удалось выполнить действие. Повторите попытку.');
  return data;
}
export default function CaseDocuments({ caseId, onPublished }: { caseId: string; onPublished: () => Promise<void> }) {
  const [documents, setDocuments] = useState<CustomerDocument[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const uploadId = useRef('');
  const endpoint = '/api/admin/cases/' + caseId + '/documents';
  const load = useCallback(async () => {
    try {
      const response = await fetch(endpoint, { cache: 'no-store' });
      if (!response.ok) throw new Error();
      setDocuments(await response.json()); setLoaded(true); setError('');
    } catch { setError('Не удалось загрузить документы. Повторите попытку.'); }
  }, [endpoint]);
  useEffect(() => { void load(); }, [load]);
  async function uploadFile() {
    if (!file || busy) return;
    setBusy(true); setError(''); setNotice('');
    try {
      const form = new FormData(); form.set('id', uploadId.current); form.set('file', file);
      const row = await read(await adminFetch(endpoint, { method: 'POST', body: form }));
      setDocuments((old) => [row, ...old.filter((item) => item.id !== row.id)]);
      setFile(null); uploadId.current = ''; setNotice('PDF загружен. Выберите тип, проверьте название и отправьте клиенту.');
    } catch (failure) { setError((failure as Error).message); }
    finally { setBusy(false); }
  }
  async function publish(row: CustomerDocument) {
    setBusy(true); setError(''); setNotice('');
    try {
      const saved = await read(await adminFetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'publish', id: row.id, type: row.type, title: row.title, comment: row.comment }) }));
      setDocuments((old) => old.map((item) => item.id === row.id ? saved : item));
      setNotice('Документ доступен в кабинете клиента. Сообщение добавлено в переписку.');
      await onPublished();
    } catch (failure) { setError((failure as Error).message); }
    finally { setBusy(false); }
  }
  function edit(id: string, patch: Partial<CustomerDocument>) { setDocuments((old) => old.map((row) => row.id === id ? { ...row, ...patch } : row)); }
  return <section className="mx-auto w-full max-w-3xl space-y-5 p-4 sm:p-7">
    <header><h2 className="text-xl font-bold text-white">Документы клиенту</h2><p className="mt-2 text-sm leading-6 text-zinc-400">Загрузите PDF, выберите тип и отправьте в кабинет клиента. До отправки документ виден только сотрудникам.</p></header>
    {error && <p role="alert" className="rounded-xl bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
    {notice && <p role="status" className="rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-200">{notice}</p>}
    {!loaded ? <button type="button" onClick={load} className={button}>Повторить загрузку списка</button> : <>
      <fieldset disabled={busy} className="space-y-3 rounded-xl border border-zinc-700 p-4">
        <input ref={fileInput} aria-label="Выбрать PDF" type="file" accept="application/pdf,.pdf" className="hidden" onChange={(event) => {
          const selected = event.target.files?.[0]; event.target.value = ''; if (!selected) return;
          if (!/\.pdf$/i.test(selected.name)) { setError(errorText.file_type); return; }
          if (!selected.size || selected.size > MAX_DOCUMENT_BYTES) { setError(errorText.file_size); return; }
          setError(''); setFile(selected); uploadId.current = crypto.randomUUID();
        }} />
        <button type="button" onClick={() => fileInput.current?.click()} className={button + ' w-full bg-indigo-600 hover:bg-indigo-500'}>＋ Выбрать PDF с компьютера</button>
        <p className="text-xs text-zinc-400">Один документ — один PDF, до 4 МБ.</p>
        {file && <div className="space-y-3"><p className="break-all text-sm text-zinc-200">{file.name}</p><div className="flex flex-wrap gap-2"><button type="button" onClick={uploadFile} className={button}>Загрузить черновик</button><button type="button" onClick={() => setFile(null)} className={button}>Отмена</button></div></div>}
      </fieldset>
      {busy && <p role="status" className="text-sm text-indigo-300">Подождите, выполняется действие…</p>}
      {documents.length === 0 && <p className="text-sm text-zinc-400">Документов пока нет.</p>}
      {documents.map((row) => <article key={row.id} className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2"><span className={'rounded-full px-3 py-1 text-xs ' + (row.publishedAt ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300')}>{row.publishedAt ? 'Отправлен · ' + new Date(row.publishedAt).toLocaleDateString('ru') : 'Черновик · клиент не видит'}</span><a href={endpoint + '/' + row.id} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-300 underline">Открыть PDF</a></div>
        {row.publishedAt ? <><p className="text-xs text-zinc-400">{copy.types[row.type]}</p><h3 className="break-words font-semibold text-white">{row.title}</h3>{row.comment && <p className="whitespace-pre-wrap break-words text-sm text-zinc-300">{row.comment}</p>}</> : <fieldset disabled={busy} className="space-y-3">
          <label className="block text-sm text-zinc-300">Тип документа<select className={field} value={row.type} onChange={(event) => edit(row.id, { type: event.target.value as DocumentType })}>{DOCUMENT_TYPES.map((type) => <option key={type} value={type}>{copy.types[type]}</option>)}</select></label>
          <label className="block text-sm text-zinc-300">Название для клиента<input maxLength={160} className={field} value={row.title} onChange={(event) => edit(row.id, { title: event.target.value })} /></label>
          <label className="block text-sm text-zinc-300">Комментарий · необязательно<textarea maxLength={2000} rows={3} className={field} value={row.comment} onChange={(event) => edit(row.id, { comment: event.target.value })} /></label>
          <p className="text-xs leading-5 text-zinc-400">После отправки PDF, название и комментарий станут доступны клиенту.</p>
          <button type="button" disabled={!row.title.trim()} onClick={() => publish(row)} className={button + ' w-full bg-indigo-600 hover:bg-indigo-500'}>Отправить клиенту</button>
        </fieldset>}
      </article>)}
    </>}
  </section>;
}
