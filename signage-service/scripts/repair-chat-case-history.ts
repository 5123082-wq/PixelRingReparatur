import { MessageAuthorRole, PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

function getPublicRequestNumber(): string | null {
  const value = process.argv.find((arg) => /^PR-[A-Z0-9-]+$/i.test(arg));
  return value?.toUpperCase() ?? null;
}

async function main() {
  const publicRequestNumber = getPublicRequestNumber();
  const apply = process.argv.includes('--apply');

  if (!publicRequestNumber) {
    throw new Error(
      'Usage: node --experimental-strip-types --experimental-specifier-resolution=node scripts/repair-chat-case-history.ts PR-XXXX-XXXX [--apply]'
    );
  }

  const caseRecord = await prisma.case.findUnique({
    where: { publicRequestNumber },
    select: {
      id: true,
      publicRequestNumber: true,
      sessions: {
        select: { id: true },
      },
    },
  });

  if (!caseRecord) {
    throw new Error(`Case not found: ${publicRequestNumber}`);
  }

  const sessionIds = caseRecord.sessions.map((session) => session.id);
  if (sessionIds.length === 0) {
    throw new Error(`Case ${publicRequestNumber} has no linked sessions.`);
  }

  const registrationMessage = await prisma.message.findFirst({
    where: {
      caseId: caseRecord.id,
      sessionId: { in: sessionIds },
      authorRole: MessageAuthorRole.SYSTEM,
      body: { startsWith: `Anfrage erfolgreich registriert. Nummer: ${publicRequestNumber}` },
    },
    orderBy: { createdAt: 'asc' },
    select: { id: true, sessionId: true, createdAt: true },
  });

  if (!registrationMessage?.sessionId) {
    throw new Error(`Registration message not found for ${publicRequestNumber}.`);
  }

  const previousRegistrationMessage = await prisma.message.findFirst({
    where: {
      sessionId: registrationMessage.sessionId,
      authorRole: MessageAuthorRole.SYSTEM,
      body: { startsWith: 'Anfrage erfolgreich registriert. Nummer:' },
      createdAt: { lt: registrationMessage.createdAt },
    },
    orderBy: { createdAt: 'desc' },
    select: { createdAt: true },
  });

  const windowFilter = previousRegistrationMessage
    ? {
        gt: previousRegistrationMessage.createdAt,
        lte: registrationMessage.createdAt,
      }
    : { lte: registrationMessage.createdAt };

  const messageWhere = {
    sessionId: registrationMessage.sessionId,
    createdAt: windowFilter,
    OR: [{ caseId: null }, { caseId: caseRecord.id }],
  };

  const attachmentWhere = {
    uploadedBySessionId: registrationMessage.sessionId,
    isCustomerVisible: true,
    createdAt: windowFilter,
    OR: [{ caseId: null }, { caseId: caseRecord.id }],
  };

  const [messages, attachments] = await Promise.all([
    prisma.message.findMany({
      where: messageWhere,
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        authorRole: true,
        body: true,
        caseId: true,
        createdAt: true,
      },
    }),
    prisma.attachment.findMany({
      where: attachmentWhere,
      orderBy: { createdAt: 'asc' },
      select: { id: true, caseId: true, originalFilename: true, createdAt: true },
    }),
  ]);

  console.log(`Case: ${publicRequestNumber}`);
  console.log(`Session: ${registrationMessage.sessionId}`);
  console.log(`Mode: ${apply ? 'apply' : 'dry-run'}`);
  console.log(`Messages in current intake window: ${messages.length}`);
  messages.forEach((message) => {
    console.log(
      `- ${message.createdAt.toISOString()} ${message.authorRole} case=${message.caseId ?? 'null'} ${message.body.slice(0, 90)}`
    );
  });
  console.log(`Attachments in current intake window: ${attachments.length}`);
  attachments.forEach((attachment) => {
    console.log(
      `- ${attachment.createdAt.toISOString()} case=${attachment.caseId ?? 'null'} ${attachment.originalFilename ?? attachment.id}`
    );
  });

  if (!apply) {
    console.log('Dry run only. Re-run with --apply to update caseId links.');
    return;
  }

  const [updatedMessages, updatedAttachments] = await prisma.$transaction([
    prisma.message.updateMany({
      where: messageWhere,
      data: { caseId: caseRecord.id },
    }),
    prisma.attachment.updateMany({
      where: attachmentWhere,
      data: { caseId: caseRecord.id },
    }),
  ]);

  console.log(`Updated messages: ${updatedMessages.count}`);
  console.log(`Updated attachments: ${updatedAttachments.count}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
