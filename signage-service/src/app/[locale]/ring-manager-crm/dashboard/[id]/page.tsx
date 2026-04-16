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

  const [activeTab, setActiveTab] = useState<'client' | 'master' | 'history'>('client');
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomAnchorRef = useRef<HTMLDivElement>(null);
  const initialScrollCaseIdRef = useRef<string | null>(null);

  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusReason, setStatusReason] = useState('');
  const [assignedOperatorDraft, setAssignedOperatorDraft] = useState('');
  const [updatingAssignment, setUpdatingAssignment] = useState(false);

  const [replyMode, setReplyMode] = useState<'customer' | 'internal'>('customer');
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);

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
    } catch (e) {
      setLoadError('Failed to connect to API');
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
    try {
      await adminFetch(`/api/admin/cases/${id}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operatorTakeover: nextValue }),
      });
      await fetchCase();
    } catch (e) {}
  }

  const caseId = caseData?.id;
  useEffect(() => {
    if (activeTab !== 'client' || !caseId) {
      return;
    }

    if (initialScrollCaseIdRef.current === caseId) {
      return;
    }

    const frameId = requestAnimationFrame(() => {
      bottomAnchorRef.current?.scrollIntoView({ block: 'end' });
      initialScrollCaseIdRef.current = caseId;
    });

    return () => cancelAnimationFrame(frameId);
  }, [activeTab, caseId]);

  if (loading) return <div className="flex h-screen items-center justify-center bg-zinc-950 text-zinc-500 font-medium tracking-tighter animate-pulse uppercase">System Loading...</div>;
  if (loadError) return <div className="flex h-screen items-center justify-center bg-zinc-950 text-red-400 font-mono text-xs uppercase p-10 text-center">{loadError}</div>;
  if (!caseData) return null;

  const currentStatusObj = STATUS_OPTIONS.find((s) => s.value === caseData.status);
  const operatorTakeover = caseData.sessions.some((session) => session.operatorTakeover);
  const hasCustomerSession = caseData.sessions.length > 0;

  const timelineEvents = [
    ...caseData.messages.map(m => ({ timestamp: new Date(m.createdAt).getTime(), type: m.isCustomerVisible ? 'message' : 'note', data: m })),
    ...caseData.statusEvents.map(e => ({ timestamp: new Date(e.createdAt).getTime(), type: 'status', data: e }))
  ].sort((a, b) => a.timestamp - b.timestamp);

  // Extract metadata (Robust regex for Тип/Type and Локация/Location)
  const firstCustomerMessage = caseData.messages.find(m => m.authorRole === 'CUSTOMER')?.body || '';
  const typeMatch = firstCustomerMessage.match(/(?:Тип|Type):\s*(.*?)(?:\s*\||$)/i);
  const locMatch = firstCustomerMessage.match(/(?:Локация|Location):\s*(.*?)(?:\s*\||$|\n)/i);
  const detectedType = typeMatch ? typeMatch[1].trim() : null;
  const detectedLocation = locMatch ? locMatch[1].trim() : null;

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-zinc-950 font-sans selection:bg-indigo-500/30">
      
      <header className="shrink-0 flex justify-between items-center bg-zinc-950/40 backdrop-blur-xl px-4 sm:px-8 py-4 border-b border-white/[0.03] z-40">
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.push(withLocalePath(locale, '/ring-manager-crm/dashboard'))}
            className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 hover:text-white transition-all uppercase tracking-widest"
          >
             <span className="text-sm">←</span> <span className="hidden sm:inline">BACK</span>
          </button>
          
          <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-3">
            {caseData.publicRequestNumber || 'CASE #'+caseData.id.slice(0,6)}
            {currentStatusObj && (
              <Badge variant={currentStatusObj.variant as any} className="text-[9px] uppercase font-black tracking-[0.2em] px-2 py-0.5 rounded-sm border-white/5">
                {currentStatusObj.label}
              </Badge>
            )}
          </h1>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all ${hasCustomerSession ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-[0_0_15px_-5px_#10b981]' : 'border-zinc-800 text-zinc-600'}`}>
           <div className={`w-1.5 h-1.5 rounded-full ${hasCustomerSession ? 'bg-emerald-500' : 'bg-zinc-700'}`}></div>
           {hasCustomerSession ? 'CUSTOMER ACTIVE' : 'OFFLINE'}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        <aside className="w-[320px] shrink-0 border-r border-white/[0.03] bg-zinc-950 flex flex-col z-30 overflow-y-auto no-scrollbar pb-20 pt-8 px-8 space-y-10">

          {/* Section: Project Context (DETECTED) */}
          {(detectedType || detectedLocation) && (
            <section className="space-y-4">
              <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.15em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></span>
                Project Context
              </h3>
              <div className="space-y-4 bg-white/[0.01] border border-white/[0.03] rounded-lg p-3">
                 {detectedType && (
                   <div className="flex justify-between items-baseline">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Type</span>
                      <span className="text-xs font-semibold text-white">{detectedType}</span>
                   </div>
                 )}
                 {detectedLocation && (
                   <div className="flex justify-between items-baseline">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase">Location</span>
                      <span className="text-xs font-semibold text-indigo-300 font-mono">{detectedLocation}</span>
                   </div>
                 )}
              </div>
            </section>
          )}

          <section className="space-y-5">
             <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.15em]">Control Panel</h3>
             <div className="space-y-4">
                <Select value={newStatus} onChange={(e) => setNewStatus(e.target.value)} className="bg-transparent border-white/[0.05] h-9 text-xs font-semibold text-white">
                  {STATUS_OPTIONS.map(opt => <option key={opt.value} value={opt.value} className="bg-zinc-900">{opt.label}</option>)}
                </Select>
                {newStatus !== caseData.status && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-2">
                     <Textarea value={statusReason} onChange={(e) => setStatusReason(e.target.value)} placeholder="Reason for change..." className="bg-zinc-900/50 border-white/[0.05] text-[11px] min-h-[60px]" />
                     <Button onClick={updateStatus} disabled={updating} variant="primary" size="sm" className="w-full font-black text-[10px] h-8 uppercase">Update Status</Button>
                  </motion.div>
                )}
                <div className="relative">
                  <Input value={assignedOperatorDraft} onChange={(e) => setAssignedOperatorDraft(e.target.value)} placeholder="Assign operator..." className="bg-transparent border-white/[0.05] h-8 text-[11px] pr-12" />
                  <button onClick={updateAssignment} disabled={updatingAssignment} className="absolute right-2 top-1.5 text-[10px] font-black text-indigo-500 uppercase">Save</button>
                </div>
             </div>
          </section>

          <section className="space-y-5">
            <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.15em]">Customer Info</h3>
            <div className="space-y-4">
               {[
                 { label: 'Name', value: caseData.customerName || 'None' },
                 { label: 'Contact', value: caseData.customerEmail || caseData.customerPhone || '—', mono: true },
                 { label: 'Source', value: `${CHANNEL_ICONS[caseData.originChannel] || '??'} ${caseData.originChannel}` }
               ].map((item, idx) => (
                 <div key={idx} className="flex justify-between items-baseline border-b border-white/[0.02] pb-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">{item.label}</span>
                    <span className={`text-xs font-semibold text-zinc-200 truncate max-w-[160px] ${item.mono ? 'font-mono' : ''}`}>{item.value}</span>
                 </div>
               ))}
            </div>
          </section>

          {caseData.attachments.length > 0 && (
             <section className="space-y-4">
               <h3 className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Media ({caseData.attachments.length})</h3>
               <div className="grid grid-cols-1 gap-3">
                 {caseData.attachments.map(att => {
                    const isVideo = att.kind === 'VIDEO' || att.mimeType.startsWith('video/');
                    const isImage = att.kind === 'IMAGE' || att.mimeType.startsWith('image/');
                    const url = `/api/admin/attachments/${att.id}`;
                    return (
                      <div key={att.id} className="group overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.01]">
                        {isImage ? (
                          <a href={url} target="_blank" rel="noreferrer" className="block aspect-video bg-black overflow-hidden hover:opacity-90 transition-opacity">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                          </a>
                        ) : isVideo ? (
                          <video src={url} controls className="w-full max-h-[250px] bg-black" />
                        ) : (
                          <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 hover:bg-white/[0.02]">
                            <span className="text-xl">📄</span>
                            <span className="text-[11px] font-semibold text-zinc-300 truncate">{att.originalFilename || 'Document'}</span>
                          </a>
                        )}
                        <div className="px-3 py-2 flex justify-between items-center text-[9px] font-bold text-zinc-500">
                           <span className="truncate max-w-[120px]">{att.originalFilename || 'File'}</span>
                           <span className="font-black">{(att.byteSize / 1024 / 1024).toFixed(2)}MB</span>
                        </div>
                      </div>
                    );
                  })}
               </div>
             </section>
          )}

          <section className="space-y-4">
            <h3 className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Description</h3>
            <div className="bg-white/[0.02] p-4 rounded-xl border border-white/[0.03] text-[11px] text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {caseData.description || caseData.summary || 'No description provided.'}
            </div>
          </section>
        </aside>

        <main className="flex flex-1 min-h-0 flex-col bg-zinc-950 overflow-hidden">
          <nav className="shrink-0 flex items-center h-16 px-8 border-b border-white/[0.03] gap-10">
             {['client', 'master', 'history'].map((tid) => (
               <button
                 key={tid} onClick={() => setActiveTab(tid as any)}
                 className={`relative h-full flex items-center text-[10px] font-black uppercase tracking-[0.2em] transition-all ${activeTab === tid ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'}`}
               >
                 {tid === 'client' ? 'Chat with client' : tid === 'master' ? 'Communication Master' : 'Event Timeline'}
                 {activeTab === tid && <motion.div layoutId="nav-line" className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500" />}
               </button>
             ))}
          </nav>

          <div className="flex flex-1 min-h-0 flex-col overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'client' && (
                <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-1 min-h-0 flex-col">
                   <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-6 sm:px-12 py-10 no-scrollbar scroll-smooth">
                      <div className="max-w-3xl mx-auto w-full space-y-10">
                         {timelineEvents.map((event) => {
                            if (event.type === 'status') {
                               const e = event.data as any;
                               return (
                                 <div key={e.id} className="flex items-center justify-center gap-4 opacity-20">
                                    <div className="h-px w-6 bg-white"></div>
                                    <span className="text-[8px] font-black uppercase tracking-[0.4em]">{ACTOR_ROLE_LABELS[e.actorRole] || 'SYSTEM'} → {formatStatusLabel(e.toStatus)}</span>
                                    <div className="h-px w-6 bg-white"></div>
                                 </div>
                               );
                            }
                            const m = event.data as any;
                            const isNote = event.type === 'note';
                            const isCustomer = m.authorRole === 'CUSTOMER';
                            return (
                              <div key={m.id} className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}>
                                 <div className={`mb-1 px-1 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest ${isNote ? 'text-amber-500' : isCustomer ? 'text-zinc-600' : 'text-indigo-400 opacity-80'}`}>
                                    <span className={`w-1 h-1 rounded-full ${m.authorRole === 'AI' ? 'bg-indigo-400 animate-pulse' : isNote ? 'bg-amber-500' : isCustomer ? 'bg-zinc-700' : 'bg-indigo-500'}`} />
                                    {isNote ? 'INTERNAL NOTE' : m.authorRole === 'AI' ? 'AI ASSISTANT' : (m.authorName || (isCustomer ? 'CLIENT' : 'OPERATOR'))}
                                 </div>
                                 <div className={`max-w-[80%] px-5 py-3.5 rounded-2xl text-[14px] leading-relaxed ${isNote ? 'bg-amber-500/10 border border-amber-500/20 text-amber-200' : isCustomer ? 'bg-zinc-900 text-zinc-300 border border-white/5' : 'bg-indigo-600 text-white shadow-xl shadow-indigo-950/20'}`}>
                                    {m.body}
                                 </div>
                                 <span className="mt-2 text-[8px] font-bold text-zinc-700 uppercase tracking-widest">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                            );
                         })}
                         <div ref={bottomAnchorRef} className="h-px" />
                      </div>
                   </div>

                   <div className="shrink-0 px-6 pb-6 pt-4">
                     <div className="mx-auto w-full max-w-2xl">
                      <div className={`rounded-3xl border ${replyMode === 'internal' ? 'bg-amber-950/30 border-amber-500/20' : 'bg-zinc-900 border-white/5'} backdrop-blur-3xl overflow-hidden shadow-2xl`}>
                         <div className="flex h-10 border-b border-white/5 px-6 items-center gap-6">
                            {['customer', 'internal'].map(m => (
                              <button key={m} onClick={() => setReplyMode(m as any)} className={`text-[8px] font-black tracking-widest uppercase ${replyMode === m ? 'text-indigo-500' : 'text-zinc-600'}`}>
                                 {m === 'customer' ? 'Reply to client' : 'Internal Note'}
                              </button>
                            ))}
                            <button onClick={() => updateTakeover(!operatorTakeover)} className={`ml-auto text-[8px] font-black px-2 py-0.5 rounded border ${operatorTakeover ? 'border-red-500/30 text-red-500' : 'border-emerald-500/30 text-emerald-500'} uppercase`}>
                               AI: {operatorTakeover ? 'OFF' : 'ON'}
                            </button>
                         </div>
                         <div className="flex items-end p-2 gap-2">
                            <textarea 
                               value={replyText} onChange={(e) => setReplyText(e.target.value)}
                               placeholder="Type your message..."
                               className="flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none resize-none min-h-[44px] max-h-[200px]"
                            />
                            <button 
                               onClick={sendReply} disabled={!replyText.trim() || sendingReply}
                               className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-full transition-all ${replyText.trim() ? (replyMode === 'customer' ? 'bg-indigo-600' : 'bg-amber-600') : 'bg-zinc-800'}`}
                            >
                               {sendingReply ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <span className="text-white text-lg">↑</span>}
                            </button>
                         </div>
                      </div>
                     </div>
                   </div>
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div key="history" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 overflow-y-auto px-12 py-12 no-scrollbar">
                   <div className="max-w-2xl mx-auto space-y-8">
                      {caseData.auditLogs.map(log => (
                        <div key={log.id} className="flex gap-8 group">
                           <span className="shrink-0 text-[10px] font-bold text-zinc-700 w-20 pt-1 font-mono tracking-tighter uppercase">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                           <div className="flex-1 border-l border-white/5 pl-8 pb-8 space-y-2">
                              <h4 className="text-[10px] font-black text-white uppercase tracking-widest">{log.action.replace(/_/g, ' ')}</h4>
                              <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">{log.outcome}</p>
                              {log.reason && <p className="text-[9px] font-mono text-zinc-600 bg-white/[0.01] p-2 rounded">Reason: {log.reason}</p>}
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
