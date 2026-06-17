import 'server-only';

import nodemailer from 'nodemailer';

type PortalCodeEmailMode = 'signup' | 'password-reset' | 'claim-access';

type PortalCodeEmailInput = {
  to: string;
  code: string;
  expiresAt: Date;
  mode: PortalCodeEmailMode;
  publicRequestNumber?: string | null;
};

type PortalActivationInviteEmailInput = {
  to: string;
  claimUrl: string;
  expiresAt: Date;
  publicRequestNumber: string;
  locale?: string | null;
};

type PortalCodeEmailResult =
  | { sent: true; provider: 'smtp' | 'resend'; providerId?: string }
  | { sent: false; reason: 'missing_config' };

type EmailProvider = 'smtp' | 'resend' | 'none';

type PortalEmailPayload = {
  to: string;
  subject: string;
  text: string;
  html: string;
  logMode: 'code' | 'activation-invite';
  expiresAt: Date;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function introForMode(input: PortalCodeEmailInput): string {
  if (input.mode === 'password-reset') {
    return 'Mit diesem Code koennen Sie ein neues Passwort fuer Ihr PixelRing Kundenportal festlegen.';
  }

  if (input.mode === 'claim-access' && input.publicRequestNumber) {
    return `Mit diesem Code verbinden Sie die Anfrage ${input.publicRequestNumber} mit Ihrem PixelRing Kundenportal.`;
  }

  return 'Mit diesem Code bestaetigen Sie Ihre E-Mail-Adresse und erstellen Ihr PixelRing Kundenportal.';
}

function subjectForMode(input: PortalCodeEmailInput): string {
  if (input.mode === 'password-reset') {
    return 'PixelRing Kundenportal: Passwort-Code';
  }

  if (input.mode === 'claim-access' && input.publicRequestNumber) {
    return `PixelRing Kundenportal: Code fuer ${input.publicRequestNumber}`;
  }

  return 'PixelRing Kundenportal: Bestaetigungscode';
}

function buildCodeTextEmail(input: PortalCodeEmailInput): string {
  return [
    'PixelRing Kundenportal',
    '',
    introForMode(input),
    '',
    `Code: ${input.code}`,
    '',
    `Dieser Code ist gueltig bis: ${input.expiresAt.toISOString()}`,
    '',
    'Wenn Sie diese Anmeldung nicht gestartet haben, ignorieren Sie diese E-Mail.',
  ].join('\n');
}

function buildCodeHtmlEmail(input: PortalCodeEmailInput): string {
  const code = escapeHtml(input.code);
  const intro = escapeHtml(introForMode(input));
  const expiresAt = escapeHtml(input.expiresAt.toISOString());

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f6f1ea;font-family:Arial,sans-serif;color:#111827;">
    <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
      <div style="background:#ffffff;border:1px solid #eadfd4;border-radius:20px;padding:28px;">
        <p style="margin:0 0 12px;color:#b8643e;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;">PixelRing Kundenportal</p>
        <h1 style="margin:0 0 16px;font-size:24px;line-height:1.2;color:#111827;">Ihr Bestaetigungscode</h1>
        <p style="margin:0 0 22px;font-size:15px;line-height:1.6;color:#4b5563;">${intro}</p>
        <div style="display:inline-block;border:1px solid #eadfd4;background:#fbf8f3;border-radius:16px;padding:16px 22px;font-size:30px;font-weight:800;letter-spacing:.18em;color:#111827;">${code}</div>
        <p style="margin:24px 0 0;font-size:12px;line-height:1.5;color:#6b7280;">Gueltig bis: ${expiresAt}</p>
        <p style="margin:12px 0 0;font-size:12px;line-height:1.5;color:#6b7280;">Wenn Sie diese Anmeldung nicht gestartet haben, ignorieren Sie diese E-Mail.</p>
      </div>
    </div>
  </body>
</html>`;
}

function localeForActivationInvite(locale?: string | null): string {
  const value = locale?.trim().toLowerCase();

  return ['de', 'en', 'ru', 'tr', 'pl', 'ar'].includes(value ?? '')
    ? value!
    : 'de';
}

function activationInviteCopy(input: PortalActivationInviteEmailInput): {
  subject: string;
  heading: string;
  paragraphs: string[];
  button: string;
  expiresLabel: string;
  direction: 'ltr' | 'rtl';
} {
  const locale = localeForActivationInvite(input.locale);
  const pr = input.publicRequestNumber;

  switch (locale) {
    case 'en':
      return {
        subject: `PixelRing customer portal: activation for ${pr}`,
        heading: 'Activate your customer portal',
        paragraphs: [
          `Your request ${pr} has been created.`,
          'Use the secure link below to activate long-term portal access. The link starts email-code verification and does not open private request data by itself.',
        ],
        button: 'Activate portal',
        expiresLabel: 'Valid until',
        direction: 'ltr',
      };
    case 'ru':
      return {
        subject: `PixelRing: активация личного кабинета для ${pr}`,
        heading: 'Активируйте личный кабинет',
        paragraphs: [
          `Ваша заявка ${pr} создана.`,
          'Откройте защищенную ссылку ниже, чтобы активировать долгосрочный доступ к личному кабинету. Ссылка запускает подтверждение через e-mail и сама по себе не открывает приватные данные заявки.',
        ],
        button: 'Активировать кабинет',
        expiresLabel: 'Ссылка активна до',
        direction: 'ltr',
      };
    case 'tr':
      return {
        subject: `PixelRing musteri portali: ${pr} aktivasyonu`,
        heading: 'Musteri portalini etkinlestirin',
        paragraphs: [
          `${pr} numarali talebiniz olusturuldu.`,
          'Uzun sureli portal erisimini etkinlestirmek icin asagidaki guvenli baglantiyi kullanin. Baglanti e-posta kodu dogrulamasini baslatir ve tek basina ozel talep verilerini acmaz.',
        ],
        button: 'Portali etkinlestir',
        expiresLabel: 'Gecerlilik sonu',
        direction: 'ltr',
      };
    case 'pl':
      return {
        subject: `PixelRing panel klienta: aktywacja dla ${pr}`,
        heading: 'Aktywuj panel klienta',
        paragraphs: [
          `Twoje zgloszenie ${pr} zostalo utworzone.`,
          'Uzyj ponizszego bezpiecznego linku, aby aktywowac dlugoterminowy dostep do panelu klienta. Link uruchamia weryfikacje kodem e-mail i sam nie otwiera prywatnych danych zgloszenia.',
        ],
        button: 'Aktywuj panel',
        expiresLabel: 'Wazne do',
        direction: 'ltr',
      };
    case 'ar':
      return {
        subject: `PixelRing: تفعيل بوابة العميل للطلب ${pr}`,
        heading: 'تفعيل بوابة العميل',
        paragraphs: [
          `تم إنشاء طلبك ${pr}.`,
          'استخدم الرابط الآمن أدناه لتفعيل الوصول طويل الأمد إلى بوابة العميل. يبدأ الرابط التحقق عبر رمز البريد الإلكتروني ولا يفتح بيانات الطلب الخاصة بمفرده.',
        ],
        button: 'تفعيل البوابة',
        expiresLabel: 'صالح حتى',
        direction: 'rtl',
      };
    case 'de':
    default:
      return {
        subject: `PixelRing Kundenportal: Aktivierung fuer ${pr}`,
        heading: 'Kundenportal aktivieren',
        paragraphs: [
          `Ihre Anfrage ${pr} wurde erstellt.`,
          'Nutzen Sie den sicheren Link unten, um den dauerhaften Zugang zum Kundenportal zu aktivieren. Der Link startet die E-Mail-Code-Bestaetigung und oeffnet allein noch keine privaten Anfragedaten.',
        ],
        button: 'Kundenportal aktivieren',
        expiresLabel: 'Gueltig bis',
        direction: 'ltr',
      };
  }
}

function buildPortalCodeEmailPayload(input: PortalCodeEmailInput): PortalEmailPayload {
  return {
    to: input.to,
    subject: subjectForMode(input),
    text: buildCodeTextEmail(input),
    html: buildCodeHtmlEmail(input),
    logMode: 'code',
    expiresAt: input.expiresAt,
  };
}

function buildPortalActivationInvitePayload(
  input: PortalActivationInviteEmailInput
): PortalEmailPayload {
  const copy = activationInviteCopy(input);
  const claimUrl = input.claimUrl;
  const expiresAt = input.expiresAt.toISOString();
  const escapedHeading = escapeHtml(copy.heading);
  const escapedButton = escapeHtml(copy.button);
  const escapedClaimUrl = escapeHtml(claimUrl);
  const escapedExpiresAt = escapeHtml(expiresAt);
  const escapedExpiresLabel = escapeHtml(copy.expiresLabel);
  const paragraphs = copy.paragraphs.map((paragraph) => escapeHtml(paragraph));
  const text = [
    'PixelRing Kundenportal',
    '',
    ...copy.paragraphs,
    '',
    `Link: ${claimUrl}`,
    '',
    `${copy.expiresLabel}: ${expiresAt}`,
  ].join('\n');

  return {
    to: input.to,
    subject: copy.subject,
    text,
    html: `<!doctype html>
<html>
  <body dir="${copy.direction}" style="margin:0;background:#f6f1ea;font-family:Arial,sans-serif;color:#111827;">
    <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
      <div style="background:#ffffff;border:1px solid #eadfd4;border-radius:20px;padding:28px;">
        <p style="margin:0 0 12px;color:#b8643e;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;">PixelRing Kundenportal</p>
        <h1 style="margin:0 0 16px;font-size:24px;line-height:1.2;color:#111827;">${escapedHeading}</h1>
        ${paragraphs.map((paragraph) => `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#4b5563;">${paragraph}</p>`).join('')}
        <a href="${escapedClaimUrl}" style="display:inline-block;margin-top:8px;border-radius:14px;background:#b8643e;color:#ffffff;text-decoration:none;font-size:15px;font-weight:800;padding:13px 18px;">${escapedButton}</a>
        <p style="margin:24px 0 0;font-size:12px;line-height:1.5;color:#6b7280;">${escapedExpiresLabel}: ${escapedExpiresAt}</p>
      </div>
    </div>
  </body>
</html>`,
    logMode: 'activation-invite',
    expiresAt: input.expiresAt,
  };
}

function selectedEmailProvider(): EmailProvider {
  const explicitProvider = process.env.PORTAL_EMAIL_PROVIDER?.trim().toLowerCase();

  if (explicitProvider === 'smtp' || process.env.SMTP_HOST) {
    return 'smtp';
  }

  if (explicitProvider === 'resend' || process.env.RESEND_API_KEY) {
    return 'resend';
  }

  return 'none';
}

function parseIntegerEnv(value: string | undefined, fallback: number): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseBooleanEnv(value: string | undefined, fallback: boolean): boolean {
  if (!value) {
    return fallback;
  }

  return ['1', 'true', 'yes', 'on'].includes(value.trim().toLowerCase());
}

async function sendViaSmtp(input: PortalEmailPayload): Promise<PortalCodeEmailResult> {
  const host = process.env.SMTP_HOST?.trim();
  const port = parseIntegerEnv(process.env.SMTP_PORT, 587);
  const secure = parseBooleanEnv(process.env.SMTP_SECURE, port === 465);
  const requireTLS = parseBooleanEnv(process.env.SMTP_REQUIRE_TLS, port === 587);
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD;
  const from = process.env.PORTAL_EMAIL_FROM?.trim() || user;

  if (!host || !user || !password || !from) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Portal SMTP email provider is not configured.');
    }

    return {
      sent: false,
      reason: 'missing_config',
    };
  }

  const transport = nodemailer.createTransport({
    host,
    port,
    secure,
    requireTLS,
    auth: {
      user,
      pass: password,
    },
  });

  const result = await transport.sendMail({
    from,
    to: input.to,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });

  return {
    sent: true,
    provider: 'smtp',
    providerId: result.messageId,
  };
}

async function sendViaResend(input: PortalEmailPayload): Promise<PortalCodeEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.PORTAL_EMAIL_FROM?.trim();

  if (!apiKey || !from) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Portal Resend email provider is not configured.');
    }

    return {
      sent: false,
      reason: 'missing_config',
    };
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      html: input.html,
    }),
  });

  const payload = (await response.json().catch(() => null)) as { id?: string; message?: string } | null;

  if (!response.ok) {
    throw new Error(payload?.message || `Resend email failed (${response.status})`);
  }

  return {
    sent: true,
    provider: 'resend',
    providerId: payload?.id,
  };
}

async function sendPortalEmailPayload(input: PortalEmailPayload): Promise<PortalCodeEmailResult> {
  const provider = selectedEmailProvider();

  if (provider === 'smtp') {
    return sendViaSmtp(input);
  }

  if (provider === 'resend') {
    return sendViaResend(input);
  }

  if (provider === 'none') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Portal email provider is not configured.');
    }

    console.info('Portal email dev fallback:', {
      mode: input.logMode,
      expiresAt: input.expiresAt.toISOString(),
    });

    return {
      sent: false,
      reason: 'missing_config',
    };
  }

  throw new Error('Unsupported portal email provider.');
}

export async function sendPortalCodeEmail(
  input: PortalCodeEmailInput
): Promise<PortalCodeEmailResult> {
  return sendPortalEmailPayload(buildPortalCodeEmailPayload(input));
}

export async function sendPortalActivationInviteEmail(
  input: PortalActivationInviteEmailInput
): Promise<PortalCodeEmailResult> {
  return sendPortalEmailPayload(buildPortalActivationInvitePayload(input));
}
