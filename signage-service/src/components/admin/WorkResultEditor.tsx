'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { upload } from '@vercel/blob/client';
import { adminFetch, withAdminCsrfHeaders } from '@/lib/admin-fetch';
import { newWorkResultDraft, workResultMissingFields, type WorkResultDraft, type WorkPhotoCategory } from '@/lib/work-results/types';
import WorkResultView from '@/components/portal/WorkResultView';
import StageWindow from './StageWindow';
import { TransitionRequestError } from './useCaseStatusTransition';

type Attachment = { id: string; originalFilename: string | null; mimeType: string };
type ResultState = {
  version: number; publishedVersion: number; hasDraft: boolean; draft: WorkResultDraft;
  role?: string; history: { number: number; publishedAt: string; correctionReason: string | null; noPhotoReason: string | null }[];
  notifications: { id: string; state: string; startedAt: string | null; lastError: string | null }[];
};
const fieldLabels: Record<string, string> = { completedOn: 'Дата выполнения', photos: 'Итоговая фотография', items: 'Название и текст дополнительного пункта', correctionReason: 'Причина исправления' };
const errors: Record<string, string> = {
  work_result_required: 'Чтобы завершить ремонт, добавьте итоговую фотографию и проверьте дату выполнения.',
  version_conflict: 'Отчёт изменён в другом окне. Ваши поля сохранены на экране. Обновите данные перед продолжением.',
  owner_required: 'Исключение без итоговой фотографии должен подтвердить владелец.',
  invalid_status: 'Публикация доступна для заявки в ремонте, после ремонта или после закрытия.',
  invalid_photos: 'Выберите фотографии этой заявки.',
  file_type: 'Нужна корректная фотография JPEG, PNG или WebP.',
  file_size: 'Файл пустой или превышает допустимый размер.',
  invalid_input: 'Проверьте заполнение полей и допустимый объём текста.',
  upload_expired: 'Время загрузки истекло. Выберите фотографию ещё раз.',
  request_number_required: 'Сначала присвойте заявке номер.',
  rate_limited: 'Слишком много действий. Повторите через минуту.',
};
const control = 'mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-indigo-400 disabled:opacity-50';
const button = 'rounded-xl border border-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-200 hover:border-indigo-400 disabled:opacity-40';

