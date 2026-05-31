'use client';

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
  const liveDispatches = [
    { id: 1, text: t.feedMunich, status: 'done', time: '10 min ago' },
    { id: 2, text: t.feedBerlin, status: 'enRoute', time: 'Just now' },
    { id: 3, text: t.feedHamburg, status: 'done', time: '1 hour ago' },
    { id: 4, text: t.feedFrankfurt, status: 'working', time: '40 min ago' },
  ];

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

      <div className="border-b border-slate-800 bg-[#0b1422]/60">
        <div className="border-b-2 border-[#B8643E] py-3 text-center font-bold tracking-wide text-slate-100">
          {t.tabFeed}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 flex-1 min-h-[310px]">
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

      </div>
    </div>
  );
}
