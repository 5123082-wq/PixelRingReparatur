
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
      messages: { orderBy: { createdAt: 'desc' }, take: 10 }
    }
  });

  if (!c) {
    console.log('Case not found');
    return;
  }

  console.log('Case UUID:', c.id);
  console.log('Last messages for this case:');
  c.messages.forEach(m => {
    console.log(`- [${m.createdAt.toISOString()}] ${m.authorRole}: ${m.body.substring(0, 30)}... (SessionID: ${m.sessionId})`);
  });

  if (c.messages.length > 0 && c.messages[0].sessionId) {
    const sid = c.messages[0].sessionId;
    console.log('\nChecking Session:', sid);
    const s = await prisma.session.findUnique({ where: { id: sid } });
    console.log('Session exists:', !!s);
    if (s) {
       console.log('Session caseId:', s.caseId);
       const allMsgs = await prisma.message.findMany({ where: { sessionId: sid } });
       console.log('Total messages for this SessionID:', allMsgs.length);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
