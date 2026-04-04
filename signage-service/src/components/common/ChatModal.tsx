'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import Logo from '../common/Logo';

interface Message {
  id: string;
  type: 'ai' | 'user';
  text: string;
  time: string;
  file?: string;
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatModal = ({ isOpen, onClose }: ChatModalProps) => {
  const t_nav = useTranslations('Nav');
  const t = useTranslations('ContactModal');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      setIsTyping(true);
      setTimeout(() => {
        setMessages([
          {
            id: '1',
            type: 'ai',
            text: 'Hello! I am your Technical Atelier assistant. How can I help you today?',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setIsTyping(false);
      }, 1000);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputText('');

    // Simulate AI response
    setIsTyping(true);
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        text: "I've received your message. A technical expert will join this chat shortly.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6 transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0E1A2B]/40 backdrop-blur-md" onClick={onClose} />

      <div 
        className={`relative w-full max-w-4xl h-[580px] bg-[#F7F1E8]/95 backdrop-blur-3xl border border-white/20 rounded-[40px] shadow-3xl overflow-hidden flex flex-col transition-all duration-500 transform ${isOpen ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-white/80 border-b border-black/5 gap-2">
          <div className="flex items-center gap-4 flex-1 overflow-hidden">
            <div className="flex items-center shrink-0">
              <Logo className="scale-75 origin-left" />
            </div>
            <div className="hidden sm:block w-px h-6 bg-black/10 mx-1 shrink-0" />
            <div className="truncate">
              <h3 className="font-black text-[#0E1A2B] text-[15px] tracking-tight leading-none mb-1 truncate">Technical Support</h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shrink-0" />
                <span className="text-[9px] text-[#72665D] uppercase font-bold tracking-wider truncate">Online</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors text-[#0E1A2B] shrink-0 ml-auto">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Message Feed */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth">
          {messages.map((m) => (
            <div 
              key={m.id} 
              className={`flex flex-col ${m.type === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div 
                className={`max-w-[80%] px-5 py-3 rounded-[24px] text-[14px] shadow-sm ${
                  m.type === 'user' 
                    ? 'bg-[#0E1A2B] text-white rounded-tr-[4px]' 
                    : 'bg-white/80 backdrop-blur-md text-[#0E1A2B] border border-black/5 rounded-tl-[4px]'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[9px] text-[#72665D]/50 mt-1.5 font-bold uppercase tracking-widest mx-2">
                {m.time}
              </span>
            </div>
          ))}
          {isTyping && (
            <div className="flex flex-col items-start animate-in fade-in duration-300">
              <div className="px-4 py-3 rounded-[20px] rounded-tl-[4px] bg-white/40 text-[#0E1A2B] border border-black/5 flex gap-1">
                <div className="w-1 h-1 bg-[#B8643E] rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1 h-1 bg-[#B8643E] rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1 h-1 bg-[#B8643E] rounded-full animate-bounce" />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white/80 border-t border-black/5 mt-auto">
          <div className="flex items-end gap-2 p-1.5 pr-1.5 bg-[#F7F1E8]/50 border border-black/5 rounded-[24px]">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 text-[#72665D] hover:text-[#0E1A2B] hover:bg-white rounded-[18px] transition-all active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            <input type="file" ref={fileInputRef} className="hidden" multiple />
            
            <textarea
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
              placeholder="Type your question..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-[#0E1A2B] placeholder-[#72665D]/40 text-[14px] py-2 max-h-24 resize-none"
            />

            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="p-2.5 bg-[#0E1A2B] hover:bg-[#1a2e47] text-white rounded-[18px] transition-all disabled:opacity-30 active:scale-95 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
