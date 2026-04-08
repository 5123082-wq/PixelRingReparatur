'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';

import { adminFetch } from '@/lib/admin-fetch';

import { withLocalePath } from '../../../admin-route';

type CaseDetail = {
  id: string;
  publicRequestNumber: string | null;
  status: string;
  originChannel: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  assignedOperator: string | null;
  primaryContactMethod: string | null;
  primaryContactValue: string | null;
  summary: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  statusUpdatedAt: string | null;
  numberIssuedAt: string | null;
  formalizedAt: string | null;
  customerProfile: {
    id: string;
    displayName: string | null;
    email: string | null;
    phone: string | null;
    preferredLanguage: string | null;
    preferredContactMethod: string | null;
    _count: { cases: number };
  } | null;
  messages: {
    id: string;
    authorRole: string;
    authorName: string | null;
    body: string;
    isCustomerVisible: boolean;
    createdAt: string;
  }[];
  attachments: {
    id: string;
    kind: string;
    originalFilename: string | null;
    mimeType: string;
    byteSize: number;
    storageProvider: string;
    createdAt: string;
  }[];
  sessions: {
    id: string;
    operatorTakeover: boolean;
    lastSeenAt: string | null;
    createdAt: string;
  }[];
  statusEvents: {
    id: string;
    actorRole: string | null;
    fromStatus: string | null;
    toStatus: string;
    reason: string | null;
    createdAt: string;
  }[];
  auditLogs: {
    id: string;
    action: string;
    outcome: string;
    reason: string | null;
    createdAt: string;
  }[];
};

type RelatedCase = {
  id: string;
  publicRequestNumber: string | null;
  status: string;
  updatedAt: string;
  summary: string | null;
};

type MessageRole = 'CUSTOMER' | 'OPERATOR' | 'SYSTEM';

function isMessageRole(value: string): value is MessageRole {
  return value === 'CUSTOMER' || value === 'OPERATOR' || value === 'SYSTEM';
}

function getMessageRole(role: string): MessageRole {
  return isMessageRole(role) ? role : 'SYSTEM';
}

const MESSAGE_ROLE_META: Record<
  MessageRole,
  {
    label: string;
    borderColor: string;
    badgeBackground: string;
    badgeColor: string;
    cardBackground: string;
  }
> = {
  CUSTOMER: {
    label: '👤 Клиент',
    borderColor: '#3b82f6',
    badgeBackground: '#dbeafe',
    badgeColor: '#1d4ed8',
    cardBackground: '#0a0a0a',
  },
  OPERATOR: {
    label: '🔧 Оператор',
    borderColor: '#10b981',
    badgeBackground: '#d1fae5',
    badgeColor: '#047857',
    cardBackground: '#0d1713',
  },
  SYSTEM: {
    label: '🤖 AI',
    borderColor: '#a855f7',
    badgeBackground: '#f3e8ff',
    badgeColor: '#7e22ce',
    cardBackground: '#111827',
  },
};

const STATUS_OPTIONS: { value: string; label: string; color: string }[] = [
  { value: 'DRAFT', label: 'Черновик', color: '#555' },
  { value: 'FORMALIZED', label: 'Оформлена', color: '#666' },
  { value: 'NUMBER_ISSUED', label: 'Принято', color: '#3b82f6' },
  { value: 'UNDER_REVIEW', label: 'В диагностике', color: '#a855f7' },
  { value: 'IN_PROGRESS', label: 'Ремонт', color: '#f59e0b' },
  { value: 'ON_HOLD', label: 'Отложено', color: '#6b7280' },
  { value: 'WAITING_FOR_CUSTOMER', label: 'Ожидает клиента', color: '#ec4899' },
  { value: 'READY_FOR_PICKUP', label: 'Готов', color: '#22c55e' },
  { value: 'COMPLETED', label: 'Выдан / Гарантия', color: '#10b981' },
  { value: 'CANCELLED', label: 'Отказ', color: '#ef4444' },
];

