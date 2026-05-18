'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useRouter } from '@/i18n/routing';
import Logo from '@/components/common/Logo';
import type { PortalDemoOrganization, PortalRequest } from '@/lib/portal/types';

type ChatAuthorRole = 'CUSTOMER' | 'SYSTEM' | 'OPERATOR';

type PortalChatMessage = {
  id: string;
  authorRole: ChatAuthorRole;
  body: string;
  createdAt: string;
  attachments?: { id: string; storageKey: string; originalFilename: string | null; mimeType?: string | null }[];
};

type AttachmentPreview = {
  id: string;
  file: File;
  previewUrl: string | null;
};

function formatTimestamp(value: string): string {
  const date = new Date(value);

  if (!Number.isNaN(date.getTime())) {
    return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(date);
  }

  return value.match(/\b\d{1,2}:\d{2}\b/)?.[0] ?? value;
}

function getRoleLabel(role: ChatAuthorRole): string {
  if (role === 'CUSTOMER') return 'User';
  if (role === 'OPERATOR') return 'Agent';
  return 'Assistant';
}

function getRolePalette(role: ChatAuthorRole) {
  if (role === 'CUSTOMER') {
    return {
      container: 'items-end',
      label: 'text-[#B8643E]',
      bubble: 'bg-[#0E1A2B] text-white rounded-tr-[4px]',
      meta: 'text-[#72665D]/70',
    };
  }

  if (role === 'OPERATOR') {
    return {
      container: 'items-start',
      label: 'text-emerald-700',
      bubble: 'bg-emerald-50 text-[#0E1A2B] border border-emerald-200 rounded-tl-[4px]',
      meta: 'text-[#72665D]/70',
    };
  }

  return {
    container: 'items-start',
    label: 'text-[#72665D]',
    bubble: 'bg-white/80 backdrop-blur-md text-[#0E1A2B] border border-black/5 rounded-tl-[4px]',
    meta: 'text-[#72665D]/70',
  };
}

function isLocalPreviewImageSrc(value: string | null | undefined): value is string {
  return Boolean(value && (value.startsWith('blob:') || value.startsWith('data:image/')));
}

function mapPortalAuthor(author: PortalDemoOrganization['messages'][number]['author']): ChatAuthorRole {
  if (author === 'Customer') return 'CUSTOMER';
  if (author === 'PixelRing Manager') return 'OPERATOR';
  return 'SYSTEM';
}

function ChatAttachmentList({
  attachments,
}: {
  attachments: NonNullable<PortalChatMessage['attachments']>;
}) {
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
                Datei empfangen
              </p>
            </div>
          </div>
        )
      ))}
    </div>
  );
}

function renderMessageBody(text: string) {
  const tokenRegex = /(https?:\/\/[^\s]+|\/portal(?:#[^\s]+|\?[^\s]+)?|[A-Z]{2,8}-[A-Z0-9]{4}-[A-Z0-9]{4})/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, i) => {
    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={i}
          href={part}
          className="font-black underline decoration-current transition-all hover:opacity-60"
          target="_blank"
          rel="noopener noreferrer"
        >
          {part}
        </a>
      );
    }

    if (/^\/portal(?:[?#]|$)/.test(part)) {
      return (
        <Link
          key={i}
          href={part.startsWith('/portal#new-request') ? '/portal#new-request' : '/portal'}
          className="font-black underline decoration-current transition-all hover:opacity-60"
        >
          {part}
        </Link>
      );
    }

    if (/^[A-Z]{2,8}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(part)) {
      return (
        <Link
          key={i}
          href={{
            pathname: '/status',
            query: { request: part },
          }}
          className="font-black underline decoration-current transition-all hover:opacity-60"
          target="_blank"
          rel="noopener noreferrer"
        >
          {part}
        </Link>
      );
    }

    return part;
  });
}

