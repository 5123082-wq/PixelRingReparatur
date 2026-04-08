'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale } from 'next-intl';

import Logo from '../common/Logo';

type ChatAuthorRole = 'CUSTOMER' | 'SYSTEM' | 'OPERATOR';

type ChatMessage = {
  id: string;
  authorRole: ChatAuthorRole;
  body: string;
  createdAt: string;
};

type ChatApiResponse = {
  messages?: Array<{
    id?: string;
    authorRole?: string;
    body?: string;
    createdAt?: string;
  }>;
  operatorTakeover?: boolean;
};

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_CHAT_ERROR = 'Chat is unavailable right now.';

function isChatAuthorRole(value: unknown): value is ChatAuthorRole {
  return value === 'CUSTOMER' || value === 'SYSTEM' || value === 'OPERATOR';
}

function normalizeMessage(message: {
  id?: string;
  authorRole?: string;
  body?: string;
  createdAt?: string;
}): ChatMessage {
  return {
    id:
      message.id ??
      `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    authorRole: isChatAuthorRole(message.authorRole) ? message.authorRole : 'SYSTEM',
    body: message.body ?? '',
    createdAt: message.createdAt ?? new Date().toISOString(),
  };
}

function formatTimestamp(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function getRoleLabel(role: ChatAuthorRole): string {
  switch (role) {
    case 'CUSTOMER':
      return 'Client';
    case 'OPERATOR':
      return 'Operator';
    case 'SYSTEM':
    default:
      return 'AI';
  }
}

function getRolePalette(role: ChatAuthorRole) {
  switch (role) {
    case 'CUSTOMER':
      return {
        container: 'items-end',
        label: 'text-[#B8643E]',
        bubble: 'bg-[#0E1A2B] text-white rounded-tr-[4px]',
        meta: 'text-white/55',
      };
    case 'OPERATOR':
      return {
        container: 'items-start',
        label: 'text-emerald-700',
        bubble: 'bg-emerald-50 text-[#0E1A2B] border border-emerald-200 rounded-tl-[4px]',
        meta: 'text-[#72665D]/70',
      };
    case 'SYSTEM':
    default:
      return {
        container: 'items-start',
        label: 'text-[#72665D]',
        bubble: 'bg-white/80 backdrop-blur-md text-[#0E1A2B] border border-black/5 rounded-tl-[4px]',
        meta: 'text-[#72665D]/70',
      };
  }
}

const ChatModal = ({ isOpen, onClose }: ChatModalProps) => {
  const locale = useLocale();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [operatorTakeover, setOperatorTakeover] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasLoadedRef = useRef(false);

  const loadChatHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    setErrorMessage('');

    try {
      const response = await fetch(
        `/api/chat/messages?locale=${encodeURIComponent(locale)}`,
        {
          method: 'GET',
          cache: 'no-store',
        }
      );

      if (!response.ok) {
        throw new Error(DEFAULT_CHAT_ERROR);
      }

      const data = (await response.json().catch(() => null)) as ChatApiResponse | null;
      const nextMessages = Array.isArray(data?.messages)
        ? data.messages.map(normalizeMessage)
        : [];

      setMessages(nextMessages);
      setOperatorTakeover(Boolean(data?.operatorTakeover));
      hasLoadedRef.current = true;
    } catch {
      setErrorMessage(DEFAULT_CHAT_ERROR);
      hasLoadedRef.current = false;
    } finally {
      setIsLoadingHistory(false);
    }
  }, [locale]);

  useEffect(() => {
    if (!isOpen || hasLoadedRef.current || isLoadingHistory) {
      return;
    }

    void loadChatHistory();
  }, [isOpen, isLoadingHistory, loadChatHistory]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoadingHistory, isSending, operatorTakeover]);

  const handleSend = useCallback(async () => {
    const trimmed = inputText.trim();

    if (!trimmed || isLoadingHistory || isSending) {
      return;
    }

    const optimisticMessage: ChatMessage = {
      id: `temp-${Date.now()}`,
      authorRole: 'CUSTOMER',
      body: trimmed,
      createdAt: new Date().toISOString(),
    };

    setInputText('');
    setErrorMessage('');
    setIsSending(true);
    setMessages((current) => [...current, optimisticMessage]);

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
          locale,
        }),
      });

      if (!response.ok) {
        throw new Error(DEFAULT_CHAT_ERROR);
      }

      const data = (await response.json().catch(() => null)) as ChatApiResponse | null;
      const nextMessages = Array.isArray(data?.messages)
        ? data.messages.map(normalizeMessage)
        : [];

      if (nextMessages.length > 0) {
        setMessages(nextMessages);
      }

      if (typeof data?.operatorTakeover === 'boolean') {
        setOperatorTakeover(data.operatorTakeover);
      }

      hasLoadedRef.current = true;
    } catch {
      setMessages((current) =>
        current.filter((message) => message.id !== optimisticMessage.id)
      );
      setInputText(trimmed);
      setErrorMessage(DEFAULT_CHAT_ERROR);
    } finally {
      setIsSending(false);
    }
  }, [inputText, isLoadingHistory, isSending, locale]);

  if (!isOpen) return null;

  const showInitialLoading = isLoadingHistory && messages.length === 0;

  return (
    <div
      className={`fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="absolute inset-0 bg-[#0E1A2B]/40 backdrop-blur-md" onClick={onClose} />

      <div
        className={`relative flex h-[580px] w-full max-w-4xl transform flex-col overflow-hidden rounded-[32px] border border-white/20 bg-[#F7F1E8]/95 shadow-3xl backdrop-blur-3xl transition-all duration-500 ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'}`}
      >
        <div className="flex items-center justify-between gap-2 border-b border-black/5 bg-white/80 p-5">
          <div className="flex min-w-0 flex-1 items-center gap-4">
            <div className="flex shrink-0 items-center">
              <Logo className="origin-left scale-75" />
            </div>
            <div className="hidden h-6 w-px shrink-0 bg-black/10 sm:block" />
            <div className="min-w-0 truncate">
              <h3 className="truncate text-[15px] font-black leading-none tracking-tight text-[#0E1A2B]">
                Technical Support
              </h3>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-green-500" />
                <span className="truncate text-[9px] font-bold uppercase tracking-wider text-[#72665D]">
                  Online
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="ml-auto shrink-0 rounded-full p-2 text-[#0E1A2B] transition-colors hover:bg-black/5"
            type="button"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5 scroll-smooth">
          {operatorTakeover ? (
            <div className="rounded-[20px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-900">
              An operator is handling this conversation.
            </div>
          ) : null}

          {showInitialLoading ? (
            <div className="rounded-[20px] border border-black/5 bg-white/60 px-4 py-3 text-[13px] text-[#72665D]">
              Loading conversation...
            </div>
          ) : null}

          {!showInitialLoading && messages.length === 0 ? (
            <div className="rounded-[20px] border border-dashed border-black/10 bg-white/45 px-4 py-4 text-[13px] text-[#72665D]">
              Start the conversation here.
            </div>
          ) : null}

          {messages.map((message) => {
            const palette = getRolePalette(message.authorRole);

            return (
              <div
                key={message.id}
                className={`flex flex-col ${palette.container} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <span className={`mb-1 text-[10px] font-bold uppercase tracking-[0.18em] ${palette.label}`}>
                  {getRoleLabel(message.authorRole)}
                </span>
                <div className={`max-w-[80%] rounded-[24px] px-5 py-3 text-[14px] shadow-sm ${palette.bubble}`}>
                  {message.body}
                </div>
                <span className={`mx-2 mt-1.5 text-[9px] font-bold uppercase tracking-widest ${palette.meta}`}>
                  {formatTimestamp(message.createdAt)}
                </span>
              </div>
            );
          })}

          {isLoadingHistory || isSending ? (
            <div className="flex flex-col items-start animate-in fade-in duration-300">
              <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#72665D]">
                {isSending ? 'Sending' : 'Loading'}
              </div>
              <div className="flex gap-1 rounded-[20px] rounded-tl-[4px] border border-black/5 bg-white/40 px-4 py-3 text-[#0E1A2B]">
                <div className="h-1 w-1 animate-bounce rounded-full bg-[#B8643E] [animation-delay:-0.3s]" />
                <div className="h-1 w-1 animate-bounce rounded-full bg-[#B8643E] [animation-delay:-0.15s]" />
                <div className="h-1 w-1 animate-bounce rounded-full bg-[#B8643E]" />
              </div>
            </div>
          ) : null}
        </div>

        <div className="mt-auto border-t border-black/5 bg-white/80 p-4">
          {errorMessage ? (
            <p className="mb-3 rounded-[20px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex items-end gap-2 rounded-[24px] border border-black/5 bg-[#F7F1E8]/50 p-1.5 pr-1.5">
            <textarea
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void handleSend();
                }
              }}
              placeholder="Type your question..."
              className="max-h-24 flex-1 resize-none border-none bg-transparent py-2 text-[14px] text-[#0E1A2B] placeholder-[#72665D]/40 focus:ring-0"
            />

            <button
              onClick={() => void handleSend()}
              disabled={!inputText.trim() || isLoadingHistory || isSending}
              className="rounded-[18px] bg-[#0E1A2B] p-2.5 text-white shadow-lg transition-all active:scale-95 hover:bg-[#1a2e47] disabled:cursor-not-allowed disabled:opacity-30"
              type="button"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatModal;