const CHANNEL_LABELS: Record<string, string> = {
  WEBSITE_CHAT: '💬 Чат',
  WEBSITE_FORM: '📝 Форма',
  TELEGRAM: '✈️ Telegram',
  WHATSAPP: '📱 WhatsApp',
  PHONE: '📞 Телефон',
  EMAIL: '📧 Email',
  CRM: '🏢 CRM',
  MANUAL: '✋ Вручную',
};

const ACTOR_ROLE_LABELS: Record<string, string> = {
  CUSTOMER: 'Клиент',
  OPERATOR: 'Оператор',
  SYSTEM: 'Система',
  AI: 'AI',
};

const AUDIT_ACTION_LABELS: Record<string, string> = {
  CASE_CREATED: 'Заявка создана',
  CASE_STATUS_CHANGED: 'Статус изменён',
  CASE_ASSIGNMENT_CHANGED: 'Назначение обновлено',
  CASE_OPERATOR_MESSAGE_SENT: 'Ответ оператора',
  CASE_INTERNAL_NOTE_CREATED: 'Внутренняя заметка',
  CASE_OPERATOR_TAKEOVER_CHANGED: 'Режим AI/takeover изменён',
  CASE_CUSTOMER_PROFILE_SYNCED: 'Профиль клиента синхронизирован',
  ATTACHMENT_DOWNLOADED: 'Вложение скачано',
  ATTACHMENT_DOWNLOAD_BLOCKED_CHECKSUM: 'Скачивание блокировано: checksum',
};

function formatStatusLabel(status: string | null | undefined) {
  if (!status) {
    return '—';
  }

  return STATUS_OPTIONS.find((option) => option.value === status)?.label || status;
}

function formatActorRole(role: string | null | undefined) {
  if (!role) {
    return 'Система';
  }

  return ACTOR_ROLE_LABELS[role] || role;
}

function formatAuditAction(action: string | null | undefined) {
  if (!action) {
    return 'Событие';
  }

  return AUDIT_ACTION_LABELS[action] || action.replaceAll('_', ' ').toLowerCase();
}

