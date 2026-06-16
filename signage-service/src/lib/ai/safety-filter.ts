import 'server-only';

const DEFAULT_LOCALE = 'de';

type SupportedLocale = 'de' | 'en' | 'ru' | 'tr' | 'pl' | 'ar';

export type SafetyIntent = 'request' | 'status' | 'human' | 'refusal' | 'general';

export type SafetyVerdict = {
  allowed: boolean;
  intent: SafetyIntent;
  refusalText: string;
  reason?: string;
};

const REFUSAL_TEXT: Record<SupportedLocale, string> = {
  de: 'Dabei kann ich hier nicht helfen. Ich bin fuer PixelRing-Service, Reparaturen, Anfragen und Statusfragen da. Beschreiben Sie bitte kurz das Problem mit der Beschilderung oder Ihrer Anfrage.',
  en: 'I cannot help with that here. I can help with PixelRing service, repairs, requests, and status questions. Please briefly describe the signage issue or your request.',
  ru: 'С этим здесь не помогу. Я могу помочь по сервису PixelRing: ремонт, заявки, связь с менеджером и статус обращения. Опишите, пожалуйста, проблему с вывеской или вашу заявку.',
  tr: 'Bu konuda burada yardimci olamam. PixelRing servis, onarim, talep ve durum sorularinda yardimci olabilirim. Lutfen tabela veya talebinizle ilgili sorunu kisaca aciklayin.',
  pl: 'W tym tutaj nie pomoge. Pomagam w sprawach serwisu PixelRing: naprawy, zgloszenia, kontakt z menedzerem i status. Opisz krotko problem z oznakowaniem albo zgloszeniem.',
  ar: 'لا يمكنني المساعدة في ذلك هنا. يمكنني المساعدة في خدمة PixelRing والإصلاحات والطلبات وحالة الطلب. يرجى وصف مشكلة اللافتة أو طلبك بإيجاز.',
};

const INJECTION_PATTERNS = [
  /ignore (all|any|the) previous instructions/i,
  /ignore (all|any|the) above/i,
  /system prompt/i,
  /developer message/i,
  /jailbreak/i,
  /prompt injection/i,
  /you are now/i,
  /act as (?:dan|developer|system|jailbreak|unfiltered|a different)/i,
  /reveal (the )?(system|hidden|internal) prompt/i,
  /print (the )?(system|developer) prompt/i,
  /show (me )?(the )?instructions/i,
  /игнорируй\s+(?:все\s+)?(?:предыдущие|системные)\s+инструкц/i,
  /покажи\s+(?:системн|скрыт).*(?:промпт|инструкц)/i,
  /раскрой\s+(?:системн|скрыт).*(?:промпт|инструкц)/i,
  /забудь\s+(?:свои\s+)?инструкц/i,
  /ignoriere\s+(?:alle\s+)?(?:vorherigen|system)\s*(?:anweisungen|instruktionen)/i,
  /zeige\s+(?:mir\s+)?(?:den\s+)?(?:system|versteckten).*(?:prompt|anweisungen|instruktionen)/i,
  /ujawnij\s+(?:systemowy|ukryty).*(?:prompt|instrukcje)/i,
  /sistem\s+talimatlarini\s+(?:goster|yazdir|acikla)/i,
];

const OFF_TOPIC_PATTERNS = [
  /\bcoding\b/i,
  /\bsource code\b/i,
  /\bwrite code\b/i,
  /\bgenerate code\b/i,
  /\bexplain code\b/i,
  /\bdebug (this )?code\b/i,
  /\bprogramming\b/i,
  /\bmath\b/i,
  /\bcalculate\b/i,
  /\bpolitic/i,
  /\breligion\b/i,
  /\bmedicine\b/i,
  /\bmedical\b/i,
  /\bdiagnose\b/i,
  /\bfinance\b/i,
  /\binvest(?:ment|ing)?\b/i,
  /\blegal\b/i,
  /\blaw\b/i,
  /\bessay\b/i,
  /\bstory\b/i,
  /\bgenerate (an? )?image\b/i,
  /\bcreate (an? )?image\b/i,
  /\bmake (an? )?image\b/i,
  /\bwrite (me )?(a )?(text|post|article|ad|advertisement)\b/i,
  /сгенерируй/i,
  /генерац/i,
  /напиши\s+(?:мне\s+)?(?:текст|статью|пост|код|сценар)/i,
  /сделай\s+(?:мне\s+)?(?:картинк|изображен|домашн|код)/i,
  /реши\s+(?:задач|пример)/i,
  /\bgeneral AI\b/i,
];

