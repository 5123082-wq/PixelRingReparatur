import 'server-only';

import nodemailer from 'nodemailer';

type PortalVerificationEmailInput = {
  to: string;
  verificationUrl: string;
  publicRequestNumber: string;
  expiresAt: Date;
};

type PortalVerificationEmailResult =
  | { sent: true; provider: 'smtp' | 'resend'; providerId?: string }
  | { sent: false; reason: 'missing_config'; verificationUrl: string };

type EmailProvider = 'smtp' | 'resend' | 'none';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildTextEmail(input: PortalVerificationEmailInput): string {
  return [
    'PixelRing Kundenportal',
    '',
    `Anfrage: ${input.publicRequestNumber}`,
    '',
    'Bitte bestaetigen Sie Ihre E-Mail-Adresse, um den Kundenportal-Zugang fuer diese Anfrage zu aktivieren:',
    input.verificationUrl,
    '',
    `Dieser Link ist gueltig bis: ${input.expiresAt.toISOString()}`,
    '',
    'Wenn Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail.',
  ].join('\n');
}

function buildHtmlEmail(input: PortalVerificationEmailInput): string {
  const verificationUrl = escapeHtml(input.verificationUrl);
  const publicRequestNumber = escapeHtml(input.publicRequestNumber);
  const expiresAt = escapeHtml(input.expiresAt.toISOString());

  return `<!doctype html>
<html>
  <body style="margin:0;background:#f6f1ea;font-family:Arial,sans-serif;color:#111827;">
    <div style="max-width:560px;margin:0 auto;padding:32px 20px;">
      <div style="background:#ffffff;border:1px solid #eadfd4;border-radius:20px;padding:28px;">
        <p style="margin:0 0 12px;color:#b8643e;font-size:12px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;">PixelRing Kundenportal</p>
        <h1 style="margin:0 0 16px;font-size:24px;line-height:1.2;color:#111827;">E-Mail-Adresse bestaetigen</h1>
        <p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#4b5563;">Ihre Anfrage <strong>${publicRequestNumber}</strong> kann mit dem Kundenportal verbunden werden.</p>
        <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4b5563;">Bitte bestaetigen Sie diese E-Mail-Adresse. Danach oeffnet sich Ihr Kundenportal.</p>
        <a href="${verificationUrl}" style="display:inline-block;background:#b8643e;color:#ffffff;text-decoration:none;border-radius:14px;padding:14px 18px;font-size:15px;font-weight:700;">E-Mail bestaetigen</a>
        <p style="margin:24px 0 0;font-size:12px;line-height:1.5;color:#6b7280;">Gueltig bis: ${expiresAt}</p>
        <p style="margin:12px 0 0;font-size:12px;line-height:1.5;color:#6b7280;">Wenn Sie diese Anfrage nicht gestellt haben, ignorieren Sie diese E-Mail.</p>
      </div>
    </div>
  </body>
</html>`;
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

async function sendViaSmtp(input: PortalVerificationEmailInput): Promise<PortalVerificationEmailResult> {
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
      verificationUrl: input.verificationUrl,
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
    subject: `PixelRing Kundenportal: ${input.publicRequestNumber}`,
    text: buildTextEmail(input),
    html: buildHtmlEmail(input),
  });

  return {
    sent: true,
    provider: 'smtp',
    providerId: result.messageId,
  };
}

async function sendViaResend(input: PortalVerificationEmailInput): Promise<PortalVerificationEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.PORTAL_EMAIL_FROM?.trim();

  if (!apiKey || !from) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Portal Resend email provider is not configured.');
    }

    return {
      sent: false,
      reason: 'missing_config',
      verificationUrl: input.verificationUrl,
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
      subject: `PixelRing Kundenportal: ${input.publicRequestNumber}`,
      text: buildTextEmail(input),
      html: buildHtmlEmail(input),
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

export async function sendPortalVerificationEmail(
  input: PortalVerificationEmailInput
): Promise<PortalVerificationEmailResult> {
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

    console.info('Portal verification email dev fallback:', {
      to: input.to,
      verificationUrl: input.verificationUrl,
    });

    return {
      sent: false,
      reason: 'missing_config',
      verificationUrl: input.verificationUrl,
    };
  }

  throw new Error('Unsupported portal email provider.');
}
