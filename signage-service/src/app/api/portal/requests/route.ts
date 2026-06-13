import { NextRequest, NextResponse } from 'next/server';

import { sendAdminTelegramNotification } from '@/lib/admin-telegram-notifications';
import { redactPiiForAi } from '@/lib/ai/pii-redaction';
import { prisma } from '@/lib/prisma';
import {
  getPortalSessionContext,
  PORTAL_SESSION_COOKIE_NAME,
} from '@/lib/portal/auth';
import { validatePortalMutationRequest } from '@/lib/portal/mutation-guard';
import { createPortalRequestForUser } from '@/lib/portal/requests';
import { publishCaseRealtimeEvent } from '@/lib/realtime';
import {
  checkRateLimit,
  getClientIP,
  PORTAL_REQUEST_LIMIT,
} from '@/lib/rate-limit';
import { DEFAULT_SITE_LOCALE, SITE_LOCALES, type SiteLocale } from '@/lib/seo';

const PORTAL_REQUEST_API_COPY: Record<SiteLocale, {
  rateLimited: string;
  loginRequired: string;
  validation: string;
  generic: string;
}> = {
  de: {
    rateLimited: 'Bitte versuchen Sie es spaeter erneut.',
    loginRequired: 'Bitte melden Sie sich zuerst im Kundenportal an.',
    validation: 'Bitte beschreiben Sie kurz, was gemacht werden soll.',
    generic: 'Die Anfrage konnte nicht erstellt werden.',
  },
  en: {
    rateLimited: 'Please try again later.',
    loginRequired: 'Please sign in to the customer portal first.',
    validation: 'Please briefly describe what needs to be done.',
    generic: 'The request could not be created.',
  },
  ru: {
    rateLimited: 'Попробуйте еще раз позже.',
    loginRequired: 'Сначала войдите в клиентский кабинет.',
    validation: 'Коротко опишите, что нужно сделать.',
    generic: 'Не удалось создать заявку.',
  },
  tr: {
    rateLimited: 'Lütfen daha sonra tekrar deneyin.',
    loginRequired: 'Lütfen önce müşteri portalına giriş yapın.',
    validation: 'Lütfen ne yapılması gerektiğini kısaca açıklayın.',
    generic: 'Talep oluşturulamadı.',
  },
  pl: {
    rateLimited: 'Spróbuj ponownie później.',
    loginRequired: 'Najpierw zaloguj się do portalu klienta.',
    validation: 'Krótko opisz, co trzeba zrobić.',
    generic: 'Nie udało się utworzyć zgłoszenia.',
  },
  ar: {
    rateLimited: 'يرجى المحاولة مرة أخرى لاحقا.',
    loginRequired: 'يرجى تسجيل الدخول إلى بوابة العميل أولا.',
    validation: 'يرجى وصف ما يجب القيام به باختصار.',
    generic: 'تعذر إنشاء الطلب.',
  },
};

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

export async function POST(request: NextRequest) {
  const mutationError = validatePortalMutationRequest(request);
  const locale = inferRequestLocale(request);
  const copy = PORTAL_REQUEST_API_COPY[locale] ?? PORTAL_REQUEST_API_COPY[DEFAULT_SITE_LOCALE];

  if (mutationError) {
    return mutationError;
  }

  const ip = getClientIP(request);
  const limit = checkRateLimit(ip, PORTAL_REQUEST_LIMIT);

  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, message: copy.rateLimited },
      { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.resetMs / 1000)) } }
    );
  }

  const session = await getPortalSessionContext(
    prisma,
    request.cookies.get(PORTAL_SESSION_COOKIE_NAME)?.value
  );

  if (!session) {
    return NextResponse.json(
      { success: false, message: copy.loginRequired },
      { status: 401 }
    );
  }

  try {
    const body = (await request.json().catch(() => null)) as {
      issueType?: unknown;
      serviceLocation?: unknown;
      serviceLatitude?: unknown;
      serviceLongitude?: unknown;
      serviceLocationSource?: unknown;
      message?: unknown;
    } | null;

    const result = await createPortalRequestForUser(prisma, {
      portalUserId: session.portalUserId,
      portalSessionId: session.sessionId,
      email: session.email,
      requestInput: body ?? {},
      locale,
      origin: request.headers.get('origin') || request.nextUrl.origin,
      userAgent: request.headers.get('user-agent'),
      ipAddress: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? ip,
    });

    await Promise.allSettled([
      publishCaseRealtimeEvent({
        caseId: result.caseId,
        reason: 'case.updated',
      }),
      sendAdminTelegramNotification({
        kind: 'website_request_created',
        caseId: result.caseId,
        publicRequestNumber: result.publicRequestNumber,
        customerName: session.email,
        contactLabel: 'Verified portal account',
        originLabel: 'Customer portal',
        messagePreview: redactPiiForAi(String(body?.message ?? '')),
        isNewCase: true,
      }),
    ]);

    return NextResponse.json({
      success: true,
      publicRequestNumber: result.publicRequestNumber,
      redirectTo: `/portal/requests/${result.publicRequestNumber}`,
    });
  } catch (error) {
    const isValidationError = error instanceof Error
      && error.message === 'Bitte beschreiben Sie kurz, was gemacht werden soll.';

    if (!isValidationError) {
      console.error('Portal request creation failed:', error);
    }

    return NextResponse.json(
      {
        success: false,
        message: isValidationError
          ? copy.validation
          : copy.generic,
      },
      { status: isValidationError ? 400 : 500 }
    );
  }
}
