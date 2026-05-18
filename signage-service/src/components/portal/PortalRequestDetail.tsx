import type { ReactNode } from 'react';
import { getLocale, getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/routing';
import type {
  PortalAsset,
  PortalCustomerAttachment,
  PortalDemoOrganization,
  PortalDocument,
  PortalObject,
  PortalRequest,
  PortalRequestTimelineItem,
  PortalRequiredAction,
} from '@/lib/portal/types';

import PortalRequestChat from './PortalRequestChat';
import PortalRequestDetailsEditor from './PortalRequestDetailsEditor';

const statusTone = {
  UNDER_REVIEW: 'border-amber-200 bg-amber-50 text-amber-800',
  IN_PROGRESS: 'border-blue-200 bg-blue-50 text-blue-800',
  WAITING_FOR_CUSTOMER: 'border-orange-200 bg-orange-50 text-orange-800',
  COMPLETED: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  PLANNED: 'border-slate-200 bg-slate-50 text-slate-700',
};

const attachmentTone = {
  received: 'bg-blue-50 text-blue-800',
  reviewed: 'bg-emerald-50 text-emerald-800',
  needs_more_context: 'bg-orange-50 text-orange-800',
};

const documentTone = {
  available: 'bg-emerald-50 text-emerald-800',
  planned: 'bg-amber-50 text-amber-800',
  locked: 'bg-slate-50 text-slate-700',
};

const detailCopy = {
  de: {
    back: 'Zurueck zum Portal',
    task: 'Anfrage',
    details: 'Details',
    description: 'Urspruengliche Beschreibung',
    address: 'Adresse / Objekt',
    requestContactPerson: 'Kontaktperson zur Anfrage',
    requestContactDetails: 'Kontaktdaten zur Anfrage',
    portalAccountOwner: 'Portal-Konto / Inhaber',
    pixelringResponsible: 'PixelRing Ansprechpartner',
    created: 'Erstellt',
    updated: 'Aktualisiert',
    result: 'Ergebnis der Arbeiten',
    noResult: 'Noch kein Ergebnis freigegeben. PixelRing ergaenzt diesen Bereich nach Abschluss oder Zwischenstand.',
    files: 'Dateien',
    noFiles: 'Noch keine freigegebenen Dateien fuer diese Anfrage.',
    timeline: 'Statusverlauf',
    notSpecified: 'Noch nicht angegeben',
    serviceTeam: 'PixelRing Service-Team',
    close: 'Schliessen',
    edit: 'Bearbeiten',
    cancel: 'Abbrechen',
    save: 'Speichern',
    saving: 'Speichert ...',
    saved: 'Daten wurden gespeichert.',
    unchanged: 'Keine Aenderung erkannt.',
    name: 'Kontaktperson',
    email: 'E-Mail',
    phone: 'Telefon',
  },
  ru: {
    back: 'Назад в кабинет',
    task: 'Заявка',
    details: 'Данные заявки',
    description: 'Первоначальное описание',
    address: 'Адрес / объект',
    requestContactPerson: 'Контакт по заявке',
    requestContactDetails: 'Контакты по заявке',
    portalAccountOwner: 'Владелец портала / аккаунт',
    pixelringResponsible: 'Ответственный PixelRing',
    created: 'Создана',
    updated: 'Обновлена',
    result: 'Результат работ',
    noResult: 'Результат пока не добавлен. PixelRing заполнит этот блок после выполнения работ или промежуточного отчета.',
    files: 'Файлы',
    noFiles: 'По этой заявке пока нет клиентских файлов или опубликованных документов.',
    timeline: 'История статусов',
    notSpecified: 'Пока не указано',
    serviceTeam: 'PixelRing Service-Team',
    close: 'Закрыть',
    edit: 'Редактировать',
    cancel: 'Отмена',
    save: 'Сохранить',
    saving: 'Сохранение ...',
    saved: 'Данные сохранены.',
    unchanged: 'Изменений нет.',
    name: 'Контактное лицо',
    email: 'E-Mail',
    phone: 'Телефон',
  },
};

function copyForLocale(locale: string) {
  return locale === 'ru' ? detailCopy.ru : detailCopy.de;
}

function nonEmpty(value: string | null | undefined): string | null {
  return value?.trim() || null;
}

function buildGoogleMapsUrl(input: {
  address: string;
  latitude?: number | null;
  longitude?: number | null;
}): string {
  if (
    typeof input.latitude === 'number' &&
    Number.isFinite(input.latitude) &&
    typeof input.longitude === 'number' &&
    Number.isFinite(input.longitude)
  ) {
    return `https://www.google.com/maps/search/?api=1&query=${input.latitude},${input.longitude}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(input.address)}`;
}

function joinValues(values: Array<string | null | undefined>, fallback: string): string {
  const clean = values.map(nonEmpty).filter((value): value is string => Boolean(value));

  return clean.length > 0 ? clean.join(' · ') : fallback;
}

async function RequestWorkspaceFrame({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const locale = await getLocale();
  const copy = copyForLocale(locale);

  return (
    <main className="min-h-screen bg-[#E8EDF2] p-3 text-[#172033] sm:p-5">
      <section className="mx-auto flex min-h-[calc(100vh-24px)] max-w-[1840px] flex-col overflow-hidden rounded-[28px] border border-white bg-white shadow-2xl shadow-slate-900/10 sm:min-h-[calc(100vh-40px)]">
        <header className="flex flex-col gap-3 border-b border-[#E5EAF0] bg-white px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <Link href="/portal" className="text-[13px] font-black text-[#B8643E] transition hover:text-[#944D2F]">
              {copy.back}
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#98A2B3]">{subtitle}</p>
            </div>
            <h1 className="mt-2 max-w-5xl text-[24px] font-black leading-tight tracking-0 text-[#172033] sm:text-[30px]">
              {title}
            </h1>
          </div>
          <Link
            href="/portal"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-[#D9E0EA] bg-white px-5 text-[14px] font-black text-[#27364A] transition hover:border-[#B8643E] hover:text-[#B8643E]"
          >
            {copy.close}
          </Link>
        </header>
        {children}
      </section>
    </main>
  );
}

export async function PortalRequestNotFound({
  organization,
}: {
  organization: PortalDemoOrganization;
}) {
  const t = await getTranslations('Portal');

  return (
    <RequestWorkspaceFrame title={t('detail.unknownTitle')} subtitle="Kundenportal">
      <div className="grid flex-1 place-items-center bg-[#F5F7FA] p-6">
        <section className="w-full max-w-2xl rounded-[22px] border border-[#E5EAF0] bg-white p-6 shadow-sm">
          <p className="text-[14px] leading-7 text-[#667085]">{t('detail.unknownSafeCopy')}</p>
          <p className="mt-3 text-[13px] text-[#98A2B3]">{organization.name}</p>
          <Link
            href="/portal"
            className="mt-5 inline-flex h-11 items-center rounded-2xl bg-[#B8643E] px-5 text-[14px] font-black text-white transition hover:bg-[#A65835]"
          >
            {t('detail.returnToPortal')}
          </Link>
        </section>
      </div>
    </RequestWorkspaceFrame>
  );
}

export default async function PortalRequestDetail({
  organization,
  request,
  object,
  messages,
  timeline,
  customerAttachments,
  documents,
  requiredActions,
  canPostMessages = false,
}: {
  organization: PortalDemoOrganization;
  request: PortalRequest;
  object: PortalObject;
  assets: PortalAsset[];
  messages: PortalDemoOrganization['messages'];
  timeline: PortalRequestTimelineItem[];
  customerAttachments: PortalCustomerAttachment[];
  documents: PortalDocument[];
  requiredActions: PortalRequiredAction[];
  canPostMessages?: boolean;
}) {
  const t = await getTranslations('Portal');
  const locale = await getLocale();
  const copy = copyForLocale(locale);
  const statusLabel = t(`requestStatus.${request.status}`);
  const address = nonEmpty(request.serviceLocation) || nonEmpty(object.address) || copy.notSpecified;
  const addressHref = address !== copy.notSpecified
    ? buildGoogleMapsUrl({
        address,
        latitude: request.serviceLatitude,
        longitude: request.serviceLongitude,
      })
    : null;
  const requestContactPerson = nonEmpty(request.customerName) || copy.notSpecified;
  const requestContactDetails = joinValues([request.contactPhone, request.contactEmail], copy.notSpecified);
  const portalAccountOwner = joinValues([organization.name, organization.demoEmail], copy.notSpecified);
  const publishedReports = documents.filter((document) => document.type === 'REPORT' && document.status === 'available');

  return (
    <RequestWorkspaceFrame
      title={request.title}
      subtitle={`${copy.task} ${request.publicRequestNumber}`}
    >
      <div className="grid flex-1 bg-[#F3F6FA] lg:grid-cols-[minmax(420px,0.92fr)_minmax(520px,1.08fr)]">
        <section className="min-h-0 overflow-y-auto border-b border-[#E5EAF0] bg-[#F4F7FA] p-4 lg:h-[calc(100vh-164px)] lg:border-b-0 lg:border-e sm:p-5">
          <div className="grid gap-4">
            <section className="rounded-[22px] border border-[#E5EAF0] bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[12px] font-black uppercase tracking-[0.16em] text-[#B8643E]">{request.publicRequestNumber}</p>
                  <h2 className="mt-2 text-[22px] font-black text-[#172033]">{copy.details}</h2>
                </div>
                <span className={`rounded-full border px-3 py-1 text-[11px] font-black ${statusTone[request.status]}`}>
                  {statusLabel}
                </span>
              </div>
              <div className="mt-5 grid gap-3">
                <FactRow label={copy.address} value={address} href={addressHref} />
                <FactRow label={copy.requestContactPerson} value={requestContactPerson} />
                <FactRow label={copy.requestContactDetails} value={requestContactDetails} />
                <FactRow label={copy.portalAccountOwner} value={portalAccountOwner} />
                <FactRow label={copy.pixelringResponsible} value={copy.serviceTeam} />
                <FactRow label={copy.created} value={request.openedAt} />
                <FactRow label={copy.updated} value={request.updatedAt} />
              </div>
              {canPostMessages && (
                <PortalRequestDetailsEditor
                  request={request}
                  copy={{
                    edit: copy.edit,
                    cancel: copy.cancel,
                    save: copy.save,
                    saving: copy.saving,
                    saved: copy.saved,
                    unchanged: copy.unchanged,
                    name: copy.name,
                    email: copy.email,
                    phone: copy.phone,
                    address: copy.address,
                  }}
                />
              )}
            </section>

            <section className="rounded-[22px] border border-[#E5EAF0] bg-white p-5 shadow-sm">
              <h2 className="text-[18px] font-black text-[#172033]">{copy.description}</h2>
              <p className="mt-3 whitespace-pre-line text-[15px] leading-7 text-[#3D4A5C]">{request.summary}</p>
            </section>

            <section className="rounded-[22px] border border-[#E5EAF0] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[18px] font-black text-[#172033]">{copy.result}</h2>
                <span className="rounded-full bg-[#F3F6FA] px-3 py-1 text-[11px] font-black text-[#667085]">
                  {publishedReports.length}
                </span>
              </div>
              {publishedReports.length > 0 ? (
                <div className="mt-4 grid gap-3">
                  {publishedReports.map((document) => (
                    <DocumentRow key={document.id} document={document} />
                  ))}
                </div>
              ) : (
                <p className="mt-3 rounded-2xl bg-[#F6F8FB] p-4 text-[14px] leading-6 text-[#667085]">{copy.noResult}</p>
              )}
            </section>

            <section className="rounded-[22px] border border-[#E5EAF0] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[18px] font-black text-[#172033]">{copy.files}</h2>
                <span className="rounded-full bg-[#F3F6FA] px-3 py-1 text-[11px] font-black text-[#667085]">
                  {customerAttachments.length + documents.length}
                </span>
              </div>
              {customerAttachments.length > 0 || documents.length > 0 ? (
                <div className="mt-4 grid gap-3">
                  {customerAttachments.map((attachment) => (
                    <AttachmentRow key={attachment.id} attachment={attachment} />
                  ))}
                  {documents.map((document) => (
                    <DocumentRow key={document.id} document={document} />
                  ))}
                </div>
              ) : (
                <p className="mt-3 rounded-2xl bg-[#F6F8FB] p-4 text-[14px] leading-6 text-[#667085]">{copy.noFiles}</p>
              )}
            </section>

            <section className="rounded-[22px] border border-[#E5EAF0] bg-white p-5 shadow-sm">
              <h2 className="text-[18px] font-black text-[#172033]">{copy.timeline}</h2>
              <div className="mt-4 grid gap-3">
                {timeline.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-[#E5EAF0] bg-[#FBFCFE] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-[14px] font-black text-[#27364A]">{item.title}</h3>
                      <span className="font-mono text-[11px] font-bold text-[#98A2B3]">{item.occurredAt}</span>
                    </div>
                    <p className="mt-2 text-[13px] leading-6 text-[#667085]">{item.description}</p>
                  </article>
                ))}
              </div>
            </section>

            {requiredActions.length > 0 && (
              <section className="rounded-[22px] border border-[#F0D7C7] bg-[#FFF8F2] p-5 shadow-sm">
                <h2 className="text-[18px] font-black text-[#172033]">{t('detail.requiresAction')}</h2>
                <div className="mt-4 grid gap-3">
                  {requiredActions.map((action) => (
                    <article key={action.id} className="rounded-2xl border border-[#E5D1C2] bg-white p-4">
                      <p className="text-[14px] leading-6 text-[#6C5B50]">{action.description}</p>
                      <span className="mt-3 inline-flex rounded-full bg-[#F3F6FA] px-3 py-1 text-[11px] font-black text-[#667085]">
                        {action.dueLabel}
                      </span>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </div>
        </section>

        <PortalRequestChat
          request={request}
          messages={messages}
          canPostMessages={canPostMessages}
        />
      </div>
    </RequestWorkspaceFrame>
  );
}

function FactRow({ label, value, href }: { label: string; value: string; href?: string | null }) {
  return (
    <div className="grid gap-1 border-b border-[#EEF2F6] pb-3 last:border-0 last:pb-0 sm:grid-cols-[190px_1fr]">
      <span className="text-[13px] font-bold text-[#8A96A8]">{label}</span>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="text-[14px] font-semibold leading-6 text-[#2563EB] underline-offset-4 hover:underline"
        >
          {value}
        </a>
      ) : (
        <span className="text-[14px] font-semibold leading-6 text-[#27364A]">{value}</span>
      )}
    </div>
  );
}

function AttachmentRow({ attachment }: { attachment: PortalCustomerAttachment }) {
  return (
    <article className="grid gap-3 rounded-2xl border border-[#E5EAF0] bg-[#FBFCFE] p-4 sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="min-w-0">
        <h3 className="truncate text-[14px] font-black text-[#27364A]">{attachment.filename}</h3>
        <p className="mt-1 text-[12px] text-[#667085]">{attachment.fileType} · {attachment.uploadedAt}</p>
      </div>
      <span className={`w-fit rounded-full px-3 py-1 text-[11px] font-black ${attachmentTone[attachment.status]}`}>
        {attachment.status}
      </span>
    </article>
  );
}

function DocumentRow({ document }: { document: PortalDocument }) {
  return (
    <article className="rounded-2xl border border-[#E5EAF0] bg-[#FBFCFE] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#B8643E]">{document.type}</p>
          <h3 className="mt-1 text-[14px] font-black text-[#27364A]">{document.title}</h3>
        </div>
        <span className={`w-fit rounded-full px-3 py-1 text-[11px] font-black ${documentTone[document.status]}`}>
          {document.status}
        </span>
      </div>
      {document.description && <p className="mt-2 text-[13px] leading-6 text-[#667085]">{document.description}</p>}
      <p className="mt-3 font-mono text-[11px] font-bold text-[#98A2B3]">{document.issuedAt}</p>
    </article>
  );
}
