'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import Logo from '../common/Logo';
import ChatIntakeCard, { type IntakePrefill } from './ChatIntakeCard';
import ChatRequestConfirmCard from './ChatRequestConfirmCard';

type ChatAuthorRole = 'CUSTOMER' | 'SYSTEM' | 'OPERATOR';

type ChatMessage = {
  id: string;
  authorRole: ChatAuthorRole;
  body: string;
  createdAt: string;
  attachments?: { id: string; storageKey: string; originalFilename: string | null }[];
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
    attachments?: { id: string; storageKey: string; originalFilename: string | null }[];
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

const DEFAULT_CHAT_ERROR = 'Chat ist derzeit nicht verfügbar.';

function isChatAuthorRole(value: unknown): value is ChatAuthorRole {
  return value === 'CUSTOMER' || value === 'SYSTEM' || value === 'OPERATOR';
}

function normalizeMessage(message: {
  id?: string;
  authorRole?: string;
  body?: string;
  createdAt?: string;
  attachments?: { id: string; storageKey: string; originalFilename: string | null }[];
}): ChatMessage {
  return {
    id: message.id ?? `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    authorRole: isChatAuthorRole(message.authorRole) ? message.authorRole : 'SYSTEM',
    body: message.body ?? '',
    createdAt: message.createdAt ?? new Date().toISOString(),
    attachments: message.attachments,
  };
}

function formatTimestamp(value: string): string {
  return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

function getRoleLabel(role: ChatAuthorRole): string {
  if (role === 'CUSTOMER') return 'Sie';
  if (role === 'OPERATOR') return 'Mitarbeiter';
  return 'AI';
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

const ChatModal = ({ isOpen, onClose }: ChatModalProps) => {
  const locale = useLocale();
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
  const [pendingFiles, setPendingFiles] = useState<AttachmentPreview[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasLoadedRef = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadChatHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    setErrorMessage('');
    try {
      const res = await fetch(`/api/chat/messages?locale=${encodeURIComponent(locale)}`, { method: 'GET', cache: 'no-store' });
      if (!res.ok) throw new Error(DEFAULT_CHAT_ERROR);
      const data = (await res.json().catch(() => null)) as ChatApiResponse | null;
      setMessages(Array.isArray(data?.messages) ? data.messages.map(normalizeMessage) : []);
      setOperatorTakeover(Boolean(data?.operatorTakeover));
      setIntakePrefill(data?.intakePrefill ?? undefined);
      setIntakeMode(data?.intakeMode ?? 'full_form');
      hasLoadedRef.current = true;
    } catch {
      setErrorMessage(DEFAULT_CHAT_ERROR);
      hasLoadedRef.current = false;
    } finally {
      setIsLoadingHistory(false);
    }
  }, [locale]);

  useEffect(() => {
    if (!isOpen || hasLoadedRef.current || isLoadingHistory) return;
    void loadChatHistory();
  }, [isOpen, isLoadingHistory, loadChatHistory]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoadingHistory, isSending, showIntakeCard]);

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

  const handleSend = useCallback(async () => {
    const trimmed = inputText.trim();
    if ((!trimmed && pendingFiles.length === 0) || isLoadingHistory || isSending) return;

    const currentFiles = [...pendingFiles];
    const messageText = trimmed || 'Foto';

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

    setInputText('');
    setErrorMessage('');
    setPendingFiles([]);
    setIsSending(true);
    setIntakeDone(false);
    setMessages(c => [...c, optimistic]);

    try {
      const fd = new FormData();
      fd.append('message', messageText);
      fd.append('locale', locale);
      currentFiles.forEach(f => fd.append('files', f.file));

      const res = await fetch('/api/chat/messages', {
        method: 'POST',
        body: fd,
      });
      if (!res.ok) throw new Error(DEFAULT_CHAT_ERROR);

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
      setInputText(trimmed);
      setErrorMessage(DEFAULT_CHAT_ERROR);
    } finally {
      setIsSending(false);
    }
  }, [inputText, pendingFiles, isLoadingHistory, isSending, locale, showIntakeCard]);

  if (!isOpen) return null;

  const showInitialLoading = isLoadingHistory && messages.length === 0;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 transition-all duration-500">
      <div className="absolute inset-0 bg-[#0E1A2B]/40 backdrop-blur-md" onClick={onClose} />

      <div className="relative flex h-[600px] w-full max-w-4xl flex-col overflow-hidden rounded-[32px] border border-white/20 bg-[#F7F1E8]/95 shadow-2xl backdrop-blur-3xl">

        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-black/5 bg-white/80 p-5">
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
          <button onClick={onClose} className="ml-auto rounded-full p-2 text-[#0E1A2B] hover:bg-black/5 transition-colors" type="button">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5 scroll-smooth">
          {operatorTakeover && (
            <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-900">
              Ein Mitarbeiter hat das Gespräch übernommen.
            </div>
          )}

          {showInitialLoading && (
            <div className="rounded-[20px] border border-black/5 bg-white/60 px-4 py-3 text-[13px] text-[#72665D]">
              Gespräch wird geladen …
            </div>
          )}

          {!showInitialLoading && messages.length === 0 && (
            <div className="rounded-[20px] border border-dashed border-black/10 bg-white/45 px-4 py-4 text-[13px] text-[#72665D]">
              Beschreiben Sie Ihr Anliegen oder senden Sie ein Foto.
            </div>
          )}

          {messages.map(message => {
            const p = getRolePalette(message.authorRole);
            return (
              <div key={message.id} className={`flex flex-col ${p.container} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                <span className={`mb-1 text-[10px] font-bold uppercase tracking-[0.18em] ${p.label}`}>
                  {getRoleLabel(message.authorRole)}
                </span>
                <div className={`max-w-[80%] rounded-[24px] px-5 py-3 text-[14px] shadow-sm whitespace-pre-wrap ${p.bubble}`}>
                  {message.body}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.attachments.map(att => (
                        <div key={att.id} className="relative rounded-xl overflow-hidden bg-white/10 flex-shrink-0" style={{ width: '80px', height: '80px' }}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={att.storageKey}
                            alt={att.originalFilename || 'Attachment'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <span className={`mx-2 mt-1.5 text-[9px] font-bold uppercase tracking-widest ${p.meta}`}>
                  {formatTimestamp(message.createdAt)}
                </span>
              </div>
            );
          })}

          {/* Inline intake card */}
          {showIntakeCard && !intakeDone && (
            <div className="flex flex-col items-start animate-in fade-in slide-in-from-bottom-2 duration-400">
              <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#72665D]">AI</span>
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
                {isSending ? 'AI tippt …' : 'Laden …'}
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
        <div className="mt-auto border-t border-black/5 bg-white/80 p-4">
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

          <div className="flex items-end gap-2 rounded-[24px] border border-black/5 bg-[#F7F1E8]/50 p-1.5">
            {/* Attachment button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-[16px] text-[#72665D] hover:bg-black/5 transition-colors"
              title="Foto/Video anhängen"
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
              title="Sprachnachricht (demnächst)"
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-[16px] text-[#72665D]/40 cursor-not-allowed"
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
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void handleSend(); } }}
              placeholder="Ihre Nachricht …"
              className="max-h-24 flex-1 resize-none border-none bg-transparent py-2 text-[14px] text-[#0E1A2B] placeholder-[#72665D]/40 focus:ring-0"
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
              Anfrage jetzt erstellen →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
