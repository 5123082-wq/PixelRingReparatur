import { NextRequest, NextResponse } from 'next/server';

import { CMS_SESSION_COOKIE_NAME, requireAdminSession } from '@/lib/admin-auth';
import {
  KNOWLEDGE_BASE_FILES,
  readKnowledgeBaseFile,
  type KnowledgeBaseFilename,
} from '@/lib/ai/system-prompt';
import { prisma } from '@/lib/prisma';

function extractMarkdownTitle(
  filename: KnowledgeBaseFilename,
  content: string
): string {
  const titleLine = content
    .split('\n')
    .find((line) => /^#{1,2}\s+\S/.test(line.trim()));

  return titleLine?.replace(/^#{1,2}\s+/, '').trim() || filename;
}

async function requireOwnerSession(request: NextRequest) {
  const token = request.cookies.get(CMS_SESSION_COOKIE_NAME)?.value;
  return requireAdminSession(prisma, token, ['OWNER']);
}

export async function GET(request: NextRequest) {
  if (!(await requireOwnerSession(request))) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const documents = await Promise.all(
      KNOWLEDGE_BASE_FILES.map(async (filename) => {
        const content = await readKnowledgeBaseFile(filename);

        return {
          filename,
          title: extractMarkdownTitle(filename, content),
          content,
          characterCount: content.length,
        };
      })
    );

    return NextResponse.json({ documents });
  } catch (error) {
    console.error('API Error /api/cms/knowledge-base (GET):', error);
    return NextResponse.json(
      { error: 'Failed to read knowledge base files' },
      { status: 500 }
    );
  }
}
