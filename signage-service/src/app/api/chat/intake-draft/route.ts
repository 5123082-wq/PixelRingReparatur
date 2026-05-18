import { NextRequest, NextResponse } from 'next/server';

import { CASE_SESSION_COOKIE_NAME } from '@/lib/case-session';
import { resolveChatSession } from '@/lib/ai/chat-session';
import { upsertSessionIntakeDraft } from '@/lib/ai/intake-draft';
import { prisma } from '@/lib/prisma';
import {
  CHAT_MESSAGE_LIMIT,
  checkRateLimit,
  getClientIP,
} from '@/lib/rate-limit';

function firstNonEmpty(...values: Array<string | null | undefined>): string | undefined {
  for (const value of values) {
    const clean = value?.trim();
    if (clean) return clean;
  }

  return undefined;
}

function splitContact(contact: string | undefined): {
  customerEmail?: string;
  customerPhone?: string;
} {
  if (!contact) return {};

  return contact.includes('@')
    ? { customerEmail: contact.trim().toLowerCase() }
    : { customerPhone: contact.trim() };
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
  const limit = checkRateLimit(ip, CHAT_MESSAGE_LIMIT);

  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: 'Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.resetMs / 1000)) } }
    );
  }

  try {
    const formData = await request.formData();
    const contact = firstNonEmpty(
      String(formData.get('contact') ?? ''),
      String(formData.get('email') ?? ''),
      String(formData.get('phone') ?? '')
    );
    const split = splitContact(contact);
    const token = request.cookies.get(CASE_SESSION_COOKIE_NAME)?.value ?? null;
    const resolved = await resolveChatSession(prisma, token, {
      createIfMissing: true,
      userAgent: request.headers.get('user-agent'),
      ipAddress: getClientIP(request),
    });

    if (!resolved) {
      return NextResponse.json(
        { success: false, error: 'Unable to create chat session' },
        { status: 500 }
      );
    }

    const draft = await upsertSessionIntakeDraft(prisma, resolved.session.id, {
      customerName: String(formData.get('name') ?? '').trim(),
      customerEmail: firstNonEmpty(String(formData.get('customerEmail') ?? ''), split.customerEmail),
      customerPhone: firstNonEmpty(String(formData.get('customerPhone') ?? ''), split.customerPhone),
      serviceLocation: String(formData.get('location') ?? '').trim(),
      serviceLatitude: readCoordinate(formData.get('locationLatitude'), -90, 90),
      serviceLongitude: readCoordinate(formData.get('locationLongitude'), -180, 180),
      serviceLocationSource: readLocationSource(formData.get('locationSource')),
      issueType: String(formData.get('issueType') ?? '').trim(),
      summary: String(formData.get('summary') ?? '').trim(),
      locale: String(formData.get('locale') ?? '').trim(),
    });

    const response = NextResponse.json({
      success: true,
      draft: draft
        ? {
            hasName: Boolean(draft.customerName),
            hasEmail: Boolean(draft.customerEmail),
            hasPhone: Boolean(draft.customerPhone),
            hasLocation: Boolean(draft.serviceLocation),
          }
        : null,
    });

    if (resolved.cookieToken) {
      response.cookies.set({
        name: CASE_SESSION_COOKIE_NAME,
        value: resolved.cookieToken,
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 180,
      });
    }

    return response;
  } catch (error) {
    console.error('Chat intake draft error:', error);

    return NextResponse.json(
      { success: false, error: 'Failed to save intake details' },
      { status: 500 }
    );
  }
}
