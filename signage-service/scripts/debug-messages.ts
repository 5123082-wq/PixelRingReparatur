import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkMessages() {
  const caseRecord = await prisma.case.findFirst({
    where: { publicRequestNumber: 'PR-SCDA-F2W6' },
    include: {
      sessions: true,
      messages: {
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!caseRecord) {
    console.log('Case not found');
    return;
  }

  console.log('Case ID:', caseRecord.id);
  console.log('Sessions count:', caseRecord.sessions.length);
  caseRecord.sessions.forEach(s => {
    console.log(`- Session ID: ${s.id}, Scope: ${s.scope}, contactValue: ${s.contactValue}`);
  });

  console.log('Messages count:', caseRecord.messages.length);
  caseRecord.messages.forEach(m => {
    console.log(`- Message ID: ${m.id}, Author: ${m.authorRole}, Body: ${m.body.substring(0, 50)}, sessionId: ${m.sessionId}, isCustomerVisible: ${m.isCustomerVisible}`);
  });

  // Also check messages that might be linked to the session but not the case
  if (caseRecord.sessions.length > 0) {
    const sessionId = caseRecord.sessions[0].id;
    const sessionMessages = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' }
    });
    console.log(`\nMessages for session ${sessionId} count:`, sessionMessages.length);
    sessionMessages.forEach(m => {
      console.log(`- Message ID: ${m.id}, CaseID: ${m.caseId}, Author: ${m.authorRole}, Body: ${m.body.substring(0, 50)}`);
    });
  }
}

checkMessages().catch(console.error).finally(() => prisma.$disconnect());
