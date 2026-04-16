'use client';

import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';
import { getLocaleSegment, withLocalePath } from '../../admin-route';

export default function CmsDashboardPage() {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams();
  const locale = getLocaleSegment(params?.locale);

  return (
    <div className="flex flex-col gap-10 font-sans">
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-500 tracking-tight">
          CMS Overview
        </h1>
        <p className="text-lg text-zinc-400 font-medium">
          Manage website content, AI intelligence and SEO strategies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8 gap-6 max-w-6xl">
        {/* Content & Wiki Card */}
        <div 
          onClick={() => router.push(withLocalePath(locale, '/ring-master-config/dashboard/articles'))}
          className="group relative flex flex-col p-8 bg-zinc-900/40 border border-zinc-800/80 rounded-3xl cursor-pointer overflow-hidden transition-all duration-300 hover:bg-zinc-800/60 hover:border-zinc-700/80 hover:shadow-[0_8px_30px_rgba(255,255,255,0.04)]"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none transform translate-x-4 -translate-y-4">
            <span className="text-9xl">📄</span>
          </div>
          <div className="text-4xl mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform origin-left duration-300 drop-shadow-md">
            📄
          </div>
          <h2 className="text-2xl font-bold text-zinc-100 mb-3 tracking-tight">
            Content &amp; Wiki
          </h2>
          <p className="text-zinc-400 leading-relaxed mb-6">
            Manage Typical Symptoms, FAQ and informational pages. Unified source for website and AI.
          </p>
          <div className="mt-auto pt-6 border-t border-zinc-800/60 flex justify-between items-center group-hover:border-zinc-700/80 transition-colors">
            <span className="text-sm font-semibold text-zinc-500">Total Articles:</span>
            <span className="text-sm font-medium text-zinc-300 bg-zinc-800/80 px-3 py-1 rounded-lg">&mdash;</span>
          </div>
        </div>

        {/* Page Content CMS Card */}
        <div 
          onClick={() => router.push(withLocalePath(locale, '/ring-master-config/dashboard/pages'))}
          className="group relative flex flex-col p-8 bg-zinc-900/40 border border-zinc-800/80 rounded-3xl cursor-pointer overflow-hidden transition-all duration-300 hover:bg-zinc-800/60 hover:border-zinc-700/80 hover:shadow-[0_8px_30px_rgba(255,255,255,0.04)]"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none transform translate-x-4 -translate-y-4">
            <span className="text-9xl">🧩</span>
          </div>
          <div className="text-4xl mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform origin-left duration-300 drop-shadow-md">
            🧩
          </div>
          <h2 className="text-2xl font-bold text-zinc-100 mb-3 tracking-tight">
            Page Content CMS
          </h2>
          <p className="text-zinc-400 leading-relaxed mb-6">
            Manage structured JSON blocks for home, support, status, and global starter content.
          </p>
        </div>

        {/* Media Library Card */}
        <div 
          onClick={() => router.push(withLocalePath(locale, '/ring-master-config/dashboard/media'))}
          className="group relative flex flex-col p-8 bg-zinc-900/40 border border-zinc-800/80 rounded-3xl cursor-pointer overflow-hidden transition-all duration-300 hover:bg-zinc-800/60 hover:border-zinc-700/80 hover:shadow-[0_8px_30px_rgba(59,130,246,0.05)]"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors pointer-events-none -translate-y-1/2 translate-x-1/4"></div>
          <div className="text-4xl mb-4 group-hover:scale-110 transition-transform origin-left duration-300 drop-shadow-md relative z-10">
            🖼️
          </div>
          <h2 className="text-2xl font-bold text-zinc-100 mb-3 tracking-tight relative z-10">
            Media Library
          </h2>
          <p className="text-zinc-400 leading-relaxed mb-8 relative z-10">
            Upload and select public CMS images without mixing them with private customer attachments.
          </p>
          <div className="mt-auto self-start bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider relative z-10 backdrop-blur-sm group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-colors">
            Public CMS assets
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-8 max-w-6xl">
         {/* AI Brain Config Card */}
         <div 
          onClick={() => router.push(withLocalePath(locale, '/ring-master-config/dashboard/ai'))}
          className="group relative flex flex-col p-8 bg-gradient-to-br from-indigo-950/40 to-violet-950/20 border border-indigo-900/40 rounded-3xl cursor-pointer overflow-hidden transition-all duration-300 hover:border-indigo-500/50 hover:shadow-[0_8px_30px_rgba(99,102,241,0.15)] hover:from-indigo-900/50 hover:to-violet-900/40"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="text-4xl mb-4 group-hover:-translate-y-1 group-hover:scale-110 transition-transform origin-left duration-300 drop-shadow-[0_0_15px_rgba(99,102,241,0.6)] relative z-10">
            🤖
          </div>
          <h2 className="text-2xl font-bold text-indigo-100 mb-3 tracking-tight relative z-10">
            AI Brain Config
          </h2>
          <p className="text-indigo-200/70 leading-relaxed mb-8 relative z-10">
            Configure System Prompt and Knowledge Base. Model: <strong className="text-indigo-300 font-semibold">GPT-4o mini</strong>
          </p>
          <div className="mt-auto self-start bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider animate-pulse group-hover:animate-none group-hover:bg-indigo-500/30 group-hover:border-indigo-400/50 transition-colors relative z-10 backdrop-blur-sm">
            Live &amp; Training
          </div>
        </div>

        {/* SEO & Keywords Card */}
        <div 
          onClick={() => router.push(withLocalePath(locale, '/ring-master-config/dashboard/seo'))}
          className="group relative flex flex-col p-8 bg-zinc-900/40 border border-zinc-800/80 rounded-3xl cursor-pointer overflow-hidden transition-all duration-300 hover:bg-zinc-800/60 hover:border-zinc-700/80 hover:shadow-[0_8px_30px_rgba(255,255,255,0.04)]"
        >
          <div className="text-4xl mb-4 group-hover:rotate-[360deg] transition-transform duration-1000 ease-in-out origin-center drop-shadow-md relative z-10 w-min">
            🌍
          </div>
          <h2 className="text-2xl font-bold text-zinc-100 mb-3 tracking-tight relative z-10">
            SEO &amp; Keywords
          </h2>
          <p className="text-zinc-400 leading-relaxed mb-6 relative z-10">
            Manage regional keywords and meta-tags to rank in Google and AI-search engines.
          </p>
        </div>
      </div>
    </div>
  );
}