export default function WorkResultEditor({ caseId, caseStatus, publicRequestNumber, attachments, completionRequested = false, onPublished, transition }: {
  caseId: string; caseStatus: string; publicRequestNumber: string | null; attachments: Attachment[]; completionRequested?: boolean; onPublished: (published: boolean) => Promise<void>;
  transition?: { targetLabel: string; publish: (version: number) => Promise<void>; stop: () => void };
}) {
  const [state, setState] = useState<ResultState | null>(null);
  const [draft, setDraft] = useState<WorkResultDraft>(newWorkResultDraft);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [missing, setMissing] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  const [preview, setPreview] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const attachmentButton = useRef<HTMLButtonElement>(null);
  const [choosingAttachments, setChoosingAttachments] = useState(false);
  const [selectedAttachments, setSelectedAttachments] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);
  const availableAttachments = attachments.filter((file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimeType) && !draft.photos.some((photo) => photo.attachmentId === file.id));
  const selectedPhotos = availableAttachments.filter((file) => selectedAttachments.includes(file.id));
  function closeAttachmentPicker() {
    setChoosingAttachments(false); setSelectedAttachments([]); attachmentButton.current?.focus();
  }
  const pendingPublication = useRef<number | null>(null);
  const cancelledAt = useRef(0);
  const modalOpen = Boolean(transition) || confirming;
  const endpoint = '/api/admin/cases/' + caseId + '/work-result';

  const load = useCallback(async () => {
    try {
      const response = await fetch(endpoint, { cache: 'no-store' });
      if (!response.ok) throw new Error();
      const data = await response.json() as ResultState;
      setState(data); setDraft(data.draft); setError(''); setMissing([]); pendingPublication.current = null;
    } catch { setError('Не удалось загрузить результат ремонта. Повторите попытку.'); }
  }, [endpoint]);
  useEffect(() => { void load(); }, [load]);

  function update(patch: Partial<WorkResultDraft>) { pendingPublication.current = null; setDraft((old) => ({ ...old, ...patch })); setNotice(''); }
  function photoChange(index: number, patch: Partial<WorkResultDraft['photos'][number]>) {
    pendingPublication.current = null;
    setDraft((old) => ({ ...old, photos: old.photos.map((photo, i) => i === index ? { ...photo, ...patch } : photo) }));
  }
  function movePhoto(index: number, offset: number) {
    const photos = [...draft.photos];
    [photos[index], photos[index + offset]] = [photos[index + offset], photos[index]];
    update({ photos });
  }
  async function read(response: Response) {
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      setMissing(data?.missingFields || []);
      const code = data?.code || data?.error || 'operation_failed';
      throw Object.assign(new Error(errors[code] || 'Не удалось сохранить изменения. Повторите попытку.'), { code });
    }
    return data;
  }
  async function save(publish = false) {
    if (!state || busy) return;
    const attempt = cancelledAt.current;
    setBusy(true); setError(''); setMissing([]); setNotice('');
    try {
      let data = state;
      if (!publish || pendingPublication.current === null) {
        data = await read(await adminFetch(endpoint, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ version: state.version, draft }),
        }));
        setState((old) => ({ ...data, role: old?.role }));
        if (publish) pendingPublication.current = data.version;
      }
      if (publish) {
        if (attempt !== cancelledAt.current) return;
        if (transition) {
          await transition.publish(pendingPublication.current!);
          pendingPublication.current = null;
          data = await read(await fetch(endpoint, { cache: 'no-store' }));
        } else {
          data = await read(await adminFetch(endpoint, {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'publish', version: pendingPublication.current }),
          }));
          pendingPublication.current = null;
        }
        setState((old) => ({ ...data, role: old?.role })); setDraft(data.draft);
        setConfirming(false);
        await onPublished(true);
      }
      setNotice(publish ? 'Отчёт опубликован.' : 'Черновик сохранён. Клиент его пока не видит.');
    } catch (failure) {
      if (failure instanceof TransitionRequestError) setMissing(failure.fields);
      if (failure && typeof failure === 'object' && 'code' in failure && failure.code !== 'operation_failed') pendingPublication.current = null;
      setError(failure instanceof Error ? failure.message : 'Ошибка сохранения.');
    }
    finally { setBusy(false); }
  }
  async function uploadFiles(files: FileList | null) {
    if (!files?.length || busy) return;
    pendingPublication.current = null;
    setBusy(true); setError(''); setNotice('');
    try {
      for (const [index, file] of Array.from(files).entries()) {
        setUploadProgress({ current: index + 1, total: files.length });
        const prepared = await read(await adminFetch(endpoint + '/uploads', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'prepare', filename: file.name, mimeType: file.type, size: file.size }),
        }));
        let response: Response;
        if (prepared.provider === 'blob') {
          await upload(prepared.pathname, file, { access: 'private', multipart: true,
            handleUploadUrl: endpoint + '/uploads/token', clientPayload: prepared.uploadId,
            headers: Object.fromEntries(withAdminCsrfHeaders().entries()) });
          response = await adminFetch(endpoint + '/uploads', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'complete', uploadId: prepared.uploadId }),
          });
        } else {
          const form = new FormData(); form.set('uploadId', prepared.uploadId); form.set('file', file);
          response = await adminFetch(endpoint + '/uploads', { method: 'POST', body: form });
        }
        const completed = await read(response);
        setDraft((old) => ({ ...old, photos: [...old.photos, { attachmentId: completed.attachmentId, category: 'RESULT', caption: '' }] }));
      }
      await onPublished(false);
      setNotice('Фотографии загружены. Сохраните черновик или опубликуйте отчёт.');
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Ошибка загрузки. Уже загруженные фотографии сохранены.'); }
    finally { setBusy(false); setUploadProgress(null); }
  }
  async function retryNotification() {
    setBusy(true); setError('');
    try {
      const data = await read(await adminFetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'retry-notification' }) }));
      setState((old) => ({ ...data, role: old?.role }));
    } catch (failure) { setError(failure instanceof Error ? failure.message : 'Ошибка отправки.'); }
    finally { setBusy(false); }
  }
  const canPublish = ['IN_PROGRESS', 'WORK_COMPLETED', 'READY_FOR_PICKUP', 'COMPLETED'].includes(caseStatus) && Boolean(publicRequestNumber);
  const statusMissing = (completionRequested || modalOpen) && state ? workResultMissingFields(draft, state.role || '', state.publishedVersion > 0) : [];
  const visibleMissing = error ? missing : statusMissing;
  const visibleError = error || (statusMissing.length ? errors.work_result_required : '');
  const fieldError = (key: string) => visibleMissing.includes(key) ? ' ring-2 ring-red-500' : '';
  return <StageWindow inline open={modalOpen} title={transition ? 'Переход к статусу «' + transition.targetLabel + '»' : 'Подтверждение публикации отчёта'} onClose={() => { cancelledAt.current += 1; setConfirming(false); transition?.stop(); }}>
  <section id="work-result-editor" className="mx-auto w-full max-w-4xl space-y-5 p-4 sm:p-7">
    <header><h2 className="text-xl font-bold text-white">Результат ремонта</h2><p className="mt-2 text-sm leading-6 text-zinc-400">{transition ? 'Проверьте отчёт и подтвердите публикацию. Затем переход к выбранному статусу продолжится.' : 'Дата и фотографии фиксируют выполненный ремонт.'}</p></header>
    {visibleError && <div role="alert" className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-200"><p>{visibleError}</p>{visibleMissing.length > 0 && <ul className="mt-2 list-inside list-disc">{visibleMissing.map((field) => <li key={field}>{fieldLabels[field] || field}</li>)}</ul>}{error.includes('другом окне') && <button onClick={load} className={button + ' mt-3'}>Загрузить актуальную редакцию</button>}</div>}
    {notice && <p role="status" className="rounded-xl bg-emerald-500/10 p-3 text-sm text-emerald-200">{notice}</p>}
    {!state ? <button onClick={load} className={button}>Загрузить данные</button> : <>
      <fieldset disabled={busy} className="min-w-0 space-y-5">
        <label className="block text-sm text-zinc-200">Дата выполнения<input aria-invalid={missing.includes('completedOn')} type="date" value={draft.completedOn} onChange={(event) => update({ completedOn: event.target.value })} className={control + fieldError('completedOn')} /></label>
        <label className="block text-sm text-zinc-200">Пояснение · необязательно<textarea maxLength={12000} rows={4} value={draft.note} onChange={(event) => update({ note: event.target.value })} className={control} /></label>
        <div className={'space-y-3 rounded-xl border border-zinc-800 p-3' + fieldError('photos')}>
          <h3 className="font-bold text-white">Фотографии</h3>
          <input ref={fileInput} type="file" aria-label="Загрузить фото с компьютера" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => { void uploadFiles(event.target.files); event.target.value = ''; }} className="hidden" />
          <div className="flex flex-col gap-2">
            <button type="button" onClick={() => fileInput.current?.click()} className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 disabled:opacity-50">
              <span aria-hidden="true">＋</span> Загрузить фото с компьютера
            </button>
            <button ref={attachmentButton} type="button" aria-expanded={choosingAttachments} aria-controls="work-result-attachments" onClick={() => { setChoosingAttachments(!choosingAttachments); setSelectedAttachments([]); }} className={button + ' min-h-11 w-full bg-zinc-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400'}>
              Выбрать из заявки · {availableAttachments.length}
            </button>
          </div>
          <p className="text-xs leading-5 text-zinc-400">JPEG, PNG или WebP. Можно выбрать несколько фотографий.</p>
          {uploadProgress && <p role="status" className="flex items-center gap-2 text-sm text-indigo-300"><span aria-hidden="true" className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-indigo-400/30 border-t-indigo-300 motion-reduce:animate-none" />Загрузка фото {uploadProgress.current} из {uploadProgress.total}…</p>}
          {choosingAttachments && <div id="work-result-attachments" className="space-y-3 rounded-xl border border-zinc-700 bg-zinc-950 p-3" onKeyDown={(event) => { if (event.key === 'Escape') { event.stopPropagation(); closeAttachmentPicker(); } }}>
            <p className="text-sm font-semibold text-white">Фотографии из заявки</p>
            {availableAttachments.length === 0 ? <p className="text-sm text-zinc-400">Нет доступных фотографий: они уже добавлены в отчёт или во вложениях нет JPEG, PNG и WebP.</p> : <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto">
              {availableAttachments.map((file) => <label key={file.id} className={'relative min-w-0 cursor-pointer rounded-xl border p-2 focus-within:ring-2 focus-within:ring-indigo-400 ' + (selectedAttachments.includes(file.id) ? 'border-indigo-400 bg-indigo-500/15' : 'border-zinc-700 bg-zinc-900 hover:border-zinc-500')}>
                <input type="checkbox" checked={selectedAttachments.includes(file.id)} onChange={(event) => setSelectedAttachments((old) => event.target.checked ? [...old, file.id] : old.filter((id) => id !== file.id))} className="absolute left-3 top-3 h-5 w-5 accent-indigo-500" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={'/api/admin/attachments/' + file.id} alt="" loading="lazy" className="h-24 w-full rounded-lg object-contain" />
                <span className="mt-2 block break-all text-xs text-zinc-300">{file.originalFilename || 'Фотография'}</span>
              </label>)}
            </div>}
            <div className="flex flex-wrap gap-2">
              <button type="button" disabled={selectedPhotos.length === 0} onClick={() => {
                update({ photos: [...draft.photos, ...selectedPhotos.map((file) => ({ attachmentId: file.id, category: 'RESULT' as const, caption: '' }))] });
                closeAttachmentPicker();
              }} className="min-h-11 rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400 disabled:opacity-40">Добавить выбранные · {selectedPhotos.length}</button>
              <button type="button" onClick={closeAttachmentPicker} className={button + ' min-h-11'}>Отмена</button>
            </div>
          </div>}
          {draft.photos.map((photo, index) => <div key={photo.attachmentId} className="grid gap-3 rounded-xl bg-zinc-900 p-3 sm:grid-cols-[100px_1fr]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={'/api/admin/attachments/' + photo.attachmentId} alt={'Фото ' + (index + 1)} className="h-24 w-24 rounded-lg object-contain" />
            <div className="min-w-0 space-y-2">
              <label className="block text-xs text-zinc-300">Категория<select value={photo.category} className={control} onChange={(event) => photoChange(index, { category: event.target.value as WorkPhotoCategory })}><option value="BEFORE">До ремонта</option><option value="PROCESS">Процесс</option><option value="RESULT">Результат</option></select></label>
              <label className="block text-xs text-zinc-300">Подпись · необязательно<input value={photo.caption} maxLength={1000} onChange={(event) => photoChange(index, { caption: event.target.value })} className={control} /></label>
              <div className="flex flex-wrap gap-2"><button type="button" disabled={index === 0} onClick={() => movePhoto(index, -1)} className={button} aria-label="Переместить фото выше">↑</button><button type="button" disabled={index === draft.photos.length - 1} onClick={() => movePhoto(index, 1)} className={button} aria-label="Переместить фото ниже">↓</button><button type="button" onClick={() => update({ photos: draft.photos.filter((_, i) => i !== index) })} className={button}>Убрать из отчёта</button></div>
            </div>
          </div>)}
          {state.role === 'OWNER' && <details><summary className="cursor-pointer text-sm text-amber-300">Исключение без итоговой фотографии</summary><label className="mt-2 block text-xs text-zinc-300">Причина · только для внутренней истории<textarea maxLength={1000} value={draft.noPhotoReason} onChange={(event) => update({ noPhotoReason: event.target.value })} className={control} /></label></details>}
          {state.role !== 'OWNER' && draft.noPhotoReason && <div className="space-y-2 text-sm text-amber-300"><p>В черновике есть исключение без итогового фото. Его может опубликовать только владелец.</p><button type="button" className={button} onClick={() => update({ noPhotoReason: '' })}>Убрать исключение и добавить итоговое фото</button></div>}
        </div>
        <div className={'space-y-3' + fieldError('items')}><h3 className="font-bold text-white">Дополнительные пункты · необязательно</h3>
          {draft.items.map((item, index) => <div key={index} className="rounded-xl border border-zinc-800 p-3"><label className="block text-xs text-zinc-300">Название<input value={item.title} maxLength={160} onChange={(event) => update({ items: draft.items.map((row, i) => i === index ? { ...row, title: event.target.value } : row) })} className={control} /></label><label className="mt-2 block text-xs text-zinc-300">Текст<textarea value={item.text} maxLength={4000} onChange={(event) => update({ items: draft.items.map((row, i) => i === index ? { ...row, text: event.target.value } : row) })} className={control} /></label><button type="button" onClick={() => update({ items: draft.items.filter((_, i) => i !== index) })} className={button + ' mt-2'}>Убрать пункт</button></div>)}
          <button type="button" disabled={draft.items.length >= 20} onClick={() => update({ items: [...draft.items, { title: '', text: '' }] })} className={button}>Добавить пункт</button>
        </div>
        {state.publishedVersion > 0 && <label className="block text-sm text-zinc-200">Причина исправления · только для внутренней истории<textarea value={draft.correctionReason} maxLength={1000} onChange={(event) => update({ correctionReason: event.target.value })} className={control + fieldError('correctionReason')} /></label>}
        <div className="flex flex-wrap gap-3"><button type="button" onClick={() => setPreview(!preview)} className={button}>Предварительный просмотр</button><button type="button" onClick={() => save(false)} className={button}>Сохранить черновик</button><button type="button" disabled={!canPublish} onClick={() => modalOpen ? save(true) : setConfirming(true)} className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-500 disabled:opacity-40">{busy ? 'Сохранение…' : pendingPublication.current !== null ? 'Повторить публикацию' : state.publishedVersion > 0 && caseStatus !== 'IN_PROGRESS' ? 'Опубликовать исправление' : 'Опубликовать отчёт и завершить ремонт'}</button></div>
        {!canPublish && <p className="text-sm text-zinc-400">Публикация станет доступна, когда заявке присвоен номер и она находится в ремонте.</p>}
      </fieldset>
      {preview && draft.completedOn && <WorkResultView preview locale="ru" publicRequestNumber={publicRequestNumber || ''} result={{
        id: 'preview', number: state.publishedVersion + 1, completedOn: draft.completedOn, publishedAt: new Date().toISOString(),
        note: draft.note, items: draft.items.filter((item) => item.title || item.text),
        photos: draft.photos.map((photo) => ({ id: photo.attachmentId, url: '/api/admin/attachments/' + photo.attachmentId, category: photo.category, caption: photo.caption })),
      }} />}
      {state.publishedVersion > 0 && <div className="space-y-3 rounded-xl border border-zinc-800 p-4 text-sm text-zinc-300">
        <h3 className="font-bold text-white">Уведомление клиента</h3>
        {state.notifications.length === 0 ? <p>На момент публикации не было подключённого кабинета с подтверждённой почтой. При необходимости используйте действие подключения кабинета в карточке заявки.</p> : state.notifications.map((item, i) => <p key={item.id}>Получатель {i + 1}: {({ SENT: 'письмо отправлено', FAILED: 'письмо не отправлено — повторите отправку', PENDING: 'ожидает отправки', SENDING: 'отправка обрабатывается', SKIPPED: 'доступ или редакция изменились' } as Record<string, string>)[item.state] || item.state}</p>)}
        {state.notifications.some((item) => ['PENDING', 'FAILED', 'SENDING'].includes(item.state)) && <button type="button" disabled={busy} onClick={retryNotification} className={button}>Повторить отправку</button>}
        {state.notifications.some((item) => item.state === 'SENDING') && <p className="text-xs text-zinc-400">Если отправка прервана, повтор станет доступен через 5 минут. Если письмо уже доставлено, клиент может получить его повторно.</p>}
      </div>}
      {state.history.length > 0 && <details className="rounded-xl border border-zinc-800 p-4 text-sm text-zinc-300"><summary className="cursor-pointer font-bold">История публикаций ({state.history.length})</summary><ol className="mt-3 space-y-3">{state.history.map((item) => <li key={item.number}>№ {item.number} · {new Date(item.publishedAt).toLocaleString('ru-RU')}{item.correctionReason && <p>{item.correctionReason}</p>}{item.noPhotoReason && <p>Без итогового фото: {item.noPhotoReason}</p>}</li>)}</ol></details>}
    </>}
  </section></StageWindow>;
}
