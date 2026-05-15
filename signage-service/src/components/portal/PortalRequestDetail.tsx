import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';

import { Link } from '@/i18n/routing';
import type {
  PortalAsset,
  PortalCustomerAttachment,
  PortalDemoOrganization,
  PortalDocument,
  PortalMessageAuthor,
  PortalObject,
  PortalRequest,
  PortalRequestTimelineItem,
  PortalRequiredAction,
  PortalRequiredActionType,
} from '@/lib/portal/types';

import PortalLogoutButton from './PortalLogoutButton';

const statusTone = {
  UNDER_REVIEW: 'bg-amber-100 text-amber-800 border-amber-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200',
  WAITING_FOR_CUSTOMER: 'bg-orange-100 text-orange-800 border-orange-200',
  COMPLETED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  PLANNED: 'bg-slate-100 text-slate-700 border-slate-200',
};

const timelineTone = {
  done: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  active: 'border-[#D9C7BA] bg-[#FFF8F2] text-[#B8643E]',
  upcoming: 'border-slate-200 bg-slate-50 text-slate-500',
};

const attachmentTone = {
  received: 'bg-blue-100 text-blue-800',
  reviewed: 'bg-emerald-100 text-emerald-800',
  needs_more_context: 'bg-orange-100 text-orange-800',
};

const documentTone = {
  available: 'bg-emerald-100 text-emerald-800',
  planned: 'bg-amber-100 text-amber-800',
  locked: 'bg-slate-100 text-slate-700',
};

function actionKey(type: PortalRequiredActionType) {
  switch (type) {
    case 'APPROVE_ESTIMATE':
      return 'approveEstimate';
    case 'CONFIRM_VISIT_WINDOW':
      return 'confirmVisitWindow';
    case 'UPLOAD_MISSING_PHOTO':
      return 'uploadMissingPhoto';
  }
}

function authorKey(author: PortalMessageAuthor) {
  switch (author) {
    case 'Customer':
      return 'customer';
    case 'PixelRing AI':
      return 'ai';
    case 'PixelRing Manager':
      return 'manager';
  }
}

