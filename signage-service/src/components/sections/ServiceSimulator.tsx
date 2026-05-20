'use client';

import React, { useState, useEffect } from 'react';

type Locale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';

const LABELS = {
  de: {
    title: "PixelRing Diagnose-Terminal",
    statusLive: "LIVE-FEED",
    tabDiag: "Diagnose-Scan",
    tabFeed: "Einsatz-Ticker",
    btnScan: "Diagnose starten",
    scanning: "Scanne Werbeanlage...",
    analyzing: "Analysiere Komponenten...",
    diagResult: "Diagnose-Ergebnis",
    recom: "PixelRing Empfehlung",
    recomText: "Reparatur & LED-Retrofit anstelle von Komplettaustausch.",
    savings: "Kostenersparnis",
    power: "Netzteil (Trafo)",
    leds: "LED-Module",
    mount: "Tragstruktur",
    ok: "In Ordnung",
    faulty: "Spannungsabfall (Defekt)",
    flicker: "Flackern (Austausch nötig)",
    stable: "Stabil (Sicher)",
    feedTitle: "Aktuelle Einsätze",
    feedMunich: "München: LED-Retrofit abgeschlossen",
    feedBerlin: "Berlin: Techniker auf dem Weg",
    feedHamburg: "Hamburg: Sturmschaden behoben",
    feedFrankfurt: "Frankfurt: Objektaudit durchgeführt",
    feedEnRoute: "Unterwegs",
    feedWorking: "In Arbeit",
    feedDone: "Erledigt"
  },
  en: {
    title: "PixelRing Diagnostics Terminal",
    statusLive: "LIVE FEED",
    tabDiag: "Diagnostic Scan",
    tabFeed: "Dispatch Feed",
    btnScan: "Start Diagnosis",
    scanning: "Scanning sign...",
    analyzing: "Analyzing components...",
    diagResult: "Diagnostic Result",
    recom: "PixelRing Recommendation",
    recomText: "Repair & LED retrofit instead of full replacement.",
    savings: "Cost Savings",
    power: "Power Supply",
    leds: "LED Modules",
    mount: "Mounting Bracket",
    ok: "Ok",
    faulty: "Voltage drop (Faulty)",
    flicker: "Flickering (Needs swap)",
    stable: "Stable (Secure)",
    feedTitle: "Active Dispatch",
    feedMunich: "Munich: LED retrofit completed",
    feedBerlin: "Berlin: Technician en route",
    feedHamburg: "Hamburg: Wind damage repaired",
    feedFrankfurt: "Frankfurt: Site audit performed",
    feedEnRoute: "En route",
    feedWorking: "Active",
    feedDone: "Done"
  },
  ru: {
    title: "Диагностический терминал PixelRing",
    statusLive: "ПРЯМОЙ ЭФИР",
    tabDiag: "Сканирование",
    tabFeed: "Лента выездов",
    btnScan: "Запустить тест",
    scanning: "Сканирование вывески...",
    analyzing: "Анализ компонентов...",
    diagResult: "Результат диагностики",
    recom: "Рекомендация PixelRing",
    recomText: "Ремонт блока и замена LED вместо новой вывески.",
    savings: "Экономия бюджета",
    power: "Блок питания",
    leds: "Светодиоды",
    mount: "Кронштейн",
    ok: "В норме",
    faulty: "Просадка напряжения (Замена)",
    flicker: "Мерцание (Замена)",
    stable: "Стабилен (Безопасно)",
    feedTitle: "Активные выезды",
    feedMunich: "Мюнхен: LED-модернизация завершена",
    feedBerlin: "Берлин: Техник в пути",
    feedHamburg: "Гамбург: Устранен штормовой дефект",
    feedFrankfurt: "Франкфурт: Проведен технический аудит",
    feedEnRoute: "В пути",
    feedWorking: "В работе",
    feedDone: "Готово"
  },
  tr: {
    title: "PixelRing Arıza Tespit Terminali",
    statusLive: "CANLI YAYIN",
    tabDiag: "Arıza Tespiti",
    tabFeed: "Servis Akışı",
    btnScan: "Taramayı Başlat",
    scanning: "Tabela taranıyor...",
    analyzing: "Bileşenler analiz ediliyor...",
    diagResult: "Teşhis Sonucu",
    recom: "PixelRing Önerisi",
    recomText: "Komple değişim yerine tamir & LED dönüşümü.",
    savings: "Maliyet Tasarrufu",
    power: "Güç Kaynağı",
    leds: "LED Modülleri",
    mount: "Taşıyıcı Braket",
    ok: "Sorunsuz",
    faulty: "Voltaj düşüşü (Arızalı)",
    flicker: "Titreşim var (Değişim)",
    stable: "Stabil (Güvenli)",
    feedTitle: "Aktif Sevkıyat",
    feedMunich: "Münih: LED dönüşümü tamamlandı",
    feedBerlin: "Berlin: Tekniker yolda",
    feedHamburg: "Hamburg: Rüzgar hasarı onarıldı",
    feedFrankfurt: "Frankfurt: Saha denetimi yapıldı",
    feedEnRoute: "Yolda",
    feedWorking: "Çalışıyor",
    feedDone: "Tamamlandı"
  },
  pl: {
    title: "Terminal Diagnostyczny PixelRing",
    statusLive: "NA ŻYWO",
    tabDiag: "Skan Diagnostyczny",
    tabFeed: "Rejestr Zgłoszeń",
    btnScan: "Uruchom Skan",
    scanning: "Skanowanie reklamy...",
    analyzing: "Analiza podzespołów...",
    diagResult: "Wynik Diagnozy",
    recom: "Rekomendacja PixelRing",
    recomText: "Naprawa zasilacza i retrofitting LED zamiast wymiany.",
    savings: "Oszczędność kosztów",
    power: "Zasilacz",
    leds: "Moduły LED",
    mount: "Konstrukcja nośna",
    ok: "W porządku",
    faulty: "Spadek napięcia (Wymiana)",
    flicker: "Migotanie (Do wymiany)",
    stable: "Stabilna (Bezpieczna)",
    feedTitle: "Aktywne Wyjazdy",
    feedMunich: "Monachium: Zakończono modernizację LED",
    feedBerlin: "Berlin: Technik w drodze",
    feedHamburg: "Hamburg: Usunięto uszkodzenie po wichurze",
    feedFrankfurt: "Frankfurt: Wykonano audyt obiektu",
    feedEnRoute: "W drodze",
    feedWorking: "W trakcie",
    feedDone: "Ukończono"
  },
  ar: {
    title: "لوحة تشخيص بكسل رينج",
    statusLive: "بث مباشر",
    tabDiag: "فحص التشخيص",
    tabFeed: "سجل العمليات",
    btnScan: "بدء الفحص",
    scanning: "جاري فحص اللافتة...",
    analyzing: "جاري تحليل المكونات...",
    diagResult: "نتيجة التشخيص",
    recom: "توصية بكسل رينج",
    recomText: "الإصلاح وتحديث الـ LED بدلاً من الاستبدال الكامل.",
    savings: "توفير التكلفة",
    power: "مزود الطاقة",
    leds: "وحدات LED",
    mount: "دعامة التثبيت",
    ok: "سليم",
    faulty: "انخفاض الجهد (تالف)",
    flicker: "وميض (يستدعي التبديل)",
    stable: "مستقر (آمن)",
    feedTitle: "العمليات الحالية",
    feedMunich: "ميونيخ: تم الانتهاء من تحديث الـ LED",
    feedBerlin: "برلين: الفني في الطريق",
    feedHamburg: "هامبورغ: تم إصلاح أضرار الرياح",
    feedFrankfurt: "فرانكفورت: تم إجراء تدقيق للموقع",
    feedEnRoute: "في الطريق",
    feedWorking: "قيد التنفيذ",
    feedDone: "مكتمل"
  }
};

