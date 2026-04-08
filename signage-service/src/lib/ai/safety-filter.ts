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
  de: 'Ich kann nur bei Fragen zum PixelRing-Reparaturservice helfen. Brauchen Sie Hilfe mit einer Reparaturanfrage?',
  en: 'I can only help with PixelRing repair services. Need help with a repair request?',
  ru: 'Я могу помочь только с вопросами о ремонте в PixelRing. Помочь с заявкой?',
  tr: 'Yalnızca PixelRing onarım hizmetleriyle ilgili konularda yardımcı olabilirim. Bir onarım talebiyle ilgili yardıma mı ihtiyacınız var?',
  pl: 'Mogę pomóc tylko w sprawach związanych z serwisem PixelRing. Potrzebujesz pomocy przy zgłoszeniu naprawy?',
  ar: 'يمكنني المساعدة فقط في خدمات إصلاح PixelRing. هل تحتاج إلى مساعدة في طلب إصلاح؟',
};

const INJECTION_PATTERNS = [
  /ignore (all|any|the) previous instructions/i,
  /ignore (all|any|the) above/i,
  /system prompt/i,
  /developer message/i,
  /jailbreak/i,
  /prompt injection/i,
  /you are now/i,
  /act as/i,
  /reveal (the )?(system|hidden|internal) prompt/i,
  /print (the )?(system|developer) prompt/i,
  /show (me )?(the )?instructions/i,
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
  /\bjoke\b/i,
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
  /\bdevice\b/i,
  /\blamp\b/i,
  /\bring light\b/i,
  /\banfrage\b/i,
  /\breparatur\b/i,
  /\bgerät\b/i,
  /\blampe\b/i,
  /заявк/i,
  /ремонт/i,
  /устрой/i,
  /ламп/i,
  /телефон/i,
  /почт/i,
  /контакт/i,
];

const STATUS_PATTERNS = [
  /\bstatus\b/i,
  /\btrack(?:ing)?\b/i,
  /\bPR[-\s]?[A-Z0-9-]+\b/i,
  /\brequest number\b/i,
  /\banfragenummer\b/i,
  /статус/i,
  /номер/i,
];

const HUMAN_PATTERNS = [
  /\bhuman\b/i,
  /\boperator\b/i,
  /\bagent\b/i,
  /\breal person\b/i,
  /\bcall me\b/i,
  /\bmanager\b/i,
  /\bmitarbeiter\b/i,
  /\boperator\b/i,
  /оператор/i,
  /человек/i,
  /менеджер/i,
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
  locale?: string
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

  if (matchesAny(OFF_TOPIC_PATTERNS, normalizedText)) {
    return {
      allowed: false,
      intent: 'refusal',
      refusalText: getRefusalText(locale),
      reason: 'off-topic',
    };
  }

  return {
    allowed: true,
    intent: detectSafetyIntent(normalizedText),
    refusalText: getRefusalText(locale),
  };
}

export function guardChatReply(
  text: string,
  locale?: string
): SafetyVerdict {
  const verdict = guardChatText(text, locale);

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

  return verdict;
}

export function buildFallbackReply(intent: SafetyIntent, locale?: string): string {
  const normalizedLocale = normalizeLocale(locale);

  const replies: Record<SupportedLocale, Record<SafetyIntent, string>> = {
    de: {
      request: 'Bitte senden Sie kurz Gerätetyp, Problem und Ihre Kontaktdaten. Danach kann ich die Anfrage weiter formalisiert vorbereiten.',
      status: 'Wenn Sie bereits eine PR-Nummer haben, können Sie den Status direkt auf der Status-Seite prüfen. Geben Sie dazu PR-Nummer und die bei der Anfrage verwendete Kontaktmethode ein.',
      human: 'Ein menschlicher Mitarbeiter kann den Vorgang übernehmen. Wenn Sie möchten, kann ich Ihre Anfrage kurz zusammenfassen und an den Operator übergeben.',
      refusal: getRefusalText('de'),
      general: 'Ich kann nur bei PixelRing-Reparaturen helfen. Bitte senden Sie Gerät, Problem und Kontakt oder fragen Sie nach dem Status einer bestehenden Anfrage.',
    },
    en: {
      request: 'Please share the device type, the issue, and a contact method. Then I can help prepare the repair request.',
      status: 'If you already have a PR number, you can check the request status on the Status page using the PR number and the contact method used for the request.',
      human: 'A human operator can take over. If you want, I can summarize the request and hand it off to the operator.',
      refusal: getRefusalText('en'),
      general: 'I can only help with PixelRing repairs. Please share the device, the issue, and a contact method, or ask about an existing request status.',
    },
    ru: {
      request: 'Пожалуйста, отправьте тип устройства, описание проблемы и контакт. После этого я помогу подготовить заявку.',
      status: 'Если у вас уже есть PR-номер, проверьте статус на странице Status по PR-номеру и контакту, который использовался при оформлении.',
      human: 'Может подключиться человек-оператор. Если хотите, я кратко подытожу заявку и передам ее оператору.',
      refusal: getRefusalText('ru'),
      general: 'Я могу помочь только с ремонтом PixelRing. Пожалуйста, отправьте устройство, проблему и контакт или спросите о статусе существующей заявки.',
    },
    tr: {
      request: 'Lütfen cihaz türünü, sorunu ve bir iletişim bilgisini gönderin. Sonra talebi hazırlamaya yardımcı olabilirim.',
      status: 'Eğer zaten bir PR numaranız varsa, Status sayfasında PR numarası ve talepte kullanılan iletişim bilgisi ile durumu kontrol edebilirsiniz.',
      human: 'Bir insan operatör devralabilir. İsterseniz talebi kısaca özetleyip operatöre aktarabilirim.',
      refusal: getRefusalText('tr'),
      general: 'Yalnızca PixelRing onarımlarıyla ilgili konularda yardımcı olabilirim. Lütfen cihaz, sorun ve iletişim bilgisi paylaşın ya da mevcut bir talebin durumunu sorun.',
    },
    pl: {
      request: 'Proszę podać typ urządzenia, problem i dane kontaktowe. Wtedy pomogę przygotować zgłoszenie.',
      status: 'Jeśli masz już numer PR, możesz sprawdzić status na stronie Status, podając numer PR i kontakt użyty przy zgłoszeniu.',
      human: 'Może przejąć to człowiek-operator. Jeśli chcesz, mogę krótko podsumować zgłoszenie i przekazać je operatorowi.',
      refusal: getRefusalText('pl'),
      general: 'Mogę pomóc tylko w sprawach napraw PixelRing. Podaj urządzenie, problem i kontakt albo zapytaj o status istniejącego zgłoszenia.',
    },
    ar: {
      request: 'يرجى إرسال نوع الجهاز والمشكلة ووسيلة تواصل. بعد ذلك يمكنني المساعدة في إعداد الطلب.',
      status: 'إذا كان لديك رقم PR بالفعل، يمكنك التحقق من الحالة في صفحة Status باستخدام رقم PR ووسيلة التواصل المستخدمة في الطلب.',
      human: 'يمكن لمشغل بشري أن يتولى المحادثة. إذا أردت، يمكنني تلخيص الطلب وتسليمه للمشغل.',
      refusal: getRefusalText('ar'),
      general: 'يمكنني المساعدة فقط في إصلاحات PixelRing. يرجى إرسال الجهاز والمشكلة ووسيلة تواصل أو السؤال عن حالة طلب موجود.',
    },
  };

  return replies[normalizedLocale][intent];
}
