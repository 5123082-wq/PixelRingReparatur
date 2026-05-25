'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import Logo from '../common/Logo';
import ChatIntakeCard, { type IntakePrefill } from './ChatIntakeCard';
import ChatRequestConfirmCard from './ChatRequestConfirmCard';
import ChatLanguageSelector from './ChatLanguageSelector';

type ChatAuthorRole = 'CUSTOMER' | 'SYSTEM' | 'OPERATOR';

type ChatMessage = {
  id: string;
  authorRole: ChatAuthorRole;
  body: string;
  createdAt: string;
  attachments?: { id: string; storageKey: string; originalFilename: string | null; mimeType?: string | null }[];
  requestRegistration?: {
    publicRequestNumber: string;
    portalClaimUrl?: string;
    portalClaimExpiresAt?: string;
  };
};

type AttachmentPreview = {
  id: string;
  file: File;
  previewUrl: string | null;
};

type ChatApiResponse = {
  messages?: Array<{
    id?: string;
    authorRole?: string;
    body?: string;
    createdAt?: string;
    attachments?: { id: string; storageKey: string; originalFilename: string | null; mimeType?: string | null }[];
    requestRegistration?: {
      publicRequestNumber?: string;
      portalClaimUrl?: string;
      portalClaimExpiresAt?: string;
    };
  }>;
  operatorTakeover?: boolean;
  suggestIntake?: boolean;
  intakeMode?: 'full_form' | 'confirm_existing_contact';
  intakePrefill?: IntakePrefill | null;
};

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function getChatUiCopy(locale: string) {
  if (locale === 'en') {
    return {
      unavailable: 'Chat is currently unavailable.',
      customer: 'Customer',
      operator: 'Specialist',
      assistant: 'Assistant',
      system: 'System',
      ai: 'AI',
      requestRegistered: 'Request registered',
      requestNumber: 'Request number',
      checkStatus: 'Check status',
      activatePortal: 'Activate customer portal',
      requestPrivacy:
        'The PR number only shows the status. Private data is unlocked only after email-code and password verification.',
      portalMissing:
        'The portal link is no longer active. PixelRing can send a new one if needed.',
      validUntil: 'Link valid until',
      attachmentReceived: 'File received',
      supportTitle: 'Technical support',
      online: 'Online',
      operatorTakeover: 'A team member has taken over the conversation.',
      loadingConversation: 'Loading conversation…',
      emptyState: 'Describe your request or send a photo.',
      typing: 'AI is typing…',
      loading: 'Loading…',
      attachMedia: 'Attach photo/video',
      voiceSoon: 'Voice message (coming soon)',
      messagePlaceholder: 'Your message…',
      createRequestNow: 'Create request now →',
      optimisticPhoto: 'Photo',
    };
  }

  if (locale === 'ru') {
    return {
      unavailable: 'Чат сейчас недоступен.',
      customer: 'Клиент',
      operator: 'Специалист',
      assistant: 'Ассистент',
      system: 'Система',
      ai: 'ИИ',
      requestRegistered: 'Заявка зарегистрирована',
      requestNumber: 'Номер заявки',
      checkStatus: 'Проверить статус',
      activatePortal: 'Активировать кабинет',
      requestPrivacy:
        'PR-номер показывает только статус. Приватные данные откроются после подтверждения e-mail и пароля.',
      portalMissing:
        'Ссылка в кабинет больше не активна. При необходимости PixelRing отправит новую ссылку.',
      validUntil: 'Ссылка активна до',
      attachmentReceived: 'Файл получен',
      supportTitle: 'Техническая поддержка',
      online: 'Онлайн',
      operatorTakeover: 'Сотрудник подключился к диалогу.',
      loadingConversation: 'Диалог загружается…',
      emptyState: 'Опишите задачу или отправьте фото.',
      typing: 'ИИ печатает…',
      loading: 'Загрузка…',
      attachMedia: 'Прикрепить фото/видео',
      voiceSoon: 'Голосовое сообщение (скоро)',
      messagePlaceholder: 'Ваше сообщение…',
      createRequestNow: 'Создать заявку сейчас →',
      optimisticPhoto: 'Фото',
    };
  }

  return {
    unavailable: 'Chat ist derzeit nicht verfügbar.',
    customer: 'Kunde',
    operator: 'Spezialist',
    assistant: 'Assistent',
    system: 'System',
    ai: 'AI',
    requestRegistered: 'Anfrage registriert',
    requestNumber: 'Anfragenummer',
    checkStatus: 'Status pruefen',
    activatePortal: 'Kundenportal aktivieren',
    requestPrivacy:
      'Die PR-Nummer zeigt nur den Status. Private Daten werden erst nach E-Mail-Code und Passwort geoeffnet.',
    portalMissing:
      'Der Portal-Link ist nicht mehr aktiv. PixelRing kann bei Bedarf einen neuen Link senden.',
    validUntil: 'Link gueltig bis',
    attachmentReceived: 'Datei empfangen',
    supportTitle: 'Technischer Support',
    online: 'Online',
    operatorTakeover: 'Ein Mitarbeiter hat das Gespräch übernommen.',
    loadingConversation: 'Gespräch wird geladen …',
    emptyState: 'Beschreiben Sie Ihr Anliegen oder senden Sie ein Foto.',
    typing: 'AI tippt …',
    loading: 'Laden …',
    attachMedia: 'Foto/Video anhängen',
    voiceSoon: 'Sprachnachricht (demnächst)',
    messagePlaceholder: 'Ihre Nachricht …',
    createRequestNow: 'Anfrage jetzt erstellen →',
    optimisticPhoto: 'Foto',
  };
}