export default function ServiceSimulator({ locale }: { locale: Locale }) {
  const t = LABELS[locale] || LABELS.de;
  const [activeTab, setActiveTab] = useState<'diag' | 'feed'>('diag');
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'analyzing' | 'done'>('idle');
  const [scanProgress, setScanProgress] = useState(0);

  // Simulated live feed updates
  const [liveDispatches, setLiveDispatches] = useState([
    { id: 1, text: t.feedMunich, status: 'done', time: '10 min ago' },
    { id: 2, text: t.feedBerlin, status: 'enRoute', time: 'Just now' },
    { id: 3, text: t.feedHamburg, status: 'done', time: '1 hour ago' },
    { id: 4, text: t.feedFrankfurt, status: 'working', time: '40 min ago' }
  ]);

  useEffect(() => {
    if (scanState === 'scanning') {
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setScanState('analyzing');
            setScanProgress(0);
            return 0;
          }
          return prev + 8;
        });
      }, 100);
      return () => clearInterval(interval);
    }

    if (scanState === 'analyzing') {
      const timer = setTimeout(() => {
        setScanState('done');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [scanState]);

  const handleStartScan = () => {
    setScanProgress(0);
    setScanState('scanning');
  };

  return (
    <div className="w-full max-w-[540px] bg-[#0E1A2B] rounded-3xl overflow-hidden border border-slate-800 shadow-[0_30px_70px_rgba(14,26,43,0.35)] text-slate-100 flex flex-col font-mono text-xs">
      
      {/* Terminal Header */}
      <div className="bg-[#0b1422] px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block"></span>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[9px] text-emerald-400 font-bold tracking-widest">{t.statusLive}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-[#0b1422]/60">
        <button
          onClick={() => setActiveTab('diag')}
          className={`flex-1 py-3 text-center border-b-2 font-bold tracking-wide transition-all duration-200 ${
            activeTab === 'diag'
              ? 'border-[#B8643E] text-slate-100 bg-[#0E1A2B]/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.tabDiag}
        </button>
        <button
          onClick={() => setActiveTab('feed')}
          className={`flex-1 py-3 text-center border-b-2 font-bold tracking-wide transition-all duration-200 ${
            activeTab === 'feed'
              ? 'border-[#B8643E] text-slate-100 bg-[#0E1A2B]/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          {t.tabFeed}
        </button>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 min-h-[310px] flex flex-col justify-between">
        
        {activeTab === 'diag' && (
          <div className="flex-1 flex flex-col justify-between">
            {/* Visual Screen */}
            <div className="bg-[#070e17] rounded-2xl p-5 border border-slate-800/80 flex items-center justify-between relative overflow-hidden h-[180px]">
              
              {/* Grid Background Effect */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b12_1px,transparent_1px),linear-gradient(to_bottom,#1e293b12_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />

              {/* Glowing decorative gradient */}
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-[#B8643E]/10 rounded-full blur-2xl pointer-events-none" />

              {/* Simulated Sign Graphic */}
              <div className="w-[45%] flex flex-col items-center justify-center relative">
                <svg className="w-full max-w-[140px] h-auto drop-shadow-[0_0_12px_rgba(184,100,62,0.15)]" viewBox="0 0 100 60" fill="none">
                  {/* Outer Frame */}
                  <rect x="5" y="5" width="90" height="50" rx="6" stroke="#1e293b" strokeWidth="2" />
                  
                  {/* Internal Neon tubes (flickering or glowing depending on scan state) */}
                  <path
                    d="M20,30 L80,30"
                    stroke={
                      scanState === 'scanning'
                        ? '#38bdf8'
                        : scanState === 'done'
                        ? '#ef4444' // Faulty middle line
                        : '#b8643e'
                    }
                    strokeWidth="4"
                    strokeLinecap="round"
                    className={`${
                      scanState === 'idle'
                        ? 'opacity-65 animate-pulse'
                        : scanState === 'scanning'
                        ? 'animate-bounce'
                        : scanState === 'analyzing'
                        ? 'opacity-100'
                        : 'opacity-50 animate-pulse'
                    }`}
                  />
                  
                  <rect
                    x="15"
                    y="15"
                    width="70"
                    height="30"
                    rx="4"
                    stroke={
                      scanState === 'scanning'
                        ? '#38bdf8'
                        : scanState === 'done'
                        ? '#10b981' // Green outer frame ok
                        : '#94a3b8'
                    }
                    strokeWidth="2"
                    strokeDasharray={scanState === 'scanning' ? '4,4' : 'none'}
                    className={scanState === 'scanning' ? 'animate-[spin_10s_linear_infinite]' : ''}
                  />
                </svg>

                {/* Laser scan line overlay */}
                {scanState === 'scanning' && (
                  <div
                    className="absolute left-0 right-0 h-0.5 bg-sky-400 shadow-[0_0_8px_#38bdf8] animate-[bounce_1.5s_infinite]"
                    style={{ top: `${scanProgress}%` }}
                  />
                )}
              </div>

              {/* Right Side: Diagnostics Telemetry */}
              <div className="w-[50%] flex flex-col gap-2 font-mono text-[10px] text-slate-300 z-10">
                {scanState === 'idle' && (
                  <div className="text-slate-400 py-6 italic text-center">
                    &gt; Terminal Ready<br />
                    &gt; Awaiting Input
                  </div>
                )}

                {scanState === 'scanning' && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sky-400 animate-pulse">&gt; {t.scanning}</span>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-sky-500 h-full transition-all duration-100" style={{ width: `${scanProgress}%` }}></div>
                    </div>
                    <span className="text-[9px] text-slate-500">Progress: {scanProgress}%</span>
                  </div>
                )}

                {scanState === 'analyzing' && (
                  <div className="flex flex-col gap-1.5 py-4">
                    <span className="text-yellow-500 animate-pulse">&gt; {t.analyzing}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-ping"></span>
                      <span className="text-[9px] text-slate-500">Parsing load lines...</span>
                    </div>
                  </div>
                )}

                {scanState === 'done' && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-emerald-400 font-bold">&gt; {t.diagResult}:</span>
                    <div className="flex flex-col gap-1 text-[9px]">
                      <div className="flex justify-between border-b border-slate-800/40 pb-0.5">
                        <span>{t.power}:</span>
                        <span className="text-red-400 font-bold">{t.faulty}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800/40 pb-0.5">
                        <span>{t.leds}:</span>
                        <span className="text-yellow-400 font-bold">{t.flicker}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t.mount}:</span>
                        <span className="text-emerald-400 font-bold">{t.stable}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Recommendation block & Button */}
            <div className="mt-4 pt-3 flex flex-col gap-3">
              {scanState === 'done' && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex flex-col gap-1">
                  <span className="font-bold text-[10px] uppercase tracking-wider text-emerald-400">{t.recom}</span>
                  <p className="text-[11px] leading-snug">{t.recomText}</p>
                  <div className="mt-1 flex items-center justify-between text-[10px] font-bold text-emerald-400 border-t border-emerald-500/10 pt-1">
                    <span>{t.savings}:</span>
                    <span>~68%</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleStartScan}
                disabled={scanState === 'scanning' || scanState === 'analyzing'}
                className="w-full py-3.5 px-6 rounded-xl bg-[#B8643E] hover:bg-[#a05431] disabled:bg-slate-800 disabled:text-slate-500 font-bold text-slate-100 flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-[#B8643E]/20"
              >
                {scanState === 'scanning' || scanState === 'analyzing' ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <span>{t.btnScan}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'feed' && (
          <div className="flex flex-col gap-4 flex-grow justify-between">
            <div className="flex flex-col gap-3">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{t.feedTitle}</span>
              <div className="flex flex-col gap-2.5">
                {liveDispatches.map((dispatch) => (
                  <div key={dispatch.id} className="p-3 bg-[#070e17] rounded-xl border border-slate-800/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${
                        dispatch.status === 'done'
                          ? 'bg-emerald-500'
                          : dispatch.status === 'working'
                          ? 'bg-yellow-500 animate-pulse'
                          : 'bg-sky-500 animate-ping'
                      }`} />
                      <span className="text-[11px] text-slate-200">{dispatch.text}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                        dispatch.status === 'done'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : dispatch.status === 'working'
                          ? 'bg-yellow-500/10 text-yellow-400'
                          : 'bg-sky-500/10 text-sky-400'
                      }`}>
                        {dispatch.status === 'done'
                          ? t.feedDone
                          : dispatch.status === 'working'
                          ? t.feedWorking
                          : t.feedEnRoute}
                      </span>
                      <span className="text-[8px] text-slate-500">{dispatch.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-3.5 bg-slate-900/40 rounded-xl border border-slate-800/50 text-[10px] text-slate-400 leading-normal flex items-start gap-2.5">
              <svg className="w-4 h-4 text-[#B8643E] shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                All service dispatches are logged inside the <strong>PixelRing CRM</strong> platform for transparent, data-driven brand tracking.
              </span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
