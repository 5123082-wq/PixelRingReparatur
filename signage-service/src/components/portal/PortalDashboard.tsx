'use client';

import type {
  PortalAsset,
  PortalDemoOrganization,
  PortalDocument,
  PortalObject,
  PortalRequest,
} from '@/lib/portal/types';
import { Link, useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

type TabKey =
  | 'overview'
  | 'requests'
  | 'new-request'
  | 'messages'
  | 'objects'
  | 'assets'
  | 'maintenance'
  | 'reports'
  | 'warranties'
  | 'offers'
  | 'billing'
  | 'documents'
  | 'team'
  | 'settings';

const statusTone = {
  UNDER_REVIEW: 'bg-amber-100 text-amber-800 border-amber-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 border-blue-200',
  WAITING_FOR_CUSTOMER: 'bg-orange-100 text-orange-800 border-orange-200',
  COMPLETED: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  PLANNED: 'bg-slate-100 text-slate-700 border-slate-200',
};

const assetTone = {
  OK: 'bg-emerald-100 text-emerald-800',
  WATCH: 'bg-amber-100 text-amber-800',
  SERVICE_NEEDED: 'bg-red-100 text-red-800',
  WARRANTY: 'bg-blue-100 text-blue-800',
};

const NAV_GROUPS: { label: string; items: { key: TabKey; icon: string; label: string }[] }[] = [
  {
    label: 'Кабинет',
    items: [
      { key: 'overview', icon: '▦', label: 'Обзор' },
      { key: 'requests', icon: '☷', label: 'Мои заявки' },
      { key: 'new-request', icon: '+', label: 'Новая заявка' },
      { key: 'messages', icon: '◌', label: 'Чат и уведомления' },
    ],
  },
  {
    label: 'Сервис',
    items: [
      { key: 'objects', icon: '⌖', label: 'Объекты' },
      { key: 'assets', icon: '□', label: 'Оборудование' },
      { key: 'maintenance', icon: '▣', label: 'План ТО' },
      { key: 'reports', icon: '▧', label: 'Фотоотчеты' },
      { key: 'warranties', icon: '◇', label: 'Гарантии' },
    ],
  },
  {
    label: 'Бизнес',
    items: [
      { key: 'offers', icon: '§', label: 'КП и согласования' },
      { key: 'billing', icon: '€', label: 'Счета и акты' },
      { key: 'documents', icon: '▤', label: 'Документы' },
      { key: 'team', icon: '◫', label: 'Сотрудники' },
      { key: 'settings', icon: '⚙', label: 'Настройки' },
    ],
  },
];

export default function PortalDashboard({
  organization,
}: {
  organization: PortalDemoOrganization;
}) {
  const t = useTranslations('Portal');
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [selectedObjectId, setSelectedObjectId] = useState(organization.objects[0]?.id);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const activeRequests = organization.requests.filter((request) => request.status !== 'COMPLETED');
  const serviceAssets = organization.assets.filter((asset) => asset.status === 'SERVICE_NEEDED' || asset.status === 'WATCH');
  const availableDocuments = organization.documents.filter((document) => document.status === 'available');
  const offerDocuments = organization.documents.filter((document) => document.type === 'OFFER');
  const reportDocuments = organization.documents.filter((document) => document.type === 'REPORT');
  const warrantyDocuments = organization.documents.filter((document) => document.type === 'WARRANTY');
  const invoiceDocuments = organization.documents.filter((document) => document.type === 'INVOICE');

  const objectsById = useMemo(() => {
    return new Map(organization.objects.map((object) => [object.id, object]));
  }, [organization.objects]);

  const selectedObject = organization.objects.find((object) => object.id === selectedObjectId) || organization.objects[0];

  async function logout() {
    setIsLoggingOut(true);
    try {
      await fetch('/api/portal/demo-auth', { method: 'DELETE' });
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  function openObjectWorkspace(objectId: string) {
    setSelectedObjectId(objectId);
    setActiveTab('objects');
  }

  return (
    <main className="min-h-screen bg-[#F3EFE7] text-[#0F1C2B]">
      <div className="grid min-h-screen lg:grid-cols-[258px_1fr]">
        <aside className="border-b border-white/10 bg-[#0D1B2A] text-white lg:h-screen lg:overflow-y-auto lg:border-b-0">
          <div className="flex min-h-full flex-col p-4">
            <Link href="/" className="mb-5 inline-flex w-fit items-center gap-3 text-[15px] font-black uppercase tracking-[0.16em]">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C46E43] text-[15px] text-white">P</span>
              PixelRing
            </Link>

            <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-4">
              <strong className="block text-[15px]">{organization.name}</strong>
              <span className="mt-1 block text-[12px] text-white/55">{t('planLabel', { plan: organization.plan })} · verified email</span>
            </div>

            <nav className="mt-6 grid gap-5">
              {NAV_GROUPS.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 px-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/28">{group.label}</p>
                  <div className="grid gap-1">
                    {group.items.map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setActiveTab(item.key)}
                        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-start text-[14px] font-bold transition ${
                          activeTab === item.key
                            ? 'bg-[#C46E43] text-white shadow-sm'
                            : 'text-white/58 hover:bg-white/[0.07] hover:text-white'
                        }`}
                      >
                        <span className="flex h-5 w-5 items-center justify-center text-[13px]">{item.icon}</span>
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-[12px] leading-5 text-white/50 lg:mt-auto">
              {t('safeBoundary')}
            </div>
          </div>
        </aside>

        <section className="min-w-0 lg:h-screen lg:overflow-y-auto">
          <div className="mx-auto max-w-[1520px] p-4 sm:p-6 lg:p-8">
            <header className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-[12px] font-black uppercase tracking-[0.18em] text-[#B8643E]">{t('demoBadge')} · Client Portal</p>
                <h1 className="mt-1 text-[30px] font-black leading-tight sm:text-[40px]">{pageTitle(activeTab, organization.name)}</h1>
                <p className="mt-1 max-w-4xl text-[15px] text-[#6F665D]">{pageSubtitle(activeTab)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('messages')}
                  className="rounded-xl border border-[#E3D8CA] bg-white px-4 py-3 text-[14px] font-black text-[#0F1C2B] shadow-sm transition hover:border-[#C46E43]"
                >
                  4 уведомления
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('new-request')}
                  className="rounded-xl bg-[#C46E43] px-4 py-3 text-[14px] font-black text-white shadow-sm transition hover:bg-[#AA5934]"
                >
                  + Создать заявку
                </button>
                <button
                  type="button"
                  onClick={logout}
                  disabled={isLoggingOut}
                  className="rounded-xl border border-[#E3D8CA] bg-white px-4 py-3 text-[14px] font-black text-[#6F665D] shadow-sm transition hover:border-[#C46E43] disabled:opacity-60"
                >
                  {isLoggingOut ? t('logoutLoading') : t('logout')}
                </button>
              </div>
            </header>

            {activeTab === 'overview' && (
              <Overview
                organization={organization}
                activeRequests={activeRequests}
                serviceAssets={serviceAssets}
                availableDocuments={availableDocuments}
                objectsById={objectsById}
                onTabChange={setActiveTab}
              />
            )}
            {activeTab === 'requests' && <RequestsTable requests={organization.requests} objectsById={objectsById} onTabChange={setActiveTab} />}
            {activeTab === 'new-request' && <NewRequestPreview organization={organization} />}
            {activeTab === 'messages' && <MessagesPanel organization={organization} objectsById={objectsById} />}
            {activeTab === 'objects' && (
              <ObjectsWorkspace
                organization={organization}
                selectedObject={selectedObject}
                onSelectObject={openObjectWorkspace}
                onTabChange={setActiveTab}
              />
            )}
            {activeTab === 'assets' && <AssetInventory organization={organization} objectsById={objectsById} />}
            {activeTab === 'maintenance' && <MaintenancePanel organization={organization} objectsById={objectsById} />}
            {activeTab === 'reports' && <DocumentCards title="Фотоотчеты" documents={reportDocuments} emptyLabel="Нет доступных demo-отчетов." />}
            {activeTab === 'warranties' && <WarrantyPanel organization={organization} warrantyDocuments={warrantyDocuments} objectsById={objectsById} />}
            {activeTab === 'offers' && <OffersPanel documents={offerDocuments} />}
            {activeTab === 'billing' && <BillingPreview invoices={invoiceDocuments} />}
            {activeTab === 'documents' && <DocumentsTable documents={organization.documents} />}
            {activeTab === 'team' && <TeamPreview organization={organization} />}
            {activeTab === 'settings' && <SettingsPreview organization={organization} />}
          </div>
        </section>
      </div>
    </main>
  );
}

function pageTitle(activeTab: TabKey, organizationName: string) {
  const titles: Record<TabKey, string> = {
    overview: `Добрый день, ${organizationName}.`,
    requests: 'Мои заявки',
    'new-request': 'Новая заявка',
    messages: 'Чат и уведомления',
    objects: 'Объекты',
    assets: 'Оборудование и рекламные активы',
    maintenance: 'План ТО',
    reports: 'Фотоотчеты',
    warranties: 'Гарантии',
    offers: 'КП и согласования',
    billing: 'Счета и акты',
    documents: 'Документы',
    team: 'Сотрудники',
    settings: 'Настройки',
  };

  return titles[activeTab];
}

function pageSubtitle(activeTab: TabKey) {
  const subtitles: Record<TabKey, string> = {
    overview: 'Здесь собраны заявки, объекты, отчеты, гарантии и действия, которые требуют вашего решения.',
    requests: 'Клиентские статусы, сообщения, документы и следующие действия без внутренних CRM-деталей.',
    'new-request': 'Быстрый старт для ремонта, гарантии, профилактики или консультации. Номер появляется только после подтверждения контакта.',
    messages: 'Единая история клиентских сообщений по заявкам, без показа внутренних заметок операторов.',
    objects: 'Торговые точки как центры ответственности: контакты, состав рекламных активов, ремонты, счета и затраты.',
    assets: 'Не только вывески: наружная и внутренняя реклама, меню, печать, баннеры, наклейки, навигация и одежда персонала.',
    maintenance: 'Профилактические визиты, сервисные окна и повторяющиеся договоренности.',
    reports: 'Клиентские отчеты до/после, диагностика, выполненные работы и PDF для архива.',
    warranties: 'Сроки, условия и гарантийные обращения по выполненным работам.',
    offers: 'Сметы можно просматривать, согласования остаются demo-only до безопасных mutations.',
    billing: 'Будущий раздел для customer-visible финансовых документов. Платежи не входят в текущий MVP.',
    documents: 'Единое место для PDF, актов, гарантий, отчетов и согласованных смет.',
    team: 'B2B-доступы: кто может создавать заявки, видеть документы и согласовывать расходы.',
    settings: 'Безопасность, уведомления, язык, экспорт и privacy-запросы.',
  };

  return subtitles[activeTab];
}

function Overview({
  organization,
  activeRequests,
  serviceAssets,
  availableDocuments,
  objectsById,
  onTabChange,
}: {
  organization: PortalDemoOrganization;
  activeRequests: PortalRequest[];
  serviceAssets: PortalAsset[];
  availableDocuments: PortalDocument[];
  objectsById: Map<string, PortalObject>;
  onTabChange: (tab: TabKey) => void;
}) {
  const t = useTranslations('Portal');
  const waitingActions = organization.requiredActions.slice(0, 3);

  return (
    <div className="grid gap-5">
      <section className="rounded-2xl bg-[#0D1B2A] p-5 text-white shadow-sm">
        <h2 className="text-[18px] font-black">PixelAI Concierge</h2>
        <p className="mt-3 max-w-5xl text-[15px] leading-7 text-white/72">
          По вашим активным заявкам есть {waitingActions.length} действия: согласовать смету, подтвердить окно визита и дополнить фото для подготовки материалов.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={() => onTabChange('requests')} className="rounded-xl bg-[#C46E43] px-4 py-3 text-[14px] font-black text-white">
            Открыть действия
          </button>
          <button type="button" className="rounded-xl bg-white/10 px-4 py-3 text-[14px] font-black text-white">
            Напомнить позже
          </button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Активные заявки" value={activeRequests.length} meta={`${waitingActions.length} требуют решения`} />
        <MetricCard label={t('metrics.objects')} value={organization.objects.length} meta="Berlin · Potsdam" />
        <MetricCard label="Гарантии" value={organization.documents.filter((document) => document.type === 'WARRANTY').length} meta="1 preview заблокирован" />
        <MetricCard label="Плановое ТО" value={serviceAssets.length} meta="Ближайший визит: 30.04" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
        <div className="grid gap-5">
          <ActionList organization={organization} objectsById={objectsById} />
          <RequestsTable requests={activeRequests.slice(0, 3)} objectsById={objectsById} compact onTabChange={onTabChange} />
        </div>
        <aside className="grid content-start gap-5">
          <UpcomingEvents organization={organization} objectsById={objectsById} />
          <ObjectHealth organization={organization} />
          <DocumentCards title="Документы preview" documents={availableDocuments.slice(0, 3)} emptyLabel="Нет документов." compact />
        </aside>
      </div>
    </div>
  );
}

function MetricCard({ label, value, meta }: { label: string; value: number; meta: string }) {
  return (
    <div className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
      <div className="text-[34px] font-black text-[#0F1C2B]">{value}</div>
      <div className="mt-1 text-[12px] font-black uppercase tracking-[0.14em] text-[#6F665D]">{label}</div>
      <p className="mt-2 text-[13px] text-[#7B7168]">{meta}</p>
    </div>
  );
}

function ActionList({
  organization,
  objectsById,
}: {
  organization: PortalDemoOrganization;
  objectsById: Map<string, PortalObject>;
}) {
  const t = useTranslations('Portal');

  return (
    <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[20px] font-black">Требует действия</h2>
        <span className="rounded-full bg-[#FFF3E8] px-3 py-1 text-[12px] font-black text-[#A85F23]">{organization.requiredActions.length} задачи</span>
      </div>
      <div className="grid gap-3">
        {organization.requiredActions.map((action) => {
          const request = organization.requests.find((item) => item.id === action.requestId);
          if (!request) return null;

          return (
            <Link
              key={action.id}
              href={`/portal/requests/${request.publicRequestNumber}`}
              className="grid gap-3 rounded-2xl border border-[#EFE6DC] bg-[#FFFDFC] p-4 transition hover:border-[#C46E43]/50 md:grid-cols-[1fr_auto] md:items-center"
            >
              <div>
                <h3 className="text-[16px] font-black">{actionTitle(action.type)}</h3>
                <p className="mt-1 text-[13px] text-[#6F665D]">
                  {request.publicRequestNumber} · {objectsById.get(request.objectId)?.name} · {action.description}
                </p>
              </div>
              <span className="w-fit rounded-xl bg-[#F2E1D5] px-4 py-2 text-[13px] font-black text-[#A45531]">
                {t('detail.previewOnly')}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function actionTitle(type: string) {
  if (type === 'APPROVE_ESTIMATE') return 'Согласовать смету';
  if (type === 'CONFIRM_VISIT_WINDOW') return 'Подтвердить приезд техника';
  return 'Добавить недостающее фото';
}

function RequestsTable({
  requests,
  objectsById,
  compact = false,
  onTabChange,
}: {
  requests: PortalRequest[];
  objectsById: Map<string, PortalObject>;
  compact?: boolean;
  onTabChange: (tab: TabKey) => void;
}) {
  const t = useTranslations('Portal');

  return (
    <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-[20px] font-black">{compact ? 'Активные заявки' : 'Мои заявки'}</h2>
        {!compact && (
          <button type="button" onClick={() => onTabChange('new-request')} className="rounded-xl bg-[#C46E43] px-4 py-2.5 text-[13px] font-black text-white">
            + Новая заявка
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[860px] w-full border-collapse text-left text-[14px]">
          <thead>
            <tr className="border-b border-[#EFE6DC] text-[11px] font-black uppercase tracking-[0.14em] text-[#7B7168]">
              <th className="py-3 pe-4">PR-номер</th>
              <th className="py-3 pe-4">Работа</th>
              <th className="py-3 pe-4">Объект</th>
              <th className="py-3 pe-4">Статус</th>
              <th className="py-3 pe-4">Следующее действие</th>
              <th className="py-3" />
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id} className="border-b border-[#F1E9DF] align-top last:border-0">
                <td className="py-4 pe-4 font-mono font-black text-[#0F1C2B]">{request.publicRequestNumber}</td>
                <td className="py-4 pe-4 font-bold">{request.title}</td>
                <td className="py-4 pe-4 text-[#6F665D]">{objectsById.get(request.objectId)?.name}</td>
                <td className="py-4 pe-4">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-[11px] font-black ${statusTone[request.status]}`}>
                    {t(`requestStatus.${request.status}`)}
                  </span>
                </td>
                <td className="py-4 pe-4 text-[#6F665D]">{request.nextStep}</td>
                <td className="py-4">
                  {request.status === 'COMPLETED' ? (
                    <button type="button" onClick={() => onTabChange('reports')} className="rounded-xl border border-[#E3D8CA] px-4 py-2 text-[13px] font-black">
                      Отчет
                    </button>
                  ) : (
                    <Link href={`/portal/requests/${request.publicRequestNumber}`} className="inline-flex rounded-xl bg-[#F2E1D5] px-4 py-2 text-[13px] font-black text-[#A45531]">
                      Открыть
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function NewRequestPreview({ organization }: { organization: PortalDemoOrganization }) {
  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
      <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-[20px] font-black">Что нужно сделать?</h2>
        <div className="mb-5 grid gap-3 md:grid-cols-3">
          {[
            ['Ремонт', 'Не горит, мигает, шумит'],
            ['Гарантия', 'Проверить гарантийный случай'],
            ['Плановое ТО', 'Профилактический осмотр'],
          ].map(([title, meta]) => (
            <button key={title} type="button" className="rounded-2xl border border-[#EFE6DC] bg-[#FFFDFC] p-4 text-left transition hover:border-[#C46E43]/60">
              <strong className="block text-[16px]">{title}</strong>
              <span className="mt-1 block text-[13px] text-[#7B7168]">{meta}</span>
            </button>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <DemoField label="Объект" value={organization.objects[0]?.name || 'Pixel Ring GmbH'} />
          <DemoField label="Приоритет" value="Обычный" />
          <div className="md:col-span-2">
            <DemoField label="Описание" value="Что произошло, где видно проблему, есть ли фото или видео..." muted />
          </div>
          <DemoField label="Желаемое окно" value="30.04, 09:00-11:00" />
          <DemoField label="Контакт для подтверждения" value={organization.demoEmail} />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" className="rounded-xl bg-[#C46E43] px-4 py-3 text-[14px] font-black text-white">Отправить на проверку</button>
          <button type="button" className="rounded-xl border border-[#E3D8CA] bg-white px-4 py-3 text-[14px] font-black">Добавить фото</button>
        </div>
        <p className="mt-4 text-[12px] text-[#7B7168]">Demo-only: форма пока не создает production-заявку и не загружает файлы.</p>
      </section>
      <TimelineCard
        title="Как это работает"
        items={[
          ['Черновик', 'Вы описываете задачу. AI может помочь уточнить проблему.'],
          ['Контактное подтверждение', 'PR-номер показывается только после проверенного email или телефона.'],
          ['Рабочая заявка', 'Координатор подтверждает план, сроки и нужные материалы.'],
        ]}
      />
    </div>
  );
}

function DemoField({ label, value, muted = false }: { label: string; value: string; muted?: boolean }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] font-black text-[#6F665D]">{label}</span>
      <div className={`min-h-11 rounded-xl border border-[#E3D8CA] bg-[#FBF8F3] px-3 py-3 text-[14px] ${muted ? 'text-[#A49A91]' : 'text-[#0F1C2B]'}`}>
        {value}
      </div>
    </label>
  );
}

function MessagesPanel({
  organization,
  objectsById,
}: {
  organization: PortalDemoOrganization;
  objectsById: Map<string, PortalObject>;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-[20px] font-black">Входящие</h2>
        <div className="grid gap-3">
          {organization.messages.slice(-5).reverse().map((message) => {
            const request = organization.requests.find((item) => item.id === message.requestId);
            return (
              <Link key={message.id} href={request ? `/portal/requests/${request.publicRequestNumber}` : '/portal'} className="rounded-2xl border border-[#EFE6DC] bg-[#FFFDFC] p-4 transition hover:border-[#C46E43]/60">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black">{message.author}</h3>
                    <p className="mt-1 text-[13px] text-[#6F665D]">{request?.publicRequestNumber} · {objectsById.get(request?.objectId || '')?.name}</p>
                  </div>
                  <span className="rounded-full bg-[#EEF3FB] px-3 py-1 text-[11px] font-black text-[#42526B]">{message.sentAt}</span>
                </div>
                <p className="mt-3 text-[14px] leading-6 text-[#4D4741]">{message.body}</p>
              </Link>
            );
          })}
        </div>
      </section>
      <UpcomingEvents organization={organization} objectsById={objectsById} />
    </div>
  );
}

function ObjectsWorkspace({
  organization,
  selectedObject,
  onSelectObject,
  onTabChange,
}: {
  organization: PortalDemoOrganization;
  selectedObject?: PortalObject;
  onSelectObject: (objectId: string) => void;
  onTabChange: (tab: TabKey) => void;
}) {
  if (!selectedObject) return null;

  return (
    <div className="grid gap-5">
      <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <DemoField label="Сеть / организация" value={organization.name} />
          <DemoField label="Город" value="Все города" />
          <DemoField label="Формат точки" value="Все форматы" />
          <DemoField label="Финансовый риск" value="Любой" />
        </div>
      </section>
      <div className="grid gap-5 xl:grid-cols-[430px_1fr]">
        <section className="grid content-start gap-4">
          {organization.objects.map((object) => {
            const assets = organization.assets.filter((asset) => asset.objectId === object.id);
            const requests = organization.requests.filter((request) => request.objectId === object.id);
            const needsAttention = assets.filter((asset) => asset.status === 'SERVICE_NEEDED' || asset.status === 'WATCH').length;

            return (
              <button
                key={object.id}
                type="button"
                onClick={() => onSelectObject(object.id)}
                className={`rounded-2xl border bg-white p-4 text-left shadow-sm transition ${
                  selectedObject.id === object.id ? 'border-[#C46E43]' : 'border-[#E3D8CA] hover:border-[#C46E43]/60'
                }`}
              >
                <div className="mb-4 h-28 rounded-xl bg-gradient-to-br from-[#0D1B2A] via-[#263A4D] to-[#C46E43]" />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-[18px] font-black">{object.name}</h3>
                    <p className="mt-1 text-[13px] text-[#6F665D]">{object.address}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-black ${needsAttention ? 'bg-[#FFF3E8] text-[#A85F23]' : 'bg-emerald-100 text-emerald-800'}`}>
                    {needsAttention ? 'Needs attention' : 'On track'}
                  </span>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2">
                  <MiniStat label="Активы" value={String(assets.length)} />
                  <MiniStat label="Заявки" value={String(requests.length)} />
                  <MiniStat label="YTD" value="demo" />
                  <MiniStat label="Риск" value={needsAttention ? String(needsAttention) : 'OK'} />
                </div>
              </button>
            );
          })}
        </section>
        <ObjectPassport organization={organization} object={selectedObject} onTabChange={onTabChange} />
      </div>
    </div>
  );
}

function ObjectPassport({
  organization,
  object,
  onTabChange,
}: {
  organization: PortalDemoOrganization;
  object: PortalObject;
  onTabChange: (tab: TabKey) => void;
}) {
  const assets = organization.assets.filter((asset) => asset.objectId === object.id);
  const requests = organization.requests.filter((request) => request.objectId === object.id);
  const contacts = organization.contacts.filter((contact) => object.responsibleContactIds.includes(contact.id));
  const attentionAssets = assets.filter((asset) => asset.status === 'SERVICE_NEEDED' || asset.status === 'WATCH');
  const groupedAssets = groupAssetsByCategory(assets);

  return (
    <section className="rounded-2xl border border-[#E3D8CA] bg-white shadow-sm">
      <div className="flex flex-col gap-3 border-b border-[#EFE6DC] p-5 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-[24px] font-black">{object.name}</h2>
          <p className="mt-1 text-[14px] text-[#6F665D]">{object.address} · {object.purpose}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => onTabChange('new-request')} className="rounded-xl bg-[#C46E43] px-4 py-2.5 text-[13px] font-black text-white">Заявка по объекту</button>
          <button type="button" className="rounded-xl border border-[#E3D8CA] px-4 py-2.5 text-[13px] font-black">Экспорт preview</button>
        </div>
      </div>
      <div className="grid gap-5 p-5 xl:grid-cols-[330px_1fr]">
        <aside className="grid content-start gap-4">
          <InfoCard title="Budget watch" value="Demo YTD" body="Расходы, счета и лимиты показываются как preview до финансового контура." />
          <InfoList title="Ответственные" rows={contacts.map((contact) => [contact.name, `${contact.role} · ${contact.email}`])} />
          <InfoList title="Доступ и ограничения" rows={[['Рабочее окно', object.accessNotes], ['Город', object.city], ['Доступ', 'Только verified portal session']]} />
          <InfoList title="Управленческая сводка" rows={[['Активов всего', String(assets.length)], ['Требуют внимания', String(attentionAssets.length)], ['Открытые заявки', String(requests.length)], ['Гарантии', String(organization.documents.filter((doc) => doc.type === 'WARRANTY').length)]]} />
          <InfoList title="Ремонты и сервис" rows={requests.map((request) => [request.title, `${request.openedAt} · ${request.publicRequestNumber}`])} />
        </aside>
        <div className="grid gap-4">
          <section className="rounded-2xl border border-[#EFE6DC] bg-[#FBF8F3] p-4">
            <h3 className="text-[18px] font-black">Состав объекта</h3>
            <p className="mt-1 text-[13px] text-[#6F665D]">Категории раскрываются как в прототипе. Фильтры пока read-only.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_190px_170px_auto] md:items-end">
              <DemoField label="Сквозной поиск" value="меню, баннер, PSU, униформа..." muted />
              <DemoField label="Категория" value="Все категории" />
              <DemoField label="Статус" value="Любой" />
              <button type="button" className="rounded-xl border border-[#E3D8CA] bg-white px-4 py-3 text-[13px] font-black">Фильтр</button>
            </div>
          </section>
          <div className="grid gap-3">
            {Object.entries(groupedAssets).map(([category, categoryAssets], index) => (
              <details key={category} className="rounded-2xl border border-[#EFE6DC] bg-white p-4" open={index === 0}>
                <summary className="cursor-pointer text-[16px] font-black">
                  {category} · {categoryAssets.length}
                </summary>
                <div className="mt-3 grid gap-2">
                  {categoryAssets.map((asset) => (
                    <div key={asset.id} className="grid gap-2 rounded-xl bg-[#FBF8F3] p-3 md:grid-cols-[1fr_150px_130px_auto] md:items-center">
                      <div>
                        <strong>{asset.name}</strong>
                        <p className="text-[12px] text-[#7B7168]">{asset.id} · {asset.type}</p>
                      </div>
                      <span className="text-[13px] text-[#6F665D]">{asset.type}</span>
                      <span className={`w-fit rounded-full px-3 py-1 text-[11px] font-black ${assetTone[asset.status]}`}>
                        {asset.status}
                      </span>
                      <button type="button" className="rounded-xl border border-[#E3D8CA] bg-white px-3 py-2 text-[12px] font-black">Открыть</button>
                    </div>
                  ))}
                </div>
              </details>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <MiniStat label="Риск простоя" value={attentionAssets.length ? 'Средний' : 'Низкий'} />
            <MiniStat label="Сезонная готовность" value="72%" />
            <MiniStat label="Следующая экономия" value="Preview" />
          </div>
        </div>
      </div>
    </section>
  );
}

function AssetInventory({
  organization,
  objectsById,
}: {
  organization: PortalDemoOrganization;
  objectsById: Map<string, PortalObject>;
}) {
  const t = useTranslations('Portal');
  const categories = [
    ['Наружная реклама', 'Фасадные вывески, световые буквы, короба, крышные установки.'],
    ['Внутренняя реклама', 'Навигация, интерьерные таблички, POS-дисплеи, менюборды.'],
    ['Наклейки и баннеры', 'Window graphics, сезонные баннеры, промо-плакаты и пленки.'],
    ['Меню и печать', 'Меню, тейбл-тенты, листовки, сертификаты, брендированные материалы.'],
    ['Одежда персонала', 'Фартуки, футболки, бейджи, вышивка, брендирование формы.'],
  ];

  return (
    <div className="grid gap-5">
      <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-5">
          <DemoField label="Торговая точка" value="Все объекты" />
          <DemoField label="Категория" value="Все категории" />
          <DemoField label="Тип оборудования" value="Все типы" />
          <DemoField label="Состояние" value="Любое" />
          <button type="button" className="self-end rounded-xl border border-[#E3D8CA] px-4 py-3 text-[13px] font-black">Найти</button>
        </div>
      </section>
      <div className="grid gap-3 md:grid-cols-5">
        {categories.map(([title, body]) => (
          <div key={title} className="rounded-2xl border border-[#E3D8CA] bg-white p-4 shadow-sm">
            <strong className="block text-[15px]">{title}</strong>
            <span className="mt-2 block text-[13px] leading-5 text-[#7B7168]">{body}</span>
          </div>
        ))}
      </div>
      <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-[#EFE6DC] text-[11px] font-black uppercase tracking-[0.14em] text-[#7B7168]">
                <th className="py-3 pe-4">Актив</th>
                <th className="py-3 pe-4">Объект</th>
                <th className="py-3 pe-4">Категория / тип</th>
                <th className="py-3 pe-4">Сервисная логика</th>
                <th className="py-3 pe-4">Состояние</th>
                <th className="py-3">Последний сервис</th>
              </tr>
            </thead>
            <tbody>
              {organization.assets.map((asset) => (
                <tr key={asset.id} className="border-b border-[#F1E9DF] align-top last:border-0">
                  <td className="py-4 pe-4 font-black">{asset.name}<div className="text-[12px] font-normal text-[#7B7168]">{asset.id}</div></td>
                  <td className="py-4 pe-4">{objectsById.get(asset.objectId)?.name}</td>
                  <td className="py-4 pe-4">{asset.category} · {asset.type}</td>
                  <td className="py-4 pe-4 text-[#6F665D]">{asset.serviceRelevance}</td>
                  <td className="py-4 pe-4"><span className={`rounded-full px-3 py-1 text-[11px] font-black ${assetTone[asset.status]}`}>{t(`assetStatus.${asset.status}`)}</span></td>
                  <td className="py-4">{asset.lastServiceAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function MaintenancePanel({
  organization,
  objectsById,
}: {
  organization: PortalDemoOrganization;
  objectsById: Map<string, PortalObject>;
}) {
  const planned = organization.assets.filter((asset) => asset.status === 'WATCH' || asset.status === 'SERVICE_NEEDED' || asset.status === 'WARRANTY');

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {planned.map((asset, index) => (
        <section key={asset.id} className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
          <span className="rounded-full bg-[#FFF3E8] px-3 py-1 text-[12px] font-black text-[#A85F23]">{index === 0 ? '30.04' : index === 1 ? '03.05' : 'Quarterly'}</span>
          <h2 className="mt-4 text-[18px] font-black">{objectsById.get(asset.objectId)?.name}</h2>
          <p className="mt-2 text-[14px] leading-6 text-[#6F665D]">{asset.serviceRelevance}</p>
        </section>
      ))}
    </div>
  );
}

function WarrantyPanel({
  organization,
  warrantyDocuments,
  objectsById,
}: {
  organization: PortalDemoOrganization;
  warrantyDocuments: PortalDocument[];
  objectsById: Map<string, PortalObject>;
}) {
  return (
    <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full text-left text-[14px]">
          <thead>
            <tr className="border-b border-[#EFE6DC] text-[11px] font-black uppercase tracking-[0.14em] text-[#7B7168]">
              <th className="py-3 pe-4">Объект</th>
              <th className="py-3 pe-4">Работа</th>
              <th className="py-3 pe-4">Действует до</th>
              <th className="py-3 pe-4">Статус</th>
              <th className="py-3" />
            </tr>
          </thead>
          <tbody>
            {warrantyDocuments.map((document) => {
              const request = organization.requests.find((item) => item.id === document.requestId);
              return (
                <tr key={document.id} className="border-b border-[#F1E9DF] last:border-0">
                  <td className="py-4 pe-4">{objectsById.get(request?.objectId || '')?.name || document.relatedTo}</td>
                  <td className="py-4 pe-4 font-black">{document.title}</td>
                  <td className="py-4 pe-4">{document.issuedAt}</td>
                  <td className="py-4 pe-4"><span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-black text-emerald-800">{document.status}</span></td>
                  <td className="py-4"><button type="button" className="rounded-xl border border-[#E3D8CA] px-4 py-2 text-[13px] font-black">Документ</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function OffersPanel({ documents }: { documents: PortalDocument[] }) {
  return (
    <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full text-left text-[14px]">
          <thead>
            <tr className="border-b border-[#EFE6DC] text-[11px] font-black uppercase tracking-[0.14em] text-[#7B7168]">
              <th className="py-3 pe-4">Документ</th>
              <th className="py-3 pe-4">Заявка</th>
              <th className="py-3 pe-4">Сумма</th>
              <th className="py-3 pe-4">Статус</th>
              <th className="py-3" />
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.id} className="border-b border-[#F1E9DF] last:border-0">
                <td className="py-4 pe-4 font-black">{document.title}<div className="text-[12px] font-normal text-[#7B7168]">{document.description}</div></td>
                <td className="py-4 pe-4">{document.relatedTo}</td>
                <td className="py-4 pe-4">Demo</td>
                <td className="py-4 pe-4"><span className="rounded-full bg-[#FFF3E8] px-3 py-1 text-[11px] font-black text-[#A85F23]">{document.status}</span></td>
                <td className="py-4"><button type="button" className="rounded-xl bg-[#C46E43] px-4 py-2 text-[13px] font-black text-white">Согласовать</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[12px] text-[#7B7168]">Кнопки согласования пока preview-only и ничего не сохраняют.</p>
    </section>
  );
}

function BillingPreview({ invoices }: { invoices: PortalDocument[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <PreviewCard tag="Future" title="Online payment" body="Появится только после утверждения платежного и юридического контура." />
      {invoices.map((invoice) => (
        <PreviewCard key={invoice.id} tag={invoice.status} title={invoice.title} body={invoice.description || invoice.relatedTo} />
      ))}
      <PreviewCard tag="Акт" title="Service report preview" body="Акты и счета остаются preview до отдельного решения по billing." />
    </div>
  );
}

function DocumentsTable({ documents }: { documents: PortalDocument[] }) {
  const t = useTranslations('Portal');

  return (
    <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full text-left text-[14px]">
          <thead>
            <tr className="border-b border-[#EFE6DC] text-[11px] font-black uppercase tracking-[0.14em] text-[#7B7168]">
              <th className="py-3 pe-4">Название</th>
              <th className="py-3 pe-4">Тип</th>
              <th className="py-3 pe-4">Связано с</th>
              <th className="py-3 pe-4">Дата</th>
              <th className="py-3" />
            </tr>
          </thead>
          <tbody>
            {documents.map((document) => (
              <tr key={document.id} className="border-b border-[#F1E9DF] last:border-0">
                <td className="py-4 pe-4 font-black">{document.title}</td>
                <td className="py-4 pe-4">{t(`documentType.${document.type}`)}</td>
                <td className="py-4 pe-4">{document.relatedTo}</td>
                <td className="py-4 pe-4">{document.issuedAt}</td>
                <td className="py-4"><button type="button" className="rounded-xl border border-[#E3D8CA] px-4 py-2 text-[13px] font-black">PDF</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TeamPreview({ organization }: { organization: PortalDemoOrganization }) {
  return (
    <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
      <div className="mb-4 flex justify-end">
        <button type="button" className="rounded-xl bg-[#C46E43] px-4 py-2.5 text-[13px] font-black text-white">Пригласить</button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-[760px] w-full text-left text-[14px]">
          <thead>
            <tr className="border-b border-[#EFE6DC] text-[11px] font-black uppercase tracking-[0.14em] text-[#7B7168]">
              <th className="py-3 pe-4">Пользователь</th>
              <th className="py-3 pe-4">Роль</th>
              <th className="py-3 pe-4">Доступ</th>
              <th className="py-3">Статус</th>
            </tr>
          </thead>
          <tbody>
            {organization.contacts.map((contact, index) => (
              <tr key={contact.id} className="border-b border-[#F1E9DF] last:border-0">
                <td className="py-4 pe-4 font-black">{contact.name}<div className="text-[12px] font-normal text-[#7B7168]">{contact.email}</div></td>
                <td className="py-4 pe-4">{index === 0 ? 'Owner' : contact.role}</td>
                <td className="py-4 pe-4">{index === 0 ? 'Все объекты, документы, согласования' : 'Заявки, объекты, фотоотчеты'}</td>
                <td className="py-4"><span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-black text-emerald-800">Verified</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-[12px] text-[#7B7168]">Invites/RBAC отключены до отдельного этапа portal identity.</p>
    </section>
  );
}

function SettingsPreview({ organization }: { organization: PortalDemoOrganization }) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <InfoList
        title="Аккаунт"
        rows={[
          ['Email', `${organization.demoEmail} · verified demo`],
          ['Вход', 'HTTP-only demo cookie'],
          ['Язык', `${organization.languagePreference.toUpperCase()} canonical · RU review copy`],
        ]}
      />
      <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
        <h2 className="text-[20px] font-black">Privacy</h2>
        <div className="mt-4 grid gap-2">
          {['Запросить экспорт данных', 'Исправить контактные данные', 'Запросить удаление данных'].map((label) => (
            <button key={label} type="button" className="rounded-xl border border-[#E3D8CA] px-4 py-3 text-left text-[14px] font-black">
              {label}
            </button>
          ))}
        </div>
        <p className="mt-4 text-[12px] text-[#7B7168]">Privacy workflows preview-only: реальные export/deletion процессы не выполняются.</p>
      </section>
    </div>
  );
}

function UpcomingEvents({
  organization,
  objectsById,
}: {
  organization: PortalDemoOrganization;
  objectsById: Map<string, PortalObject>;
}) {
  const items = organization.requiredActions.map((action) => {
    const request = organization.requests.find((item) => item.id === action.requestId);
    return [
      action.dueLabel,
      request ? `${request.publicRequestNumber} · ${objectsById.get(request.objectId)?.name}` : action.description,
    ] as const;
  });

  return <TimelineCard title="Ближайшие события" items={items} />;
}

function TimelineCard({ title, items }: { title: string; items: readonly (readonly [string, string])[] }) {
  return (
    <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-[20px] font-black">{title}</h2>
      <div className="grid gap-4">
        {items.map(([heading, body], index) => (
          <div key={`${heading}-${index}`} className="grid grid-cols-[28px_1fr] gap-3">
            <span className={`mt-1 flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-black ${index === 0 ? 'bg-[#C46E43] text-white' : 'bg-[#EFE6DC] text-[#6F665D]'}`}>
              {index + 1}
            </span>
            <div>
              <h3 className="font-black">{heading}</h3>
              <p className="mt-1 text-[13px] leading-5 text-[#6F665D]">{body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ObjectHealth({ organization }: { organization: PortalDemoOrganization }) {
  return (
    <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-[20px] font-black">Здоровье объектов</h2>
      <div className="grid gap-4">
        {organization.objects.map((object) => {
          const assets = organization.assets.filter((asset) => asset.objectId === object.id);
          const attention = assets.filter((asset) => asset.status === 'SERVICE_NEEDED' || asset.status === 'WATCH').length;
          const score = Math.max(42, 92 - attention * 18);
          return (
            <div key={object.id}>
              <div className="mb-2 flex items-center justify-between gap-3">
                <strong>{object.name}</strong>
                <span className="rounded-full bg-[#FFF3E8] px-3 py-1 text-[11px] font-black text-[#A85F23]">{score}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#EFE6DC]">
                <span className="block h-full rounded-full bg-[#C46E43]" style={{ width: `${score}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function DocumentCards({
  title,
  documents,
  emptyLabel,
  compact = false,
}: {
  title: string;
  documents: PortalDocument[];
  emptyLabel: string;
  compact?: boolean;
}) {
  const t = useTranslations('Portal');

  return (
    <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-[20px] font-black">{title}</h2>
      {documents.length === 0 ? (
        <p className="text-[14px] text-[#7B7168]">{emptyLabel}</p>
      ) : (
        <div className={`grid gap-3 ${compact ? '' : 'md:grid-cols-2 xl:grid-cols-3'}`}>
          {documents.map((document) => (
            <article key={document.id} className="rounded-2xl border border-[#EFE6DC] bg-[#FFFDFC] p-4">
              <span className="rounded-full bg-[#EEF3FB] px-3 py-1 text-[11px] font-black text-[#42526B]">{t(`documentType.${document.type}`)}</span>
              <h3 className="mt-3 font-black">{document.title}</h3>
              <p className="mt-2 text-[13px] leading-5 text-[#6F665D]">{document.description || document.relatedTo}</p>
              <button type="button" className="mt-4 rounded-xl border border-[#E3D8CA] px-4 py-2 text-[13px] font-black">PDF preview</button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function PreviewCard({ tag, title, body }: { tag: string; title: string; body: string }) {
  return (
    <article className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
      <span className="rounded-full bg-[#FFF3E8] px-3 py-1 text-[11px] font-black text-[#A85F23]">{tag}</span>
      <h2 className="mt-4 text-[18px] font-black">{title}</h2>
      <p className="mt-2 text-[14px] leading-6 text-[#6F665D]">{body}</p>
    </article>
  );
}

function InfoCard({ title, value, body }: { title: string; value: string; body: string }) {
  return (
    <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
      <span className="rounded-full bg-[#FFF3E8] px-3 py-1 text-[11px] font-black text-[#A85F23]">{title}</span>
      <h3 className="mt-3 text-[22px] font-black">{value}</h3>
      <p className="mt-2 text-[13px] leading-5 text-[#6F665D]">{body}</p>
    </section>
  );
}

function InfoList({ title, rows }: { title: string; rows: readonly (readonly [string, string])[] }) {
  return (
    <section className="rounded-2xl border border-[#E3D8CA] bg-white p-5 shadow-sm">
      <h2 className="text-[20px] font-black">{title}</h2>
      <div className="mt-4 grid gap-3">
        {rows.map(([label, value]) => (
          <div key={`${label}-${value}`} className="flex items-start justify-between gap-4 border-b border-[#F1E9DF] pb-3 last:border-0 last:pb-0">
            <span className="text-[13px] text-[#7B7168]">{label}</span>
            <strong className="max-w-[65%] text-right text-[13px]">{value}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#FBF8F3] p-3">
      <span className="block text-[11px] font-bold text-[#7B7168]">{label}</span>
      <strong className="mt-1 block text-[15px]">{value}</strong>
    </div>
  );
}

function groupAssetsByCategory(assets: PortalAsset[]) {
  return assets.reduce<Record<string, PortalAsset[]>>((groups, asset) => {
    if (!groups[asset.category]) groups[asset.category] = [];
    groups[asset.category].push(asset);
    return groups;
  }, {});
}
