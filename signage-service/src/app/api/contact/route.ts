import { NextRequest, NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { checkRateLimit, getClientIP, CONTACT_LIMIT } from '@/lib/rate-limit';
import { createWebsiteRequest } from '@/lib/request-intake';
import { CASE_SESSION_COOKIE_NAME } from '@/lib/case-session';
import { sendAdminTelegramNotification } from '@/lib/admin-telegram-notifications';
import { getSessionIntakeDraft } from '@/lib/ai/intake-draft';
import { redactPiiForAi } from '@/lib/ai/pii-redaction';
import { DEFAULT_SITE_LOCALE, SITE_LOCALES, type SiteLocale } from '@/lib/seo';
import {
  AttachmentValidationError,
  deleteAttachment,
  storeAttachment,
  type StoredAttachmentInput,
} from '@/lib/attachments';

function inferRequestLocale(request: NextRequest): SiteLocale {
  const referer = request.headers.get('referer');

  try {
    const url = referer ? new URL(referer) : request.nextUrl;
    const locale = url.pathname.split('/').filter(Boolean)[0];

    if (SITE_LOCALES.includes(locale as SiteLocale)) {
      return locale as SiteLocale;
    }
  } catch {
    // Fall back to the canonical locale.
  }

  return DEFAULT_SITE_LOCALE;
}

function readCoordinate(value: FormDataEntryValue | null, min: number, max: number): number | null {
  if (typeof value !== 'string' || !value.trim()) {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed >= min && parsed <= max ? parsed : null;
}

function readLocationSource(value: FormDataEntryValue | null): string | null {
  if (typeof value !== 'string') {
    return null;
  }

  return value.trim() === 'photon' ? 'photon' : null;
}

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const limit = checkRateLimit(ip, CONTACT_LIMIT);
  let storedAttachments: StoredAttachmentInput[] = [];

  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.resetMs / 1000)) } }
    );
  }

  try {
    const formData = await request.formData();
    let name = String(formData.get('name') ?? '').trim();
    let contact = String(formData.get('contact') ?? '').trim();
    const message = String(formData.get('message') ?? '').trim();
    const issueType = String(formData.get('issueType') ?? '').trim();
    let location = String(formData.get('location') ?? '').trim();
    let serviceLatitude = readCoordinate(formData.get('locationLatitude'), -90, 90);
    let serviceLongitude = readCoordinate(formData.get('locationLongitude'), -180, 180);
    let serviceLocationSource = readLocationSource(formData.get('locationSource'));
    const isFromChat = formData.get('isFromChat') === 'true';

    let existingSessionId: string | null = null;
    let existingSessionToken: string | null = null;
    let draftContactKnown = false;
    let draftLocationKnown = false;

    if (isFromChat) {
      const { resolveChatSession } = await import('@/lib/ai/chat-session');
      const token = request.cookies.get(CASE_SESSION_COOKIE_NAME)?.value ?? null;
      const resolved = await resolveChatSession(prisma, token, {
        createIfMissing: false,
        userAgent: request.headers.get('user-agent'),
        ipAddress: getClientIP(request),
      });
      if (resolved) {
        existingSessionId = resolved.session.id;
        existingSessionToken = resolved.cookieToken || token;
        const draft = await getSessionIntakeDraft(prisma, resolved.session.id);
        name = name || draft?.customerName || '';
        contact = contact || draft?.customerEmail || draft?.customerPhone || '';
        if (!location) {
          location = draft?.serviceLocation || '';
          serviceLatitude = draft?.serviceLatitude ?? null;
          serviceLongitude = draft?.serviceLongitude ?? null;
          serviceLocationSource = draft?.serviceLocationSource ?? null;
        }
        draftContactKnown = Boolean(draft?.customerEmail || draft?.customerPhone);
        draftLocationKnown = Boolean(draft?.serviceLocation);
      }
    }

    if (!contact || !message) {
      return NextResponse.json(
        {
          error: 'Please provide a valid email address or phone number and a message.',
        },
        { status: 400 }
      );
    }

    const fileEntries = [
      ...formData.getAll('files'),
      ...formData.getAll('photo'),
    ].filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (fileEntries.length > 0) {
      storedAttachments = await Promise.all(
        fileEntries.map((file) => storeAttachment(file))
      );
    }

    const messageParts = [];
    if (issueType) messageParts.push(`Тип: ${issueType}`);
    
    const finalMessage = messageParts.length > 0 
      ? `${messageParts.join(' | ')}\n\n${message}`
      : message;

    const result = await createWebsiteRequest(prisma, {
      name,
      contact,
      serviceLocation: location,
      serviceLatitude,
      serviceLongitude,
      serviceLocationSource,
      message: finalMessage,
      userAgent: request.headers.get('user-agent'),
      locale: inferRequestLocale(request),
      origin: request.headers.get('origin') || request.nextUrl.origin,
      ipAddress:
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? null,
      attachments: storedAttachments,
      existingSessionId,
      existingSessionToken,
      isFromChat,
    });

    await sendAdminTelegramNotification({
      kind: 'website_request_created',
      caseId: result.caseId,
      publicRequestNumber: result.publicRequestNumber,
      customerName: null,
      contactLabel: contact || draftContactKnown ? 'Contact provided' : null,
      originLabel: isFromChat ? 'Website chat' : 'Website form',
      messagePreview: [
        redactPiiForAi(finalMessage),
        location || draftLocationKnown ? 'Location provided' : null,
      ].filter(Boolean).join('\n'),
      isNewCase: true,
    }).catch((telegramError) => {
      console.error('Admin Telegram request notification failed:', telegramError);
    });

    const response = NextResponse.json({
      success: true,
      publicRequestNumber: result.publicRequestNumber,
      portalClaimUrl: result.portalClaimUrl,
      portalClaimExpiresAt: result.portalClaimExpiresAt,
      photoReceived: result.photoReceived,
    });

    if (result.sessionToken) {
      response.cookies.set({
        name: CASE_SESSION_COOKIE_NAME,
        value: result.sessionToken,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 180,
      });
    }

    return response;
  } catch (error) {
    await Promise.allSettled(
      storedAttachments.map((attachment) =>
        deleteAttachment(attachment)
      )
    );

    console.error('Contact form error:', error);

    const message =
      error instanceof Error && error.message
        ? error.message
        : 'Internal server error';
    const status =
      message.startsWith('Please provide a valid') ||
      error instanceof AttachmentValidationError
        ? 400
        : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
