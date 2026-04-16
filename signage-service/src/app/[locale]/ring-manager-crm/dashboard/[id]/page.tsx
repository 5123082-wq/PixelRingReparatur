'use client';

import { useState, useEffect, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

import { adminFetch } from '@/lib/admin-fetch';
import { withLocalePath } from '../../../admin-route';

import { Button } from '@/components/admin/ui/Button';
import { Input, Textarea, Select } from '@/components/admin/ui/Input';
import { Badge } from '@/components/admin/ui/Badge';

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
    createdAt: string;
  }[];
  sessions: {
    id: string;
    operatorTakeover: boolean;
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

const STATUS_OPTIONS: { value: string; label: string; variant: any }[] = [
  { value: 'DRAFT', label: 'Черновик', variant: 'neutral' },
  { value: 'FORMALIZED', label: 'Оформлена', variant: 'neutral' },
  { value: 'NUMBER_ISSUED', label: 'Принято', variant: 'info' },
  { value: 'UNDER_REVIEW', label: 'В диагностике', variant: 'warning' },
  { value: 'IN_PROGRESS', label: 'Ремонт', variant: 'warning' },
  { value: 'ON_HOLD', label: 'Отложено', variant: 'neutral' },
  { value: 'WAITING_FOR_CUSTOMER', label: 'Ожидает клиента', variant: 'warning' },
  { value: 'READY_FOR_PICKUP', label: 'Готов', variant: 'success' },
  { value: 'COMPLETED', label: 'Выдан / Гарантия', variant: 'success' },
  { value: 'CANCELLED', label: 'Отказ', variant: 'error' },
];

const CHANNEL_ICONS: Record<string, string> = {
  WEBSITE_CHAT: '💬', WEBSITE_FORM: '📝', TELEGRAM: '✈️', WHATSAPP: '📱', PHONE: '📞', EMAIL: '📧', CRM: '🏢', MANUAL: '✋'
};

const ACTOR_ROLE_LABELS: Record<string, string> = { CUSTOMER: 'Клиент', OPERATOR: 'Оператор', SYSTEM: 'Система', AI: 'AI' };

function formatStatusLabel(status: string | null | undefined) {
  if (!status) return '—';
  return STATUS_OPTIONS.find((option) => option.value === status)?.label || status;
}

export default function CaseDetailPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { id, locale } = use(params);
  const router = useRouter();
  
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  
  // Tabs: 'client' | 'master' | 'history'
  const [activeTab, setActiveTab] = useState<'client' | 'master' | 'history'>('client');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on data load or tab change to 'client'
  useEffect(() => {
    if (activeTab === 'client' && scrollRef.current) {
      // Small timeout to ensure DOM is fully updated after motion animations
      const timer = setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [caseData?.messages.length, activeTab]);

  // Status/Assignment state
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [assignedOperatorDraft, setAssignedOperatorDraft] = useState('');
  const [updatingAssignment, setUpdatingAssignment] = useState(false);
  
  // Reply Panel State
  const [replyMode, setReplyMode] = useState<'customer' | 'internal'>('customer');
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [updatingTakeover, setUpdatingTakeover] = useState(false);

  useEffect(() => {
    fetchCase();
  }, [id, locale]);

  async function fetchCase() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/cases/${id}`);
      if (!res.ok) {
        setLoadError(`Ошибка загрузки: ${res.status}`);
        return;
      }
      const data = await res.json();
      setCaseData(data.case);
      setAssignedOperatorDraft(data.case.assignedOperator || '');
      setNewStatus(data.case.status);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus() {
    setUpdating(true);
    try {
      const res = await adminFetch(`/api/admin/cases/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, statusReason: statusReason.trim() || undefined }),
      });
      if (res.ok) { setStatusReason(''); await fetchCase(); }
    } finally { setUpdating(false); }
  }

  async function sendReply() {
    const text = replyText.trim();
    if (!text || sendingReply) return;
    setSendingReply(true);
    try {
      const payload = replyMode === 'customer' ? { message: text } : { internalNote: text };
      const res = await adminFetch(`/api/admin/cases/${id}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) { setReplyText(''); await fetchCase(); }
    } finally { setSendingReply(false); }
  }

  async function updateAssignment() {
    setUpdatingAssignment(true);
    try {
      await adminFetch(`/api/admin/cases/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assignedOperator: assignedOperatorDraft }),
      });
      await fetchCase();
    } finally { setUpdatingAssignment(false); }
  }

  async function updateTakeover(nextValue: boolean) {
    setUpdatingTakeover(true);
    try {
      await adminFetch(`/api/admin/cases/${id}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operatorTakeover: nextValue }),
      });
      await fetchCase();
    } finally { setUpdatingTakeover(false); }
  }

  if (loading) return <div className="flex h-screen items-center justify-center bg-zinc-950 text-zinc-500 font-medium tracking-tighter animate-pulse">SYSTEM LOADING...</div>;
  if (loadError) return <div className="flex h-screen items-center justify-center bg-zinc-950 text-red-400 font-mono text-sm">{loadError}</div>;
  if (!caseData) return null;

  const currentStatusObj = STATUS_OPTIONS.find((s) => s.value === caseData.status);
  const operatorTakeover = caseData.sessions.some((session) => session.operatorTakeover);
  const hasCustomerSession = caseData.sessions.length > 0;

  const timelineEvents = [
    ...caseData.messages.map(m => ({ timestamp: new Date(m.createdAt).getTime(), type: m.isCustomerVisible ? 'message' : 'note', data: m })),
    ...caseData.statusEvents.map(e => ({ timestamp: new Date(e.createdAt).getTime(), type: 'status', data: e }))
  ].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-zinc-950 font-sans selection:bg-indigo-500/30">
      
      {/* Premium Integrated Header */}
      <header className="shrink-0 flex justify-between items-center bg-zinc-950/40 backdrop-blur-xl px-1 sm:px-8 py-5 border-b border-white/[0.03] z-40">
        <div className="flex items-center gap-4 sm:gap-10">
          <button 
            onClick={() => router.push(withLocalePath(locale, '/ring-manager-crm/dashboard'))}
            className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-white transition-all uppercase tracking-widest px-1"
          >
             <span className="text-sm">←</span> <span className="hidden sm:inline">BACK</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-3">
                {caseData.publicRequestNumber || 'CASE #'+caseData.id.slice(0,6)}
                {currentStatusObj && (
                  <Badge variant={currentStatusObj.variant as any} className="text-[9px] uppercase font-black tracking-[0.2em] px-2 py-0.5 rounded-sm line-clamp-1 border-white/5">
                    {currentStatusObj.label}
                  </Badge>
                )}
              </h1>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all ${hasCustomerSession ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-[0_0_15px_-5px_#10b981]' : 'border-zinc-800 text-zinc-600'}`}>
              <div className={`w-1.5 h-1.5 rounded-full ${hasCustomerSession ? 'bg-emerald-500' : 'bg-zinc-700'}`}></div>
              {hasCustomerSession ? 'CUSTOMER ACTIVE' : 'OFFLINE'}
           </div>
        </div>
      </header>

      {/* Main Board */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Left Sidebar: Minimalist Context (320px) */}
        <aside className="w-[320px] shrink-0 border-r border-white/[0.03] bg-zinc-950 flex flex-col z-30 overflow-y-auto no-scrollbar pt-6 px-8 space-y-10">
          
          {/* Section: Status & Assignment */}
          <section className="space-y-6">
             <div className="space-y-1.5">
               <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.15em]">Status & Owner</h3>
               <div className="space-y-4 pt-2">
                  <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="bg-transparent border-white/[0.05] h-9 text-xs font-semibold focus:border-indigo-500 transition-all text-white">
                    {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value} className="bg-zinc-900">{opt.label}</option>)}
                  </Select>
                  {newStatus !== caseData.status && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-2">
                       <Textarea value={statusReason} onChange={(e) => setStatusReason(e.target.value)} placeholder="Reason for change..." className="bg-zinc-900/50 border-white/[0.05] text-[11px] min-h-[60px]" />
                       <Button onClick={updateStatus} disabled={updating} variant="primary" size="sm" className="w-full font-black text-[10px] uppercase h-8 shadow-indigo-500/10 shadow-lg">UPDATE STATUS</Button>
                    </motion.div>
                  )}
                  <div className="flex gap-2 relative">
                    <Input value={assignedOperatorDraft} onChange={(e) => setAssignedOperatorDraft(e.target.value)} placeholder="Assign operator..." className="bg-transparent border-white/[0.05] h-8 text-[11px] font-semibold" />
                    <button onClick={updateAssignment} disabled={updatingAssignment} className="absolute right-2 top-1.5 text-[10px] font-black text-indigo-500 hover:text-indigo-400">SAVE</button>
                  </div>
               </div>
             </div>
          </section>

          {/* Section: Customer Context */}
          <section className="space-y-5">
            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.15em]">Customer Info</h3>
            <div className="space-y-4 pt-1">
               <div className="flex justify-between items-baseline group border-b border-white/[0.02] pb-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">Name</span>
                  <span className="text-xs font-semibold text-zinc-200 group-hover:text-white transition-all">{caseData.customerName || 'None'}</span>
               </div>
               <div className="flex justify-between items-baseline group border-b border-white/[0.02] pb-2">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">Contact</span>
                  <span className="text-xs font-semibold text-zinc-200 truncate max-w-[150px] text-right font-mono tracking-tighter" title={caseData.customerEmail || ''}>{caseData.customerEmail || caseData.customerPhone || '—'}</span>
               </div>
               <div className="flex justify-between items-baseline group">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">Source</span>
                  <span className="text-xs font-semibold text-zinc-400 italic opacity-60">{CHANNEL_ICONS[caseData.originChannel] || '??'} {caseData.originChannel}</span>
               </div>
            </div>
          </section>

          {/* Section: Documents */}
          {caseData.attachments.length > 0 && (
             <section className="space-y-5">
               <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Documents ({caseData.attachments.length})</h3>
               <div className="space-y-2">
                 {caseData.attachments.map(att => (
                   <a key={att.id} href={`/api/admin/attachments/${att.id}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-2 rounded-lg border border-transparent hover:border-white/[0.05] hover:bg-white/[0.02] transition-all group overflow-hidden">
                      <div className="text-base bg-white/[0.03] w-8 h-8 flex items-center justify-center rounded-md text-zinc-500 group-hover:text-zinc-200 transition-colors">{att.kind === 'IMAGE' ? '📷' : '📦'}</div>
                      <div className="flex flex-col min-w-0">
                         <span className="text-[10px] font-bold text-zinc-300 truncate tracking-tight">{att.originalFilename || 'FILE'}</span>
                         <span className="text-[8px] font-black text-zinc-600 uppercase">{(att.byteSize / 1024).toFixed(0)} KB</span>
                      </div>
                   </a>
                 ))}
               </div>
             </section>
          )}

          {/* Issue Section */}
          <section className="space-y-4">
            <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Original Issue</h3>
            <div className="bg-white/[0.02] p-4 rounded-xl border border-white/[0.03]">
              <p className="text-[11px] text-zinc-300 leading-relaxed font-medium whitespace-pre-wrap selection:bg-indigo-500/40">
                {caseData.description || caseData.summary || 'No description provided.'}
              </p>
            </div>
          </section>

          <footer className="h-20 shrink-0"></footer>
        </aside>

        {/* Right Workspace: System Center (Messenger) */}
        <main className="flex-1 flex flex-col relative z-10 bg-zinc-950 overflow-hidden">
          
          {/* Navigation Tabs */}
          <div className="shrink-0 flex items-center justify-between h-16 px-8 border-b border-white/[0.03]">
             <div className="flex gap-10 relative h-full">
                {['client', 'master', 'history'].map((tid) => (
                  <button 
                    key={tid} onClick={() => setActiveTab(tid as any)} 
                    className={`relative flex items-center px-1 text-[11px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === tid ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
                  >
                    {tid === 'client' ? 'Chat with client' : tid === 'master' ? 'Communication Master' : 'Event Timeline'}
                    {activeTab === tid && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" transition={{ type: "spring", stiffness: 350, damping: 30 }} />}
                  </button>
                ))}
             </div>
          </div>

          {/* Active Area */}
          <div className="flex-1 overflow-hidden relative flex flex-col">
            
            <AnimatePresence mode="wait">
              {activeTab === 'client' && (
                <motion.div key="client" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col overflow-hidden">
                   
                   {/* Chat Feed */}
                   <div 
                     ref={scrollRef}
                     className="flex-1 overflow-y-auto px-6 sm:px-12 py-10 scrollbar-none space-y-8 select-auto scroll-smooth"
                   >
                      <div className="max-w-3xl mx-auto w-full flex flex-col space-y-12">
                         {timelineEvents.map((event, idx) => {
                            if (event.type === 'status') {
                               const payload = event.data as any;
                               return (
                                 <motion.div key={payload.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center my-4">
                                   <div className="flex items-center gap-3 opacity-30 hover:opacity-100 transition-opacity">
                                      <div className="h-px w-8 bg-white/20"></div>
                                      <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500">
                                         {ACTOR_ROLE_LABELS[payload.actorRole] || 'SYSTEM'} CHANGED STATUS TO {formatStatusLabel(payload.toStatus)}
                                      </span>
                                      <div className="h-px w-8 bg-white/20"></div>
                                   </div>
                                 </motion.div>
                               );
                            }

                            if (event.type === 'note') {
                               const payload = event.data as any;
                               return (
                                 <motion.div key={payload.id} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} className="flex justify-center">
                                    <div className="w-full max-w-[85%] border-l-2 border-indigo-500 bg-white/[0.03] p-5 rounded-r-2xl relative overflow-hidden group">
                                       <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-500 text-[8px] font-black text-white uppercase tracking-widest shadow-lg">INTERNAL NOTE</div>
                                       <div className="text-xs text-indigo-400 font-bold mb-2 uppercase tracking-wide opacity-80">{payload.authorName || 'OPERATOR'} • {new Date(payload.createdAt).toLocaleTimeString()}</div>
                                       <div className="text-[13px] text-zinc-100 font-medium leading-relaxed selection:bg-indigo-500/40">{payload.body}</div>
                                    </div>
                                 </motion.div>
                               );
                            }

                            const payload = event.data as any;
                            const isCustomer = payload.authorRole === 'CUSTOMER';
                            return (
                              <motion.div key={payload.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'} group`}>
                                 {/* Persistent Author Badge */}
                                 <div className={`mb-1 px-1 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.1em] ${isCustomer ? 'text-zinc-600' : 'text-indigo-400 opacity-80'}`}>
                                    <span className={`w-1 h-1 rounded-full ${payload.authorRole === 'AI' ? 'bg-indigo-400 animate-pulse-slow shadow-[0_0_8px_rgba(129,140,248,0.5)]' : isCustomer ? 'bg-zinc-700' : 'bg-indigo-500'}`}></span>
                                    {payload.authorRole === 'AI' ? 'AI Assistant' : (payload.authorName || (isCustomer ? 'Client' : 'Operator'))}
                                 </div>

                                 <div className={`
                                    max-w-[70%] px-5 py-3.5 rounded-2xl text-[14px] font-medium leading-[1.6] shadow-2xl relative transition-all
                                    ${isCustomer ? 'bg-zinc-900 text-zinc-200 border border-white/5 rounded-tl-sm' : 'bg-indigo-600 text-white rounded-tr-sm shadow-indigo-950/40'}
                                 `}>
                                    {payload.body}
                                 </div>
                                 <div className={`mt-2 flex items-center gap-2 text-[8px] font-black tracking-widest text-zinc-600 transition-opacity ${isCustomer ? '' : 'flex-row-reverse'}`}>
                                    <span>{new Date(payload.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    {!isCustomer && <span className="text-indigo-500 opacity-50">DELIVERED</span>}
                                 </div>
                              </motion.div>
                            );
                         })}
                      </div>
                      <div className="h-32"></div>
                   </div>

                   {/* Floating Prompt Bar */}
                   <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-50">
                      <div className={`relative rounded-3xl overflow-hidden transition-all duration-500 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)] border ${replyMode === 'internal' ? 'bg-indigo-950/50 border-indigo-500/30' : 'bg-zinc-900/80 border-white/[0.08]'} backdrop-blur-3xl ring-1 ring-white/5`}>
                         <div className="flex h-12 border-b border-white/[0.03] px-6 items-center gap-6">
                            <button onClick={() => setReplyMode('customer')} className={`text-[9px] font-black tracking-widest uppercase transition-all ${replyMode === 'customer' ? 'text-indigo-400' : 'text-zinc-600 hover:text-zinc-400'}`}>REPLY TO CLIENT</button>
                            <button onClick={() => setReplyMode('internal')} className={`text-[9px] font-black tracking-widest uppercase transition-all ${replyMode === 'internal' ? 'text-indigo-400' : 'text-zinc-600 hover:text-zinc-400'}`}>INTERNAL NOTE</button>
                            <div className="ml-auto flex items-center gap-3 h-full">
                               <button onClick={() => updateTakeover(!operatorTakeover)} className={`text-[8px] font-black px-2 py-0.5 rounded border transition-colors ${operatorTakeover ? 'bg-red-500/10 border-red-500/20 text-red-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
                                  {operatorTakeover ? 'AI: DISABLED' : 'AI: ACTIVE'}
                               </button>
                            </div>
                         </div>
                         <div className="relative p-2 h-max min-h-[60px] flex items-end">
                            <textarea 
                              value={replyText} onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type something meaningful..."
                              className="flex-1 bg-transparent px-4 py-3 text-sm font-medium text-white outline-none resize-none placeholder:text-zinc-700 min-h-[44px] max-h-[200px]"
                            />
                            <button 
                              onClick={sendReply} disabled={!replyText.trim() || sendingReply}
                              className={`mb-1.5 mr-1.5 w-8 h-8 rounded-full flex items-center justify-center transition-all ${replyText.trim() ? (replyMode === 'customer' ? 'bg-indigo-600 shadow-lg shadow-indigo-600/30' : 'bg-amber-600 shadow-lg shadow-amber-600/30') : 'bg-zinc-800'}`}
                            >
                              {sendingReply ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : <span className="text-white text-xs">↑</span>}
                            </button>
                         </div>
                      </div>
                   </div>

                </motion.div>
              )}

              {activeTab === 'master' && (
                <motion.div key="master" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center space-y-6">
                   <div className="relative">
                      <div className="w-24 h-24 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-center text-4xl shadow-inner relative z-10">🛠️</div>
                      <div className="absolute inset-0 bg-indigo-500/10 blur-3xl animate-pulse"></div>
                   </div>
                   <div className="text-center space-y-2">
                      <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">Master Session Control</h3>
                      <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest max-w-xs leading-loose">This module is currently initializing. Real-time communication with field masters is coming in next system update.</p>
                   </div>
                   <div className="flex gap-2">
                      <div className="h-1 w-20 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} className="w-1/2 h-full bg-indigo-500/40" />
                      </div>
                   </div>
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-y-auto px-12 py-12 space-y-6 scrollbar-none">
                   <div className="max-w-2xl mx-auto space-y-4">
                      {caseData.auditLogs.map(log => (
                        <div key={log.id} className="flex gap-6 items-start group">
                           <div className="shrink-0 text-[10px] font-black text-zinc-700 w-24 pt-1 font-mono">{new Date(log.createdAt).toLocaleTimeString()}</div>
                           <div className="flex-1 border-b border-white/[0.02] pb-6 space-y-2">
                              <div className="text-[10px] font-black text-white uppercase tracking-widest">{log.action.replace(/_/g, ' ')}</div>
                              <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">{log.outcome}</p>
                              {log.reason && <div className="text-[9px] bg-white/[0.01] border border-white/[0.03] p-3 rounded-lg text-zinc-600 mt-3 font-mono">REASON: {log.reason}</div>}
                           </div>
                        </div>
                      ))}
                   </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
