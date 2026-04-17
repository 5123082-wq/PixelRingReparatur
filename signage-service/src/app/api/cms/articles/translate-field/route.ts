import { CMS_SESSION_COOKIE_NAME } from '@/lib/admin-auth';
import { requireAdminPermissionActor } from '@/lib/admin-audit';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAiRuntimeConfig } from '@/lib/ai/config';
import { validateAdminCsrf } from '@/lib/admin-csrf';

export async function POST(request: NextRequest) {
  const csrfError = validateAdminCsrf(request);
  if (csrfError) return csrfError;

  const actor = await requireAdminPermissionActor(
    prisma,
    request,
    CMS_SESSION_COOKIE_NAME,
    ['CMS_AI_CONFIG_WRITE'] 
  );

  if (!actor) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { text, targetLocale, sourceLocale, fieldName } = body;

    if (!text || !targetLocale) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const config = await getAiRuntimeConfig();
    
    if (!config.apiKeyConfigured || !config.apiKey) {
      return NextResponse.json({ error: 'AI API Key not configured' }, { status: 503 });
    }

    const systemPrompt = `You are an expert translator for PixelRing Reparatur, a premium multilingual sign repair service.
Current context: Translating field "${fieldName}" for a support article.
Target language: ${targetLocale.toUpperCase()}
Source language: ${sourceLocale ? sourceLocale.toUpperCase() : 'DE'}

Rules:
1. Maintain technical accuracy (LEDs, transformers, acrylic, light advertising).
2. Keep the professional, premium, yet helpful brand voice.
3. Preserve Markdown formatting (bold, links, lists).
4. If the field is a technical parameter or slug, ensure it remains valid for the target locale.
5. Translate ONLY the provided text. Do not add explanations.
6. For arrays passed as newline-separated strings, preserve the newline structure.`;

    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.2, 
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('OpenAI Error:', errorData);
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const data = await response.json();
    const translatedText = data.choices?.[0]?.message?.content?.trim() || '';

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error('Translation API Error:', error);
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