const REQUEST_PATTERNS = [
  /\brequest\b/i,
  /\brepair\b/i,
  /\bstatus\b/i,
  /\btrack\b/i,
  /\bcontact\b/i,
  /\bphone\b/i,
  /\bemail\b/i,
  /\bsign(?:age)?\b/i,
  /\bsignboard\b/i,
  /\bshopfront\b/i,
  /\bstorefront\b/i,
  /\billuminated sign\b/i,
  /\blightbox\b/i,
  /\bletter(?:ing)?\b/i,
  /\bled\b/i,
  /\bflicker/i,
  /\bbroken\b/i,
  /\bdefect/i,
  /\bfallen\b/i,
  /\bnot lighting\b/i,
  /\bno photo\b/i,
  /\bneed help\b/i,
  /\bcreate (a )?request\b/i,
  /\banfrage\b/i,
  /\breparatur\b/i,
  /\bschild\b/i,
  /\bbeschilderung\b/i,
  /\bwerbeanlage\b/i,
  /\bleuchtreklame\b/i,
  /\bleuchtkasten\b/i,
  /\bbuchstabe\b/i,
  /\bwerbung\b/i,
  /\bdefekt\b/i,
  /\bkaputt\b/i,
  /\bflacker/i,
  /\bhilfe\b/i,
  /заявк/i,
  /ремонт/i,
  /вывес/i,
  /таблич/i,
  /реклам/i,
  /витрин/i,
  /букв/i,
  /свет/i,
  /мерца/i,
  /сломал/i,
  /упал/i,
  /фото\s+нет/i,
  /нет\s+фото/i,
  /нужн[ао]?\s+помощ/i,
  /помоги/i,
  /оформ/i,
  /телефон/i,
  /почт/i,
  /контакт/i,
];