async function PortalFrame({
  organization,
  badge,
  title,
  subtitle,
  children,
}: {
  organization: PortalDemoOrganization;
  badge: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const t = await getTranslations('Portal');
  const navItems = [
    { key: 'overview', label: t('nav.overview') },
    { key: 'requests', label: t('nav.requests') },
    { key: 'objects', label: t('nav.objects') },
    { key: 'assets', label: t('nav.assets') },
    { key: 'documents', label: t('nav.documents') },
  ];

  return (
    <main className="min-h-screen bg-[#EEF3FB] text-[#121826]">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-[#D9E0EA] bg-[#0A111F] text-white lg:border-b-0 lg:border-e lg:border-white/10">
          <div className="flex h-full flex-col p-4 sm:p-5">
            <Link href="/" className="mb-5 inline-flex w-fit items-center gap-2 rounded-2xl bg-white/[0.06] px-3 py-2 text-[13px] font-black">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#B8643E] text-white">PR</span>
              PixelRing
            </Link>

            <div className="rounded-3xl border border-white/10 bg-white/[0.055] p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40">
                {t('accountLabel')}
              </p>
              <h1 className="mt-2 text-[22px] font-black leading-tight">{organization.name}</h1>
              <p className="mt-2 text-[13px] text-white/58">
                {t('planLabel', { plan: organization.plan })}
              </p>
            </div>

            <nav className="mt-5 grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.key}
                  href="/portal"
                  className={`flex items-center justify-between rounded-2xl px-4 py-3 text-start text-[14px] font-bold transition ${
                    item.key === 'requests'
                      ? 'bg-white text-[#0A111F]'
                      : 'text-white/70 hover:bg-white/[0.07] hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.key === 'requests' && (
                    <span className="rounded-full bg-[#B8643E]/15 px-2 py-0.5 text-[11px] text-[#D98A61]">
                      {organization.requests.length}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            <div className="mt-auto hidden rounded-3xl border border-white/10 bg-white/[0.045] p-4 text-[13px] text-white/60 lg:block">
              {t('safeBoundary')}
            </div>
          </div>
        </aside>

        <section className="min-w-0 p-4 sm:p-6 lg:p-8">
          <header className="mb-6 flex flex-col gap-4 rounded-[28px] border border-white bg-white/80 p-4 shadow-sm backdrop-blur md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <Link href="/portal" className="mb-3 inline-flex text-[13px] font-black text-[#B8643E] hover:text-[#944D2F]">
                {t('detail.backToPortal')}
              </Link>
              <p className="text-[12px] font-black uppercase tracking-[0.2em] text-[#B8643E]">
                {badge}
              </p>
              <h2 className="mt-1 text-[26px] font-black leading-tight sm:text-[34px]">{title}</h2>
              <p className="mt-1 text-[14px] leading-6 text-[#667085]">{subtitle}</p>
            </div>
            <PortalLogoutButton />
          </header>

          {children}
        </section>
      </div>
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
    <PortalFrame
      organization={organization}
      badge="Kundenportal"
      title={t('detail.unknownTitle')}
      subtitle={t('detail.unknownDescription')}
    >
      <section className="rounded-[28px] border border-white bg-white p-6 shadow-sm">
        <p className="max-w-2xl text-[14px] leading-7 text-[#667085]">
          {t('detail.unknownSafeCopy')}
        </p>
        <Link
          href="/portal"
          className="mt-5 inline-flex h-11 items-center rounded-2xl bg-[#B8643E] px-5 text-[14px] font-black text-white transition hover:bg-[#A65835]"
        >
          {t('detail.returnToPortal')}
        </Link>
      </section>
    </PortalFrame>
  );
}

export default async function PortalRequestDetail({
  organization,
  request,
  object,
  assets,
  messages,
  timeline,
  customerAttachments,
  documents,
  requiredActions,
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
}) {
  const t = await getTranslations('Portal');
  const contacts = organization.contacts.filter((contact) => object.responsibleContactIds.includes(contact.id));

  return (
    <PortalFrame
      organization={organization}
      badge={request.publicRequestNumber}
      title={request.title}
      subtitle={`${t('detail.customerStatus')}: ${t(`requestStatus.${request.status}`)}`}
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="grid gap-5">
          <section className="rounded-[28px] border border-white bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <p className="font-mono text-[12px] font-black text-[#B8643E]">{request.publicRequestNumber}</p>
                <h3 className="mt-1 text-[22px] font-black">{t('detail.requestSummary')}</h3>
              </div>
              <span className={`w-fit rounded-full border px-3 py-1 text-[11px] font-black ${statusTone[request.status]}`}>
                {t(`requestStatus.${request.status}`)}
              </span>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <InfoCard label={t('detail.objectLocation')} value={object.name} meta={object.address} />
              <InfoCard label={t('detail.openedAt')} value={request.openedAt} meta={`${t('detail.updatedAt')}: ${request.updatedAt}`} />
              <InfoCard label={t('detail.relatedAssets')} value={String(assets.length)} meta={assets.map((asset) => asset.name).join(', ')} />
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              <TextPanel title={t('detail.issueSummary')} body={request.summary} />
              <TextPanel title={t('detail.nextStep')} body={request.nextStep} highlight />
            </div>
          </section>

          <section className="rounded-[28px] border border-[#D9C7BA] bg-[#FFF8F2] p-5 shadow-sm">
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#B8643E]">
                  {t('detail.requiresActionEyebrow')}
                </p>
                <h3 className="mt-1 text-[20px] font-black">{t('detail.requiresAction')}</h3>
              </div>
              <span className="w-fit rounded-full bg-white px-3 py-1 text-[11px] font-black text-[#B8643E]">
                {requiredActions.length}
              </span>
            </div>
            {requiredActions.length > 0 ? (
              <div className="grid gap-3 lg:grid-cols-2">
                {requiredActions.map((action) => {
                  const key = actionKey(action.type);

                  return (
                    <article key={action.id} className="rounded-3xl border border-[#E5D1C2] bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-[16px] font-black">{t(`actionType.${key}`)}</h4>
                          <p className="mt-2 text-[13px] leading-6 text-[#6C5B50]">{action.description}</p>
                        </div>
                        <span className="rounded-full bg-[#EEF3FB] px-3 py-1 text-[11px] font-black text-[#475467]">
                          {action.dueLabel}
                        </span>
                      </div>
                      <button
                        type="button"
                        disabled
                        className="mt-4 h-10 rounded-2xl bg-[#B8643E] px-4 text-[13px] font-black text-white opacity-70"
                      >
                        {t(`actionCta.${key}`)}
                      </button>
                      <p className="mt-2 text-[12px] font-semibold text-[#9A6A4A]">{t('detail.actionPlaceholder')}</p>
                    </article>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-2xl bg-white p-4 text-[13px] leading-6 text-[#667085]">{t('detail.noActions')}</p>
            )}
          </section>

          <section className="rounded-[28px] border border-white bg-white p-5 shadow-sm">
            <h3 className="text-[20px] font-black">{t('detail.correspondence')}</h3>
            <div className="mt-4 grid gap-3">
              {messages.length > 0 ? messages.map((message) => (
                <article key={message.id} className="rounded-3xl border border-[#EAECF0] bg-[#FCFCFD] p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-[13px] font-black text-[#B8643E]">
                      {t(`messageAuthor.${authorKey(message.author)}`)}
                    </span>
                    <span className="font-mono text-[11px] font-bold text-[#98A2B3]">{message.sentAt}</span>
                  </div>
                  <p className="mt-3 text-[14px] leading-7 text-[#475467]">{message.body}</p>
                </article>
              )) : (
                <p className="rounded-2xl bg-[#F6F8FB] p-4 text-[13px] text-[#667085]">{t('detail.noMessages')}</p>
              )}
            </div>
          </section>
        </div>

        <aside className="grid content-start gap-5">
          <section className="rounded-[28px] border border-white bg-white p-5 shadow-sm">
            <h3 className="text-[18px] font-black">{t('detail.objectLocation')}</h3>
            <div className="mt-4 grid gap-3 rounded-2xl bg-[#F6F8FB] p-4 text-[13px] leading-6 text-[#475467]">
              <p><strong className="text-[#121826]">{object.name}</strong></p>
              <p>{object.address}</p>
              <p>{t('objects.access')}: {object.accessNotes}</p>
              <p>{t('objects.contacts')}: {contacts.map((contact) => `${contact.name} (${contact.role})`).join(', ')}</p>
            </div>
          </section>

          <section className="rounded-[28px] border border-white bg-white p-5 shadow-sm">
            <h3 className="text-[18px] font-black">{t('detail.timeline')}</h3>
            <div className="mt-4 grid gap-3">
              {timeline.length > 0 ? timeline.map((item) => (
                <article key={item.id} className={`rounded-3xl border p-4 ${timelineTone[item.state]}`}>
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="text-[15px] font-black">{item.title}</h4>
                    <span className="font-mono text-[11px] font-bold opacity-75">{item.occurredAt}</span>
                  </div>
                  <p className="mt-2 text-[13px] leading-6 opacity-85">{item.description}</p>
                </article>
              )) : (
                <p className="rounded-2xl bg-[#F6F8FB] p-4 text-[13px] text-[#667085]">{t('detail.noTimeline')}</p>
              )}
            </div>
          </section>

          <section className="rounded-[28px] border border-white bg-white p-5 shadow-sm">
            <h3 className="text-[18px] font-black">{t('detail.customerAttachments')}</h3>
            <div className="mt-4 grid gap-3">
              {customerAttachments.length > 0 ? customerAttachments.map((attachment) => (
                <article key={attachment.id} className="rounded-3xl border border-[#EAECF0] bg-[#FCFCFD] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="truncate text-[14px] font-black">{attachment.filename}</h4>
                      <p className="mt-1 text-[12px] text-[#667085]">{attachment.fileType} · {attachment.uploadedAt}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-black ${attachmentTone[attachment.status]}`}>
                      {t(`attachmentStatus.${attachment.status}`)}
                    </span>
                  </div>
                </article>
              )) : (
                <p className="rounded-2xl bg-[#F6F8FB] p-4 text-[13px] text-[#667085]">{t('detail.noAttachments')}</p>
              )}
            </div>
          </section>

          <section className="rounded-[28px] border border-white bg-white p-5 shadow-sm">
            <h3 className="text-[18px] font-black">{t('detail.pixelringFiles')}</h3>
            <div className="mt-4 grid gap-3">
              {documents.length > 0 ? documents.map((document) => (
                <article key={document.id} className="rounded-3xl border border-[#EAECF0] bg-[#FCFCFD] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#B8643E]">
                        {t(`documentType.${document.type}`)}
                      </p>
                      <h4 className="mt-1 text-[15px] font-black">{document.title}</h4>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[11px] font-black ${documentTone[document.status]}`}>
                      {t(`documentStatus.${document.status}`)}
                    </span>
                  </div>
                  <p className="mt-3 text-[13px] leading-6 text-[#667085]">{document.description}</p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#EAECF0] pt-3">
                    <span className="font-mono text-[11px] font-bold text-[#98A2B3]">{document.issuedAt}</span>
                    <button
                      type="button"
                      disabled
                      className="h-9 rounded-2xl border border-[#D0D5DD] bg-white px-3 text-[12px] font-black text-[#667085]"
                    >
                      {document.status === 'available' ? t('detail.previewOnly') : t('detail.unavailable')}
                    </button>
                  </div>
                </article>
              )) : (
                <p className="rounded-2xl bg-[#F6F8FB] p-4 text-[13px] text-[#667085]">{t('detail.noFiles')}</p>
              )}
            </div>
          </section>
        </aside>
      </div>
    </PortalFrame>
  );
}

function InfoCard({ label, value, meta }: { label: string; value: string; meta: string }) {
  return (
    <article className="rounded-3xl border border-[#EAECF0] bg-[#FCFCFD] p-4">
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#98A2B3]">{label}</p>
      <h4 className="mt-2 text-[16px] font-black">{value}</h4>
      <p className="mt-2 text-[13px] leading-6 text-[#667085]">{meta}</p>
    </article>
  );
}

function TextPanel({ title, body, highlight = false }: { title: string; body: string; highlight?: boolean }) {
  return (
    <article className={`rounded-3xl border p-4 ${highlight ? 'border-[#E5D1C2] bg-[#FFF8F2]' : 'border-[#EAECF0] bg-[#FCFCFD]'}`}>
      <h4 className="text-[15px] font-black">{title}</h4>
      <p className="mt-2 text-[14px] leading-7 text-[#475467]">{body}</p>
    </article>
  );
}