export default function PortalRequestChat({
  request,
  messages,
  canPostMessages,
}: {
  request: PortalRequest;
  messages: PortalDemoOrganization['messages'];
  canPostMessages: boolean;
}) {
  const router = useRouter();
  const [chatMessages, setChatMessages] = useState<PortalChatMessage[]>(() =>
    messages.map((message) => ({
      id: message.id,
      authorRole: mapPortalAuthor(message.author),
      body: message.body,
      createdAt: message.sentAt,
      attachments: message.attachments,
    }))
  );
  const [inputText, setInputText] = useState('');
  const [pendingFiles, setPendingFiles] = useState<AttachmentPreview[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setChatMessages(messages.map((message) => ({
      id: message.id,
      authorRole: mapPortalAuthor(message.author),
      body: message.body,
      createdAt: message.sentAt,
      attachments: message.attachments,
    })));
  }, [messages]);

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
    return scheduleScrollToBottom();
  }, [chatMessages, isSending, scheduleScrollToBottom]);

  useEffect(() => {
    return () => {
      pendingFiles.forEach((file) => {
        if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
      });
    };
  }, [pendingFiles]);

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;

    const newPreviews: AttachmentPreview[] = Array.from(fileList)
      .filter((file) => file.size > 0 && file.size <= 20 * 1024 * 1024)
      .map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        file,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      }));

    setPendingFiles((current) => [...current, ...newPreviews]);
  }

  function removePendingFile(id: string) {
    setPendingFiles((current) => {
      const removed = current.find((file) => file.id === id);
      if (removed?.previewUrl) URL.revokeObjectURL(removed.previewUrl);
      return current.filter((file) => file.id !== id);
    });
  }

  async function handleSend() {
    const messageToSubmit = inputText.trim();
    if ((!messageToSubmit && pendingFiles.length === 0) || isSending || !canPostMessages) return;

    const currentFiles = [...pendingFiles];
    const messageText = messageToSubmit || 'Foto';
    const optimistic: PortalChatMessage = {
      id: `temp-${Date.now()}`,
      authorRole: 'CUSTOMER',
      body: messageText,
      createdAt: new Date().toISOString(),
      attachments: currentFiles.map((file) => ({
        id: file.id,
        storageKey: file.previewUrl || '',
        originalFilename: file.file.name,
        mimeType: file.file.type,
      })),
    };

    setInputText('');
    setPendingFiles([]);
    setChatMessages((current) => [...current, optimistic]);
    setErrorMessage('');
    setIsSending(true);

    try {
      const formData = new FormData();
      formData.append('message', messageText);
      currentFiles.forEach((file) => formData.append('files', file.file));

      const response = await fetch(`/api/portal/requests/${encodeURIComponent(request.publicRequestNumber)}/messages`, {
        method: 'POST',
        body: formData,
      });

      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        message?: string | {
          id: string;
          body: string;
          authorRole: ChatAuthorRole;
          createdAt: string;
          attachments?: PortalChatMessage['attachments'];
        };
        assistantMessage?: {
          id: string;
          body: string;
          authorRole: ChatAuthorRole;
          createdAt: string;
          attachments?: PortalChatMessage['attachments'];
        } | null;
      } | null;

      if (!response.ok || !data?.success) {
        throw new Error(typeof data?.message === 'string' ? data.message : 'Chat ist derzeit nicht verfügbar.');
      }

      const assistantMessage = data.assistantMessage;

      if (assistantMessage) {
        setChatMessages((current) => [
          ...current.filter((message) => message.id !== optimistic.id),
          {
            id: typeof data.message === 'object' ? data.message.id : optimistic.id,
            authorRole: 'CUSTOMER',
            body: typeof data.message === 'object' ? data.message.body : optimistic.body,
            createdAt: typeof data.message === 'object' ? data.message.createdAt : optimistic.createdAt,
            attachments: typeof data.message === 'object' ? data.message.attachments : optimistic.attachments,
          },
          {
            id: assistantMessage.id,
            authorRole: assistantMessage.authorRole,
            body: assistantMessage.body,
            createdAt: assistantMessage.createdAt,
            attachments: assistantMessage.attachments,
          },
        ]);
      }

      router.refresh();
    } catch (error) {
      setChatMessages((current) => current.filter((message) => message.id !== optimistic.id));
      setInputText(messageToSubmit);
      setPendingFiles(currentFiles);
      setErrorMessage(error instanceof Error ? error.message : 'Chat ist derzeit nicht verfügbar.');
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className="flex min-h-[620px] flex-col bg-[#F7F1E8]/95 lg:h-[calc(100vh-164px)]">
      <div className="flex items-center justify-between gap-2 border-b border-black/5 bg-white/80 p-4 sm:p-5">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <Logo className="origin-left scale-75 shrink-0" />
          <div className="hidden h-6 w-px shrink-0 bg-black/10 sm:block" />
          <div className="min-w-0">
            <h3 className="truncate text-[15px] font-black text-[#0E1A2B]">Technischer Support</h3>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#72665D]">Online</span>
            </div>
          </div>
        </div>
        <span className="hidden rounded-full border border-black/5 bg-white/70 px-3 py-1 font-mono text-[10px] font-black text-[#72665D] sm:inline-flex">
          {request.publicRequestNumber}
        </span>
        {canPostMessages && (
          <Link
            href="/portal#new-request"
            className="inline-flex h-9 shrink-0 items-center justify-center rounded-[14px] bg-[#B8643E] px-3 text-[12px] font-black text-white transition hover:bg-[#A65835]"
          >
            Neue Anfrage
          </Link>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto overscroll-contain p-4 sm:p-5">
        {chatMessages.length === 0 && (
          <div className="rounded-[20px] border border-dashed border-black/10 bg-white/45 px-4 py-4 text-[13px] text-[#72665D]">
            Beschreiben Sie Ihr Anliegen oder senden Sie ein Foto.
          </div>
        )}

        {chatMessages.map((message, index) => {
          const palette = getRolePalette(message.authorRole);

          return (
            <div key={message.id}>
              <div className={`flex flex-col ${palette.container} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <span className={`mb-1 text-[10px] font-bold uppercase tracking-[0.18em] ${palette.label}`}>
                  {index === 1 && message.authorRole === 'SYSTEM' ? 'System' : getRoleLabel(message.authorRole)}
                </span>
                <div className={`max-w-[80%] rounded-[24px] px-5 py-3 text-[14px] shadow-sm whitespace-pre-wrap ${palette.bubble}`}>
                  {renderMessageBody(message.body)}
                  {message.attachments && message.attachments.length > 0 && (
                    <ChatAttachmentList attachments={message.attachments} />
                  )}
                </div>
                <span className={`mx-2 mt-1.5 text-[9px] font-bold uppercase tracking-widest ${palette.meta}`}>
                  {formatTimestamp(message.createdAt)}
                </span>
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex flex-col items-start animate-in fade-in duration-300">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#72665D]">
              Laden …
            </div>
            <div className="flex gap-1 rounded-[20px] rounded-tl-[4px] border border-black/5 bg-white/40 px-4 py-3">
              <div className="h-1 w-1 animate-bounce rounded-full bg-[#B8643E] [animation-delay:-0.3s]" />
              <div className="h-1 w-1 animate-bounce rounded-full bg-[#B8643E] [animation-delay:-0.15s]" />
              <div className="h-1 w-1 animate-bounce rounded-full bg-[#B8643E]" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-auto border-t border-black/5 bg-white/80 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:p-4">
        {errorMessage && (
          <p className="mb-3 rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
            {errorMessage}
          </p>
        )}

        {pendingFiles.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {pendingFiles.map((pendingFile) => (
              <div key={pendingFile.id} className="relative group">
                {pendingFile.previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- Local object URLs are only used for immediate unsaved previews.
                  <img src={pendingFile.previewUrl} alt={pendingFile.file.name} className="h-14 w-14 rounded-[10px] border border-black/10 object-cover" />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-[10px] border border-black/10 bg-black/5">
                    <svg className="h-5 w-5 text-[#72665D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.871V15.13a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                    </svg>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removePendingFile(pendingFile.id)}
                  className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#0E1A2B] text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  x
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex w-full min-w-0 items-end gap-2 rounded-[24px] border border-black/5 bg-[#F7F1E8]/50 p-1.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[16px] text-[#72665D] transition-colors hover:bg-black/5 disabled:cursor-not-allowed disabled:opacity-30"
            title="Foto/Video anhängen"
            disabled={!canPostMessages || isSending}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={(event) => {
              handleFiles(event.target.files);
              event.target.value = '';
            }}
          />

          <button
            type="button"
            title="Sprachnachricht (demnächst)"
            className="hidden h-9 w-9 shrink-0 cursor-not-allowed items-center justify-center rounded-[16px] text-[#72665D]/40 sm:flex"
            disabled
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>

          <textarea
            rows={1}
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            onFocus={scheduleScrollToBottom}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                void handleSend();
              }
            }}
            placeholder="Ihre Nachricht …"
            className="max-h-24 min-w-0 flex-1 resize-none border-none bg-transparent py-2 text-[16px] text-[#0E1A2B] placeholder-[#72665D]/40 focus:ring-0"
            disabled={!canPostMessages || isSending}
          />

          <button
            onClick={() => void handleSend()}
            disabled={(!inputText.trim() && pendingFiles.length === 0) || !canPostMessages || isSending}
            className="shrink-0 rounded-[18px] bg-[#0E1A2B] p-2.5 text-white shadow-lg transition-all hover:bg-[#1a2e47] active:scale-95 disabled:cursor-not-allowed disabled:opacity-30"
            type="button"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