export default function CaseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id, locale } = use(params);
  const router = useRouter();
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [relatedCases, setRelatedCases] = useState<RelatedCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusError, setStatusError] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [assignedOperatorDraft, setAssignedOperatorDraft] = useState('');
  const [assignmentMessage, setAssignmentMessage] = useState('');
  const [updatingAssignment, setUpdatingAssignment] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [internalNoteText, setInternalNoteText] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [internalNoteMessage, setInternalNoteMessage] = useState('');
  const [takeoverMessage, setTakeoverMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [sendingInternalNote, setSendingInternalNote] = useState(false);
  const [updatingTakeover, setUpdatingTakeover] = useState(false);

  useEffect(() => {
    fetchCase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, locale]);

  async function fetchCase() {
    setLoading(true);
    setLoadError('');

    try {
      const res = await fetch(`/api/admin/cases/${id}`);

      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as { error?: string } | null;
        const errorMessage = payload?.error || 'Не удалось загрузить заявку';

        // Hidden admin auth failure still redirects to CRM login.
        if (res.status === 404 && errorMessage === 'Not found') {
          router.push(withLocalePath(locale, '/ring-manager-crm'));
          return;
        }

        setCaseData(null);
        setRelatedCases([]);
        setLoadError(`${errorMessage} (HTTP ${res.status})`);
        return;
      }

      const data = await res.json();

      setCaseData(data.case);
      setRelatedCases(Array.isArray(data.relatedCases) ? data.relatedCases : []);
      setAssignedOperatorDraft(data.case.assignedOperator || '');
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(newStatus: string) {
    setUpdating(true);
    setStatusMessage('');
    setStatusError('');

    try {
      const res = await adminFetch(`/api/admin/cases/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          statusReason: statusReason.trim() || undefined,
        }),
      });

      if (res.ok) {
        setStatusMessage(
          statusReason.trim()
            ? `Статус изменён на «${formatStatusLabel(newStatus)}». Причина сохранена.`
            : `Статус изменён на «${formatStatusLabel(newStatus)}».`
        );
        setStatusReason('');
        await fetchCase();
      } else {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setStatusError(data?.error || 'Не удалось изменить статус.');
      }
    } finally {
      setUpdating(false);
      setTimeout(() => {
        setStatusMessage('');
        setStatusError('');
      }, 4000);
    }
  }

  async function sendOperatorReply() {
    const message = replyText.trim();

    if (!message || sendingReply) {
      return;
    }

    setSendingReply(true);
    setReplyMessage('');

    try {
      const res = await adminFetch(`/api/admin/cases/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      if (res.ok) {
        setReplyText('');
        setReplyMessage('Ответ клиенту сохранён в истории и виден клиенту.');
        await fetchCase();
      } else {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setReplyMessage(data?.error || 'Не удалось сохранить ответ клиенту.');
      }
    } finally {
      setSendingReply(false);
    }
  }

  async function sendInternalNote() {
    const note = internalNoteText.trim();

    if (!note || sendingInternalNote) {
      return;
    }

    setSendingInternalNote(true);
    setInternalNoteMessage('');

    try {
      const res = await adminFetch(`/api/admin/cases/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ internalNote: note }),
      });

      if (res.ok) {
        setInternalNoteText('');
        setInternalNoteMessage('Внутренняя заметка сохранена и клиенту не видна.');
        await fetchCase();
      } else {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setInternalNoteMessage(data?.error || 'Не удалось сохранить внутреннюю заметку.');
      }
    } finally {
      setSendingInternalNote(false);
    }
  }

  async function updateAssignment() {
    if (updatingAssignment) {
      return;
    }

    setUpdatingAssignment(true);
    setAssignmentMessage('');

    try {
      const res = await adminFetch(`/api/admin/cases/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignedOperator: assignedOperatorDraft,
        }),
      });

      if (res.ok) {
        setAssignmentMessage(
          assignedOperatorDraft.trim()
            ? `Назначение обновлено: ${assignedOperatorDraft.trim()}.`
            : 'Назначение очищено.'
        );
        await fetchCase();
      } else {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setAssignmentMessage(data?.error || 'Не удалось обновить назначение.');
      }
    } finally {
      setUpdatingAssignment(false);
    }
  }

  async function updateOperatorTakeover(nextValue: boolean) {
    setUpdatingTakeover(true);
    setTakeoverMessage('');

    try {
      const res = await adminFetch(`/api/admin/cases/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operatorTakeover: nextValue }),
      });

      if (res.ok) {
        setTakeoverMessage(
          nextValue
            ? 'Перехват оператора включён. AI больше не отвечает в активных сессиях заявки.'
            : 'Перехват оператора выключен. AI снова может отвечать в активных сессиях заявки.'
        );
        await fetchCase();
      } else {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        setTakeoverMessage(data?.error || 'Не удалось обновить режим перехвата.');
      }
    } finally {
      setUpdatingTakeover(false);
    }
  }

  if (loading) {
    return <p style={{ color: '#666', textAlign: 'center', padding: '60px' }}>Загрузка...</p>;
  }

  if (loadError) {
    return (
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Ошибка загрузки заявки</h3>
        <p style={{ color: '#ef4444', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
          {loadError}
        </p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <button
            type="button"
            onClick={() => void fetchCase()}
            style={styles.assignmentBtn}
          >
            Повторить
          </button>
          <button
            type="button"
            onClick={() => router.push(withLocalePath(locale, '/ring-manager-crm/dashboard'))}
            style={styles.backBtn}
          >
            Назад к списку
          </button>
        </div>
      </div>
    );
  }

  if (!caseData) {
    return <p style={{ color: '#666', textAlign: 'center', padding: '60px' }}>Заявка не найдена</p>;
  }

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === caseData.status);
  const operatorTakeover = caseData.sessions.some((session) => session.operatorTakeover);
  const hasCustomerSession = caseData.sessions.length > 0;
  const customerVisibleMessages = caseData.messages.filter((message) => message.isCustomerVisible);
  const internalMessages = caseData.messages.filter((message) => !message.isCustomerVisible);

  return (
    <div>
      {/* Back button */}
      <button
        onClick={() => router.push(withLocalePath(locale, '/ring-manager-crm/dashboard'))}
        style={styles.backBtn}
      >
        ← Назад к списку
      </button>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.prNumber}>
            {caseData.publicRequestNumber || 'Без номера'}
          </h1>
          <span style={{ color: '#666', fontSize: '13px' }}>
            {CHANNEL_LABELS[caseData.originChannel] || caseData.originChannel}
            {' • '}
            Создана {new Date(caseData.createdAt).toLocaleDateString('de-DE', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>

        <span
          style={{
            ...styles.badge,
            background: currentStatus?.color || '#555',
          }}
        >
          {currentStatus?.label || caseData.status}
        </span>
      </div>

      {/* Two columns */}
      <div style={styles.columns}>
        {/* Left: Info + Status */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Информация о клиенте</h3>

          <div style={styles.infoGrid}>
            <InfoRow label="Имя" value={caseData.customerName} />
            <InfoRow label="Email" value={caseData.customerEmail} />
            <InfoRow label="Телефон" value={caseData.customerPhone} />
            <InfoRow label="Контакт" value={caseData.primaryContactValue} />
          </div>

          {caseData.customerProfile ? (
            <>
              <h3 style={{ ...styles.cardTitle, marginTop: '24px' }}>Профиль клиента</h3>
              <div style={styles.infoGrid}>
                <InfoRow label="Profile ID" value={caseData.customerProfile.id} />
                <InfoRow
                  label="Язык"
                  value={caseData.customerProfile.preferredLanguage || '—'}
                />
                <InfoRow
                  label="Предпочт. контакт"
                  value={caseData.customerProfile.preferredContactMethod || '—'}
                />
                <InfoRow
                  label="Связанные заявки"
                  value={String(caseData.customerProfile._count.cases)}
                />
              </div>
            </>
          ) : null}

          <h3 style={{ ...styles.cardTitle, marginTop: '24px' }}>Назначение</h3>
          <div style={styles.assignmentRow}>
            <input
              value={assignedOperatorDraft}
              onChange={(event) => setAssignedOperatorDraft(event.target.value)}
              placeholder="Имя или логин ответственного оператора"
              style={styles.assignmentInput}
            />
            <button
              type="button"
              onClick={() => void updateAssignment()}
              disabled={updatingAssignment}
              style={styles.assignmentBtn}
            >
              {updatingAssignment ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
          {assignmentMessage ? (
            <p style={styles.assignmentMessage}>{assignmentMessage}</p>
          ) : null}

          <h3 style={{ ...styles.cardTitle, marginTop: '24px' }}>Описание</h3>
          <p style={styles.description}>
            {caseData.description || caseData.summary || '—'}
          </p>

          <h3 style={{ ...styles.cardTitle, marginTop: '24px' }}>Изменить статус</h3>
          <p style={styles.sectionHint}>
            При смене статуса укажите причину. Для <strong>Отложено</strong> и <strong>Отказ</strong>{' '}
            она нужна обязательно, для остальных статусов — для аудита и разбора.
          </p>

          <div style={styles.statusGrid}>
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateStatus(opt.value)}
                disabled={updating || opt.value === caseData.status}
                style={{
                  ...styles.statusBtn,
                  borderColor: opt.value === caseData.status ? opt.color : '#333',
                  color: opt.value === caseData.status ? opt.color : '#999',
                  opacity: opt.value === caseData.status ? 1 : 0.8,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <textarea
            value={statusReason}
            onChange={(event) => setStatusReason(event.target.value)}
            rows={2}
            placeholder="Например: ожидание детали от клиента, повторная диагностика, отказ после согласования"
            style={styles.statusReasonInput}
          />
          <p style={styles.fieldHint}>
            Причина попадет в историю статусов и поможет сверить решение с последующими действиями.
          </p>

          {statusMessage && (
            <p style={{ color: '#22c55e', fontSize: '13px', marginTop: '8px' }}>
              {statusMessage}
            </p>
          )}

          {statusError && (
            <p style={{ color: '#ef4444', fontSize: '13px', marginTop: '8px' }}>
              {statusError}
            </p>
          )}

          {caseData.statusEvents.length > 0 && (
            <>
              <h3 style={{ ...styles.cardTitle, marginTop: '24px' }}>История статусов</h3>
              <p style={styles.sectionHint}>
                События показываются в хронологии изменений статуса, чтобы быстро понять, кто и
                почему перевёл заявку дальше по процессу.
              </p>
              <div style={styles.timelineList}>
                {caseData.statusEvents.map((event) => (
                  <div key={event.id} style={styles.timelineItem}>
                    <div style={styles.timelineHeader}>
                      <span style={styles.timelineStatus}>
                        {formatStatusLabel(event.fromStatus)} → {formatStatusLabel(event.toStatus)}
                      </span>
                      <span style={styles.timelineTime}>
                        {new Date(event.createdAt).toLocaleString('de-DE')}
                      </span>
                    </div>
                    <p style={styles.timelineMeta}>
                      Инициатор: {formatActorRole(event.actorRole)}
                    </p>
                    {event.reason ? (
                      <p style={styles.timelineReason}>Причина: {event.reason}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right: Messages + Attachments */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            Сообщения ({customerVisibleMessages.length})
          </h3>

          {customerVisibleMessages.length === 0 ? (
            <p style={{ color: '#555', fontSize: '13px' }}>Нет сообщений</p>
          ) : (
            <div style={styles.messageList}>
              {customerVisibleMessages.map((msg) => {
                const role = getMessageRole(msg.authorRole);
                const roleMeta = MESSAGE_ROLE_META[role];

                return (
                  <div
                    key={msg.id}
                    style={{
                      ...styles.message,
                      borderLeftColor: roleMeta.borderColor,
                      background: roleMeta.cardBackground,
                    }}
                  >
                    <div style={styles.msgMeta}>
                      <span
                        style={{
                          ...styles.roleBadge,
                          background: roleMeta.badgeBackground,
                          color: roleMeta.badgeColor,
                        }}
                      >
                        {roleMeta.label}
                      </span>
                      <span style={styles.msgTime}>
                        {new Date(msg.createdAt).toLocaleString('de-DE')}
                      </span>
                    </div>
                    {msg.authorName ? <p style={styles.msgAuthor}>{msg.authorName}</p> : null}
                    <p style={styles.msgBody}>{msg.body}</p>
                  </div>
                );
              })}
            </div>
            )}

          <div style={styles.replyPanel}>
            <div style={styles.takeoverHeader}>
              <div>
                <h4 style={styles.replyTitle}>Ответ, внутренние заметки и takeover</h4>
                <p style={styles.replyHint}>
                  Ответ клиенту, внутренняя заметка и перехват AI управляются отдельно. Это
                  помогает не смешивать клиентскую коммуникацию с внутренними действиями.
                </p>
              </div>
              <button
                type="button"
                onClick={() => void updateOperatorTakeover(!operatorTakeover)}
                disabled={!hasCustomerSession || updatingTakeover || sendingReply}
                style={{
                  ...styles.takeoverBtn,
                  borderColor: operatorTakeover ? '#10b981' : '#333',
                  color: operatorTakeover ? '#10b981' : '#999',
                  opacity: hasCustomerSession ? 1 : 0.5,
                }}
              >
                {operatorTakeover ? 'Возобновить AI' : 'Остановить AI'}
              </button>
            </div>

            <div style={styles.takeoverStatusRow}>
              <span style={styles.takeoverPill}>
                Перехват: {operatorTakeover ? 'включён' : 'выключен'}
              </span>
              <span style={styles.takeoverPill}>
                Активные сессии: {caseData.sessions.length}
              </span>
            </div>

            {!hasCustomerSession ? (
              <p style={styles.replyHint}>
                У заявки пока нет активной клиентской сессии. Ответ и заметка сохранятся в
                истории, а takeover будет доступен после появления сессии.
              </p>
            ) : null}

            <textarea
              value={replyText}
              onChange={(event) => setReplyText(event.target.value)}
              placeholder="Ответ клиенту, который должен быть виден в переписке"
              rows={4}
              style={styles.replyTextarea}
            />
            <button
              type="button"
              onClick={() => void sendOperatorReply()}
              disabled={!replyText.trim() || sendingReply}
              style={{
                ...styles.replyBtn,
                opacity: !replyText.trim() || sendingReply ? 0.5 : 1,
              }}
            >
              {sendingReply ? 'Сохранение ответа...' : 'Сохранить ответ клиенту'}
            </button>

            <textarea
              value={internalNoteText}
              onChange={(event) => setInternalNoteText(event.target.value)}
              placeholder="Внутренняя заметка для команды (клиент её не видит)"
              rows={3}
              style={{ ...styles.replyTextarea, marginTop: '10px' }}
            />
            <button
              type="button"
              onClick={() => void sendInternalNote()}
              disabled={!internalNoteText.trim() || sendingInternalNote}
              style={{
                ...styles.internalNoteBtn,
                opacity: !internalNoteText.trim() || sendingInternalNote ? 0.5 : 1,
              }}
            >
              {sendingInternalNote ? 'Сохранение заметки...' : 'Сохранить внутреннюю заметку'}
            </button>

            {replyMessage ? <p style={styles.replyMessage}>{replyMessage}</p> : null}
            {internalNoteMessage ? (
              <p style={{ ...styles.replyMessage, color: '#f59e0b' }}>{internalNoteMessage}</p>
            ) : null}
            {takeoverMessage ? (
              <p style={{ ...styles.replyMessage, color: '#38bdf8' }}>{takeoverMessage}</p>
            ) : null}
          </div>

          {internalMessages.length > 0 && (
            <>
              <h3 style={{ ...styles.cardTitle, marginTop: '24px' }}>
                Внутренние заметки ({internalMessages.length})
              </h3>

              <div style={styles.messageList}>
                {internalMessages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      ...styles.message,
                      borderLeftColor: '#f59e0b',
                      background: '#17120a',
                    }}
                  >
                    <div style={styles.msgMeta}>
                      <span
                        style={{
                          ...styles.roleBadge,
                          background: '#fef3c7',
                          color: '#b45309',
                        }}
                      >
                        📝 Internal
                      </span>
                      <span style={styles.msgTime}>
                        {new Date(msg.createdAt).toLocaleString('de-DE')}
                      </span>
                    </div>
                    {msg.authorName ? <p style={styles.msgAuthor}>{msg.authorName}</p> : null}
                    <p style={styles.msgBody}>{msg.body}</p>
                  </div>
                ))}
              </div>
            </>
          )}

          {caseData.attachments.length > 0 && (
            <>
              <h3 style={{ ...styles.cardTitle, marginTop: '24px' }}>
                Вложения ({caseData.attachments.length})
              </h3>

              <div style={styles.attachmentList}>
                {caseData.attachments.map((att) => (
                  <a
                    key={att.id}
                    href={`/api/admin/attachments/${att.id}`}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.attachment}
                  >
                    <span>{att.kind === 'IMAGE' ? '🖼️' : att.kind === 'VIDEO' ? '🎥' : '📄'}</span>
                    <span style={{ fontSize: '13px' }}>{att.originalFilename || 'file'}</span>
                    <span style={{ color: '#555', fontSize: '11px' }}>
                      {(att.byteSize / 1024).toFixed(0)} KB
                    </span>
                  </a>
                ))}
              </div>
            </>
          )}

          {caseData.auditLogs.length > 0 && (
            <>
              <h3 style={{ ...styles.cardTitle, marginTop: '24px' }}>Журнал аудита</h3>
              <p style={styles.sectionHint}>
                Здесь видны служебные операции: смена статуса, назначение, ответы, заметки и
                takeover. Это помогает быстро восстановить контекст смены.
              </p>
              <div style={styles.auditList}>
                {caseData.auditLogs.map((log) => (
                  <div key={log.id} style={styles.auditItem}>
                    <div style={styles.auditHeader}>
                      <span style={styles.auditAction}>{formatAuditAction(log.action)}</span>
                      <span style={styles.auditTime}>
                        {new Date(log.createdAt).toLocaleString('de-DE')}
                      </span>
                    </div>
                    <p style={styles.auditMeta}>Результат: {log.outcome}</p>
                    {log.reason ? <p style={styles.auditMeta}>Причина: {log.reason}</p> : null}
                  </div>
                ))}
              </div>
            </>
          )}

          {relatedCases.length > 0 ? (
            <>
              <h3 style={{ ...styles.cardTitle, marginTop: '24px' }}>
                Related Requests ({relatedCases.length})
              </h3>
              <div style={styles.auditList}>
                {relatedCases.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      router.push(withLocalePath(locale, `/ring-manager-crm/dashboard/${item.id}`))
                    }
                    style={styles.relatedCaseButton}
                  >
                    <div style={styles.auditHeader}>
                      <span style={styles.auditAction}>{item.publicRequestNumber || item.id}</span>
                      <span style={styles.auditTime}>
                        {new Date(item.updatedAt).toLocaleString('de-DE')}
                      </span>
                    </div>
                    <p style={styles.auditMeta}>Status: {item.status}</p>
                    {item.summary ? <p style={styles.auditMeta}>{item.summary}</p> : null}
                  </button>
                ))}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div style={styles.infoRow}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>{value || '—'}</span>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  backBtn: {
    padding: '8px 16px',
    fontSize: '13px',
    background: 'transparent',
    border: '1px solid #333',
    borderRadius: '8px',
    color: '#999',
    cursor: 'pointer',
    marginBottom: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '28px',
  },
  prNumber: {
    margin: '0 0 4px',
    fontSize: '28px',
    fontWeight: 700,
    color: '#fff',
    fontFamily: "'JetBrains Mono', monospace",
    letterSpacing: '0.03em',
  },
  badge: {
    display: 'inline-block',
    padding: '6px 14px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#fff',
  },
  columns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
  },
  card: {
    background: '#111',
    border: '1px solid #222',
    borderRadius: '12px',
    padding: '24px',
  },
  cardTitle: {
    margin: '0 0 16px',
    fontSize: '14px',
    fontWeight: 600,
    color: '#888',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  infoGrid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '10px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #1a1a1a',
  },
  infoLabel: {
    fontSize: '13px',
    color: '#666',
  },
  infoValue: {
    fontSize: '13px',
    color: '#e5e5e5',
    fontWeight: 500,
  },
  assignmentRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  assignmentInput: {
    flex: 1,
    padding: '10px 12px',
    background: '#0a0a0a',
    color: '#e5e5e5',
    border: '1px solid #333',
    borderRadius: '8px',
    outline: 'none',
    fontSize: '13px',
  },
  assignmentBtn: {
    padding: '10px 12px',
    border: '1px solid #333',
    borderRadius: '8px',
    background: '#141414',
    color: '#d4d4d4',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  },
  assignmentMessage: {
    margin: '8px 0 0',
    color: '#999',
    fontSize: '12px',
    lineHeight: 1.5,
  },
  sectionHint: {
    margin: '0 0 10px',
    color: '#777',
    fontSize: '12px',
    lineHeight: 1.5,
  },
  fieldHint: {
    margin: '8px 0 0',
    color: '#666',
    fontSize: '11px',
    lineHeight: 1.45,
  },
  description: {
    margin: 0,
    fontSize: '13px',
    color: '#ccc',
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap' as const,
  },
  statusGrid: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '6px',
  },
  statusBtn: {
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: 500,
    background: '#0a0a0a',
    border: '1px solid #333',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  statusReasonInput: {
    marginTop: '10px',
    width: '100%',
    resize: 'vertical' as const,
    minHeight: '70px',
    padding: '10px 12px',
    background: '#0a0a0a',
    color: '#e5e5e5',
    border: '1px solid #333',
    borderRadius: '8px',
    outline: 'none',
    fontSize: '13px',
    lineHeight: 1.5,
  },
  timelineList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    marginTop: '8px',
  },
  timelineItem: {
    border: '1px solid #1f1f1f',
    borderRadius: '8px',
    padding: '10px 12px',
    background: '#0a0a0a',
  },
  timelineHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
  },
  timelineStatus: {
    fontSize: '12px',
    color: '#d4d4d4',
    fontWeight: 600,
    fontFamily: "'JetBrains Mono', monospace",
  },
  timelineTime: {
    fontSize: '11px',
    color: '#666',
    whiteSpace: 'nowrap' as const,
  },
  timelineMeta: {
    margin: '6px 0 0',
    color: '#888',
    fontSize: '12px',
  },
  timelineReason: {
    margin: '4px 0 0',
    color: '#b8b8b8',
    fontSize: '12px',
    lineHeight: 1.45,
  },
  messageList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    maxHeight: '400px',
    overflowY: 'auto' as const,
  },
  message: {
    padding: '12px',
    background: '#0a0a0a',
    borderRadius: '8px',
    borderLeft: '3px solid #3b82f6',
  },
  msgMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '6px',
    gap: '8px',
    alignItems: 'center',
  },
  roleBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '999px',
    fontSize: '11px',
    fontWeight: 600,
    lineHeight: 1,
  },
  msgTime: {
    color: '#555',
    fontSize: '11px',
    whiteSpace: 'nowrap' as const,
  },
  msgAuthor: {
    margin: '0 0 6px',
    fontSize: '12px',
    color: '#aaa',
    fontWeight: 500,
  },
  msgBody: {
    margin: 0,
    fontSize: '13px',
    color: '#ccc',
    lineHeight: 1.5,
    whiteSpace: 'pre-wrap' as const,
  },
  replyPanel: {
    marginTop: '18px',
    paddingTop: '16px',
    borderTop: '1px solid #222',
  },
  takeoverHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '12px',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  replyTitle: {
    margin: '0 0 4px',
    fontSize: '13px',
    color: '#e5e5e5',
    fontWeight: 700,
  },
  replyHint: {
    margin: '0 0 10px',
    fontSize: '12px',
    color: '#777',
    lineHeight: 1.5,
  },
  takeoverStatusRow: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: '8px',
    marginBottom: '12px',
  },
  takeoverPill: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '999px',
    background: '#0f172a',
    border: '1px solid #1f2937',
    color: '#cbd5e1',
    fontSize: '11px',
    fontWeight: 600,
  },
  takeoverBtn: {
    flexShrink: 0,
    padding: '7px 10px',
    background: '#0a0a0a',
    border: '1px solid #333',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 600,
  },
  replyTextarea: {
    width: '100%',
    resize: 'vertical' as const,
    minHeight: '96px',
    padding: '10px 12px',
    background: '#0a0a0a',
    color: '#e5e5e5',
    border: '1px solid #333',
    borderRadius: '8px',
    outline: 'none',
    fontSize: '13px',
    lineHeight: 1.5,
  },
  replyBtn: {
    marginTop: '10px',
    padding: '8px 12px',
    background: '#10b981',
    border: '1px solid #10b981',
    borderRadius: '6px',
    color: '#04130d',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 700,
  },
  internalNoteBtn: {
    marginTop: '10px',
    padding: '8px 12px',
    background: '#f59e0b',
    border: '1px solid #f59e0b',
    borderRadius: '6px',
    color: '#2a1a00',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 700,
  },
  replyMessage: {
    margin: '10px 0 0',
    fontSize: '12px',
    color: '#10b981',
    lineHeight: 1.5,
  },
  attachmentList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  attachment: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    background: '#0a0a0a',
    borderRadius: '6px',
    border: '1px solid #222',
    color: '#d4d4d4',
    textDecoration: 'none',
  },
  auditList: {
    marginTop: '8px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  auditItem: {
    border: '1px solid #1f1f1f',
    borderRadius: '8px',
    padding: '10px 12px',
    background: '#0a0a0a',
  },
  auditHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
  },
  auditAction: {
    fontSize: '12px',
    color: '#e5e5e5',
    fontWeight: 600,
    fontFamily: "'JetBrains Mono', monospace",
  },
  auditTime: {
    fontSize: '11px',
    color: '#666',
    whiteSpace: 'nowrap' as const,
  },
  auditMeta: {
    margin: '4px 0 0',
    color: '#888',
    fontSize: '12px',
  },
  relatedCaseButton: {
    display: 'block',
    width: '100%',
    textAlign: 'left' as const,
    border: '1px solid #1f1f1f',
    borderRadius: '8px',
    padding: '10px 12px',
    background: '#0a0a0a',
    cursor: 'pointer',
  },
};