const STATUS_PATTERNS = [
  /\bstatus\b/i,
  /\btrack(?:ing)?\b/i,
  /\bPR[-\s]?[A-Z0-9-]+\b/i,
  /\brequest number\b/i,
  /\b(?:status|track(?:ing)?|what(?:'s| is)?|happening).{0,40}\bmy\s+request\b/i,
  /\banfragenummer\b/i,
  /\bmeine\s+anfrage\b/i,
  /статус/i,
  /что\s+с\s+(?:моей\s+)?заявк/i,
  /как\s+(?:там\s+)?(?:моя\s+)?заявк/i,
  /номер\s+(?:заяв|обращ|pr)/i,
  /(?:заяв|обращ).*номер/i,
];

const HUMAN_PATTERNS = [
  /\bhuman\b/i,
  /\boperator\b/i,
  /\bagent\b/i,
  /\breal person\b/i,
  /\bcall me\b/i,
  /\bcall back\b/i,
  /\bmanager\b/i,
  /\bmitarbeiter\b/i,
  /\boperator\b/i,
  /\bcontact me\b/i,
  /\bspeak to\b/i,
  /\brueckruf\b/i,
  /\bzurueckrufen\b/i,
  /оператор/i,
  /человек/i,
  /менеджер/i,
  /связаться/i,
  /позвон/i,
];

function normalizeLocale(locale?: string): SupportedLocale {
  const normalized = locale?.trim().toLowerCase();

  if (
    normalized === 'de' ||
    normalized === 'en' ||
    normalized === 'ru' ||
    normalized === 'tr' ||
    normalized === 'pl' ||
    normalized === 'ar'
  ) {
    return normalized;
  }

  return DEFAULT_LOCALE;
}

function matchesAny(patterns: RegExp[], text: string): boolean {
  return patterns.some((pattern) => pattern.test(text));
}

export function detectSafetyIntent(text: string): SafetyIntent {
  if (matchesAny(STATUS_PATTERNS, text)) {
    return 'status';
  }

  if (matchesAny(HUMAN_PATTERNS, text)) {
    return 'human';
  }

  if (matchesAny(REQUEST_PATTERNS, text)) {
    return 'request';
  }

  return 'general';
}

export function getRefusalText(locale?: string): string {
  return REFUSAL_TEXT[normalizeLocale(locale)];
}

export function guardChatText(
  text: string,
  locale?: string,
  caseId?: string | null
): SafetyVerdict {
  const normalizedText = text.trim();

  if (!normalizedText) {
    return {
      allowed: false,
      intent: 'refusal',
      refusalText: getRefusalText(locale),
      reason: 'empty',
    };
  }

  if (matchesAny(INJECTION_PATTERNS, normalizedText)) {
    return {
      allowed: false,
      intent: 'refusal',
      refusalText: getRefusalText(locale),
      reason: 'prompt-injection',
    };
  }

  const intent = detectSafetyIntent(normalizedText);

  if (matchesAny(OFF_TOPIC_PATTERNS, normalizedText) && !caseId && intent === 'general') {
    return {
      allowed: false,
      intent: 'refusal',
      refusalText: getRefusalText(locale),
      reason: 'off-topic',
    };
  }

  return {
    allowed: true,
    intent,
    refusalText: getRefusalText(locale),
  };
}

export function guardChatReply(
  text: string,
  locale?: string,
  caseId?: string | null
): SafetyVerdict {
  const verdict = guardChatText(text, locale, caseId);

  if (!verdict.allowed) {
    return verdict;
  }

  if (text.includes('```')) {
    return {
      allowed: false,
      intent: 'refusal',
      refusalText: getRefusalText(locale),
      reason: 'code-block',
    };
  }

  if (/https?:\/\/|\/portal\/claim\?token=|Kundenportal-Link:/i.test(text)) {
    return {
      allowed: false,
      intent: 'refusal',
      refusalText: getRefusalText(locale),
      reason: 'assistant-link',
    };
  }

  return verdict;
}

export function buildFallbackReply(intent: SafetyIntent, locale?: string): string {
  const normalizedLocale = normalizeLocale(locale);

  const replies: Record<SupportedLocale, Record<SafetyIntent, string>> = {
    de: {
      request: 'Bitte beschreiben Sie kurz, was passiert ist. Kontaktdaten erfassen wir anschließend ueber das sichere Formular im Chat.',
      status: 'Wenn Sie bereits eine PR-Nummer haben, können Sie den Status direkt auf der Status-Seite prüfen. Geben Sie dazu PR-Nummer und die bei der Anfrage verwendete Kontaktmethode ein.',
      human: 'Ein menschlicher Mitarbeiter kann den Vorgang übernehmen. Wenn Sie möchten, kann ich Ihre Anfrage kurz zusammenfassen und an den Operator übergeben.',
      refusal: getRefusalText('de'),
      general: 'Ich bin hier fuer PixelRing-Servicefragen da. Wenn es um eine Beschilderung, Lichtwerbung, Reparatur, Montage oder eine bestehende Anfrage geht, beschreiben Sie kurz, was passiert ist.',
    },
    en: {
      request: 'Please briefly describe what happened. Contact details can be collected afterwards through the secure form in chat.',
      status: 'If you already have a PR number, you can check the request status on the Status page using the PR number and the contact method used for the request.',
      human: 'A human operator can take over. If you want, I can summarize the request and hand it off to the operator.',
      refusal: getRefusalText('en'),
      general: 'I am here for PixelRing service questions. If this is about signage, lighting, repair, installation, or an existing request, briefly describe what happened.',
    },
    ru: {
      request: 'Пожалуйста, коротко опишите, что случилось. Контактные данные можно будет указать после этого в защищённой форме внутри чата.',
      status: 'Если у вас уже есть PR-номер, проверьте статус на странице Status по PR-номеру и контакту, который использовался при оформлении.',
      human: 'Может подключиться человек-оператор. Если хотите, я кратко подытожу заявку и передам ее оператору.',
      refusal: getRefusalText('ru'),
      general: 'Я здесь по вопросам сервиса PixelRing. Если речь о вывеске, подсветке, ремонте, монтаже или существующей заявке, коротко опишите, что случилось.',
    },
    tr: {
      request: 'Lutfen kisaca ne oldugunu aciklayin. Iletisim bilgileri daha sonra sohbet icindeki guvenli formdan alinabilir.',
      status: 'Eğer zaten bir PR numaranız varsa, Status sayfasında PR numarası ve talepte kullanılan iletişim bilgisi ile durumu kontrol edebilirsiniz.',
      human: 'Bir insan operatör devralabilir. İsterseniz talebi kısaca özetleyip operatöre aktarabilirim.',
      refusal: getRefusalText('tr'),
      general: 'PixelRing servis konulari icin buradayim. Konu tabela, aydinlatma, onarim, montaj veya mevcut bir talepse lutfen ne oldugunu kisaca yazin.',
    },
    pl: {
      request: 'Opisz krotko, co sie stalo. Dane kontaktowe mozna pozniej podac w bezpiecznym formularzu w czacie.',
      status: 'Jeśli masz już numer PR, możesz sprawdzić status na stronie Status, podając numer PR i kontakt użyty przy zgłoszeniu.',
      human: 'Może przejąć to człowiek-operator. Jeśli chcesz, mogę krótko podsumować zgłoszenie i przekazać je operatorowi.',
      refusal: getRefusalText('pl'),
      general: 'Jestem tutaj w sprawach serwisu PixelRing. Jesli chodzi o oznakowanie, reklame swietlna, naprawe, montaz albo istniejace zgloszenie, opisz krotko, co sie stalo.',
    },
    ar: {
      request: 'يرجى وصف ما حدث بإيجاز. يمكن إدخال بيانات التواصل لاحقاً عبر النموذج الآمن داخل الدردشة.',
      status: 'إذا كان لديك رقم PR بالفعل، يمكنك التحقق من الحالة في صفحة Status باستخدام رقم PR ووسيلة التواصل المستخدمة في الطلب.',
      human: 'يمكن لمشغل بشري أن يتولى المحادثة. إذا أردت، يمكنني تلخيص الطلب وتسليمه للمشغل.',
      refusal: getRefusalText('ar'),
      general: 'أنا هنا لمواضيع خدمة PixelRing. إذا كان الأمر يتعلق بلافتة أو إضاءة أو إصلاح أو تركيب أو طلب قائم، صف بإيجاز ما حدث.',
    },
  };

  return replies[normalizedLocale][intent];
}
