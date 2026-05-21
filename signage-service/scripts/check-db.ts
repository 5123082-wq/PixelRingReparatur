import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local'), quiet: true });
dotenv.config({ path: path.resolve(process.cwd(), '.env'), quiet: true });

async function main() {
  const { prisma } = await import('../src/lib/prisma.ts');

  // 1. Check admin users
  const adminUsers = await prisma.adminUser.findMany({
    select: { id: true, email: true, role: true, status: true }
  });
  console.log('\n--- Admin Users ---');
  console.log(adminUsers);

  // 2. Check if service page key is seeded
  const servicePages = await prisma.cmsPage.findMany({
    where: { pageKey: 'service' }
  });
  console.log('\n--- Service Page CMS Key ---');
  if (servicePages.length > 0) {
    servicePages.forEach(p => {
      console.log({
        id: p.id,
        pageKey: p.pageKey,
        locale: p.locale,
        status: p.status,
        publishedAt: p.publishedAt,
        deletedAt: p.deletedAt,
      });
    });
  } else {
    console.log('Not found');
  }
  
  // 3. Check for any active sessions
  const activeSessions = await prisma.adminSession.findMany({
    where: { revokedAt: null, expiresAt: { gt: new Date() } },
    select: { id: true, role: true, expiresAt: true, adminUser: { select: { email: true } } }
  });
  console.log('\n--- Active Admin Sessions ---');
  console.log(activeSessions);
}

main().catch(console.error);
