
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  const caseNumber = 'PR-PPX9-CN26';
  console.log('Checking case:', caseNumber);

  const c = await prisma.case.findUnique({
    where: { publicRequestNumber: caseNumber },
    include: {
      sessions: true,
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!c) {
    console.log('Case not found');
    return;
  }

  console.log('Case ID:', c.id);
  console.log('Sessions linked to case:', c.sessions.map(s => s.id));

  const allMessages = await prisma.message.findMany({
    where: {
      OR: [
        { caseId: c.id },
        { sessionId: { in: c.sessions.map(s => s.id) } },
      ],
    },
    orderBy: { createdAt: 'asc' },
  });

  console.log('Found total messages:', allMessages.length);
  allMessages.forEach(m => {
    console.log(`[${m.createdAt.toISOString()}] ${m.authorRole}: ${m.body.substring(0, 50)}... (Session: ${m.sessionId}, Case: ${m.caseId})`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