function isChatAuthorRole(value: unknown): value is ChatAuthorRole {
  return value === 'CUSTOMER' || value === 'SYSTEM' || value === 'OPERATOR';
}

function normalizeMessage(message: {
  id?: string;
  authorRole?: string;
  body?: string;
  createdAt?: string;
  attachments?: { id: string; storageKey: string; originalFilename: string | null; mimeType?: string | null }[];
  requestRegistration?: {
    publicRequestNumber?: string;
    portalClaimUrl?: string;
    portalClaimExpiresAt?: string;
  };
}): ChatMessage {
  const publicRequestNumber = message.requestRegistration?.publicRequestNumber?.trim();

  return {
    id: message.id ?? `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    authorRole: isChatAuthorRole(message.authorRole) ? message.authorRole : 'SYSTEM',
    body: message.body ?? '',
    createdAt: message.createdAt ?? new Date().toISOString(),
    attachments: message.attachments,
    requestRegistration: publicRequestNumber
      ? {
          publicRequestNumber,
          portalClaimUrl: message.requestRegistration?.portalClaimUrl,
          portalClaimExpiresAt: message.requestRegistration?.portalClaimExpiresAt,
        }
      : undefined,
  };
}

function formatTimestamp(value: string): string {
  return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

function getRoleLabel(role: ChatAuthorRole, locale: string): string {
  const copy = getChatUiCopy(locale);
  if (role === 'CUSTOMER') return copy.customer;
  if (role === 'OPERATOR') return copy.operator;
  return copy.assistant;
}

function getRolePalette(role: ChatAuthorRole) {
  if (role === 'CUSTOMER') return {
    container: 'items-end',
    label: 'text-[#B8643E]',
    bubble: 'bg-[#0E1A2B] text-white rounded-tr-[4px]',
    meta: 'text-white/55',
  };
  if (role === 'OPERATOR') return {
    container: 'items-start',
    label: 'text-emerald-700',
    bubble: 'bg-emerald-50 text-[#0E1A2B] border border-emerald-200 rounded-tl-[4px]',
    meta: 'text-[#72665D]/70',
  };
  return {
    container: 'items-start',
    label: 'text-[#72665D]',
    bubble: 'bg-white/80 backdrop-blur-md text-[#0E1A2B] border border-black/5 rounded-tl-[4px]',
    meta: 'text-[#72665D]/70',
  };
}

function getRequestCardCopy(locale: string) {
  if (locale === 'en') {
    return {
      label: 'Request registered',
      number: 'Request number',
      status: 'Check status',
      portal: 'Activate customer portal',
      privacy:
        'The PR number only shows the status. Private data is unlocked only after email-code and password verification.',
      portalMissing:
        'The portal link is no longer active. PixelRing can send a new link if needed.',
      validUntil: 'Link valid until',
    };
  }

  if (locale === 'ru') {
    return {
      label: 'Заявка зарегистрирована',
      number: 'Номер заявки',
      status: 'Проверить статус',
      portal: 'Активировать кабинет',
      privacy:
        'PR-номер показывает только статус. Приватные данные откроются после подтверждения e-mail и пароля.',
      portalMissing:
        'Ссылка на кабинет больше не активна. При необходимости специалист PixelRing отправит новую ссылку.',
      validUntil: 'Ссылка активна до',
    };
  }

  return {
    label: 'Anfrage registriert',
    number: 'Anfragenummer',
    status: 'Status pruefen',
    portal: 'Kundenportal aktivieren',
    privacy:
      'Die PR-Nummer zeigt nur den Status. Private Daten werden erst nach E-Mail-Code und Passwort geoeffnet.',
    portalMissing:
      'Der Portal-Link ist nicht mehr aktiv. PixelRing kann bei Bedarf einen neuen Link senden.',
    validUntil: 'Link gueltig bis',
  };
}

function ChatRequestSuccessCard({
  locale,
  registration,
}: {
  locale: string;
  registration: NonNullable<ChatMessage['requestRegistration']>;
}) {
  const copy = getRequestCardCopy(locale);
  const expiresAt = registration.portalClaimExpiresAt
    ? new Date(registration.portalClaimExpiresAt)
    : null;

  return (
    <div className="w-full max-w-[520px] rounded-[22px] border border-[#E2D4C7] bg-[#FFFDF9] p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#B8643E]/10 text-[#B8643E]">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.4} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-black text-[#0E1A2B]">{copy.label}</p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#72665D]">{copy.number}</p>
          <p className="mt-1 break-all text-[22px] font-black tracking-[0.08em] text-[#0E1A2B]">
            {registration.publicRequestNumber}
          </p>
        </div>
      </div>

      <p className="mt-3 rounded-[14px] bg-[#F7F1E8] px-3 py-2 text-[12px] leading-5 text-[#5E554E]">
        {copy.privacy}
      </p>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {registration.portalClaimUrl ? (
          <a
            href={registration.portalClaimUrl}
            className="inline-flex min-h-11 items-center justify-center rounded-[14px] bg-[#0E1A2B] px-4 py-2 text-center text-[13px] font-black text-white transition-colors hover:bg-[#1A2E47]"
          >
            {copy.portal}
          </a>
        ) : (
          <div className="rounded-[14px] border border-[#E7DDD3] bg-white px-3 py-2 text-[12px] leading-5 text-[#72665D]">
            {copy.portalMissing}
          </div>
        )}
        <Link
          href={{
            pathname: '/status',
            query: { request: registration.publicRequestNumber },
          }}
          className="inline-flex min-h-11 items-center justify-center rounded-[14px] border border-[#E7DDD3] bg-white px-4 py-2 text-center text-[13px] font-black text-[#0E1A2B] transition-colors hover:border-[#B8643E]"
        >
          {copy.status}
        </Link>
      </div>

      {expiresAt && (
        <p className="mt-3 text-[11px] font-semibold text-[#72665D]">
          {copy.validUntil}: {expiresAt.toLocaleString(locale === 'ru' ? 'ru-RU' : locale === 'en' ? 'en-US' : 'de-DE')}
        </p>
      )}
    </div>
  );
}

function isLocalPreviewImageSrc(value: string | null | undefined): value is string {
  return Boolean(value && (value.startsWith('blob:') || value.startsWith('data:image/')));
}

function ChatAttachmentList({
  attachments,
  locale,
}: {
  attachments: NonNullable<ChatMessage['attachments']>;
  locale: string;
}) {
  const copy = getChatUiCopy(locale);
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {attachments.map((att) => (
        isLocalPreviewImageSrc(att.storageKey) ? (
          <div key={att.id} className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element -- Local object URLs are only used for immediate unsaved previews. */}
            <img
              src={att.storageKey}
              alt={att.originalFilename || 'Attachment'}
              className="h-full w-full object-cover"
            />
          </div>
        ) : (
          <div key={att.id} className="flex min-h-14 max-w-[240px] items-center gap-2 rounded-xl border border-black/5 bg-white/70 px-3 py-2 text-[#0E1A2B]">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#B8643E]/10 text-[#B8643E]">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-black">{att.originalFilename || 'Attachment'}</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#72665D]">
                {copy.attachmentReceived}
              </p>
            </div>
          </div>
        )
      ))}
    </div>
  );
}

const ChatModal = ({ isOpen, onClose }: ChatModalProps) => {
  const locale = useLocale();
  const copy = getChatUiCopy(locale);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [operatorTakeover, setOperatorTakeover] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showIntakeCard, setShowIntakeCard] = useState(false);
  const [intakeMode, setIntakeMode] = useState<'full_form' | 'confirm_existing_contact'>('full_form');
  const [intakePrefill, setIntakePrefill] = useState<IntakePrefill | undefined>();
  const [intakeDone, setIntakeDone] = useState(false);
  const [hasChosenLanguage, setHasChosenLanguage] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<AttachmentPreview[]>([]);
  const [viewportFrame, setViewportFrame] = useState({ height: '100dvh', offsetTop: '0px' });
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasLoadedRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const renderMessageBody = (text: string) => {
    const tokenRegex = /(https?:\/\/[^\s]+|[A-Z]{2,8}-[A-Z0-9]{4}-[A-Z0-9]{4})/g;
    const parts = text.split(tokenRegex);
    
    return parts.map((part, i) => {
      if (/^https?:\/\//.test(part)) {
        return (
          <a
            key={i}
            href={part}
            className="underline font-black decoration-current hover:opacity-60 transition-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            {part}
          </a>
        );
      }

      if (/^[A-Z]{2,8}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(part)) {
        return (
          <Link
            key={i}
            href={{
              pathname: '/status',
              query: { request: part }
            }}
            className="underline font-black decoration-current hover:opacity-60 transition-all"
            target="_blank"
            rel="noopener noreferrer"
          >
            {part}
          </Link>
        );
      }
      return part;
    });
  };

  const loadChatHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    setErrorMessage('');
    try {
      const res = await fetch(`/api/chat/messages?locale=${encodeURIComponent(locale)}`, { method: 'GET', cache: 'no-store' });
      if (!res.ok) throw new Error(copy.unavailable);
      const data = (await res.json().catch(() => null)) as ChatApiResponse | null;
      const rawMessages = Array.isArray(data?.messages) ? data.messages.map(normalizeMessage) : [];
      
      setMessages(rawMessages);
      setOperatorTakeover(Boolean(data?.operatorTakeover));
      setIntakePrefill(data?.intakePrefill ?? undefined);
      setIntakeMode(data?.intakeMode ?? 'full_form');
      if (data?.suggestIntake) {
        setShowIntakeCard(true);
      }
      hasLoadedRef.current = true;
    } catch {
      setErrorMessage(copy.unavailable);
      hasLoadedRef.current = false;
    } finally {
      setIsLoadingHistory(false);
    }
  }, [locale]);

  useEffect(() => {
    if (!isOpen || hasLoadedRef.current || isLoadingHistory) return;
    void loadChatHistory();
  }, [isOpen, isLoadingHistory, loadChatHistory]);

  const scrollToBottom = useCallback(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;
    scrollContainer.scrollTop = scrollContainer.scrollHeight;
  }, []);

  const scheduleScrollToBottom = useCallback(() => {
    const frame = window.requestAnimationFrame(scrollToBottom);
    const delayed = window.setTimeout(scrollToBottom, 250);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(delayed);
    };
  }, [scrollToBottom]);

  useEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyPosition = body.style.position;
    const previousBodyTop = body.style.top;
    const previousBodyWidth = body.style.width;
    const previousBodyOverscrollBehavior = body.style.overscrollBehavior;
    const previousRootOverscrollBehavior = documentElement.style.overscrollBehavior;

    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overscrollBehavior = 'none';
    documentElement.style.overscrollBehavior = 'none';

    return () => {
      body.style.overflow = previousBodyOverflow;
      body.style.position = previousBodyPosition;
      body.style.top = previousBodyTop;
      body.style.width = previousBodyWidth;
      body.style.overscrollBehavior = previousBodyOverscrollBehavior;
      documentElement.style.overscrollBehavior = previousRootOverscrollBehavior;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const updateViewportFrame = () => {
      const viewport = window.visualViewport;
      setViewportFrame({
        height: `${Math.round(viewport?.height ?? window.innerHeight)}px`,
        offsetTop: `${Math.round(viewport?.offsetTop ?? 0)}px`,
      });
      scrollToBottom();
    };

    updateViewportFrame();
    window.visualViewport?.addEventListener('resize', updateViewportFrame);
    window.visualViewport?.addEventListener('scroll', updateViewportFrame);
    window.addEventListener('resize', updateViewportFrame);

    return () => {
      window.visualViewport?.removeEventListener('resize', updateViewportFrame);
      window.visualViewport?.removeEventListener('scroll', updateViewportFrame);
      window.removeEventListener('resize', updateViewportFrame);
      setViewportFrame({ height: '100dvh', offsetTop: '0px' });
    };
  }, [isOpen, scrollToBottom]);

  useEffect(() => {
    if (!isOpen) return;
    return scheduleScrollToBottom();
  }, [isOpen, messages, isLoadingHistory, isSending, showIntakeCard, viewportFrame.height, scheduleScrollToBottom]);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const newPreviews: AttachmentPreview[] = Array.from(fileList)
      .filter(f => f.size > 0 && f.size <= 20 * 1024 * 1024)
      .map(f => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        file: f,
        previewUrl: f.type.startsWith('image/') ? URL.createObjectURL(f) : null,
      }));
    setPendingFiles(prev => [...prev, ...newPreviews]);
  };

  const removePendingFile = (id: string) => {
    setPendingFiles(prev => {
      const removed = prev.find(p => p.id === id);
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter(p => p.id !== id);
    });
  };

  const handleSend = useCallback(async (overrideMessage?: string, silent?: boolean) => {
    const messageToSubmit = (overrideMessage || inputText).trim();
    if ((!messageToSubmit && pendingFiles.length === 0) || isLoadingHistory || isSending) return;

    const currentFiles = [...pendingFiles];
    const messageText = messageToSubmit || copy.optimisticPhoto;

    const optimistic: ChatMessage = {
      id: `temp-${Date.now()}`,
      authorRole: 'CUSTOMER',
      body: messageText,
      createdAt: new Date().toISOString(),
      attachments: currentFiles.map(f => ({
        id: f.id,
        storageKey: f.previewUrl || '',
        originalFilename: f.file.name,
      }))
    };

    if (!silent) {
      setInputText('');
      setMessages(c => [...c, optimistic]);
    }

    setErrorMessage('');
    setPendingFiles([]);
    setIsSending(true);
    setIntakeDone(false);

    try {
      const fd = new FormData();
      fd.append('message', messageText);
      fd.append('locale', locale);
      if (silent) fd.append('silent', 'true');
      currentFiles.forEach(f => fd.append('files', f.file));

      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        body: fd,
      });
      if (!res.ok) throw new Error(copy.unavailable);

      const data = (await res.json().catch(() => null)) as ChatApiResponse | null;
      
      const next = Array.isArray(data?.messages) ? data.messages.map(normalizeMessage) : [];
      if (next.length > 0) setMessages(next);
      if (typeof data?.operatorTakeover === 'boolean') setOperatorTakeover(data.operatorTakeover);

      if (data?.suggestIntake && !showIntakeCard) {
        setIntakePrefill(data.intakePrefill ?? undefined);
        setIntakeMode(data.intakeMode ?? 'full_form');
        setShowIntakeCard(true);
      }

      hasLoadedRef.current = true;
    } catch {
      setMessages(c => c.filter(m => m.id !== optimistic.id));
      setInputText(messageToSubmit);
      setErrorMessage(copy.unavailable);
    } finally {
      setIsSending(false);
    }
  }, [inputText, pendingFiles, isLoadingHistory, isSending, locale, showIntakeCard, copy.unavailable, copy.optimisticPhoto]);

  const handleLanguageSelect = (languageName: string) => {
    setHasChosenLanguage(true);
    const silentInstruction = `Please communicate with me in ${languageName} from now on. Start by repeating your initial greeting in this language.`;
    void handleSend(silentInstruction, true);
  };

  if (!isOpen) return null;

  const showInitialLoading = isLoadingHistory && messages.length === 0;

  return (
    <div
      className="fixed inset-x-0 z-[110] flex items-center justify-center overscroll-none sm:inset-0 sm:p-6 transition-all duration-500"
      style={{ top: viewportFrame.offsetTop, height: viewportFrame.height }}
    >
      <div className="absolute inset-0 bg-[#0E1A2B]/40 backdrop-blur-md" onClick={onClose} />

      <div className="relative flex h-full sm:h-[750px] w-full sm:max-w-5xl flex-col overflow-hidden sm:rounded-[32px] border-none sm:border border-white/20 bg-[#F7F1E8]/95 shadow-2xl backdrop-blur-3xl">

        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-black/5 bg-white/80 p-4 sm:p-5">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <Logo className="origin-left scale-75 shrink-0" />
            <div className="hidden h-6 w-px shrink-0 bg-black/10 sm:block" />
            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-black text-[#0E1A2B]">{copy.supportTitle}</h3>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#72665D]">{copy.online}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="ml-auto rounded-full p-2 text-[#0E1A2B] hover:bg-black/5 transition-colors" type="button">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 sm:p-5">
          {operatorTakeover && (
            <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-900">
              {copy.operatorTakeover}
            </div>
          )}

          {showInitialLoading && (
            <div className="rounded-[20px] border border-black/5 bg-white/60 px-4 py-3 text-[13px] text-[#72665D]">
              {copy.loadingConversation}
            </div>
          )}

          {!showInitialLoading && messages.length === 0 && (
            <div className="rounded-[20px] border border-dashed border-black/10 bg-white/45 px-4 py-4 text-[13px] text-[#72665D]">
              {copy.emptyState}
            </div>
          )}
          
          {(() => {
            const userHasSpoken = messages.some(m => m.authorRole === 'CUSTOMER');
            return messages.map((message, idx) => {
              if (message.body.startsWith('[SILENT]')) return null;
              const p = getRolePalette(message.authorRole);

              if (message.requestRegistration) {
                return (
                  <div key={message.id}>
                    <div className={`flex flex-col ${p.container} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                      <span className={`mb-1 text-[10px] font-bold uppercase tracking-[0.18em] ${p.label}`}>
                        {getRoleLabel(message.authorRole, locale)}
                      </span>
                      <ChatRequestSuccessCard locale={locale} registration={message.requestRegistration} />
                      <span className={`mx-2 mt-1.5 text-[9px] font-bold uppercase tracking-widest ${p.meta}`}>
                        {formatTimestamp(message.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <div key={message.id}>
                  <div className={`flex flex-col ${p.container} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                      <span className={`mb-1 text-[10px] font-bold uppercase tracking-[0.18em] ${p.label}`}>
                        {idx === 1 ? copy.system : getRoleLabel(message.authorRole, locale)}
                      </span>
                    <div className={`max-w-[80%] rounded-[24px] px-5 py-3 text-[14px] shadow-sm whitespace-pre-wrap ${p.bubble}`}>
                      {renderMessageBody(message.body)}
                      
                      {/* Integrated language selector */}
                      {idx === 1 && !userHasSpoken && (
                        <div className="mt-4 animate-in fade-in slide-in-from-bottom-1 duration-400">
                          <ChatLanguageSelector onSelect={handleLanguageSelect} />
                        </div>
                      )}

                      {message.attachments && message.attachments.length > 0 && (
                        <ChatAttachmentList attachments={message.attachments} locale={locale} />
                      )}
                    </div>
                    <span className={`mx-2 mt-1.5 text-[9px] font-bold uppercase tracking-widest ${p.meta}`}>
                      {formatTimestamp(message.createdAt)}
                    </span>
                  </div>

                </div>
              );
            });
          })()}


          {/* Inline intake card */}
          {showIntakeCard && !intakeDone && (
            <div className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-2 duration-400">
              <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#72665D]">{copy.ai}</span>
              <div className="w-full max-w-[90%]">
                {intakeMode === 'confirm_existing_contact' ? (
                  <ChatRequestConfirmCard
                    prefill={intakePrefill}
                    onEditContact={() => setIntakeMode('full_form')}
                    onSuccess={() => {
                      setIntakeDone(true);
                      setShowIntakeCard(false);
                      setIntakeMode('full_form');
                      void loadChatHistory();
                    }}
                  />
                ) : (
                  <ChatIntakeCard
                    prefill={intakePrefill}
                    onSuccess={() => {
                      setIntakeDone(true);
                      setShowIntakeCard(false);
                      setIntakeMode('full_form');
                      void loadChatHistory();
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {/* Typing indicator */}
          {(isLoadingHistory || isSending) && (
            <div className="flex flex-col items-start animate-in fade-in duration-300">
              <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#72665D]">
                {isSending ? copy.typing : copy.loading}
              </div>
              <div className="flex gap-1 rounded-[20px] rounded-tl-[4px] border border-black/5 bg-white/40 px-4 py-3">
                <div className="h-1 w-1 animate-bounce rounded-full bg-[#B8643E] [animation-delay:-0.3s]" />
                <div className="h-1 w-1 animate-bounce rounded-full bg-[#B8643E] [animation-delay:-0.15s]" />
                <div className="h-1 w-1 animate-bounce rounded-full bg-[#B8643E]" />
              </div>
            </div>
          )}
        </div>

        {/* Input area */}
        <div className="mt-auto border-t border-black/5 bg-white/80 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:p-4">
          {errorMessage && (
            <p className="mb-3 rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {errorMessage}
            </p>
          )}

          {/* Pending file previews */}
          {pendingFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {pendingFiles.map(pf => (
                <div key={pf.id} className="relative group">
                  {pf.previewUrl
                    ? <img src={pf.previewUrl} alt={pf.file.name} className="w-14 h-14 rounded-[10px] object-cover border border-black/10" />
                    : <div className="w-14 h-14 rounded-[10px] bg-black/5 border border-black/10 flex items-center justify-center">
                        <svg className="w-5 h-5 text-[#72665D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.871V15.13a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                        </svg>
                      </div>
                  }
                  <button
                    type="button"
                    onClick={() => removePendingFile(pf.id)}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#0E1A2B] text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >×</button>
                </div>
              ))}
            </div>
          )}

          <div className="flex w-full min-w-0 items-end gap-2 rounded-[24px] border border-black/5 bg-[#F7F1E8]/50 p-1.5">
            {/* Attachment button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-[16px] text-[#72665D] hover:bg-black/5 transition-colors"
              title={copy.attachMedia}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              className="hidden"
              onChange={e => { handleFiles(e.target.files); e.target.value = ''; }}
            />

            {/* Voice placeholder */}
            <button
              type="button"
              title={copy.voiceSoon}
              className="hidden shrink-0 w-9 h-9 items-center justify-center rounded-[16px] text-[#72665D]/40 cursor-not-allowed sm:flex"
              disabled
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>

            <textarea
              rows={1}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onFocus={scheduleScrollToBottom}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void handleSend(); } }}
              placeholder={copy.messagePlaceholder}
              className="min-w-0 max-h-24 flex-1 resize-none border-none bg-transparent py-2 text-[16px] text-[#0E1A2B] placeholder-[#72665D]/40 focus:ring-0"
            />

            <button
              onClick={() => void handleSend()}
              disabled={(!inputText.trim() && pendingFiles.length === 0) || isLoadingHistory || isSending}
              className="shrink-0 rounded-[18px] bg-[#0E1A2B] p-2.5 text-white shadow-lg transition-all active:scale-95 hover:bg-[#1a2e47] disabled:cursor-not-allowed disabled:opacity-30"
              type="button"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>

          {/* Intake shortcut */}
          {!showIntakeCard && !intakeDone && messages.length >= 2 && (
            <button
              type="button"
              onClick={() => {
                setIntakeMode(
                  intakePrefill?.hasKnownSessionContact &&
                    intakePrefill.summary &&
                    intakePrefill.issueType
                    ? 'confirm_existing_contact'
                    : 'full_form'
                );
                setShowIntakeCard(true);
              }}
              className="mt-2 w-full text-center text-[11px] text-[#B8643E] hover:underline font-semibold"
            >
              {copy.createRequestNow}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
