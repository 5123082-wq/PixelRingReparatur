'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminFetch } from '@/lib/admin-fetch';

type AiRuntimeStatus = {
  rawProvider: string;
  supportedProvider: boolean;
  apiKeyConfigured: boolean;
  apiKeySource: string | null;
  model: string;
  temperature: number;
  maxContextMessages: number;
  maxOutputTokens: number;
  timeoutMs: number;
  cmsSystemPrompt: string | null;
  issues: string[];
};

type KnowledgeBaseDocument = {
  filename: string;
  title: string;
  content: string;
  characterCount: number;
};

export default function AiConfigPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');
  const [temperature, setTemperature] = useState(0.2);
  const [runtime, setRuntime] = useState<AiRuntimeStatus | null>(null);
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeBaseDocument[]>([]);
  const [selectedKnowledgeFilename, setSelectedKnowledgeFilename] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [knowledgeError, setKnowledgeError] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const savingRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        const [res, knowledgeRes] = await Promise.all([
          adminFetch('/api/cms/ai', { signal: controller.signal }),
          adminFetch('/api/cms/knowledge-base', { signal: controller.signal }),
        ]);

        if (res.ok) {
          const data = await res.json();
          setSystemPrompt(data.systemPrompt || '');
          setModel(data.model || 'gpt-4o-mini');
          setTemperature(data.temperature ?? 0.2);
          setRuntime(data.runtime ?? null);
          setAiError(null);
        } else {
          const errorData = await res.json().catch(() => null);
          console.error('AI config load failed:', errorData);
          setAiError(errorData?.message || 'Failed to load AI configuration.');
        }

        if (knowledgeRes.ok) {
          const data = await knowledgeRes.json();
          const documents = Array.isArray(data.documents)
            ? data.documents as KnowledgeBaseDocument[]
            : [];
          setKnowledgeDocs(documents);
          setKnowledgeError(null);
          
          setSelectedKnowledgeFilename(prev => {
            if (prev && documents.some(d => d.filename === prev)) return prev;
            return documents[0]?.filename ?? null;
          });
        } else {
          const errorData = await knowledgeRes.json().catch(() => null);
          setKnowledgeError(errorData?.message || 'Knowledge base files could not be loaded.');
        }
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') return;
        console.error('Failed to load AI data', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setAiError(`Connection error: Failed to sync with AI service (${errorMessage}).`);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchData();
    return () => controller.abort();
  }, []);

  async function handleSave() {
    if (savingRef.current) return;
    
    savingRef.current = true;
    setSaving(true);
    setMessage(null);

    try {
      const res = await adminFetch('/api/cms/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ systemPrompt, model, temperature }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'AI Configuration saved successfully!' });
        // Auto-clear success message
        setTimeout(() => setMessage(null), 5000);
      } else {
        const errorData = await res.json().catch(() => null);
        setMessage({ 
          type: 'error', 
          text: errorData?.message || 'Failed to save configuration.' 
        });
      }
    } catch (error) {
      console.error('Failed to save AI config', error);
      setMessage({ type: 'error', text: 'An unexpected error occurred.' });
    } finally {
      setSaving(false);
      savingRef.current = false;
    }
  }

  const selectedKnowledgeDoc =
    knowledgeDocs.find((doc) => doc.filename === selectedKnowledgeFilename) ??
    knowledgeDocs[0] ??
    null;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin"></div>
          <p className="text-zinc-500 font-medium animate-pulse">Synchronizing AI Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
      <div className="max-w-5xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Brain Configuration</h1>
          <p className="text-zinc-500 mt-1.5 text-[13px]">
            Fine-tune the assistant behavior and verify the server-side API connection.
          </p>
        </div>

        {/* Status Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-col gap-1.5"
          >
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">API Key Status</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${runtime?.apiKeyConfigured ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'}`} />
              <span className={`text-base font-bold ${runtime?.apiKeyConfigured ? 'text-emerald-400' : 'text-rose-400'}`}>
                {runtime?.apiKeyConfigured ? 'Active & Valid' : 'Missing Configuration'}
              </span>
            </div>
            <span className="text-[10px] text-zinc-600 font-medium italic">
              {runtime?.apiKeyConfigured ? `Source: ${runtime.apiKeySource}` : 'Set OPENAI_API_KEY in environment'}
            </span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-col gap-1.5"
          >
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Inference Provider</span>
            <span className="text-base font-bold text-zinc-200 capitalize">
              {runtime?.rawProvider || 'OpenAI API'}
            </span>
            <span className="text-[10px] text-zinc-600 font-medium">
              {runtime?.supportedProvider ? 'System Ready' : 'Protocol Mismatch'}
            </span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex flex-col gap-1.5"
          >
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Runtime Constraints</span>
            <span className="text-base font-bold text-zinc-200">
              {runtime?.maxOutputTokens ?? 600} tokens
            </span>
            <span className="text-[10px] text-zinc-600 font-medium">
              {runtime?.timeoutMs ?? 20000}ms timeout • {runtime?.maxContextMessages ?? 20} msgs
            </span>
          </motion.div>
        </div>

        {/* Error/Warning Banner */}
        <AnimatePresence>
          {(runtime?.issues?.length || aiError) && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm overflow-hidden"
            >
              {aiError && <div className="font-bold mb-1">Configuration Error: {aiError}</div>}
              {runtime?.issues?.map((issue, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="mt-1">⚠️</span>
                  <span>{issue}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Config Form Area */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 space-y-8">
          
          {/* Section: Knowledge Base */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white tracking-tight uppercase text-[13px] opacity-80">Server Knowledge Base</h3>
                <p className="text-xs text-zinc-500 mt-1">Read-only markdown files injected into the assistant system prompt.</p>
              </div>
            </div>

            {knowledgeError && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {knowledgeError}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
              <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {knowledgeDocs.map((doc) => {
                  const active = selectedKnowledgeDoc?.filename === doc.filename;
                  return (
                    <button
                      key={doc.filename}
                      onClick={() => setSelectedKnowledgeFilename(doc.filename)}
                      className={`group p-3 rounded-xl border text-left transition-all duration-200 ${
                        active 
                          ? 'bg-violet-600/10 border-violet-500/50 shadow-lg shadow-violet-500/10' 
                          : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]'
                      }`}
                    >
                      <span className={`block text-[13px] font-bold transition-colors ${active ? 'text-violet-400' : 'text-zinc-300 group-hover:text-white'}`}>
                        {doc.title}
                      </span>
                      <span className="block text-[10px] text-zinc-500 mt-0.5 font-mono opacity-80">
                        {doc.filename}
                      </span>
                      <div className="mt-1.5 flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-wider text-zinc-600 font-bold">
                          {doc.characterCount.toLocaleString()} chars
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="bg-black/40 border border-white/[0.06] rounded-2xl flex flex-col overflow-hidden min-h-[400px]">
                {selectedKnowledgeDoc ? (
                  <>
                    <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                      <span className="text-xs font-mono text-violet-400 font-bold">{selectedKnowledgeDoc.filename}</span>
                      <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Preview Mode</span>
                    </div>
                    <div className="p-6 flex-1 max-h-[440px] overflow-y-auto custom-scrollbar">
                      <pre className="text-sm text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap break-words">
                        {selectedKnowledgeDoc.content}
                      </pre>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm italic">
                    Select a knowledge document to preview content
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Section: System Prompt */}
          <section className="space-y-4 pt-4 border-t border-white/[0.06]">
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight uppercase text-[13px] opacity-80">Dynamic System Instructions</h3>
              <p className="text-xs text-zinc-500 mt-1">Additional CMS logic. The base knowledge and safety boundaries are appended automatically.</p>
            </div>
            
            <div className="relative group">
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Describe your assistant's personality and specific CMS tasks..."
                className="w-full min-h-[300px] p-6 bg-black/30 border border-white/[0.08] rounded-2xl text-zinc-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/50 transition-all placeholder:text-zinc-700 resize-none custom-scrollbar"
              />
              <div className="absolute top-4 right-4 text-[10px] font-bold text-zinc-700 uppercase tracking-widest group-focus-within:text-violet-500/50 pointer-events-none">
                Live Editor
              </div>
            </div>
          </section>

          {/* Section: Model & Params */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white tracking-tight uppercase text-[13px] opacity-80">Model Engine</h3>
              <select 
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-4 h-12 bg-black/30 border border-white/[0.08] rounded-xl text-zinc-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all appearance-none cursor-pointer"
              >
                <option value="gpt-4o-mini">GPT-4o mini (Balanced)</option>
                <option value="gpt-4o">GPT-4o (Vision & Reasoning)</option>
                <option value="o1-mini">o1-mini (Complex Logic)</option>
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white tracking-tight uppercase text-[13px] opacity-80">Temperature</h3>
                <span className="text-xs font-bold text-violet-400 font-mono bg-violet-400/10 px-2 py-0.5 rounded-md">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-violet-500 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
                <span>Precise</span>
                <span>Creative</span>
              </div>
            </div>
          </section>

          {/* Actions & Alerts */}
          <div className="pt-8 border-t border-white/[0.06] flex flex-col gap-4">
            <AnimatePresence>
              {message && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-4 rounded-xl text-sm font-bold flex items-center gap-3 ${
                    message.type === 'success' 
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' 
                      : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                  }`}
                >
                  <span className="text-lg">{message.type === 'success' ? '✅' : '❌'}</span>
                  {message.text}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              disabled={saving}
              onClick={handleSave}
              className={`w-full h-11 rounded-xl font-bold text-white transition-all duration-300 relative overflow-hidden group shadow-xl ${
                saving 
                  ? 'bg-zinc-800 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-violet-600 via-violet-500 to-indigo-600 hover:shadow-violet-500/20 active:scale-[0.98]'
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative flex items-center justify-center gap-2 text-sm">
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Updating Production Brain...
                  </>
                ) : (
                  'Deploy Brain Configuration'
                )}
              </span>
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  );
}
